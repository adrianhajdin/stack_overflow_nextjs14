import React from 'react'
import type { AdTutor } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'
import AdIcon from './AdIcon'
import { AdCard } from './AdCards'

/**
 * Tutor-aware building blocks. These are the pieces that make the ad library
 * data-driven: hand them a row from the tutor collection and they render.
 *
 * Every field beyond `id` and `name` is optional, so a partially-filled tutor
 * record still produces a clean creative (missing photo → initials, missing
 * rating → the rating line is simply omitted).
 */

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

/** Stable per-tutor tint so initials avatars don't all look identical. */
const tintOf = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 360
  }
  const hue = 18 + (hash % 26) // keep it inside the brand's orange range
  return `linear-gradient(140deg, hsl(${hue} 100% 58%), hsl(${hue + 12} 96% 46%))`
}

interface AdTutorAvatarProps {
  tutor: AdTutor
  /** Any CSS length; `em` keeps it proportional to the format. */
  size?: string
  shape?: 'circle' | 'rounded'
  ring?: string
}

export const AdTutorAvatar = ({
  tutor,
  size = '6em',
  shape = 'circle',
  ring,
}: AdTutorAvatarProps) => {
  const radius = shape === 'circle' ? '999em' : '1.1em'

  return (
    <span
      style={{
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: radius,
        overflow: 'hidden',
        background: tutor.avatarUrl ? BRAND_COLORS.orangeSoft : tintOf(tutor.id),
        boxShadow: ring ? `0 0 0 0.22em ${ring}` : undefined,
      }}
    >
      {tutor.avatarUrl ? (
        // Plain <img>: ad creatives are rendered at fixed pixel sizes and are
        // often screenshotted, so next/image's lazy loading is unwanted here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tutor.avatarUrl}
          alt={tutor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span
          style={{
            fontSize: `calc(${size} * 0.38)`,
            fontWeight: 700,
            color: BRAND_COLORS.white,
            letterSpacing: '-0.02em',
          }}
        >
          {initialsOf(tutor.name)}
        </span>
      )}
    </span>
  )
}

interface AdTutorRatingProps {
  tutor: AdTutor
  size?: number
  showFlag?: boolean
}

export const AdTutorRating = ({
  tutor,
  size = 1.3,
  showFlag = true,
}: AdTutorRatingProps) => {
  if (tutor.rating === undefined) return null

  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35em',
        fontSize: `${size}em`,
        fontWeight: 700,
        color: BRAND_COLORS.orange,
        lineHeight: 1,
      }}
    >
      {showFlag && tutor.countryFlag && (
        <span style={{ fontSize: '1.05em' }}>{tutor.countryFlag}</span>
      )}
      <AdIcon name="star" size="1em" filled />
      {tutor.rating.toFixed(1)}
    </span>
  )
}

interface AdTutorCardProps {
  tutor: AdTutor
  size?: number
  /** Adds the review count / lesson count line under the subject. */
  showMeta?: boolean
}

/** The compact tutor card used in the showcase creatives. */
export const AdTutorCard = ({
  tutor,
  size = 1.5,
  showMeta = false,
}: AdTutorCardProps) => (
  <AdCard padding={size * 0.8} radius={1.1}>
    <div
      style={{ display: 'flex', alignItems: 'center', gap: `${size * 0.85}em` }}
    >
      <AdTutorAvatar tutor={tutor} size={`${size * 4.2}em`} shape="rounded" />

      <div style={{ minWidth: `${size * 7}em` }}>
        <div
          style={{
            fontSize: `${size * 1.15}em`,
            fontWeight: 700,
            color: BRAND_COLORS.ink,
            lineHeight: 1.2,
          }}
        >
          {tutor.name}
        </div>

        {tutor.subject && (
          <div
            style={{
              fontSize: `${size * 0.92}em`,
              color: BRAND_COLORS.muted,
              lineHeight: 1.35,
              marginBottom: `${size * 0.3}em`,
            }}
          >
            {tutor.subject}
          </div>
        )}

        <AdTutorRating tutor={tutor} size={size * 0.92} />

        {showMeta && tutor.reviewCount !== undefined && (
          <div
            style={{
              fontSize: `${size * 0.82}em`,
              color: BRAND_COLORS.muted,
              marginTop: `${size * 0.25}em`,
            }}
          >
            {tutor.reviewCount} reviews
          </div>
        )}
      </div>
    </div>
  </AdCard>
)

interface AdTutorCardStackProps {
  tutors: AdTutor[]
  size?: number
  /** How many cards the layout has room for. */
  limit?: number
}

/**
 * The offset stack of tutor cards from the "More choice" creative.
 *
 * Iterates whatever tutors it is given, so pointing it at a query result is
 * all that's needed to spin up a fresh variant of the ad.
 */
