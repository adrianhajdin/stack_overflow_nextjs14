import React from 'react'
import type { AdCopyDeck, AdTemplateProps } from '@/types/ads'
import { AD_PLATFORM_STATS } from '@/constants/ads'
import { isCompactFormat, splitMetrics } from '@/lib/ads/formats'
import { mergeCopy } from '@/lib/ads/copy'
import AdFrame from '../primitives/AdFrame'
import AdCompact from '../primitives/AdCompact'
import AdSplit from '../primitives/AdSplit'
import AdLogo from '../primitives/AdLogo'
import { AdHeadline, fitHeadlineSize } from '../primitives/AdType'
import { AdFeatureRows } from '../primitives/AdLists'
import AdCta from '../primitives/AdCta'
import { AdHeroPhoto } from '../primitives/AdMedia'
import { AdRatingCard } from '../primitives/AdCards'

/**
 * Student acquisition — "Learn with great tutors. Get real results."
 *
 * The general-purpose student creative: benefit rows plus marketplace social
 * proof. Use it for cold traffic, and TutorSpotlight for retargeting.
 */
export const LEARN_WITH_GREAT_TUTORS_COPY: AdCopyDeck = {
  eyebrow: 'For students',
  headline: [
    { text: 'Learn with' },
    { text: 'great tutors.' },
    { text: 'Get real results.', accent: true },
  ],
  subhead: '1-on-1 lessons tailored to you. Any subject, any level.',
  bullets: [
    { text: '1-on-1 lessons', subtext: 'Just for you', icon: 'user' },
    { text: 'Any subject,', subtext: 'any level', icon: 'book' },
    { text: 'Flexible scheduling', icon: 'calendar' },
    { text: 'Book in minutes', icon: 'clock' },
  ],
  cta: { label: 'Find your tutor', href: '/tutors' },
  footnote: 'Rated by students',
  disclaimer: '',
}

const LearnWithGreatTutors = ({
  format = 'square',
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const deck = mergeCopy(LEARN_WITH_GREAT_TUTORS_COPY, copy)
  const action = cta ?? deck.cta
  const averageRating = AD_PLATFORM_STATS.averageRating

  if (isCompactFormat(format)) {
    return (
      <AdCompact
        format={format}
        headline={deck.headline}
        cta={action}
        scale={scale}
        className={className}
        adKey="learn-with-great-tutors"
      />
    )
  }

  const padding = 4.2
  const mediaShare = 0.44
  const { scale: contentScale, innerWidthEm } = splitMetrics(
    format,
    mediaShare,
    padding,
    { max: 1.7 },
  )
  const headlineSize = fitHeadlineSize(deck.headline, innerWidthEm, 7.4)

  return (
    <AdFrame format={format} scale={scale} className={className} adKey="learn-with-great-tutors">
      <AdSplit
        format={format}
        mediaShare={mediaShare}
        padding={padding}
        contentScale={contentScale}
        media={
          <AdHeroPhoto blob="right" blobSize={118}>
            {/* The rating card is a factual claim about our average score, so
                it only appears once that figure is verified. */}
            {averageRating && (
              <div style={{ position: 'absolute', right: '5%', bottom: '9%' }}>
                <AdRatingCard
                  title={deck.footnote}
                  ratingLabel={averageRating}
                  size={1.45}
                />
              </div>
            )}
          </AdHeroPhoto>
        }
      >
        {/* Authored for the tightest format; contentScale grows the stack. */}
        <AdLogo size={3.4} />

        <div style={{ marginTop: '1.5em' }}>
          <AdHeadline lines={deck.headline} size={headlineSize} />
        </div>

        <div style={{ marginTop: '1.8em' }}>
          <AdFeatureRows bullets={deck.bullets} size={1.5} gap={0.9} />
        </div>

        <div style={{ marginTop: '1.9em' }}>
          <AdCta cta={action} size={2.05} shape="rounded" />
        </div>
      </AdSplit>
    </AdFrame>
  )
}

export default LearnWithGreatTutors
