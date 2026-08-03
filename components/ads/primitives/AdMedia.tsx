import React from 'react'
import { BRAND_COLORS } from '@/constants/brand'
import RocketMark from '@/components/brand/RocketMark'

interface AdHeroPhotoProps {
  /** Cut-out subject photo. Omit to get the branded placeholder. */
  src?: string
  alt?: string
  /** Where the orange disc sits behind the subject. */
  blob?: 'right' | 'left' | 'center' | 'none'
  /**
   * Diameter of the disc as a % of the media panel's width. Values over 100
   * are normal and intended: the disc is meant to bleed off the edge.
   */
  blobSize?: number
  /** Vertical centre of the disc, as a % down the panel. */
  blobY?: number
  objectPosition?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

/**
 * The hero photo panel: an orange disc with the subject sitting on top of it.
 *
 * Without a `src` it renders the disc plus a large rocket watermark, so a
 * creative is still presentable before art has been supplied — useful when
 * batch-generating ads for tutors who have not uploaded a photo.
 */
export const AdHeroPhoto = ({
  src,
  alt = '',
  blob = 'right',
  blobSize = 118,
  blobY = 58,
  objectPosition = 'center top',
  children,
  style,
}: AdHeroPhotoProps) => (
  // The disc and photo are clipped to the panel; `children` deliberately are
  // not, so proof cards can overlap the copy column the way the master art does.
  <div
    style={{
      position: 'relative',
      height: '100%',
      width: '100%',
      ...style,
    }}
  >
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {blob !== 'none' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: `${blobSize}%`,
            aspectRatio: '1 / 1',
            borderRadius: '999em',
            backgroundColor: BRAND_COLORS.orange,
            top: `${blobY}%`,
            transform: 'translateY(-50%)',
            left: blob === 'left' ? '-14%' : blob === 'center' ? '50%' : 'auto',
            right: blob === 'right' ? '-14%' : 'auto',
            marginLeft: blob === 'center' ? `-${blobSize / 2}%` : undefined,
          }}
        />
      )}

      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition,
          }}
        />
      ) : (
        <div
          style={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <RocketMark size="34%" color="rgba(255,255,255,0.35)" />
        </div>
      )}
    </div>

    {children}
  </div>
)

/**
 * The rounded orange slab that bleeds off an edge behind a card.
 *
 * Distinct from the disc: this is the shape the profile-card creative sits on,
 * squared off against the ad's edge with only the inner corners rounded.
 */
export const AdOrangePanel = ({
  side = 'right',
  width = '26%',
  top = '10%',
  bottom = '18%',
  radius = '4em',
  style,
}: {
  side?: 'right' | 'left'
  width?: string
  top?: string
  bottom?: string
  radius?: string
  style?: React.CSSProperties
}) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      top,
      bottom,
      width,
      [side]: 0,
      backgroundColor: BRAND_COLORS.orange,
      borderTopLeftRadius: side === 'right' ? radius : 0,
      borderBottomLeftRadius: side === 'right' ? radius : 0,
      borderTopRightRadius: side === 'left' ? radius : 0,
      borderBottomRightRadius: side === 'left' ? radius : 0,
      ...style,
    }}
  />
)

/** A bare orange disc, for compositions that place their own content on top. */
export const AdOrangeDisc = ({
  size = '70%',
  style,
}: {
  size?: string
  style?: React.CSSProperties
}) => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      width: size,
      aspectRatio: '1 / 1',
      borderRadius: '999em',
      backgroundColor: BRAND_COLORS.orange,
      ...style,
    }}
  />
)

interface AdBadgeProps {
  lines: string[]
  size?: number
  style?: React.CSSProperties
}

/** The round orange sticker ("Built for tutors, not investors."). */
export const AdRoundBadge = ({ lines, size = 1.35, style }: AdBadgeProps) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // Relative to the badge's own font-size, already `${size}em`.
      width: '8em',
      height: '8em',
      borderRadius: '999em',
      backgroundColor: BRAND_COLORS.orange,
      color: BRAND_COLORS.white,
      fontSize: `${size}em`,
      fontWeight: 700,
      lineHeight: 1.22,
      textAlign: 'center',
      padding: '0.6em',
      boxShadow: '0 1em 2.4em rgba(255, 112, 0, 0.35)',
      ...style,
    }}
  >
    {lines.map((line) => (
      <span key={line}>{line}</span>
    ))}
  </div>
)

/** The curved hand-drawn arrow that points at the badge / CTA. */
export const AdCurvedArrow = ({
  size = '6em',
  color = BRAND_COLORS.white,
  flip = false,
  style,
}: {
  size?: string
  color?: string
  flip?: boolean
  style?: React.CSSProperties
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ transform: flip ? 'scaleX(-1)' : undefined, ...style }}
  >
    <path d="M6 34c10 6 22 4 30-6" />
    <path d="M30 30.5 36.5 28l1.5 6.8" />
  </svg>
)
