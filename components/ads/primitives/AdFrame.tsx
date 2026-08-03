import React from 'react'
import type { AdFormatId } from '@/types/ads'
import { AD_FORMATS } from '@/lib/ads/formats'
import { BRAND_COLORS } from '@/constants/brand'

interface AdFrameProps {
  format: AdFormatId
  /** 1 = true pixel size. The gallery passes a fraction to show thumbnails. */
  scale?: number
  /** Faint orange graph-paper texture in the top-right, as per the brand. */
  grid?: boolean
  background?: 'paper' | 'white' | 'orange'
  /** Stable id used by the export tooling to target a single creative. */
  adKey?: string
  className?: string
  children: React.ReactNode
}

/**
 * The canvas every creative is drawn on.
 *
 * Two things make the whole library work:
 *
 * 1. The frame is laid out at the format's *true pixel size* and then scaled
 *    with a CSS transform. What you preview is exactly what gets exported.
 * 2. It sets `font-size: width / 100`, so `1em` inside a creative always means
 *    "1% of the ad's width". Templates size everything in `em`, which is why
 *    one template can fill an 300px MREC and a 1200px leaderboard without any
 *    per-format pixel tweaking.
 */
const AdFrame = ({
  format,
  scale = 1,
  grid = true,
  background = 'paper',
  adKey,
  className = '',
  children,
}: AdFrameProps) => {
  const { width, height } = AD_FORMATS[format]

  const backgroundColor =
    background === 'white'
      ? BRAND_COLORS.white
      : background === 'orange'
        ? BRAND_COLORS.orange
        : BRAND_COLORS.paper

  return (
    // Outer box occupies the *scaled* footprint so the page lays out correctly.
    <div
      style={{
        width: width * scale,
        height: height * scale,
        overflow: 'hidden',
        flex: 'none',
      }}
      className={className}
    >
      <div
        data-ad-key={adKey}
        data-ad-format={format}
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor,
          // 1em === 1% of the creative's width.
          fontSize: width / 100,
          fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif',
          color: BRAND_COLORS.ink,
          lineHeight: 1.2,
        }}
      >
        {grid && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${BRAND_COLORS.orange} 1px, transparent 1px), linear-gradient(90deg, ${BRAND_COLORS.orange} 1px, transparent 1px)`,
              backgroundSize: `${width / 18}px ${width / 18}px`,
              opacity: 0.13,
              // Fade the texture out towards the lower-left so copy stays clean.
              maskImage:
                'radial-gradient(120% 90% at 100% 0%, #000 0%, transparent 62%)',
              WebkitMaskImage:
                'radial-gradient(120% 90% at 100% 0%, #000 0%, transparent 62%)',
              pointerEvents: 'none',
            }}
          />
        )}

        {children}
      </div>
    </div>
  )
}

export default AdFrame
