import React from 'react'
import type { AdBullet, AdCopyDeck, AdTemplateProps } from '@/types/ads'
import { AD_PLATFORM_STATS, SAMPLE_TUTORS } from '@/constants/ads'
import { claim, claimIsTrue, MARKETPLACE_CLAIMS, POLICY_CLAIMS } from '@/constants/claims'
import { BRAND, BRAND_COLORS } from '@/constants/brand'
import { fillCopyDeck, mergeCopy } from '@/lib/ads/copy'
import { AD_FORMATS, isCompactFormat, splitMetrics } from '@/lib/ads/formats'
import AdFrame from '../primitives/AdFrame'
import AdCompact from '../primitives/AdCompact'
import AdLogo from '../primitives/AdLogo'
import {
  AdHeadline,
  AdSubhead,
  AdUnderlined,
  fitHeadlineSize,
} from '../primitives/AdType'
import { AdFeatureRows } from '../primitives/AdLists'
import AdCta, { AdCtaNotes } from '../primitives/AdCta'
import { AdFooterStrip, AdNoticePill } from '../primitives/AdCards'
import { AdOrangePanel } from '../primitives/AdMedia'
import { AdSocialProofBar } from '../primitives/AdTutorBits'
import AdTutorProfileCard from '../primitives/AdTutorProfileCard'

/**
 * Student acquisition — "Your perfect tutor is here."
 *
 * Sells the marketplace by showing the product: a real profile card, rendered
 * from a tutor record, next to the platform's promises. The highest-intent
 * creative in the set — the viewer sees exactly who they would book and when.
 *
 * Pair it with the batch generator to produce one per featured tutor.
 */
export const PERFECT_TUTOR_COPY: AdCopyDeck = {
  eyebrow: 'The fair tutoring platform',
  headline: [
    { text: 'Your perfect' },
    { text: 'tutor', accentTail: 'is here.' },
  ],
  subhead: 'Real people. Real lessons. Real results.',
  // Built at render time: the tutor-count and payment-protection lines are
  // claims, so they appear only once verified.
  bullets: [],
  cta: { label: 'Find your tutor', href: '/tutors' },
  footnote: 'Book in minutes. Start learning today.',
  disclaimer: 'Built for tutors, not investors.',
}

/**
 * The promise list, filtered to what is substantiated.
 *
 * The tutor-count headline row needs a verified figure; the payment-protection
 * row needs a verified policy. Everything else is a plain description of the
 * product, which needs no source.
 */
const buildStudentPromises = (): AdBullet[] => {
  const count = AD_PLATFORM_STATS.tutorCountShort ?? AD_PLATFORM_STATS.tutorCount

  return [
    count && {
      text: `${count} Expert Tutors`,
      subtext: claimIsTrue(POLICY_CLAIMS.tutorsAreVerified)
        ? 'Carefully verified and reviewed'
        : undefined,
      icon: 'users' as const,
    },
    {
      text: 'Any Subject, Any Goal',
      subtext: 'Languages, test prep, business, and more',
      icon: 'chat' as const,
    },
    {
      text: '1-on-1 Lessons',
      subtext: 'Personalized lessons that fit you',
      icon: 'calendar' as const,
    },
    claimIsTrue(POLICY_CLAIMS.paymentsProtected) && {
      text: 'Safe & Secure',
      subtext: 'Your payments and data are always protected',
      icon: 'shield' as const,
    },
  ].filter(Boolean) as AdBullet[]
}

