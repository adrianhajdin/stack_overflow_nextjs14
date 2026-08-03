import type { AdIconName, AdTutor } from '@/types/ads'
import {
  claim,
  claimIsTrue,
  COMPETITOR_CLAIMS,
  EARNINGS_EXAMPLE,
  MARKETPLACE_CLAIMS,
  POLICY_CLAIMS,
} from './claims'

/**
 * Ad content derived from the claims register.
 *
 * Nothing in this file hardcodes a statistic. Every figure is read from
 * `constants/claims.ts`, and anything unverified comes back `undefined` so the
 * creative can drop that element. See the header of that file for why.
 */

/**
 * Preview fixtures for the ad gallery.
 *
 * NOT PUBLISHABLE. These are invented people. They exist so the layouts can be
 * judged before real data is wired up, and every one carries `isSample: true`,
 * which the gallery and the render route surface as a warning.
 *
 * Two deliberate omissions: there are no testimonial quotes and no bios worth
 * lifting. A fabricated review attributed to a named student is the single
 * most dangerous thing this repo could ship, so the placeholders are written
 * to be unusable as copy rather than merely fake.
 */
export const SAMPLE_TUTORS: AdTutor[] = [
  {
    id: 'sample-anna',
    isSample: true,
    name: 'Anna',
    subject: 'English Tutor',
    headline: 'Speak English with confidence.',
    countryFlag: '🇺🇸',
    countryName: 'United States',
    verified: true,
    superTutor: true,
    yearsExperience: 6,
    rating: 4.9,
    reviewCount: 412,
    lessonCount: 3200,
    studentCount: 280,
    languages: ['English', 'Spanish'],
    hourlyRate: 28,
    currency: 'USD',
    bio: '[SAMPLE — replace with the tutor’s own profile text. This placeholder runs to about three lines at this card size so the layout can be judged.]',
    nextAvailability: 'Today at 6:00 PM',
    introVideoUrl: '/tutors/anna/intro',
    tags: ['Conversation', 'IELTS', 'Business'],
    profileUrl: '/tutors/anna',
  },
  {
    id: 'sample-carlos',
    isSample: true,
    name: 'Carlos',
    subject: 'Spanish Tutor',
    headline: 'Real Spanish, from day one.',
    countryFlag: '🇪🇸',
    countryName: 'Spain',
    verified: true,
    superTutor: true,
    yearsExperience: 5,
    rating: 4.9,
    reviewCount: 356,
    lessonCount: 2750,
    studentCount: 210,
    languages: ['Spanish', 'English'],
    hourlyRate: 24,
    currency: 'USD',
    bio: '[SAMPLE — replace with the tutor’s own profile text. This placeholder runs to about three lines at this card size so the layout can be judged.]',
    nextAvailability: 'Tomorrow at 9:00 AM',
    introVideoUrl: '/tutors/carlos/intro',
    tags: ['Conversation', 'DELE', 'Beginners'],
    profileUrl: '/tutors/carlos',
  },
  {
    id: 'sample-mei',
    isSample: true,
    name: 'Mei',
    subject: 'Chinese Tutor',
    headline: 'Mandarin that sticks.',
    countryFlag: '🇨🇳',
    countryName: 'China',
    verified: true,
    yearsExperience: 4,
    rating: 4.8,
    reviewCount: 289,
    lessonCount: 2100,
    studentCount: 175,
    languages: ['Mandarin', 'English'],
    hourlyRate: 22,
    currency: 'USD',
    bio: '[SAMPLE — replace with the tutor’s own profile text. This placeholder runs to about three lines at this card size so the layout can be judged.]',
    nextAvailability: 'Today at 8:30 PM',
    tags: ['HSK', 'Conversation', 'Characters'],
    profileUrl: '/tutors/mei',
  },
  {
    id: 'sample-daniel',
    isSample: true,
    name: 'Daniel',
    subject: 'Math Tutor',
    headline: 'Algebra to calculus, finally clear.',
    countryFlag: '🇬🇧',
    countryName: 'United Kingdom',
    verified: true,
    superTutor: true,
    yearsExperience: 9,
    rating: 5.0,
    reviewCount: 198,
    lessonCount: 1640,
    studentCount: 140,
    languages: ['English'],
    hourlyRate: 34,
    currency: 'USD',
    bio: '[SAMPLE — replace with the tutor’s own profile text. This placeholder runs to about three lines at this card size so the layout can be judged.]',
    nextAvailability: 'Tomorrow at 4:00 PM',
    tags: ['Algebra', 'Calculus', 'SAT'],
    profileUrl: '/tutors/daniel',
  },
  {
    id: 'sample-sofia',
    isSample: true,
    name: 'Sofia',
    subject: 'Test Prep Tutor',
    headline: 'Score higher. Stress less.',
    countryFlag: '🇧🇷',
    countryName: 'Brazil',
    verified: true,
    superTutor: true,
    yearsExperience: 7,
    rating: 4.9,
    reviewCount: 271,
    lessonCount: 1980,
    studentCount: 160,
    languages: ['Portuguese', 'English'],
    hourlyRate: 30,
    currency: 'USD',
    bio: '[SAMPLE — replace with the tutor’s own profile text. This placeholder runs to about three lines at this card size so the layout can be judged.]',
    nextAvailability: 'Today at 7:15 PM',
    introVideoUrl: '/tutors/sofia/intro',
    tags: ['IELTS', 'TOEFL', 'GMAT'],
    profileUrl: '/tutors/sofia',
  },
  {
    id: 'sample-yuki',
    isSample: true,
    name: 'Yuki',
    subject: 'Japanese Tutor',
    headline: 'Japanese, one real conversation at a time.',
    countryFlag: '🇯🇵',
    countryName: 'Japan',
    verified: true,
    yearsExperience: 5,
    rating: 4.8,
    reviewCount: 164,
    lessonCount: 1320,
    studentCount: 118,
    languages: ['Japanese', 'English'],
    hourlyRate: 26,
    currency: 'USD',
    bio: '[SAMPLE — replace with the tutor’s own profile text. This placeholder runs to about three lines at this card size so the layout can be judged.]',
    nextAvailability: 'Tomorrow at 11:00 AM',
    tags: ['JLPT', 'Conversation', 'Kanji'],
    profileUrl: '/tutors/yuki',
  },
]