export const AdTutorCardStack = ({
  tutors,
  size = 1.5,
  limit = 3,
}: AdTutorCardStackProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${size * 0.9}em`,
    }}
  >
    {tutors.slice(0, limit).map((tutor, i) => (
      <div
        key={tutor.id}
        style={{
          // Alternating indent gives the stack its scattered, organic feel.
          marginLeft: i % 2 === 1 ? `${size * 2.4}em` : 0,
          marginRight: i % 2 === 1 ? 0 : `${size * 2.4}em`,
        }}
      >
        <AdTutorCard tutor={tutor} size={size} />
      </div>
    ))}
  </div>
)

interface AdSocialProofBarProps {
  tutors: AdTutor[]
  /** Overflow bubble on the end of the avatar stack, e.g. "100K+". */
  overflowLabel?: string
  headline: React.ReactNode
  items: {
    icon: React.ComponentProps<typeof AdIcon>['name']
    value: string
    detail: string
  }[]
  size?: number
  avatarCount?: number
}

/**
 * The full-width reassurance band: an avatar stack with an overflow bubble,
 * then a row of stat + caption pairs.
 */
export const AdSocialProofBar = ({
  tutors,
  overflowLabel,
  headline,
  items,
  size = 1.2,
  avatarCount = 4,
}: AdSocialProofBarProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: `${size * 2}em`,
      padding: `${size * 1.6}em ${size * 2}em`,
      borderRadius: `${size * 1.4}em`,
      border: `0.06em solid ${BRAND_COLORS.hairline}`,
      backgroundColor: BRAND_COLORS.white,
    }}
  >
    <div style={{ flex: 'none' }}>
      <div style={{ display: 'flex', marginBottom: `${size * 0.7}em` }}>
        {tutors.slice(0, avatarCount).map((tutor, i) => (
          <span key={tutor.id} style={{ marginLeft: i === 0 ? 0 : '-0.9em' }}>
            <AdTutorAvatar
              tutor={tutor}
              size={`${size * 3.2}em`}
              ring={BRAND_COLORS.white}
            />
          </span>
        ))}

        {overflowLabel && (
          <span
            style={{
              marginLeft: '-0.9em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${size * 3.2}em`,
              height: `${size * 3.2}em`,
              borderRadius: '999em',
              backgroundColor: BRAND_COLORS.orange,
              color: BRAND_COLORS.white,
              fontSize: `${size * 0.85}em`,
              fontWeight: 700,
              boxShadow: `0 0 0 0.22em ${BRAND_COLORS.white}`,
            }}
          >
            {overflowLabel}
          </span>
        )}
      </div>

      <div
        style={{
          fontSize: `${size}em`,
          fontWeight: 600,
          color: BRAND_COLORS.ink,
          lineHeight: 1.35,
        }}
      >
        {headline}
      </div>
    </div>

    {items.map((item) => (
      <div
        key={item.value}
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          gap: `${size * 0.7}em`,
          paddingLeft: `${size * 1.6}em`,
          borderLeft: `0.06em solid ${BRAND_COLORS.hairline}`,
        }}
      >
        <AdIcon name={item.icon} size={`${size * 1.9}em`} />
        <span>
          <span
            style={{
              display: 'block',
              fontSize: `${size * 1.35}em`,
              fontWeight: 700,
              color: BRAND_COLORS.ink,
              lineHeight: 1.2,
            }}
          >
            {item.value}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: `${size * 0.9}em`,
              color: BRAND_COLORS.muted,
              lineHeight: 1.3,
            }}
          >
            {item.detail}
          </span>
        </span>
      </div>
    ))}
  </div>
)

interface AdTutorAvatarRowProps {
  tutors: AdTutor[]
  size?: string
  limit?: number
  label?: string
  sublabel?: string
}

/** Overlapping avatar row + count, e.g. "100+ tutors ready to help you". */
export const AdTutorAvatarRow = ({
  tutors,
  size = '4.2em',
  limit = 5,
  label,
  sublabel,
}: AdTutorAvatarRowProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2em' }}>
    <div style={{ display: 'flex' }}>
      {tutors.slice(0, limit).map((tutor, i) => (
        <span key={tutor.id} style={{ marginLeft: i === 0 ? 0 : '-1.1em' }}>
          <AdTutorAvatar tutor={tutor} size={size} ring={BRAND_COLORS.white} />
        </span>
      ))}
    </div>

    {(label || sublabel) && (
      <div>
        {label && (
          <div
            style={{
              fontSize: '1.45em',
              fontWeight: 700,
              color: BRAND_COLORS.ink,
              lineHeight: 1.2,
            }}
          >
            {label}
          </div>
        )}
        {sublabel && (
          <div
            style={{
              fontSize: '1.15em',
              color: BRAND_COLORS.muted,
              lineHeight: 1.3,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    )}
  </div>
)
