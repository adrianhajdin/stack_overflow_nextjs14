/**
 * Single source of truth for TutorBoost brand identity.
 *
 * Everything that renders the logo, the brand colours or the boilerplate copy
 * reads from here — the app chrome and every ad creative alike. Change the
 * wordmark or the accent colour once and it propagates across the product and
 * the whole ad library.
 */

export const BRAND = {
  name: 'TutorBoost',
  /** Lowercase two-tone wordmark: accent-coloured half + ink-coloured half. */
  wordmark: {
    accent: 'tutor',
    ink: 'boost',
  },
  tagline: 'The fair tutoring platform for tutors.',
  studentTagline: 'Better learning. Real results.',
  domain: 'tutorboost.org',
  url: 'https://tutorboost.org',
  /**
   * Plain description of what the product is, with no numeric or comparative
   * claims in it. Used for the site's meta description and social cards, both
   * of which are quoted verbatim in places we do not control.
   */
  description:
    'TutorBoost is an online tutoring platform. Book 1-on-1 lessons with a tutor, or sign up to teach.',
  /** Static rocket mark, for favicons / <img> / OG images. */
  logoUrl: '/assets/images/rocket-logo.svg',
  /** Shareable brand assets, also usable as social profile pictures. */
  assets: {
    ogImage: '/assets/brand/og-image.png',
    markTransparent: '/assets/brand/rocket-mark-512.png',
    markOnOrange: '/assets/brand/rocket-mark-orange-512.png',
  },
} as const

/**
 * Raw hex values. Ad creatives are rendered at fixed pixel sizes and are often
 * screenshotted outside the app's theme context, so they use these literals
 * instead of the Tailwind theme tokens.
 */
export const BRAND_COLORS = {
  orange: '#FF7000',
  orangeDeep: '#E85D00',
  orangeSoft: '#FFF1E6',
  orangeTint: '#FFE7D3',
  ink: '#101012',
  inkSoft: '#3F444D',
  muted: '#6B7280',
  hairline: '#EFE3D8',
  paper: '#FFFCF9',
  white: '#FFFFFF',
} as const

/**
 * Proof points live in `constants/claims.ts`, not here — each one needs a
 * source and a verification date before an ad may state it. Use
 * `buildTutorPromises()` from `constants/ads.ts` to get the substantiated set.
 */
