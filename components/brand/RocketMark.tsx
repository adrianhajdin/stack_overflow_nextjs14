import React from 'react'

interface RocketMarkProps {
  /**
   * Size of the square mark. A number is pixels; a string is passed straight
   * through, so ad creatives can pass an `em` value and scale with the format.
   */
  size?: number | string
  /** Any valid CSS colour. Defaults to the brand orange. */
  color?: string
  className?: string
  title?: string
}

/**
 * The TutorBoost rocket mark, inlined as SVG.
 *
 * Inlined rather than loaded from /public so it can inherit `currentColor`,
 * be recoloured per-surface, and render reliably inside ad creatives that get
 * screenshotted to PNG/JPG (no extra network request to race against).
 *
 * The static twin lives at /assets/images/rocket-logo.svg for favicons and
 * anywhere an <img src> is required. Keep the two in sync.
 */
const RocketMark = ({
  size = 24,
  color = 'currentColor',
  className,
  title = 'TutorBoost',
}: RocketMarkProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={title}
  >
    <g transform="rotate(45 32 32)" fill={color}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 7C39.2 14.1 43.2 24 43.2 33.4V42.6H20.8V33.4C20.8 24 24.8 14.1 32 7ZM32 30.4C34.98 30.4 37.4 27.98 37.4 25C37.4 22.02 34.98 19.6 32 19.6C29.02 19.6 26.6 22.02 26.6 25C26.6 27.98 29.02 30.4 32 30.4Z"
      />
      <path d="M20.8 30.6L12.4 44.4C11.6 45.7 12.6 47.3 14.1 46.9L20.8 45.1V30.6Z" />
      <path d="M43.2 30.6L51.6 44.4C52.4 45.7 51.4 47.3 49.9 46.9L43.2 45.1V30.6Z" />
      <path d="M25.6 44.6H38.4C38.4 49.2 35.8 53.4 32 56C28.2 53.4 25.6 49.2 25.6 44.6Z" />
      <rect x="30.5" y="58" width="3" height="7" rx="1.5" />
      <rect x="21.5" y="54.5" width="3" height="6" rx="1.5" />
      <rect x="39.5" y="54.5" width="3" height="6" rx="1.5" />
    </g>
  </svg>
)

export default RocketMark
