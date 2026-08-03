import React from 'react'
import type { AdCtaSpec } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'
import AdIcon from './AdIcon'

interface AdCtaProps {
  cta: AdCtaSpec
  size?: number
  variant?: 'solid' | 'outline' | 'white'
  /** Square-ish corners (poster) vs. fully rounded pill (feed ads). */
  shape?: 'pill' | 'rounded'
  fullWidth?: boolean
}

/** The orange call-to-action button, with the trailing arrow. */
export const AdCta = ({
  cta,
  size = 2.3,
  variant = 'solid',
  shape = 'pill',
  fullWidth = false,
}: AdCtaProps) => {
  const palette =
    variant === 'solid'
      ? { bg: BRAND_COLORS.orange, fg: BRAND_COLORS.white, border: 'transparent' }
      : variant === 'white'
        ? { bg: BRAND_COLORS.white, fg: BRAND_COLORS.ink, border: 'transparent' }
        : {
            bg: 'transparent',
            fg: BRAND_COLORS.orange,
            border: BRAND_COLORS.orange,
          }

  return (
    <span
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // These are relative to this element's own font-size, which is already
        // `${size}em` — multiplying by `size` again would scale them twice.
        gap: '1.15em',
        padding: '0.72em 1.15em',
        backgroundColor: palette.bg,
        color: palette.fg,
        border: `0.09em solid ${palette.border}`,
        borderRadius: shape === 'pill' ? '999em' : '0.42em',
        fontSize: `${size}em`,
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        boxShadow:
          variant === 'solid'
            ? `0 0.5em 1.4em ${BRAND_COLORS.orange}33`
            : undefined,
      }}
    >
      {cta.label}
      {/* Arrow is inline rather than an AdIcon so it inherits the button's colour. */}
      <svg
        width="0.95em"
        height="0.95em"
        viewBox="0 0 24 24"
        fill="none"
        stroke={palette.fg}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </span>
  )
}

interface AdCtaNotesProps {
  notes: string[]
  size?: number
  color?: string
  direction?: 'row' | 'column'
}

/** The ticked reassurances that sit beside the CTA ("Start free"). */
export const AdCtaNotes = ({
  notes,
  size = 1.7,
  color = BRAND_COLORS.inkSoft,
  direction = 'column',
}: AdCtaNotesProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: direction,
      gap: direction === 'row' ? '1.4em' : '0.5em',
      fontSize: `${size}em`,
      color,
      fontWeight: 500,
    }}
  >
    {notes.map((note) => (
      <span
        key={note}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}
      >
        <AdIcon name="check" size="1em" strokeWidth={3} />
        {note}
      </span>
    ))}
  </div>
)

export default AdCta
