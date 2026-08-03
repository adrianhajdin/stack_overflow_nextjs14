import React from 'react'
import RocketMark from '@/components/brand/RocketMark'
import { BRAND, BRAND_COLORS } from '@/constants/brand'

interface AdLogoProps {
  /** Height of the wordmark in `em` (1em = 1% of the creative's width). */
  size?: number
  /** `light` for paper backgrounds, `dark` for photo / orange backgrounds. */
  tone?: 'light' | 'dark'
  markOnly?: boolean
}

/**
 * The lockup, sized in `em` so it scales with the creative.
 *
 * Deliberately separate from the app's `<Logo />`: that one uses Tailwind's
 * rem-based type scale and theme-aware colours, neither of which is wanted on
 * a fixed-size creative that may be exported outside the app's theme context.
 */
const AdLogo = ({ size = 3.2, tone = 'light', markOnly = false }: AdLogoProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: `${size * 0.24}em`,
    }}
  >
    <RocketMark size={`${size * 1.12}em`} />

    {!markOnly && (
      <span
        style={{
          fontSize: `${size}em`,
          fontWeight: 800,
          letterSpacing: '-0.035em',
          lineHeight: 1,
        }}
      >
        <span style={{ color: BRAND_COLORS.orange }}>{BRAND.wordmark.accent}</span>
        <span
          style={{
            color: tone === 'dark' ? BRAND_COLORS.white : BRAND_COLORS.ink,
          }}
        >
          {BRAND.wordmark.ink}
        </span>
      </span>
    )}
  </span>
)

export default AdLogo
