import { memo } from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'
import type { FeedSource } from '@/types/feed'

interface SourceIconProps extends SvgIconProps {
  source: FeedSource
}

const HackerNewsIcon = memo(function HackerNewsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#FF6600" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="white"
        fontSize="15"
        fontWeight="bold"
        fontFamily="Arial"
      >
        Y
      </text>
    </SvgIcon>
  )
})

const RedditIcon = memo(function RedditIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#FF4500" />
      <circle cx="12" cy="13" r="5" fill="white" />
      <circle cx="10" cy="12.5" r="1" fill="#FF4500" />
      <circle cx="14" cy="12.5" r="1" fill="#FF4500" />
      <path d="M9.5 15.5c0 0 1 1.5 2.5 1.5s2.5-1.5 2.5-1.5" stroke="#FF4500" strokeWidth="0.8" fill="none" />
      <circle cx="17.5" cy="7" r="1.5" fill="white" />
      <path d="M12 4l4.5 3" stroke="white" strokeWidth="1.2" fill="none" />
    </SvgIcon>
  )
})

const DevtoIcon = memo(function DevtoIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#0A0A0A" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="Arial"
      >
        DEV
      </text>
    </SvgIcon>
  )
})

const GithubIcon = memo(function GithubIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
        fill="#238636"
      />
    </SvgIcon>
  )
})

const LobstersIcon = memo(function LobstersIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#AC130D" />
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial"
      >
        {'{}'}
      </text>
    </SvgIcon>
  )
})

const HashnodeIcon = memo(function HashnodeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#2962FF" />
      <circle cx="12" cy="12" r="5.5" fill="white" />
      <circle cx="12" cy="12" r="3" fill="#2962FF" />
    </SvgIcon>
  )
})

const ProductHuntIcon = memo(function ProductHuntIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="#DA552F" />
      <path
        d="M14.5 11.5C14.5 12.88 13.38 14 12 14H10V9H12C13.38 9 14.5 10.12 14.5 11.5Z"
        fill="white"
      />
      <rect x="8" y="7.5" width="2" height="9" rx="0.5" fill="white" />
    </SvgIcon>
  )
})

const SourceIcon = memo(function SourceIcon({ source, ...props }: SourceIconProps) {
  switch (source) {
    case 'hackernews':
      return <HackerNewsIcon {...props} />
    case 'reddit':
      return <RedditIcon {...props} />
    case 'devto':
      return <DevtoIcon {...props} />
    case 'github':
      return <GithubIcon {...props} />
    case 'lobsters':
      return <LobstersIcon {...props} />
    case 'hashnode':
      return <HashnodeIcon {...props} />
    case 'producthunt':
      return <ProductHuntIcon {...props} />
    default:
      return null
  }
})

export default SourceIcon