/**
 * Marketplace figures, or `undefined` where unverified.
 * Creatives must treat every one of these as optional.
 */
export const AD_PLATFORM_STATS = {
  tutorCount: claim(MARKETPLACE_CLAIMS.tutorCount),
  tutorCountShort: claim(MARKETPLACE_CLAIMS.tutorCountShort),
  languageCount: claim(MARKETPLACE_CLAIMS.languageCount),
  averageRating: claim(MARKETPLACE_CLAIMS.averageRating),
  studentCount: claim(MARKETPLACE_CLAIMS.studentCount),
} as const

const money = (amount: number) =>
  `$${Math.round(amount).toLocaleString('en-US')}`

export interface EarningsExample {
  title: string
  competitor?: {
    label: string
    detail: string
    keepLabel: string
    amount: string
    period: string
  }
  tutorboost: {
    label: string
    detail: string
    keepLabel: string
    amount: string
    period: string
  }
  disclaimer: string
}

/**
 * Build the earnings panel from the verified commission rate.
 *
 * Returns null when the rate is unverified, in which case the creative drops
 * the panel. The competitor half appears only when a sourced commission range
 * exists, and is shown as a range rather than a single flattering number.
 */
export const buildEarningsExample = (): EarningsExample | null => {
  const rate = claim(POLICY_CLAIMS.commissionRate)
  if (!rate) return null

  const pct = Number.parseFloat(rate)
  if (!Number.isFinite(pct)) return null

  const gross = EARNINGS_EXAMPLE.monthlyLessonRevenue
  const range = claim(COMPETITOR_CLAIMS.commissionRange)

  return {
    title: 'Keep more of what you earn',
    competitor: range
      ? {
          label: 'Other platforms',
          detail: `${range.min}% – ${range.max}% commission`,
          keepLabel: 'You keep',
          // Their best case first, so the comparison is not stacked.
          amount: `${money(gross * (1 - range.max / 100))} – ${money(
            gross * (1 - range.min / 100),
          )}`,
          period: '/mo',
        }
      : undefined,
    tutorboost: {
      label: 'TutorBoost',
      detail: `${rate} commission`,
      keepLabel: 'You keep',
      amount: money(gross * (1 - pct / 100)),
      period: '/mo',
    },
    disclaimer: EARNINGS_EXAMPLE.disclaimer,
  }
}

