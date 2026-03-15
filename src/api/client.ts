
export class ApiError extends Error {
  readonly status: number
  readonly source: string
  readonly retryable: boolean

  constructor(message: string, source: string, status = 0, retryable = true) {
    super(message)
    this.name = 'ApiError'
    this.source = source
    this.status = status
    this.retryable = retryable
  }
}

function backoffDelay(attempt: number): Promise<void> {
  return sleep(500 * 2 ** attempt)
}

function buildNetworkError(err: unknown, source: string, timeoutMs: number): ApiError {
  const isAbort = err instanceof DOMException && err.name === 'AbortError'
  const message = isAbort
    ? `${source}: Request timed out after ${timeoutMs}ms`
    : `${source}: Network error — ${(err as Error).message}`
  return new ApiError(message, source, 0, true)
}

async function fetchOnce(
  url: string,
  fetchOptions: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit & {
    source: string
    timeoutMs?: number
    maxRetries?: number
  },
): Promise<Response> {
  const { source, timeoutMs = 10_000, maxRetries = 2, ...fetchOptions } = options
  let lastError: ApiError | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetchOnce(url, fetchOptions, timeoutMs)

      if (res.ok) return res

      const retryable = res.status >= 500 || res.status === 429
      lastError = new ApiError(
        `${source}: HTTP ${res.status} — ${res.statusText || 'Request failed'}`,
        source,
        res.status,
        retryable,
      )
      if (!retryable || attempt === maxRetries) throw lastError
      await backoffDelay(attempt)
    } catch (err) {
      if (err instanceof ApiError) throw err
      lastError = buildNetworkError(err, source, timeoutMs)
      if (attempt === maxRetries) throw lastError
      await backoffDelay(attempt)
    }
  }

  throw lastError ?? new ApiError(`${source}: Unknown error`, source)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
