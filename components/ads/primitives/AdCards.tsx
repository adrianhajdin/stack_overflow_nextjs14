import React from 'react'
import { BRAND_COLORS } from '@/constants/brand'
import { buildEarningsExample, type EarningsExample } from '@/constants/ads'
import RocketMark from '@/components/brand/RocketMark'
import AdIcon from './AdIcon'
import { AdKicker } from './AdType'

/** Floating white card used for the proof panels that overlap the hero photo. */
export const AdCard = ({
  children,
  padding = 2,
  radius = 1.6,
  background = BRAND_COLORS.white,
  shadow = true,
  style,
}: {
  children: React.ReactNode
  padding?: number
  radius?: number
  background?: string
  shadow?: boolean
  style?: React.CSSProperties
}) => (
  <div
    style={{
      backgroundColor: background,
      borderRadius: `${radius}em`,
      padding: `${padding}em`,
      boxShadow: shadow ? '0 1.4em 3.4em rgba(16, 16, 18, 0.14)' : undefined,
      ...style,
    }}
  >
    {children}
  </div>
)

interface AdEarningsCompareProps {
  data?: EarningsExample | null
  size?: number
  /** Show "/mo" after the amounts. */
  showPeriod?: boolean
  /**
   * The handwritten aside. It is a comparative claim, so it only renders when
   * a sourced competitor figure is actually on the panel beside it.
   */
  showKicker?: boolean
  kicker?: string
  /** The kicker usually sits on the orange disc, so it needs to go white. */
  kickerColor?: string
}

/**
 * The "Keep more of what you earn" panel.
 *
 * Renders nothing when the commission rate is unverified, and drops the
 * competitor row unless a sourced commission range exists — so the panel can
 * appear as a single honest statement of TutorBoost's own terms. Every amount
 * is computed from the stated inputs, and the example disclaimer is part of
 * the panel rather than optional decoration.
 */
export const AdEarningsCompare = ({
  data,
  size = 1.5,
  showPeriod = true,
  showKicker = true,
  kicker = 'Same work. More money.',
  kickerColor = BRAND_COLORS.white,
}: AdEarningsCompareProps) => {
  const example = data ?? buildEarningsExample()
  if (!example) return null

  const Row = ({
    label,
    detail,
    keepLabel,
    amount,
    period,
    highlight,
  }: {
    label: string
    detail: string
    keepLabel: string
    amount: string
    period: string
    highlight?: boolean
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: `${size}em`,
        padding: `${size * 0.85}em ${size * 1.15}em`,
        backgroundColor: highlight ? BRAND_COLORS.orangeSoft : 'transparent',
      }}
    >
      <span>
        <span
          style={{
            display: 'block',
            fontSize: `${size}em`,
            fontWeight: 600,
            color: highlight ? BRAND_COLORS.orange : BRAND_COLORS.ink,
            lineHeight: 1.25,
          }}
        >
          {label}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: `${size * 0.88}em`,
            color: BRAND_COLORS.muted,
            lineHeight: 1.3,
          }}
        >
          {detail}
        </span>
      </span>

      <span style={{ textAlign: 'right' }}>
        <span
          style={{
            display: 'block',
            fontSize: `${size * 0.88}em`,
            color: highlight ? BRAND_COLORS.orange : BRAND_COLORS.muted,
            lineHeight: 1.3,
          }}
        >
          {keepLabel}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: `${size * 1.85}em`,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: highlight ? BRAND_COLORS.orange : BRAND_COLORS.ink,
            lineHeight: 1.1,
          }}
        >
          {amount}
          {showPeriod && (
            <span style={{ fontSize: '0.5em', fontWeight: 600 }}>{period}</span>
          )}
        </span>
      </span>
    </div>
  )

  return (
    <div>
      <AdCard padding={0} radius={1.2}>
        <div
          style={{
            // Relative to this element's own font-size, already `${size}em`.
            padding: '0.95em 1.15em 0.7em',
            fontSize: `${size}em`,
            fontWeight: 700,
            color: BRAND_COLORS.orange,
            borderBottom: `0.05em solid ${BRAND_COLORS.hairline}`,
          }}
        >
          {example.title}
        </div>

        {example.competitor && (
          <Row
            label={example.competitor.label}
            detail={example.competitor.detail}
            keepLabel={example.competitor.keepLabel}
            amount={example.competitor.amount}
            period={example.competitor.period}
          />
        )}
        <Row
          highlight
          label={example.tutorboost.label}
          detail={example.tutorboost.detail}
          keepLabel={example.tutorboost.keepLabel}
          amount={example.tutorboost.amount}
          period={example.tutorboost.period}
        />

        <div
          style={{
            padding: `${size * 0.6}em ${size * 1.15}em ${size * 0.75}em`,
            fontSize: `${size * 0.78}em`,
            color: BRAND_COLORS.muted,
            lineHeight: 1.35,
          }}
        >
          {example.disclaimer}
        </div>
      </AdCard>

      {showKicker && example.competitor && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4em',
            marginTop: `${size * 0.6}em`,
          }}
        >
          <AdKicker size={size * 1.05} color={kickerColor}>
            {kicker}
          </AdKicker>
          <svg
            width={`${size * 1.6}em`}
            height={`${size * 1.6}em`}
            viewBox="0 0 24 24"
            fill="none"
            stroke={kickerColor}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 20c6.5-1.5 10-6 11-14" />
            <path d="M13 5h4.6v4.6" />
          </svg>
        </div>
      )}
    </div>
  )
}

