import React from 'react'
import type { AdBullet, AdCopyDeck, AdTemplateProps, AdTutor } from '@/types/ads'
import { SAMPLE_TUTORS } from '@/constants/ads'
import { BRAND_COLORS } from '@/constants/brand'
import { claimIsTrue, POLICY_CLAIMS } from '@/constants/claims'
import { fillCopyDeck, formatRate, mergeCopy } from '@/lib/ads/copy'
import { isCompactFormat, splitMetrics } from '@/lib/ads/formats'
import AdFrame from '../primitives/AdFrame'
import AdCompact from '../primitives/AdCompact'
import AdSplit from '../primitives/AdSplit'
import AdLogo from '../primitives/AdLogo'
import {
  AdEyebrow,
  AdHeadline,
  AdSubhead,
  fitHeadlineSize,
} from '../primitives/AdType'
import { AdFeatureRows } from '../primitives/AdLists'
import AdCta from '../primitives/AdCta'
import { AdHeroPhoto } from '../primitives/AdMedia'
import { AdQuoteCard } from '../primitives/AdCards'
import { AdTutorAvatar, AdTutorRating } from '../primitives/AdTutorBits'

/**
 * Single-tutor creative — one ad per tutor.
 *
 * This is the template the batch generator is really for: point it at the
 * tutor collection and every row produces its own ad, with the headline,
 * stats, testimonial and CTA link all resolved from that tutor's record.
 *
 * Copy is written with `{name}` / `{subject}` / `{rate}` tokens (see
 * lib/ads/copy.ts), so one deck covers the whole roster.
 */
export const TUTOR_SPOTLIGHT_COPY: AdCopyDeck = {
  eyebrow: 'Meet your tutor',
  headline: [{ text: 'Learn with' }, { text: '{name}.', accent: true }],
  subhead: '{headline}',
  bullets: [],
  cta: { label: 'Book a lesson' },
  footnote: 'First lesson, your goals, your pace.',
  // Filled at render time from verified policy claims.
  disclaimer: '',
}

/** Turn a tutor's numbers into the creative's proof rows. */
const statsFor = (tutor: AdTutor): AdBullet[] => {
  const bullets: AdBullet[] = []
  const rate = formatRate(tutor)

  if (tutor.rating !== undefined) {
    bullets.push({
      text: `${tutor.rating.toFixed(1)} average rating`,
      subtext: tutor.reviewCount ? `${tutor.reviewCount} student reviews` : undefined,
      icon: 'star',
    })
  }

  if (tutor.lessonCount !== undefined) {
    bullets.push({
      text: `${tutor.lessonCount.toLocaleString('en-US')} lessons taught`,
      subtext: tutor.studentCount ? `${tutor.studentCount} students` : undefined,
      icon: 'trend',
    })
  }

  if (tutor.languages?.length) {
    bullets.push({
      text: `Speaks ${tutor.languages.join(', ')}`,
      subtext: tutor.countryName,
      icon: 'globe',
    })
  }

  if (rate) {
    bullets.push({
      text: `From ${rate} / hour`,
      subtext: claimIsTrue(POLICY_CLAIMS.noUnpaidTrials)
        ? 'No unpaid trials'
        : undefined,
      icon: 'dollar',
    })
  }

  return bullets
}

