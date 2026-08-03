import React from 'react'
import type { AdHeadlineLine } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'
import AdIcon from './AdIcon'

/**
 * Typography primitives for ad creatives.
 *
 * Everything is sized in `em`, which AdFrame pins to 1% of the creative's
 * width — so a headline set at `size={7}` is 7% of the ad width in every
 * format, from a 300px MREC to a 1200px leaderboard.
 */

interface AdEyebrowProps {
  children: React.ReactNode
  /** Outlined pill (as on the poster) vs. plain uppercase text. */
  variant?: 'pill' | 'plain'
  size?: number
}

export const AdEyebrow = ({
  children,
  variant = 'pill',
  size = 1.9,
}: AdEyebrowProps) => {
  const text = (
    <span
      style={{
        fontSize: `${size}em`,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: BRAND_COLORS.orange,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )

  if (variant === 'plain') return text

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${size * 0.4}em`,
        padding: `${size * 0.55}em ${size * 1.1}em`,
        border: `${Math.max(1, size * 0.09)}em solid ${BRAND_COLORS.orange}`,
        borderRadius: '999em',
        lineHeight: 1,
      }}
    >
      {text}
      <AdIcon name="star" size={`${size * 0.85}em`} filled />
    </span>
  )
}

/**
 * Largest headline size (in `em`) that keeps every line unwrapped inside
 * `availableEm`, capped at `max` and floored at `min`.
 *
 * Headlines are the one element that breaks a creative when it overflows, and
 * a template has to survive a 44em-wide leaderboard column and a 90em-wide
 * story column. Estimating from the character count is approximate, but it is
 * measured against the actual face (Inter at weight 800 averages ~0.58em per
 * character) and errs small, so nothing wraps unexpectedly.
 */
export const fitHeadlineSize = (
  lines: AdHeadlineLine[],
  availableEm: number,
  max: number,
  min = max * 0.55,
): number => {
  const longest = Math.max(
    1,
    ...lines.map(
      (line) => line.text.length + (line.accentTail ? line.accentTail.length + 1 : 0),
    ),
  )
  const estimatedWidthPerEm = longest * 0.58

  return Math.max(min, Math.min(max, availableEm / estimatedWidthPerEm))
}

interface AdHeadlineProps {
  lines: AdHeadlineLine[]
  size?: number
  /** Overrides the ink colour for dark or photographic backgrounds. */
  inkColor?: string
  align?: 'left' | 'center'
}

export const AdHeadline = ({
  lines,
  size = 7,
  inkColor = BRAND_COLORS.ink,
  align = 'left',
}: AdHeadlineProps) => (
  <h2
    style={{
      fontSize: `${size}em`,
      fontWeight: 800,
      letterSpacing: '-0.033em',
      lineHeight: 1.02,
      margin: 0,
      textAlign: align,
    }}
  >
    {lines.map((line, i) => (
      <span
        key={`${line.text}-${i}`}
        style={{
          display: 'block',
          color: line.accent ? BRAND_COLORS.orange : inkColor,
        }}
      >
        {line.text}
        {line.accentTail && (
          <>
            {' '}
            <span
              style={{
                color: line.accent ? inkColor : BRAND_COLORS.orange,
              }}
            >
              {line.accentTail}
            </span>
          </>
        )}
      </span>
    ))}
  </h2>
)

interface AdSubheadProps {
  children: React.ReactNode
  size?: number
  color?: string
  weight?: number
  align?: 'left' | 'center'
}

export const AdSubhead = ({
  children,
  size = 2.4,
  color = BRAND_COLORS.inkSoft,
  weight = 500,
  align = 'left',
}: AdSubheadProps) => (
  <p
    style={{
      fontSize: `${size}em`,
      fontWeight: weight,
      color,
      lineHeight: 1.35,
      margin: 0,
      textAlign: align,
    }}
  >
    {children}
  </p>
)

interface AdKickerProps {
  children: React.ReactNode
  size?: number
  color?: string
}

/**
 * The handwritten aside ("Same work. More money."). Falls back through a
 * couple of common script faces before landing on generic cursive.
 */
export const AdKicker = ({
  children,
  size = 1.9,
  color = BRAND_COLORS.ink,
}: AdKickerProps) => (
  <span
    style={{
      fontFamily:
        "'Segoe Script', 'Bradley Hand', 'Brush Script MT', 'Comic Sans MS', cursive",
      fontSize: `${size}em`,
      fontWeight: 700,
      fontStyle: 'italic',
      color,
      lineHeight: 1.1,
    }}
  >
    {children}
  </span>
)

/** A word with the brand's hand-drawn orange underline, as on "fair". */
export const AdUnderlined = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      borderBottom: `0.14em solid ${BRAND_COLORS.orange}`,
      paddingBottom: '0.04em',
    }}
  >
    {children}
  </span>
)
