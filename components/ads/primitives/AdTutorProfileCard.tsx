import React from 'react'
import type { AdCtaSpec, AdTutor } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'
import AdIcon from './AdIcon'
import AdCta from './AdCta'
import { AdTutorAvatar } from './AdTutorBits'

/**
 * A tutor's profile rendered as a marketing card.
 *
 * The most data-hungry primitive in the library, and the most literal: it is
 * the product's own profile UI, dressed for an ad. Every section is driven by
 * the tutor record and disappears when its field is absent, so the card holds
 * together for a fully-populated tutor and a bare one alike.
 *
 * Sets its own `font-size` and sizes everything inside in plain `em`, so a
 * caller scales the whole card with the single `size` prop.
 */

interface AdTutorProfileCardProps {
  tutor: AdTutor
  /** Card scale, in the creative's `em` units. */
  size?: number
  cta?: AdCtaSpec
  /** Drop the photo panel where the layout is too short to carry it. */
  showPhoto?: boolean
  showBio?: boolean
  showSpecialties?: boolean
  showBooking?: boolean
}

/** Small pill over the photo, e.g. the "Super Tutor" badge. */
const PhotoChip = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4em',
      padding: '0.5em 0.85em',
      borderRadius: '999em',
      backgroundColor: BRAND_COLORS.white,
      fontSize: '0.95em',
      fontWeight: 700,
      color: BRAND_COLORS.ink,
      boxShadow: '0 0.4em 1.2em rgba(16,16,18,0.16)',
      lineHeight: 1,
    }}
  >
    {children}
  </span>
)

const StatChip = ({
  icon,
  value,
  detail,
}: {
  icon: React.ComponentProps<typeof AdIcon>['name']
  value: string
  detail: string
}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.55em',
      padding: '0.7em 0.75em',
      borderRadius: '0.7em',
      backgroundColor: BRAND_COLORS.orangeSoft,
    }}
  >
    <AdIcon name={icon} size="1.5em" />
    <span style={{ minWidth: 0 }}>
      <span
        style={{
          display: 'block',
          fontSize: '0.95em',
          fontWeight: 700,
          color: BRAND_COLORS.ink,
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
      <span
        style={{
          display: 'block',
          fontSize: '0.85em',
          color: BRAND_COLORS.inkSoft,
          lineHeight: 1.25,
        }}
      >
        {detail}
      </span>
    </span>
  </div>
)

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: '1.15em',
      fontWeight: 700,
      color: BRAND_COLORS.ink,
      marginBottom: '0.4em',
    }}
  >
    {children}
  </div>
)

