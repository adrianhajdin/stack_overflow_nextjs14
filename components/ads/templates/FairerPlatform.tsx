import React from 'react'
import type { AdCopyDeck, AdTemplateProps } from '@/types/ads'
import { buildComparisonRows, hasCompetitorData } from '@/constants/ads'
import { BRAND_COLORS } from '@/constants/brand'
import {
  contentScale,
  copyHeightEm,
  isCompactFormat,
  isPortraitFormat,
} from '@/lib/ads/formats'
import { mergeCopy } from '@/lib/ads/copy'
import AdFrame from '../primitives/AdFrame'
import AdCompact from '../primitives/AdCompact'
import AdLogo from '../primitives/AdLogo'
import RocketMark from '@/components/brand/RocketMark'
import { AdHeadline, AdSubhead } from '../primitives/AdType'
import AdComparisonTable from '../primitives/AdComparisonTable'
import AdCta from '../primitives/AdCta'

/**
 * Tutor acquisition — the terms creative.
 *
 * Copy-only, no photography: the table is the whole ad.
 *
 * Two versions, chosen by what is actually sourced. With verified competitor
 * data it runs the comparative headline and the two-column table. Without it,
 * both the headline and the table drop the comparison and simply state
 * TutorBoost's own terms — "fairer" and "earning more" are claims about other
 * platforms, and we do not make them unsourced.
 */
export const FAIRER_PLATFORM_COPY: AdCopyDeck = {
  eyebrow: 'For tutors',
  headline: [
    { text: 'Our terms,' },
    { text: 'in plain sight.', accent: true },
  ],
  subhead: 'Exactly what TutorBoost charges, and what you keep.',
  bullets: [],
  cta: { label: 'Join free', href: '/sign-up?role=tutor' },
  footnote: 'Start teaching on TutorBoost',
  disclaimer: 'Free to join.',
}

/** Swapped in only when a sourced competitor figure is on the table. */
const COMPARATIVE_COPY = {
  headline: [
    { text: 'A fairer platform.' },
    { text: 'A better future.', accent: true },
  ],
  subhead: 'See exactly how TutorBoost compares.',
}

const FairerPlatform = ({
  format = 'square',
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const rows = buildComparisonRows()
  const comparative = hasCompetitorData(rows)

  const deck = mergeCopy(
    comparative
      ? { ...FAIRER_PLATFORM_COPY, ...COMPARATIVE_COPY }
      : FAIRER_PLATFORM_COPY,
    copy,
  )
  const action = cta ?? deck.cta
  const portrait = isPortraitFormat(format)

  if (isCompactFormat(format)) {
    return (
      <AdCompact
        format={format}
        headline={deck.headline}
        cta={action}
        scale={scale}
        className={className}
        adKey="fairer-platform"
      />
    )
  }

  // No media panel here, so the copy has the full canvas height to grow into.
  const bodyScale = contentScale(copyHeightEm(format, 0, 5), { max: 1.45 })

  return (
    <AdFrame format={format} scale={scale} className={className} adKey="fairer-platform">
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '5em',
          fontSize: `${bodyScale}em`,
        }}
      >
        <AdLogo size={3.6} />

        <div style={{ marginTop: '2.4em' }}>
          <AdHeadline lines={deck.headline} size={6.4} />
        </div>

        {!portrait && (
          <div style={{ marginTop: '1.2em' }}>
            <AdSubhead size={1.95}>{deck.subhead}</AdSubhead>
          </div>
        )}

        <div style={{ marginTop: '2.8em', flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%' }}>
            <AdComparisonTable rows={rows} size={1.45} />
          </div>
        </div>

        {/* Orange footer bar carrying the CTA. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2em',
            marginTop: '2.6em',
            padding: '1.6em 2em',
            borderRadius: '1.2em',
            backgroundColor: BRAND_COLORS.orange,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.1em',
              minWidth: 0,
            }}
          >
            <RocketMark size="3.2em" color={BRAND_COLORS.white} />
            <span
              style={{
                fontSize: '1.45em',
                fontWeight: 700,
                color: BRAND_COLORS.white,
                lineHeight: 1.25,
              }}
            >
              {deck.footnote}
              <br />
              {deck.disclaimer}
            </span>
          </span>

          <AdCta cta={action} size={1.7} variant="white" shape="rounded" />
        </div>
      </div>
    </AdFrame>
  )
}

export default FairerPlatform
