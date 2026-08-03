import React from 'react'
import type { AdBullet } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'
import AdIcon from './AdIcon'

/**
 * The three bullet treatments used across the ad library:
 *
 * - AdCheckList   filled orange ticks, one line each  (tutor value props)
 * - AdFeatureRows soft icon tile + title + subtitle    (student benefits)
 * - AdStatRings   outlined icon circles in a row       (hero proof strip)
 */

interface AdCheckListProps {
  bullets: AdBullet[]
  size?: number
  color?: string
  gap?: number
}

export const AdCheckList = ({
  bullets,
  size = 1.85,
  color = BRAND_COLORS.ink,
  gap = 0.95,
}: AdCheckListProps) => (
  <ul
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${gap}em`,
      margin: 0,
      padding: 0,
      listStyle: 'none',
    }}
  >
    {bullets.map((bullet) => (
      <li
        key={bullet.text}
        style={{
          display: 'flex',
          alignItems: 'center',
          // Relative to this row's own font-size, already `${size}em`.
          gap: '0.55em',
          fontSize: `${size}em`,
          fontWeight: 500,
          color,
          lineHeight: 1.25,
        }}
      >
        <span
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1.5em',
            height: '1.5em',
            borderRadius: '999em',
            backgroundColor: BRAND_COLORS.orange,
          }}
        >
          <AdIcon
            name="check"
            size="0.95em"
            color={BRAND_COLORS.white}
            strokeWidth={3.2}
          />
        </span>
        {bullet.text}
      </li>
    ))}
  </ul>
)

interface AdFeatureRowsProps {
  bullets: AdBullet[]
  size?: number
  gap?: number
  /** Draw hairline separators between rows, as on the poster. */
  divided?: boolean
  /** Soft filled square (default) or an outlined circle. */
  iconStyle?: 'tile' | 'ring'
}

export const AdFeatureRows = ({
  bullets,
  size = 1.75,
  gap = 1.3,
  divided = false,
  iconStyle = 'tile',
}: AdFeatureRowsProps) => (
  <ul
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${gap}em`,
      margin: 0,
      padding: 0,
      listStyle: 'none',
    }}
  >
    {bullets.map((bullet, i) => (
      <li
        key={bullet.text}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: `${size * 0.75}em`,
          paddingBottom: divided && i < bullets.length - 1 ? `${gap}em` : 0,
          borderBottom:
            divided && i < bullets.length - 1
              ? `0.06em solid ${BRAND_COLORS.hairline}`
              : undefined,
        }}
      >
        <span
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${size * 2.4}em`,
            height: `${size * 2.4}em`,
            borderRadius: iconStyle === 'ring' ? '999em' : `${size * 0.62}em`,
            backgroundColor:
              iconStyle === 'ring' ? 'transparent' : BRAND_COLORS.orangeSoft,
            border:
              iconStyle === 'ring'
                ? `${size * 0.11}em solid ${BRAND_COLORS.orange}`
                : undefined,
          }}
        >
          <AdIcon name={bullet.icon ?? 'check'} size={`${size * 1.25}em`} />
        </span>

        <span style={{ display: 'block' }}>
          <span
            style={{
              display: 'block',
              fontSize: `${size}em`,
              fontWeight: 700,
              color: BRAND_COLORS.ink,
              lineHeight: 1.2,
            }}
          >
            {bullet.text}
          </span>
          {bullet.subtext && (
            <span
              style={{
                display: 'block',
                fontSize: `${size * 0.86}em`,
                fontWeight: 400,
                color: BRAND_COLORS.muted,
                lineHeight: 1.3,
                marginTop: '0.2em',
              }}
            >
              {bullet.subtext}
            </span>
          )}
        </span>
      </li>
    ))}
  </ul>
)

interface AdStatRingsProps {
  bullets: AdBullet[]
  size?: number
  /** Renders "15%" style text inside the ring instead of an icon. */
  labelsInRing?: (string | undefined)[]
  divided?: boolean
}

export const AdStatRings = ({
  bullets,
  size = 1.35,
  labelsInRing = [],
  divided = true,
}: AdStatRingsProps) => (
  <div style={{ display: 'flex', alignItems: 'stretch' }}>
    {bullets.map((bullet, i) => (
      <div
        key={bullet.text}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${size * 0.85}em`,
          padding: `0 ${size * 0.55}em`,
          borderRight:
            divided && i < bullets.length - 1
              ? `0.06em solid ${BRAND_COLORS.hairline}`
              : undefined,
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Sized against the ring's own font-size (`${size * 0.92}em`),
            // so these are plain ratios rather than `size` multiples.
            width: '3.48em',
            height: '3.48em',
            borderRadius: '999em',
            border: `0.14em solid ${BRAND_COLORS.orange}`,
            color: BRAND_COLORS.orange,
            fontSize: `${size * 0.92}em`,
            fontWeight: 700,
          }}
        >
          {labelsInRing[i] ? (
            <span style={{ fontSize: '1.03em' }}>{labelsInRing[i]}</span>
          ) : (
            <AdIcon name={bullet.icon ?? 'check'} size="1.6em" />
          )}
        </span>

        <span
          style={{
            fontSize: `${size}em`,
            fontWeight: 500,
            color: BRAND_COLORS.ink,
            textAlign: 'center',
            lineHeight: 1.28,
          }}
        >
          {bullet.text}
        </span>
      </div>
    ))}
  </div>
)
