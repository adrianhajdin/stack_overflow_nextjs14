import React from 'react'
import type { AdCopyDeck, AdTemplateProps } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'
import { isCompactFormat, isPortraitFormat, splitMetrics } from '@/lib/ads/formats'
import { buildTutorPromises } from '@/constants/ads'
import { mergeCopy } from '@/lib/ads/copy'
import AdFrame from '../primitives/AdFrame'
import AdCompact from '../primitives/AdCompact'
import AdSplit from '../primitives/AdSplit'
import AdLogo from '../primitives/AdLogo'
import { AdHeadline, AdSubhead, fitHeadlineSize } from '../primitives/AdType'
import { AdStatRings } from '../primitives/AdLists'
import AdCta, { AdCtaNotes } from '../primitives/AdCta'
import { AdHeroPhoto } from '../primitives/AdMedia'
import { AdEarningsCompare } from '../primitives/AdCards'

/**
 * Tutor acquisition — "Teach more. Keep more."
 *
 * The flagship earnings ad. Leads with the take-home comparison, so it is the
 * one to reach for in performance campaigns aimed at tutors already on a
 * competitor platform.
 */
export const TEACH_MORE_KEEP_MORE_COPY: AdCopyDeck = {
  eyebrow: 'For tutors',
  headline: [
    { text: 'Teach more.' },
    { text: 'Keep more.', accent: true },
  ],
  subhead: 'A tutoring platform built for tutors.',
  // Built at render time from the verified policy claims; see buildTutorPromises.
  bullets: [],
  cta: { label: 'Join TutorBoost', href: '/sign-up?role=tutor' },
  footnote: 'Start free',
  disclaimer: 'No credit card',
}

const TeachMoreKeepMore = ({
  format = 'leaderboard',
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const promises = buildTutorPromises()
  const deck = mergeCopy(
    {
      ...TEACH_MORE_KEEP_MORE_COPY,
      bullets: promises.map(({ icon, text }) => ({ icon, text })),
    },
    copy,
  )
  const action = cta ?? deck.cta
  const portrait = isPortraitFormat(format)

  // Small display units cannot carry the stat strip or the earnings panel.
  if (isCompactFormat(format)) {
    return (
      <AdCompact
        format={format}
        headline={deck.headline}
        cta={action}
        scale={scale}
        className={className}
        adKey="teach-more-keep-more"
      />
    )
  }

  const padding = portrait ? 5 : 4
  const mediaShare = portrait ? 0.42 : 0.47
  // The four-across stat ring row is width-constrained, so this template is
  // held below the default ceiling to stop the labels wrapping to three lines.
  const { scale: contentScale, innerWidthEm } = splitMetrics(
    format,
    mediaShare,
    padding,
    { max: 1.45 },
  )
  const headlineSize = fitHeadlineSize(deck.headline, innerWidthEm, 7.8)

  return (
    <AdFrame format={format} scale={scale} className={className} adKey="teach-more-keep-more">
      <AdSplit
        format={format}
        mediaShare={mediaShare}
        padding={padding}
        contentScale={contentScale}
        media={
          <AdHeroPhoto blob="right" blobSize={portrait ? 105 : 122}>
            {/* The earnings panel overlaps the photo, as in the master art. */}
            <div
              style={{
                position: 'absolute',
                right: portrait ? '6%' : '4%',
                bottom: portrait ? '10%' : '13%',
                width: portrait ? '84%' : '82%',
              }}
            >
              <AdEarningsCompare size={portrait ? 1.5 : 1.35} />
            </div>
          </AdHeroPhoto>
        }
      >
        {/* Sizes are authored for the tightest format; AdSplit's contentScale
            grows the whole stack for formats with more room. */}
        <AdLogo size={3.4} />

        <div style={{ marginTop: '1.5em' }}>
          <AdHeadline lines={deck.headline} size={headlineSize} />
        </div>

        <div style={{ marginTop: '1.1em' }}>
          <AdSubhead size={2}>{deck.subhead}</AdSubhead>
        </div>

        <div style={{ marginTop: '1.9em' }}>
          <AdStatRings
            bullets={deck.bullets}
            size={1.15}
            labelsInRing={promises.map((promise) => promise.ring)}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2.2em',
            marginTop: '1.9em',
            flexWrap: 'wrap',
          }}
        >
          <AdCta cta={action} size={2.05} shape="rounded" />
          <AdCtaNotes
            notes={[deck.footnote, deck.disclaimer]}
            size={1.5}
            color={BRAND_COLORS.inkSoft}
          />
        </div>
      </AdSplit>
    </AdFrame>
  )
}

export default TeachMoreKeepMore
