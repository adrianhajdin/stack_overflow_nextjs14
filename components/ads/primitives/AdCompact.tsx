import React from 'react'
import type { AdCtaSpec, AdFormatId, AdHeadlineLine } from '@/types/ads'
import { AD_FORMATS } from '@/lib/ads/formats'
import AdFrame from './AdFrame'
import AdLogo from './AdLogo'
import AdCta from './AdCta'
import { AdHeadline, fitHeadlineSize } from './AdType'

interface AdCompactProps {
  format: AdFormatId
  headline: AdHeadlineLine[]
  cta: AdCtaSpec
  scale?: number
  className?: string
  adKey?: string
  /** Optional block between the headline and the CTA, e.g. a tutor identity. */
  children?: React.ReactNode
}

/**
 * Shared layout for the small display units (MREC, skyscraper, billboard).
 *
 * These sizes cannot carry a template's full stack, so every template collapses
 * to logo → headline → CTA here. The 970x250 billboard runs that row-wise
 * (headline beside the CTA) while the tall units stack it; in both cases the
 * headline is fitted to whichever of width or height binds first, so nothing
 * clips at 300px wide or 250px tall.
 */
const AdCompact = ({
  format,
  headline,
  cta,
  scale = 1,
  className,
  adKey,
  children,
}: AdCompactProps) => {
  const { width, height } = AD_FORMATS[format]
  const canvasHeightEm = (height / width) * 100

  // Short and wide (the billboard) reads better side by side than stacked.
  const rowLayout = width > height * 2
  const padding = rowLayout ? 4 : 5
  const availableHeightEm = canvasHeightEm - 2 * padding

  const logoSize = rowLayout ? 3.6 : 5.5
  const ctaSize = rowLayout ? 2.6 : 3.4
  // AdCta's own padding makes it roughly 2.45x its font size tall.
  const ctaHeightEm = ctaSize * 2.45

  const headlineWidthEm = rowLayout ? 58 : 100 - 2 * padding
  const heightBudgetEm = rowLayout
    ? availableHeightEm - logoSize * 1.25 - 1.5
    : availableHeightEm - logoSize * 1.25 - ctaHeightEm - 4

  const headlineMax = Math.max(
    2,
    heightBudgetEm / (headline.length * 1.06),
  )
  const headlineSize = fitHeadlineSize(
    headline,
    headlineWidthEm,
    headlineMax,
    Math.min(headlineMax, 2.5),
  )

  if (rowLayout) {
    return (
      <AdFrame format={format} scale={scale} className={className} adKey={adKey}>
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: `${padding}em`,
            padding: `${padding}em`,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <AdLogo size={logoSize} />
            <div style={{ marginTop: '0.8em' }}>
              <AdHeadline lines={headline} size={headlineSize} />
            </div>
          </div>

          {children}

          <AdCta cta={cta} size={ctaSize} shape="rounded" />
        </div>
      </AdFrame>
    )
  }

  return (
    <AdFrame format={format} scale={scale} className={className} adKey={adKey}>
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          // Without this the CTA would stretch to the full column width.
          alignItems: 'flex-start',
          padding: `${padding}em`,
        }}
      >
        <AdLogo size={logoSize} />

        {/* Logo pinned top, CTA pinned bottom, message centred between them —
            `space-between` alone would strand the headline on tall units. */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: `${padding * 0.7}em`,
            width: '100%',
            minHeight: 0,
          }}
        >
          {headline.length > 0 && (
            <AdHeadline lines={headline} size={headlineSize} />
          )}
          {children}
        </div>

        <AdCta cta={cta} size={ctaSize} shape="rounded" />
      </div>
    </AdFrame>
  )
}

export default AdCompact
