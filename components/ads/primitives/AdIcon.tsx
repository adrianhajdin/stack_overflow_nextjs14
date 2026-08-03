import React from 'react'
import type { AdIconName } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'

/**
 * The ad-library icon set: line icons drawn on a shared 24x24 grid so they
 * optically match at any size. Kept inline (rather than as /public SVGs) so
 * creatives render in one pass when screenshotted to an image.
 */
const PATHS: Record<AdIconName, React.ReactNode> = {
  percent: (
    <>
      <path d="M18 6 6 18" />
      <circle cx="8" cy="8" r="2.4" />
      <circle cx="16" cy="16" r="2.4" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 3v18" />
      <path d="M16 7.5c0-1.6-1.8-2.6-4-2.6S8 5.9 8 7.7s1.7 2.4 4 3 4 1.3 4 3.2-1.8 2.9-4 2.9-4-1.1-4-2.7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.4" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 19.2a6 6 0 0 1 12 0" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 5.9" />
      <path d="M17.6 14.2a6 6 0 0 1 3.4 5" />
    </>
  ),
  trend: (
    <>
      <path d="M3.5 16.5 9 11l3.5 3.5L20 7" />
      <path d="M15 7h5v5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 19.5 6v5.6c0 4.4-3 7.7-7.5 9.2-4.5-1.5-7.5-4.8-7.5-9.2V6Z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 12.2c0 4-3.8 7.2-8.5 7.2a10 10 0 0 1-2.6-.34L4.5 20.5l1.2-3.4A6.8 6.8 0 0 1 3.5 12.2C3.5 8.2 7.3 5 12 5s8.5 3.2 8.5 7.2Z" />
      <path d="M9 12h.01M12 12h.01M15 12h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.3l3.4 2" />
    </>
  ),
  star: (
    <path d="m12 3.8 2.6 5.3 5.9.86-4.25 4.14 1 5.86L12 17.2l-5.25 2.76 1-5.86L3.5 9.96l5.9-.86Z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.4 3.4 5.4 3.4 8.5s-1.2 6.1-3.4 8.5c-2.2-2.4-3.4-5.4-3.4-8.5S9.8 5.9 12 3.5Z" />
    </>
  ),
  book: (
    <>
      <path d="M5 4.5h9.5A3.5 3.5 0 0 1 18 8v11.5H8.5A3.5 3.5 0 0 1 5 16Z" />
      <path d="M5 16a3.5 3.5 0 0 1 3.5-3.5H18" />
    </>
  ),
  flask: (
    <>
      <path d="M10 3.5v6L5.2 17.4A2.4 2.4 0 0 0 7.3 21h9.4a2.4 2.4 0 0 0 2.1-3.6L14 9.5v-6" />
      <path d="M8.5 3.5h7M7.6 14.5h8.8" />
    </>
  ),
  rocket: (
    <>
      <path d="M14.5 4.2c3.4 2.2 5.3 6 5.3 9.4L15.6 18H9.9l-4.2-4.4c0-3.4 1.9-7.2 5.3-9.4Z" />
      <circle cx="12.75" cy="10" r="1.8" />
      <path d="M9.9 18c-.4 1.6-1.4 2.6-3.1 3.1.5-1.7 1.5-2.7 3.1-3.1ZM15.6 18c.4 1.6 1.4 2.6 3.1 3.1-.5-1.7-1.5-2.7-3.1-3.1Z" />
    </>
  ),
  graduation: (
    <>
      <path d="M2.8 9.2 12 5l9.2 4.2L12 13.4Z" />
      <path d="M6.6 11v4.9c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9V11" />
      <path d="M20.4 9.6v4.6" />
    </>
  ),
  heart: (
    <path d="M12 20.2c-5.4-3.3-8-6.3-8-9.6A4.4 4.4 0 0 1 12 7.9a4.4 4.4 0 0 1 8 2.7c0 3.3-2.6 6.3-8 9.6Z" />
  ),
  // Just the triangle: callers draw their own circular button behind it.
  play: <path d="M9.2 7.2 17 12l-7.8 4.8Z" />,
  // The tick is pinned to white so it stays legible on the filled badge.
  // This glyph is designed for `filled`; stroked it reads as an outline only.
  verified: (
    <>
      <path d="m12 3.2 2.2 1.7 2.8-.2.9 2.6 2.3 1.6-1 2.6 1 2.6-2.3 1.6-.9 2.6-2.8-.2L12 20.8l-2.2-1.7-2.8.2-.9-2.6-2.3-1.6 1-2.6-1-2.6 2.3-1.6.9-2.6 2.8.2Z" />
      <path
        d="m9.2 12 2 2 3.6-3.8"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  support: (
    <>
      <path d="M4.6 15v-3a7.4 7.4 0 0 1 14.8 0v3" />
      <path d="M4.6 13.2h1.6a1.2 1.2 0 0 1 1.2 1.2v2.4a1.2 1.2 0 0 1-1.2 1.2H5.8a1.2 1.2 0 0 1-1.2-1.2Z" />
      <path d="M19.4 13.2h-1.6a1.2 1.2 0 0 0-1.2 1.2v2.4a1.2 1.2 0 0 0 1.2 1.2h.4a1.2 1.2 0 0 0 1.2-1.2Z" />
      <path d="M18.6 18v.6a2.4 2.4 0 0 1-2.4 2.4H13" />
    </>
  ),
}

interface AdIconProps {
  name: AdIconName
  /**
   * A number is treated as pixels; a string is passed through as-is. Creatives
   * always pass an `em` string so icons scale with the format.
   */
  size?: number | string
  color?: string
  strokeWidth?: number
  /** Fill the `star` and `check` glyphs instead of stroking them. */
  filled?: boolean
  className?: string
}

const AdIcon = ({
  name,
  size = 24,
  color = BRAND_COLORS.orange,
  strokeWidth = 1.9,
  filled = false,
  className,
}: AdIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={filled ? 'none' : color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
)

export default AdIcon