interface AdRatingCardProps {
  title: string
  /** Omit when unverified — the star row is dropped rather than assumed. */
  rating?: number
  ratingLabel?: string
  size?: number
}

/**
 * The social-proof panel.
 *
 * The star row previously defaulted to five filled stars, which asserted a
 * perfect score whether or not one existed. Stars now render only from a
 * supplied rating, and are filled to that rating rather than to full.
 */
export const AdRatingCard = ({
  title,
  rating,
  ratingLabel,
  size = 1.5,
}: AdRatingCardProps) => (
  <AdCard padding={size * 1.15} radius={1.2}>
    <div
      style={{
        fontSize: `${size}em`,
        fontWeight: 700,
        color: BRAND_COLORS.ink,
        lineHeight: 1.25,
        maxWidth: '9em',
      }}
    >
      {title}
    </div>

    {rating !== undefined && (
      <div
        style={{ display: 'flex', gap: '0.18em', margin: `${size * 0.55}em 0` }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <AdIcon
            key={i}
            name="star"
            size={`${size * 1.35}em`}
            filled
            color={
              i < Math.round(rating)
                ? BRAND_COLORS.orange
                : BRAND_COLORS.orangeTint
            }
          />
        ))}
      </div>
    )}

    {ratingLabel && (
      <div
        style={{
          fontSize: `${size * 1.35}em`,
          fontWeight: 800,
          color: BRAND_COLORS.ink,
          lineHeight: 1,
        }}
      >
        {ratingLabel}
      </div>
    )}
  </AdCard>
)

interface AdQuoteCardProps {
  quote: string
  author?: string
  /** The reviewer's actual score. Omit and no stars are shown. */
  rating?: number
  size?: number
}

/**
 * Testimonial panel.
 *
 * Only ever render this from a real, permissioned review. The stars follow the
 * reviewer's own score and are omitted when there isn't one — the previous
 * hardcoded five-star row implied a rating the quote never carried.
 */
