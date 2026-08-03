import React from 'react'
import type { AdBullet, AdCopyDeck, AdTemplateProps } from '@/types/ads'
import { AD_PLATFORM_STATS, SAMPLE_TUTORS } from '@/constants/ads'
import { isCompactFormat, isPortraitFormat, splitMetrics } from '@/lib/ads/formats'
import { claimIsTrue, POLICY_CLAIMS } from '@/constants/claims'
import { mergeCopy } from '@/lib/ads/copy'
import AdFrame from '../primitives/AdFrame'
import AdCompact from '../primitives/AdCompact'
import AdSplit from '../primitives/AdSplit'
import AdLogo from '../primitives/AdLogo'
import { AdHeadline, fitHeadlineSize } from '../primitives/AdType'
import { AdFeatureRows } from '../primitives/AdLists'
import AdCta from '../primitives/AdCta'
import { AdTutorCardStack } from '../primitives/AdTutorBits'
import { AdTrustBar } from '../primitives/AdCards'

/**
 * Student acquisition — "More choice. Better learning. Real connection."
 *
 * The marketplace-breadth creative, and the clearest demonstration of the
 * data-driven approach: the card stack is rendered straight from whatever
 * tutors are passed in, so a fresh variant per subject, language or country is
 * just a different query.
 */
export const MORE_CHOICE_COPY: AdCopyDeck = {
  eyebrow: 'For students',
  headline: [
    { text: 'More choice.' },
    { text: 'Better learning.' },
    { text: 'Real connection.', accent: true },
  ],
  subhead: 'Find a tutor who fits how you learn.',
  // The scale line needs verified figures; the rest describe the product.
  bullets: [],
  cta: { label: 'Start learning today', href: '/tutors' },
  footnote: 'Every lesson is paid',
  disclaimer: 'Choose your own tutor',
}

/** Only states marketplace scale once those figures are verified. */
const buildBullets = (): AdBullet[] => {
  const { tutorCount, languageCount } = AD_PLATFORM_STATS

  return [
    tutorCount && {
      text: `${tutorCount} tutors`,
      subtext: languageCount ? `across ${languageCount} languages` : undefined,
      icon: 'users' as const,
    },
    {
      text: '1-on-1 lessons',
      subtext: 'tailored to your goals',
      icon: 'trend' as const,
    },
    {
      text: 'Book in minutes,',
      subtext: 'learn on your schedule',
      icon: 'clock' as const,
    },
  ].filter(Boolean) as AdBullet[]
}

const MoreChoiceBetterLearning = ({
  format = 'square',
  tutors = SAMPLE_TUTORS,
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const deck = mergeCopy({ ...MORE_CHOICE_COPY, bullets: buildBullets() }, copy)
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
        adKey="more-choice-better-learning"
      />
    )
  }

  const padding = 4.2
  const mediaShare = portrait ? 0.4 : 0.44
  const { scale: contentScale, innerWidthEm } = splitMetrics(
    format,
    mediaShare,
    padding,
    { max: 1.6 },
  )
  const headlineSize = fitHeadlineSize(deck.headline, innerWidthEm, 7)

  return (
    <AdFrame format={format} scale={scale} className={className} adKey="more-choice-better-learning">
      <AdSplit
        format={format}
        mediaShare={mediaShare}
        padding={padding}
        contentScale={contentScale}
        media={
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3em 3em 3em 0',
            }}
          >
            <AdTutorCardStack
              tutors={tutors}
              size={portrait ? 1.85 : 1.6}
              limit={3}
            />
          </div>
        }
      >
        {/* Authored for the tightest format; contentScale grows the stack. */}
        <AdLogo size={3.4} />

        <div style={{ marginTop: '1.5em' }}>
          <AdHeadline lines={deck.headline} size={headlineSize} />
        </div>

        <div style={{ marginTop: '1.8em' }}>
          <AdFeatureRows bullets={deck.bullets} size={1.55} gap={1} />
        </div>

        <div style={{ marginTop: '1.9em' }}>
          <AdCta cta={action} size={2.05} shape="rounded" />
        </div>

        <div style={{ marginTop: '1.6em' }}>
          <AdTrustBar
            align="left"
            size={1.05}
            items={[
              // The payment promise is a policy claim; the others describe
              // how the product works and need no source.
              ...(claimIsTrue(POLICY_CLAIMS.everyLessonPaid)
                ? [{ icon: 'dollar' as const, text: deck.footnote }]
                : []),
              { icon: 'user' as const, text: 'Pick your own tutor' },
              { icon: 'globe' as const, text: deck.disclaimer },
            ]}
          />
        </div>
      </AdSplit>
    </AdFrame>
  )
}

export default MoreChoiceBetterLearning
