/**
 * The claims register: every factual statement the ad library is allowed to
 * make, in one auditable place.
 *
 * The rule this file exists to enforce: **a creative never invents a number.**
 * Anything not verified here is `null`, and the templates omit that element
 * rather than substituting a plausible-looking placeholder. That means an ad
 * exported before the real figures are filled in comes out missing a stat
 * block — which is obvious and safe — instead of quietly shipping an invented
 * one, which is neither.
 *
 * To publish a claim: set its `value`, record where the figure came from in
 * `source`, and stamp `asOf`. `unverifiedClaims()` lists whatever is still
 * outstanding, and the /ads gallery renders that list as a pre-publish
 * checklist.
 */

export interface VerifiedClaim<T = string> {
  value: T
  /** Where the figure comes from, specifically enough to re-check it. */
  source: string
  /** ISO date the figure was last confirmed. */
  asOf: string
}

/** `null` means "not verified yet" — creatives leave it out. */
export type MaybeClaim<T = string> = VerifiedClaim<T> | null

/**
 * Marketplace scale and quality figures.
 *
 * These were placeholders invented for the design comps (100,000+ tutors,
 * 90+ languages, a 4.8/5 average). None of them are substantiated, so all of
 * them are null until someone fills in a real number and its source.
 */
export const MARKETPLACE_CLAIMS: {
  tutorCount: MaybeClaim
  tutorCountShort: MaybeClaim
  languageCount: MaybeClaim
  averageRating: MaybeClaim
  ratingScale: MaybeClaim
  studentCount: MaybeClaim
  lessonsDelivered: MaybeClaim
} = {
  tutorCount: null,
  tutorCountShort: null,
  languageCount: null,
  averageRating: null,
  ratingScale: null,
  studentCount: null,
  lessonsDelivered: null,
}

/**
 * Statements about how TutorBoost itself operates.
 *
 * Unlike the figures above these are policy, not measurement — they are true
 * if and only if the business actually works this way. They are seeded from
 * the brand's own artwork; confirm each one and correct anything that has
 * changed, because these are the claims a customer would hold us to.
 */
export const POLICY_CLAIMS: {
  commissionRate: MaybeClaim
  commissionNeverIncreases: MaybeClaim<boolean>
  everyLessonPaid: MaybeClaim<boolean>
  noUnpaidTrials: MaybeClaim<boolean>
  tutorsAreVerified: MaybeClaim<boolean>
  paymentsProtected: MaybeClaim<boolean>
  humanSupport: MaybeClaim<boolean>
} = {
  commissionRate: {
    value: '15%',
    source: 'Brand artwork supplied by the founder; confirm against pricing page.',
    asOf: '2026-08-03',
  },
  commissionNeverIncreases: {
    value: true,
    source:
      'Brand artwork ("15% commission forever"); confirm this is contractual.',
    asOf: '2026-08-03',
  },
  everyLessonPaid: {
    value: true,
    source: 'Brand artwork ("Every lesson is paid"); confirm against tutor terms.',
    asOf: '2026-08-03',
  },
  noUnpaidTrials: {
    value: true,
    source: 'Brand artwork ("No unpaid trials"); confirm against tutor terms.',
    asOf: '2026-08-03',
  },
  // Only true once there is an actual vetting process to point at.
  tutorsAreVerified: null,
  paymentsProtected: null,
  humanSupport: null,
}

/**
 * Claims about other platforms.
 *
 * Comparative advertising is the easiest way to end up in trouble, so nothing
 * here is seeded. A competitor figure needs a dated, checkable source — a
 * screenshot of their published pricing page, not an impression. While these
 * are null the comparison creatives drop the competitor column entirely and
 * present TutorBoost's terms on their own.
 */
export interface CommissionRange {
  min: number
  max: number
}

export const COMPETITOR_CLAIMS: {
  /** Percentages, e.g. { min: 18, max: 33 }. Needs a dated, checkable source. */
  commissionRange: MaybeClaim<CommissionRange>
  holdsLessonPayments: MaybeClaim<boolean>
  usesUnpaidTrials: MaybeClaim<boolean>
} = {
  commissionRange: null,
  holdsLessonPayments: null,
  usesUnpaidTrials: null,
}

/**
 * The worked earnings example.
 *
 * Not a claim about typical earnings — it is arithmetic on an assumed monthly
 * booking total, and the creative says so on its face. Every figure shown is
 * derived from these inputs so the sums always agree; the previous comps had
 * hardcoded amounts that did not reconcile with the stated rates.
 */
export const EARNINGS_EXAMPLE = {
  monthlyLessonRevenue: 5000,
  currency: 'USD',
  /** Rendered on the creative. Keep it explicit about being an illustration. */
  disclaimer: 'Example based on $5,000/mo in lessons. Not an income projection.',
} as const

/** Read a claim's value, or `undefined` when it is not verified. */
export const claim = <T>(entry: MaybeClaim<T>): T | undefined => entry?.value

/** True when a boolean policy claim is verified and affirmative. */
export const claimIsTrue = (entry: MaybeClaim<boolean>): boolean =>
  entry?.value === true

export interface UnverifiedClaim {
  group: string
  key: string
  /** What the ads lose while this stays unverified. */
  impact: string
}

const IMPACTS: Record<string, string> = {
  tutorCount: 'Tutor-count stats are omitted from student creatives.',
  tutorCountShort: 'The short tutor count is omitted from tight rows.',
  languageCount: 'The language-coverage line is omitted.',
  averageRating: 'Rating cards and the star row are omitted.',
  ratingScale: 'Rating cards are omitted.',
  studentCount: 'The "join N students" social bar headline falls back to a generic line.',
  lessonsDelivered: 'Lessons-delivered stats are omitted.',
  commissionRate: 'Commission figures and the earnings example are omitted.',
  commissionNeverIncreases: 'The word "forever" is dropped from commission copy.',
  everyLessonPaid: 'The "every lesson is paid" promise is omitted.',
  noUnpaidTrials: 'The "no unpaid trials" promise is omitted.',
  tutorsAreVerified: 'Tutors are described as "experienced" rather than "verified".',
  paymentsProtected: 'The payment-protection promise is omitted.',
  humanSupport: 'The support promise is omitted.',
  commissionRange: 'The competitor column is dropped from comparison creatives.',
  holdsLessonPayments: 'That comparison row is dropped.',
  usesUnpaidTrials: 'That comparison row is dropped.',
}

/**
 * Everything still unverified, for the pre-publish checklist.
 * An empty list means every claim in the library is backed by a source.
 */
export const unverifiedClaims = (): UnverifiedClaim[] => {
  const groups: [string, Record<string, MaybeClaim<unknown>>][] = [
    ['Marketplace', MARKETPLACE_CLAIMS],
    ['Policy', POLICY_CLAIMS],
    ['Competitor', COMPETITOR_CLAIMS],
  ]

  return groups.flatMap(([group, entries]) =>
    Object.entries(entries)
      .filter(([, entry]) => entry === null)
      .map(([key]) => ({
        group,
        key,
        impact: IMPACTS[key] ?? 'Related copy is omitted.',
      })),
  )
}