const TutorSpotlight = ({
  format = 'square',
  tutors = SAMPLE_TUTORS,
  copy,
  cta,
  scale = 1,
  className,
}: AdTemplateProps) => {
  const tutor = tutors[0] ?? SAMPLE_TUTORS[0]
  const deck = fillCopyDeck(mergeCopy(TUTOR_SPOTLIGHT_COPY, copy), tutor)
  const action = cta ?? {
    label: deck.cta.label,
    href: deck.cta.href ?? tutor.profileUrl,
  }
  const bullets = deck.bullets.length ? deck.bullets : statsFor(tutor)
  // Only promises we can substantiate make it onto the creative.
  const promises = [
    claimIsTrue(POLICY_CLAIMS.everyLessonPaid) && 'Every lesson is paid.',
    claimIsTrue(POLICY_CLAIMS.paymentsProtected) && 'Payments and data protected.',
  ].filter(Boolean)
  const disclaimer = deck.disclaimer || promises.join(' ')

  if (isCompactFormat(format)) {
    // The identity block replaces the headline here — at these sizes the
    // tutor's face and name are the message.
    return (
      <AdCompact
        format={format}
        headline={[]}
        cta={action}
        scale={scale}
        className={className}
        adKey={`tutor-spotlight-${tutor.id}`}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.6em' }}>
          <AdTutorAvatar tutor={tutor} size="11em" shape="rounded" />
          <div>
            <div style={{ fontSize: '4.4em', fontWeight: 800, lineHeight: 1.1 }}>
              {tutor.name}
            </div>
            {tutor.subject && (
              <div style={{ fontSize: '2.9em', color: BRAND_COLORS.muted }}>
                {tutor.subject}
              </div>
            )}
            <div style={{ marginTop: '0.4em' }}>
              <AdTutorRating tutor={tutor} size={2.9} />
            </div>
          </div>
        </div>
      </AdCompact>
    )
  }

  const padding = 4.2
  const mediaShare = 0.42
  // Denser than the other templates (identity block, tags and stat rows), so
  // it is held to a lower ceiling than the default content scale.
  const { scale: contentScale, innerWidthEm } = splitMetrics(
    format,
    mediaShare,
    padding,
    { design: 46, max: 1.4 },
  )
  const headlineSize = fitHeadlineSize(deck.headline, innerWidthEm, 6.8)

  return (
    <AdFrame
      format={format}
      scale={scale}
      className={className}
      adKey={`tutor-spotlight-${tutor.id}`}
    >
      <AdSplit
        format={format}
        mediaShare={mediaShare}
        padding={padding}
        contentScale={contentScale}
        media={
          <AdHeroPhoto src={tutor.avatarUrl} alt={tutor.name} blob="right" blobSize={118}>
            {tutor.quote && (
              <div
                style={{ position: 'absolute', left: '-18%', bottom: '7%', width: '104%' }}
              >
                <AdQuoteCard
                  quote={tutor.quote}
                  author={tutor.quoteAuthor}
                  size={1.35}
                />
              </div>
            )}
          </AdHeroPhoto>
        }
      >
        {/* Authored for the tightest format; contentScale grows the stack. */}
        <AdLogo size={3.2} />

        <div style={{ marginTop: '1.4em' }}>
          <AdEyebrow size={1.35} variant="plain">
            {deck.eyebrow}
          </AdEyebrow>
        </div>

        {/* Tutor identity block — avatar, name, subject, rating. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2em',
            marginTop: '1.1em',
          }}
        >
          <AdTutorAvatar tutor={tutor} size="6em" shape="rounded" />
          <div>
            <div
              style={{
                fontSize: '2.5em',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {tutor.name}
            </div>
            {tutor.subject && (
              <div style={{ fontSize: '1.5em', color: BRAND_COLORS.muted }}>
                {tutor.subject}
              </div>
            )}
            <div style={{ marginTop: '0.5em' }}>
              <AdTutorRating tutor={tutor} size={1.4} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5em' }}>
          <AdHeadline lines={deck.headline} size={headlineSize} />
        </div>

        {deck.subhead && deck.subhead !== '{headline}' && (
          <div style={{ marginTop: '1.2em' }}>
            <AdSubhead size={1.9}>{deck.subhead}</AdSubhead>
          </div>
        )}

        {tutor.tags?.length ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6em',
              marginTop: '1.3em',
            }}
          >
            {tutor.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '1.35em',
                  fontWeight: 600,
                  color: BRAND_COLORS.orange,
                  backgroundColor: BRAND_COLORS.orangeSoft,
                  borderRadius: '999em',
                  padding: '0.45em 1em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div style={{ marginTop: '1.6em' }}>
          <AdFeatureRows bullets={bullets} size={1.45} gap={0.85} />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.6em',
            marginTop: '1.8em',
            flexWrap: 'wrap',
          }}
        >
          <AdCta cta={action} size={2.05} shape="rounded" />
          <span
            style={{
              fontSize: '1.25em',
              color: BRAND_COLORS.muted,
              lineHeight: 1.35,
            }}
          >
            {deck.footnote}
            {disclaimer && (
              <>
                <br />
                {disclaimer}
              </>
            )}
          </span>
        </div>
      </AdSplit>
    </AdFrame>
  )
}

export default TutorSpotlight