const AdTutorProfileCard = ({
  tutor,
  size = 1.5,
  cta,
  showPhoto = true,
  showBio = true,
  showSpecialties = true,
  showBooking = true,
}: AdTutorProfileCardProps) => {
  const bookAction: AdCtaSpec = cta ?? {
    label: 'Book a lesson',
    href: tutor.profileUrl,
  }

  const stats = [
    tutor.yearsExperience !== undefined && {
      icon: 'graduation' as const,
      value: `${tutor.yearsExperience}+ years`,
      detail: 'experience',
    },
    tutor.lessonCount !== undefined && {
      icon: 'users' as const,
      value: `${tutor.lessonCount.toLocaleString('en-US')}+`,
      detail: 'lessons taught',
    },
    tutor.languages?.length && {
      icon: 'globe' as const,
      value: 'Speaks',
      detail: tutor.languages.join(', '),
    },
  ].filter(Boolean) as {
    icon: React.ComponentProps<typeof AdIcon>['name']
    value: string
    detail: string
  }[]

  return (
    <div
      style={{
        fontSize: `${size}em`,
        borderRadius: '1.5em',
        backgroundColor: BRAND_COLORS.white,
        boxShadow: '0 2em 4.5em rgba(16, 16, 18, 0.18)',
        overflow: 'hidden',
        lineHeight: 1.3,
      }}
    >
      {showPhoto && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 0.82',
            backgroundColor: BRAND_COLORS.orangeSoft,
            overflow: 'hidden',
          }}
        >
          {tutor.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={tutor.avatarUrl}
              alt={tutor.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AdTutorAvatar tutor={tutor} size="7em" shape="circle" />
            </div>
          )}

          {tutor.superTutor && (
            <span style={{ position: 'absolute', top: '1em', left: '1em' }}>
              <PhotoChip>
                <AdIcon name="star" size="1.1em" filled color="#E8318A" />
                Super Tutor
              </PhotoChip>
            </span>
          )}

          <span
            style={{
              position: 'absolute',
              top: '1em',
              right: '1em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.6em',
              height: '2.6em',
              borderRadius: '999em',
              backgroundColor: BRAND_COLORS.white,
              boxShadow: '0 0.4em 1.2em rgba(16,16,18,0.16)',
            }}
          >
            <AdIcon name="heart" size="1.4em" color={BRAND_COLORS.ink} />
          </span>

          {tutor.introVideoUrl && (
            <span
              style={{
                position: 'absolute',
                bottom: '1em',
                left: '1em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6em',
                padding: '0.4em 1em 0.4em 0.4em',
                borderRadius: '999em',
                backgroundColor: 'rgba(16, 16, 18, 0.62)',
                color: BRAND_COLORS.white,
                fontSize: '0.95em',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.2em',
                  height: '2.2em',
                  borderRadius: '999em',
                  backgroundColor: BRAND_COLORS.white,
                }}
              >
                <AdIcon
                  name="play"
                  size="1.3em"
                  filled
                  color={BRAND_COLORS.orange}
                />
              </span>
              Watch intro
            </span>
          )}
        </div>
      )}

      <div style={{ padding: '1.3em 1.4em' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1em',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4em',
                fontSize: '2.1em',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
              }}
            >
              {tutor.name}
              {tutor.verified && (
                <AdIcon name="verified" size="0.85em" filled />
              )}
            </div>

            {tutor.subject && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4em',
                  fontSize: '1.2em',
                  color: BRAND_COLORS.muted,
                  marginTop: '0.15em',
                }}
              >
                {tutor.subject}
                {tutor.countryFlag && <span>{tutor.countryFlag}</span>}
              </div>
            )}
          </div>

          {tutor.rating !== undefined && (
            <div style={{ flex: 'none', textAlign: 'right' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.3em',
                }}
              >
                <AdIcon name="star" size="1.9em" filled />
                <span
                  style={{
                    fontSize: '2.1em',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                >
                  {tutor.rating.toFixed(1)}
                </span>
              </div>
              {tutor.reviewCount !== undefined && (
                <div
                  style={{
                    fontSize: '1em',
                    color: BRAND_COLORS.muted,
                    marginTop: '0.25em',
                  }}
                >
                  ({tutor.reviewCount} reviews)
                </div>
              )}
            </div>
          )}
        </div>

        {stats.length > 0 && (
          <div style={{ display: 'flex', gap: '0.6em', marginTop: '1em' }}>
            {stats.map((stat) => (
              <StatChip key={stat.value + stat.detail} {...stat} />
            ))}
          </div>
        )}

        {showBio && tutor.bio && (
          <div style={{ marginTop: '1.1em' }}>
            <SectionTitle>About me</SectionTitle>
            <p
              style={{
                margin: 0,
                fontSize: '1.05em',
                color: BRAND_COLORS.inkSoft,
                lineHeight: 1.45,
              }}
            >
              {tutor.bio}
            </p>
          </div>
        )}

        {showSpecialties && tutor.tags?.length ? (
          <div style={{ marginTop: '1.1em' }}>
            <SectionTitle>Specialties</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
              {tutor.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '1em',
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
          </div>
        ) : null}
      </div>

      {showBooking && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1em',
            padding: '1.1em 1.4em',
            backgroundColor: BRAND_COLORS.orangeSoft,
          }}
        >
          {tutor.nextAvailability ? (
            <span
              style={{ display: 'flex', alignItems: 'center', gap: '0.7em' }}
            >
              <AdIcon name="calendar" size="1.9em" />
              <span style={{ fontSize: '1.05em', lineHeight: 1.3 }}>
                <span style={{ display: 'block', color: BRAND_COLORS.inkSoft }}>
                  Next availability
                </span>
                <span style={{ display: 'block', fontWeight: 700 }}>
                  {tutor.nextAvailability}
                </span>
              </span>
            </span>
          ) : (
            <span />
          )}

          <AdCta cta={bookAction} size={1.3} shape="rounded" />
        </div>
      )}
    </div>
  )
}

export default AdTutorProfileCard
