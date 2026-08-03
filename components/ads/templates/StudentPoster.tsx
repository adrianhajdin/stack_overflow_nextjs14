import React from 'react'
import type { AdCopyDeck, AdTemplateProps } from '@/types/ads'
import { AD_PLATFORM_STATS, AD_SUBJECTS, SAMPLE_TUTORS } from '@/constants/ads'
import { claimIsTrue, POLICY_CLAIMS } from '@/constants/claims'
import { BRAND, BRAND_COLORS } from '@/constants/brand'
import { mergeCopy } from '@/lib/ads/copy'
import AdFrame from '../primitives/AdFrame'
import AdLogo from '../primitives/AdLogo'
import { AdEyebrow, AdHeadline, AdSubhead } from '../primitives/AdType'
import { AdFeatureRows } from '../primitives/AdLists'
import AdCta from '../primitives/AdCta'
import AdSubjectGrid from '../primitives/AdSubjectGrid'
import { AdHeroPhoto } from '../primitives/AdMedia'
import { AdQuoteCard, AdTrustBar } from '../primitives/AdCards'
import { AdTutorAvatarRow } from '../primitives/AdTutorBits'
import AdIcon from '../primitives/AdIcon'

/**
 * Student acquisition — the long-form poster.
 *
 * The most content-dense creative in the set: hero, benefits, subject strip,
 * social proof and a footer lockup. Built for the landing-page hero and print,
 * not for a feed placement.
 */
export const STUDENT_POSTER_COPY: AdCopyDeck = {
  eyebrow: BRAND.studentTagline,
  headline: [
    { text: 'Learn with' },
    { text: 'great tutors.' },
    { text: 'Reach your', accent: true },
    { text: 'goals.', accent: true },
  ],
  subhead: '1-on-1 lessons tailored to you. Any subject, any level.',
  bullets: [
    {
      // "verified" is a process claim; without a vetting process to point at
      // the row says only what we can stand behind.
      text: claimIsTrue(POLICY_CLAIMS.tutorsAreVerified)
        ? 'Experienced, verified tutors'
        : 'Experienced tutors',
      subtext: 'Learn from experts who care.',
      icon: 'users',
    },
    {
      text: 'Personalized 1-on-1 lessons',
      subtext: 'Lessons built around you.',
      icon: 'chat',
    },
    {
      text: 'Flexible scheduling',
      subtext: 'Book lessons that fit your life.',
      icon: 'calendar',
    },
    {
      text: 'Book in minutes',
      subtext: 'Lessons that fit your schedule.',
      icon: 'clock',
    },
  ],
  cta: { label: 'Find your tutor today', href: '/tutors' },
  footnote: 'Every lesson is paid.',
  disclaimer: 'Tutors are paid for every lesson they teach.',
}

const StudentPoster = ({
  format = 'poster',
  tutors = SAMPLE_TUTORS,
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const deck = mergeCopy(STUDENT_POSTER_COPY, copy)
  const action = cta ?? deck.cta
  const featured = tutors[0]

  return (
    <AdFrame format={format} scale={scale} className={className} adKey="student-poster">
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Hero: copy on the left, photo bleeding off the right edge. */}
        <div style={{ position: 'relative', flex: 'none', height: '54%' }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              left: '50%',
            }}
          >
            <AdHeroPhoto blob="right" blobSize={112} blobY={48}>
              {/* Only ever a real, permissioned review. The hardcoded fallback
                  that used to sit here was an invented quote from an invented
                  student, which is the one thing this library must not emit. */}
              {featured?.quote && (
                <div
                  style={{
                    position: 'absolute',
                    left: '-16%',
                    bottom: '2%',
                    width: '110%',
                  }}
                >
                  <AdQuoteCard
                    quote={featured.quote}
                    author={featured.quoteAuthor}
                    rating={featured.rating}
                    size={1.4}
                  />
                </div>
              )}
            </AdHeroPhoto>
          </div>

          <div
            style={{
              position: 'relative',
              width: '49%',
              padding: '4.5em 0 0 4.5em',
            }}
          >
            <AdLogo size={4.2} />

            <div style={{ marginTop: '2.2em' }}>
              <AdEyebrow size={1.55}>{deck.eyebrow}</AdEyebrow>
            </div>

            <div style={{ marginTop: '1.8em' }}>
              <AdHeadline lines={deck.headline} size={7.6} />
            </div>

            <div style={{ marginTop: '1.6em' }}>
              <AdSubhead size={1.95}>{deck.subhead}</AdSubhead>
            </div>

            <div style={{ marginTop: '2.4em' }}>
              <AdFeatureRows bullets={deck.bullets} size={1.5} gap={1} divided />
            </div>
          </div>
        </div>

        {/* Lower third: subjects, social proof, CTA. */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            gap: '2em',
            padding: '0 4.5em 2.2em',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '2.4em',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginBottom: '0.6em',
              }}
            >
              Find the right tutor for you
            </div>
            <AdSubjectGrid subjects={AD_SUBJECTS} size={1.05} columns={6} />
          </div>

          {/* Reassurance band + live tutor avatars. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2em',
              padding: '1.8em 2.2em',
              borderRadius: '1.4em',
              border: `0.07em solid ${BRAND_COLORS.hairline}`,
              backgroundColor: BRAND_COLORS.white,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '1.2em' }}>
              <AdIcon name="shield" size="3.4em" filled />
              <span>
                <span
                  style={{ display: 'block', fontSize: '1.5em', fontWeight: 700 }}
                >
                  {deck.footnote}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '1.25em',
                    color: BRAND_COLORS.muted,
                    lineHeight: 1.3,
                  }}
                >
                  {deck.disclaimer}
                </span>
              </span>
            </span>

            {/* The count is a claim; without it the row is avatars only. */}
            <AdTutorAvatarRow
              tutors={tutors}
              size="4em"
              limit={5}
              label={
                AD_PLATFORM_STATS.tutorCount
                  ? `${AD_PLATFORM_STATS.tutorCount} tutors`
                  : undefined
              }
              sublabel={
                AD_PLATFORM_STATS.tutorCount ? 'ready to help you' : undefined
              }
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2em',
            }}
          >
            <AdCta cta={action} size={2.4} shape="rounded" />

            <AdTrustBar
              size={1.05}
              align="left"
              items={[
                { icon: 'user', text: '1-on-1 lessons' },
                { icon: 'calendar', text: 'Book in minutes' },
                { icon: 'user', text: '1-on-1 with a real tutor' },
              ]}
            />
          </div>
        </div>

        {/* Footer lockup. */}
        <div
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '2.2em',
            padding: '1.6em 4.5em',
            backgroundColor: BRAND_COLORS.orangeSoft,
          }}
        >
          <AdLogo size={2.6} />

          <span
            style={{
              height: '2.6em',
              width: '0.07em',
              backgroundColor: BRAND_COLORS.orangeTint,
            }}
          />

          <span
            style={{
              fontSize: '1.2em',
              color: BRAND_COLORS.inkSoft,
              lineHeight: 1.35,
            }}
          >
            {BRAND.tagline}
            <br />
            Better for students. Better for tutors.
          </span>

          <span style={{ marginLeft: 'auto' }}>
            <AdTrustBar
              size={1.15}
              align="left"
              items={[
                { icon: 'check', text: 'Choose your own tutor' },
                { icon: 'check', text: 'Transparent pricing' },
                { icon: 'check', text: 'Lessons built around you' },
              ]}
            />
          </span>
        </div>
      </div>
    </AdFrame>
  )
}

export default StudentPoster