export const AdQuoteCard = ({
  quote,
  author,
  rating,
  size = 1.5,
}: AdQuoteCardProps) => (
  <AdCard padding={size * 1.5} radius={1.2}>
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: `${size}em`,
        marginBottom: `${size * 0.55}em`,
      }}
    >
      <span
        style={{
          fontSize: `${size * 2.6}em`,
          fontWeight: 800,
          color: BRAND_COLORS.orange,
          lineHeight: 0.75,
        }}
      >
        &rdquo;
      </span>
      {rating !== undefined && (
        <span style={{ display: 'flex', gap: '0.15em' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <AdIcon
              key={i}
              name="star"
              size={`${size * 1.2}em`}
              filled
              color={
                i < Math.round(rating)
                  ? BRAND_COLORS.orange
                  : BRAND_COLORS.orangeTint
              }
            />
          ))}
        </span>
      )}
    </div>

    <p
      style={{
        margin: 0,
        fontSize: `${size * 1.15}em`,
        fontWeight: 500,
        color: BRAND_COLORS.ink,
        lineHeight: 1.35,
      }}
    >
      {quote}
    </p>

    {author && (
      <p
        style={{
          margin: `${size * 0.7}em 0 0`,
          fontSize: `${size}em`,
          fontWeight: 600,
          color: BRAND_COLORS.orange,
        }}
      >
        &ndash; {author}
      </p>
    )}
  </AdCard>
)

interface AdNoticePillProps {
  lines: React.ReactNode[]
  size?: number
  icon?: React.ComponentProps<typeof AdIcon>['name']
}

/** Floating white pill with a filled icon — the corner reassurance note. */
export const AdNoticePill = ({
  lines,
  size = 1.25,
  icon = 'shield',
}: AdNoticePillProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: `${size * 0.75}em`,
      padding: `${size * 0.85}em ${size * 1.3}em`,
      borderRadius: '999em',
      backgroundColor: BRAND_COLORS.white,
      boxShadow: '0 0.8em 2.2em rgba(16, 16, 18, 0.10)',
    }}
  >
    <AdIcon name={icon} size={`${size * 2}em`} filled />
    <span
      style={{
        fontSize: `${size}em`,
        fontWeight: 500,
        color: BRAND_COLORS.ink,
        lineHeight: 1.35,
      }}
    >
      {lines.map((line, i) => (
        <span key={i} style={{ display: 'block' }}>
          {line}
        </span>
      ))}
    </span>
  </span>
)

interface AdFooterStripProps {
  tagline: string
  domain: string
  size?: number
}

/** The thin sign-off line: mark, tagline, domain. */
export const AdFooterStrip = ({
  tagline,
  domain,
  size = 1.25,
}: AdFooterStripProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `${size * 1.4}em`,
      fontSize: `${size}em`,
    }}
  >
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.7em' }}>
      <RocketMark size="1.9em" color={BRAND_COLORS.orange} />
      <span style={{ fontWeight: 600, color: BRAND_COLORS.ink }}>{tagline}</span>
    </span>

    <span
      style={{
        width: '0.06em',
        height: '1.5em',
        backgroundColor: BRAND_COLORS.hairline,
      }}
    />

    <span style={{ fontWeight: 700, color: BRAND_COLORS.orange }}>{domain}</span>
  </div>
)

interface AdTrustBarProps {
  items: { icon: React.ComponentProps<typeof AdIcon>['name']; text: string }[]
  size?: number
  align?: 'left' | 'center' | 'space-between'
}

/** The footer strip of small reassurance items. */
export const AdTrustBar = ({
  items,
  size = 1.1,
  align = 'space-between',
}: AdTrustBarProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent:
        align === 'space-between'
          ? 'space-between'
          : align === 'center'
            ? 'center'
            : 'flex-start',
      gap: `${size * 2.2}em`,
      width: '100%',
    }}
  >
    {items.map((item) => (
      <span
        key={item.text}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em',
          fontSize: `${size}em`,
          fontWeight: 500,
          color: BRAND_COLORS.inkSoft,
          whiteSpace: 'nowrap',
        }}
      >
        <AdIcon name={item.icon} size="1.45em" />
        {item.text}
      </span>
    ))}
  </div>
)