export interface AdComparisonRowSpec {
  icon: AdIconName
  label: string
  /** What TutorBoost does — always a verified policy claim. */
  us: string
  /** Only present when a sourced competitor claim backs it. */
  them?: string
}

/**
 * Rows for the comparison creative.
 *
 * Only verified policy claims produce a row, and the competitor cell is filled
 * only from a sourced competitor claim. The old rows comparing who a platform
 * is "built for" and how good its support is were unverifiable disparagement
 * and have been dropped rather than gated.
 */
export const buildComparisonRows = (): AdComparisonRowSpec[] => {
  const rows: AdComparisonRowSpec[] = []

  const rate = claim(POLICY_CLAIMS.commissionRate)
  const range = claim(COMPETITOR_CLAIMS.commissionRange)
  if (rate) {
    rows.push({
      icon: 'percent',
      label: 'Commission',
      us: rate,
      them: range ? `${range.min}% – ${range.max}%` : undefined,
    })
  }

  if (claimIsTrue(POLICY_CLAIMS.noUnpaidTrials)) {
    rows.push({
      icon: 'user',
      label: 'Unpaid trials',
      us: 'Never',
      them: claimIsTrue(COMPETITOR_CLAIMS.usesUnpaidTrials) ? 'Common' : undefined,
    })
  }

  if (claimIsTrue(POLICY_CLAIMS.everyLessonPaid)) {
    rows.push({
      icon: 'dollar',
      label: 'Lesson payments',
      us: 'Paid to you',
      them: claimIsTrue(COMPETITOR_CLAIMS.holdsLessonPayments)
        ? 'Held by platform'
        : undefined,
    })
  }

  return rows
}

/** True when at least one row has a sourced competitor value. */
export const hasCompetitorData = (rows: AdComparisonRowSpec[]) =>
  rows.some((row) => row.them !== undefined)

/**
 * The tutor-side promises, filtered to those that are verified policy.
 * Used by the checklist and stat-ring creatives.
 */
export const buildTutorPromises = () => {
  const rate = claim(POLICY_CLAIMS.commissionRate)
  const forever = claimIsTrue(POLICY_CLAIMS.commissionNeverIncreases)

  return [
    rate && {
      icon: 'percent' as const,
      ring: rate,
      text: forever ? `${rate} commission forever` : `${rate} commission`,
    },
    claimIsTrue(POLICY_CLAIMS.everyLessonPaid) && {
      icon: 'dollar' as const,
      text: 'Every lesson is paid',
    },
    claimIsTrue(POLICY_CLAIMS.noUnpaidTrials) && {
      icon: 'user' as const,
      text: 'No unpaid trials',
    },
    claimIsTrue(POLICY_CLAIMS.humanSupport) && {
      icon: 'clock' as const,
      text: 'Real human support',
    },
    claimIsTrue(POLICY_CLAIMS.paymentsProtected) && {
      icon: 'shield' as const,
      text: 'Payments and data protected',
    },
  ].filter(Boolean) as { icon: AdIconName; ring?: string; text: string }[]
}

/**
 * Subjects offered on the platform.
 *
 * A product catalogue rather than a statistic, so it is edited here directly —
 * but it still has to match what students can actually book. Prune anything
 * TutorBoost does not currently offer.
 */
export const AD_SUBJECTS: { icon: AdIconName; name: string; detail: string }[] =
  [
    { icon: 'chat', name: 'English', detail: 'Conversation, IELTS, Business' },
    { icon: 'book', name: 'Math', detail: 'Algebra, Calculus, SAT' },
    {
      icon: 'globe',
      name: 'Languages',
      detail: 'Spanish, French, Chinese, more',
    },
    { icon: 'calendar', name: 'Test Prep', detail: 'IELTS, TOEFL, GRE, GMAT' },
    {
      icon: 'flask',
      name: 'Science',
      detail: 'Physics, Chemistry, Biology, more',
    },
    { icon: 'rocket', name: 'And more', detail: 'Custom lessons for every goal' },
  ]
