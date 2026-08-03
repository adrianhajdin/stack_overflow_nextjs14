import React from 'react'
import type { AdCopyDeck, AdTemplateProps } from '@/types/ads'
import { isCompactFormat, splitMetrics } from '@/lib/ads/formats'
import { buildTutorPromises } from '@/constants/ads'
import { mergeCopy } from '@/lib/ads/copy'
import AdFrame from '../primitives/AdFrame'
import AdCompact from '../primitives/AdCompact'
import AdSplit from '../primitives/AdSplit'
import AdLogo from '../primitives/AdLogo'
import { AdHeadline, AdSubhead, fitHeadlineSize } from '../primitives/AdType'
import { AdCheckList } from '../primitives/AdLists'
import AdCta from '../primitives/AdCta'
import { AdCurvedArrow, AdHeroPhoto, AdRoundBadge } from '../primitives/AdMedia'

/**
 * Tutor acquisition — "Your skills. Your students. Your income."
 *
 * The autonomy angle rather than the money angle. Pairs well with
 * TeachMoreKeepMore as the second creative in a tutor-side test.
 */
export const YOUR_SKILLS_YOUR_INCOME_COPY: AdCopyDeck = {
  eyebrow: 'For tutors',
  headline: [
    { text: 'Your skills.' },
    { text: 'Your students.' },
    { text: 'Your income.', accent: true },
  ],
  subhead: 'We handle the platform. You do what you do best.',
  // Built at render time from the verified policy claims. "Fast payouts" was
  // dropped outright: there is no payout-time figure to stand behind.
  bullets: [],
  cta: { label: 'Get started free', href: '/sign-up?role=tutor' },
  footnote: 'Built for tutors, not investors.',
  disclaimer: 'No credit card required.',
}

const YourSkillsYourIncome = ({
  format = 'square',
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const deck = mergeCopy(
    {
      ...YOUR_SKILLS_YOUR_INCOME_COPY,
      bullets: buildTutorPromises().map(({ text }) => ({ text })),
    },
    copy,
  )
  const action = cta ?? deck.cta

  if (isCompactFormat(format)) {
    return (
      <AdCompact
        format={format}
        headline={deck.headline}
        cta={action}
        scale={scale}
        className={className}
        adKey="your-skills-your-income"
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
    <AdFrame format={format} scale={scale} className={className} adKey="your-skills-your-income">
      <AdSplit
        format={format}
        mediaShare={mediaShare}
        padding={padding}
        contentScale={contentScale}
        media={
          <AdHeroPhoto blob="right" blobSize={118}>
            {/* Sticker + arrow: the hand-made touch on the master art. */}
            <AdRoundBadge
              lines={['Built for', 'tutors,', 'not', 'investors.']}
              size={1.45}
              style={{ position: 'absolute', right: '7%', bottom: '11%' }}
            />
            <AdCurvedArrow
              size="9em"
              style={{ position: 'absolute', right: '30%', bottom: '15%' }}
            />
          </AdHeroPhoto>
        }
      >
        {/* Authored for the tightest format; contentScale grows the stack. */}
        <AdLogo size={3.4} />

        <div style={{ marginTop: '1.5em' }}>
          <AdHeadline lines={deck.headline} size={headlineSize} />
        </div>

        <div style={{ marginTop: '1.2em' }}>
          <AdSubhead size={1.95}>{deck.subhead}</AdSubhead>
        </div>

        <div style={{ marginTop: '1.7em' }}>
          <AdCheckList bullets={deck.bullets} size={1.65} gap={0.7} />
        </div>

        <div style={{ marginTop: '1.9em' }}>
          <AdCta cta={action} size={2.05} shape="rounded" />
        </div>
      </AdSplit>
    </AdFrame>
  )
}

export default YourSkillsYourIncome