const PerfectTutor = ({
  format = 'poster',
  tutors = SAMPLE_TUTORS,
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const deck = fillCopyDeck(
    mergeCopy({ ...PERFECT_TUTOR_COPY, bullets: buildStudentPromises() }, copy),
    tutors[0],
  )
  const action = cta ?? deck.cta
  const featured = tutors[0] ?? SAMPLE_TUTORS[0]

  // The avatar stack is decorative social proof rather than the subject of the
  // ad, so it tops up from the roster when a single tutor was passed in.
  const crowd = tutors.length >= 4 ? tutors : SAMPLE_TUTORS

  if (isCompactFormat(format)) {
    return (
      <AdCompact
        format={format}
        headline={deck.headline}
        cta={action}
        scale={scale}
        className={className}
        adKey={`perfect-tutor-${featured.id}`}
      />
    )
  }

  const { width, height } = AD_FORMATS[format]
  const canvasHeightEm = (height / width) * 100

  const showFooter = canvasHeightEm >= 130
  /**
   * A landscape banner cannot carry the full card and the full promise list.
   * On short canvases the card sheds its photo and bio and the copy column
   * drops to three promises, which is what keeps the leaderboard from
   * overflowing rather than a bespoke layout.
   */
  const short = canvasHeightEm < 70

  const studentCount = claim(MARKETPLACE_CLAIMS.studentCount)
  // Each band item is dropped unless the claim behind it is verified.
  const socialProofItems = [
    AD_PLATFORM_STATS.averageRating && {
      icon: 'star' as const,
      value: AD_PLATFORM_STATS.averageRating,
      detail: 'Average rating from students',
    },
    claimIsTrue(POLICY_CLAIMS.paymentsProtected) && {
      icon: 'shield' as const,
      value: 'Safe & secure',
      detail: 'Protected payments and data',
    },
    claimIsTrue(POLICY_CLAIMS.humanSupport) && {
      icon: 'support' as const,
      value: 'Real support',
      detail: 'Here to help you succeed',
    },
  ].filter(Boolean) as { icon: 'star' | 'shield' | 'support'; value: string; detail: string }[]

  // Only the taller canvases have room for the band, and only worth showing at
  // all once there is a substantiated figure to put in it — an empty proof bar
  // is worse than no proof bar.
  const showSocialBar =
    canvasHeightEm >= 118 &&
    (socialProofItems.length > 0 || Boolean(studentCount))

  const padding = 4.5
  const mediaShare = 0.53
  const { scale: contentScale, innerWidthEm } = splitMetrics(
    format,
    mediaShare,
    padding,
    { max: 1.35 },
  )

  const headlineSize = fitHeadlineSize(deck.headline, innerWidthEm, 7.4)

  return (
    <AdFrame format={format} scale={scale} className={className} adKey={`perfect-tutor-${featured.id}`}>
      <AdOrangePanel
        side="right"
        width="24%"
        top="9%"
        bottom={showSocialBar ? '26%' : '10%'}
        radius="5em"
      />

      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: `${padding}em`,
        }}
      >
        {/* Header: lockup left, reassurance pill right. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '2em',
            flex: 'none',
          }}
        >
          <AdLogo size={4} />
          {!short && (
            <AdNoticePill
              size={1.2}
              lines={[
                deck.eyebrow,
                <>
                  Built for{' '}
                  <span style={{ color: BRAND_COLORS.orange }}>tutors</span>, not
                  investors.
                </>,
              ]}
            />
          )}
        </div>

        {/* Body: promises left, live profile card right. */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '3em',
            paddingTop: short ? '1.2em' : '2.5em',
          }}
        >
          <div style={{ flex: 1, minWidth: 0, fontSize: `${contentScale}em` }}>
            <AdHeadline lines={deck.headline} size={headlineSize} />

            {!short && (
              <div style={{ marginTop: '1.3em' }}>
                <AdSubhead size={2}>
                  Real people. Real lessons.
                  <br />
                  <AdUnderlined>Real results.</AdUnderlined>
                </AdSubhead>
              </div>
            )}

            <div style={{ marginTop: short ? '1.4em' : '2.2em' }}>
              <AdFeatureRows
                bullets={short ? deck.bullets.slice(0, 3) : deck.bullets}
                size={short ? 1.4 : 1.55}
                gap={short ? 0.85 : 1.15}
                divided
                iconStyle="ring"
              />
            </div>

            <div style={{ marginTop: short ? '1.6em' : '2.4em' }}>
              <AdCta cta={action} size={short ? 2 : 2.3} shape="rounded" />
            </div>

            {!short && (
              <div style={{ marginTop: '1.2em' }}>
                <AdCtaNotes notes={[deck.footnote]} size={1.35} />
              </div>
            )}
          </div>

          <div style={{ flex: 'none', width: `${mediaShare * 100}%` }}>
            <AdTutorProfileCard
              tutor={featured}
              size={1.5}
              showPhoto={!short}
              showBio={!short}
            />
          </div>
        </div>

        {showSocialBar && (
          <div style={{ flex: 'none', marginTop: '2.5em' }}>
            <AdSocialProofBar
              tutors={crowd}
              overflowLabel={AD_PLATFORM_STATS.tutorCountShort}
              headline={
                <>
                  {studentCount ? `Join ${studentCount} students` : 'Start learning'}
                  <br />
                  {studentCount ? 'learning with ' : 'with '}
                  <span style={{ fontWeight: 800 }}>
                    <span style={{ color: BRAND_COLORS.orange }}>tutor</span>boost
                  </span>
                </>
              }
              items={socialProofItems}
            />
          </div>
        )}

        {showFooter && (
          <div style={{ flex: 'none', marginTop: '2em' }}>
            <AdFooterStrip
              tagline="Better learning. Real people. Real results."
              domain={BRAND.domain}
            />
          </div>
        )}
      </div>
    </AdFrame>
  )
}

export default PerfectTutor
