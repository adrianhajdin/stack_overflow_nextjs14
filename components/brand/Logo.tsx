import React from 'react'
import { BRAND, BRAND_COLORS } from '@/constants/brand'
import RocketMark from './RocketMark'

export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type LogoTone =
  /** Follows the app's light/dark theme. */
  | 'theme'
  /** Orange rocket + orange/ink wordmark, for light surfaces. */
  | 'light'
  /** Orange rocket + orange/white wordmark, for dark or photo surfaces. */
  | 'dark'
  /** Everything one colour — for single-colour placements. */
  | 'mono'

interface LogoProps {
  size?: LogoSize
  tone?: LogoTone
  /** Hide the wordmark and render the rocket on its own. */
  markOnly?: boolean
  /** Only used when `tone="mono"`. */
  monoColor?: string
  className?: string
}

const SIZES: Record<LogoSize, { mark: number; text: string; gap: string }> = {
  xs: { mark: 20, text: 'text-base', gap: 'gap-1.5' },
  sm: { mark: 26, text: 'text-xl', gap: 'gap-1.5' },
  md: { mark: 32, text: 'text-2xl', gap: 'gap-2' },
  lg: { mark: 44, text: 'text-4xl', gap: 'gap-2.5' },
  xl: { mark: 60, text: 'text-5xl', gap: 'gap-3' },
}

/**
 * The TutorBoost lockup: rocket mark + two-tone wordmark.
 *
 * Used everywhere the brand appears — nav, mobile nav, auth screens and every
 * ad creative — so the mark only ever has to be swapped in one place.
 */
const Logo = ({
  size = 'sm',
  tone = 'theme',
  markOnly = false,
  monoColor = BRAND_COLORS.ink,
  className = '',
}: LogoProps) => {
  const { mark, text, gap } = SIZES[size]

  const markColor = tone === 'mono' ? monoColor : BRAND_COLORS.orange

  const accentClass = tone === 'mono' ? '' : 'text-primary-500'
  const inkClass =
    tone === 'mono'
      ? ''
      : tone === 'dark'
        ? 'text-light-900'
        : tone === 'light'
          ? 'text-dark-100'
          : 'text-dark-100 dark:text-light-900'

  return (
    <span className={`inline-flex items-center ${gap} ${className}`}>
      <RocketMark size={mark} color={markColor} />

      {!markOnly && (
        <span
          className={`font-spaceGrotesk font-bold leading-none tracking-tight ${text}`}
          style={tone === 'mono' ? { color: monoColor } : undefined}
        >
          <span className={accentClass}>{BRAND.wordmark.accent}</span>
          <span className={inkClass}>{BRAND.wordmark.ink}</span>
        </span>
      )}
    </span>
  )
}

export default Logo
