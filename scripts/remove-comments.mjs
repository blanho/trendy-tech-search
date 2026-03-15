#!/usr/bin/env node

/**
 * Strip all comments from TypeScript / TSX source files.
 *
 * Handles:
 *   1. Single-line  // …
 *   2. Multi-line   /* … *​/
 *   3. JSDoc        /** … *​/
 *   4. JSX          {/* … *​/}
 *
 * Preserves:
 *   - Strings  ("…", '…', `…`)  — URLs like https://… inside strings are NOT touched
 *   - Regex    /…/
 *   - Shebangs #!/usr/bin/env …
 *
 * Usage:
 *   node scripts/remove-comments.mjs            # dry-run (preview)
 *   node scripts/remove-comments.mjs --write    # apply changes in-place
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const WRITE = process.argv.includes('--write')

// ── Collect files ────────────────────────────────────────────────────
const files = execSync(
  `find ${ROOT}/src -type f \\( -name "*.ts" -o -name "*.tsx" \\)`,
  { encoding: 'utf-8' },
)
  .trim()
  .split('\n')
  .filter(Boolean)

function stripComments(src) {
  let out = ''
  let i = 0
  const len = src.length

  function consumeTemplateLiteral() {
    out += src[i]
    i++
    while (i < len) {
      if (src[i] === '\\') {
        out += src[i] + (src[i + 1] ?? '')
        i += 2
        continue
      }
      if (src[i] === '`') {
        out += src[i]
        i++
        return
      }
      if (src[i] === '$' && src[i + 1] === '{') {
        out += '${'
        i += 2
        let braceDepth = 1
        while (i < len && braceDepth > 0) {
          if (src[i] === '{') {
            braceDepth++
            out += src[i]
            i++
          } else if (src[i] === '}') {
            braceDepth--
            out += src[i]
            i++
          } else if (src[i] === '`') {
            consumeTemplateLiteral()
          } else if (src[i] === '"' || src[i] === "'") {
            consumeStringLiteral(src[i])
          } else if (src[i] === '/' && src[i + 1] === '/') {
            while (i < len && src[i] !== '\n') i++
          } else if (src[i] === '/' && src[i + 1] === '*') {
            i += 2
            while (i < len && !(src[i] === '*' && src[i + 1] === '/')) i++
            if (i < len) i += 2
          } else {
            out += src[i]
            i++
          }
        }
        continue
      }
      out += src[i]
      i++
    }
  }

  function consumeStringLiteral(quote) {
    out += src[i]
    i++
    while (i < len) {
      if (src[i] === '\\') {
        out += src[i] + (src[i + 1] ?? '')
        i += 2
        continue
      }
      if (src[i] === quote) {
        out += src[i]
        i++
        return
      }
      out += src[i]
      i++
    }
  }

  while (i < len) {
    const ch = src[i]
    const next = src[i + 1]

    if (ch === '`') {
      consumeTemplateLiteral()
      continue
    }

    if (ch === '"' || ch === "'") {
      consumeStringLiteral(ch)
      continue
    }

    // ── Single-line comment  // … ────────────────────────────────
    if (ch === '/' && next === '/') {
      // skip until end of line
      while (i < len && src[i] !== '\n') i++
      // keep the newline itself
      continue
    }

    // ── Multi-line / JSDoc comment  /* … */ ──────────────────────
    if (ch === '/' && next === '*') {
      i += 2
      while (i < len) {
        if (src[i] === '*' && src[i + 1] === '/') {
          i += 2
          break
        }
        i++
      }
      continue
    }

    // ── JSX comment  {/* … */} ──────────────────────────────────
    // Already handled by the /* */ rule above + the outer loop will
    // naturally consume the surrounding { and } as normal code.

    // ── Regular expression literal  /…/ ─────────────────────────
    if (ch === '/') {
      // Heuristic: a '/' starts a regex if preceded by one of these
      const prevNonSpace = out.trimEnd().slice(-1)
      const regexPrecursors = '=(!&|?:;,([{>~+-*/%^'
      if (regexPrecursors.includes(prevNonSpace) || prevNonSpace === '') {
        out += ch
        i++
        while (i < len) {
          if (src[i] === '\\') {
            out += src[i] + (src[i + 1] ?? '')
            i += 2
            continue
          }
          if (src[i] === '/') {
            out += src[i]
            i++
            // consume flags
            while (i < len && /[gimsuy]/.test(src[i])) {
              out += src[i]
              i++
            }
            break
          }
          if (src[i] === '\n') break // unterminated — bail
          out += src[i]
          i++
        }
        continue
      }
    }

    // ── Normal character ─────────────────────────────────────────
    out += ch
    i++
  }

  return out
}

// ── Clean up blank lines left behind by removed comments ─────────────
function collapseBlankLines(src) {
  // Replace 3+ consecutive newlines with 2 (single blank line)
  return src.replace(/\n{3,}/g, '\n\n')
}

// Remove trailing whitespace on lines that now only have spaces
function trimTrailingWhitespace(src) {
  return src
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
}

// ── Main ─────────────────────────────────────────────────────────────
let totalRemoved = 0
let filesChanged = 0

for (const file of files) {
  const original = readFileSync(file, 'utf-8')
  const stripped = trimTrailingWhitespace(collapseBlankLines(stripComments(original)))

  if (stripped === original) continue

  const rel = relative(ROOT, file)
  const origLines = original.split('\n').length
  const newLines = stripped.split('\n').length
  const diff = origLines - newLines

  totalRemoved += diff
  filesChanged++

  console.log(`  ${WRITE ? '✓' : '~'} ${rel}  (${diff > 0 ? `-${diff}` : diff} lines)`)

  if (WRITE) {
    writeFileSync(file, stripped, 'utf-8')
  }
}

console.log('')
if (filesChanged === 0) {
  console.log('No comments found — all clean! 🎉')
} else if (WRITE) {
  console.log(`Done — removed ~${totalRemoved} comment lines across ${filesChanged} files.`)
} else {
  console.log(`Found ~${totalRemoved} comment lines in ${filesChanged} files.`)
  console.log('Run with --write to apply:  node scripts/remove-comments.mjs --write')
}
