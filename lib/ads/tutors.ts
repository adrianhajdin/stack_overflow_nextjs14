import type { AdTutor } from '@/types/ads'
import { SAMPLE_TUTORS } from '@/constants/ads'

/**
 * The seam between the tutor collection and the ad library.
 *
 * Ad templates only ever consume `AdTutor`, so a schema change is absorbed
 * here rather than rippling through seven creatives.
 */

/** A loosely-typed record straight out of the database or an API. */
export interface RawTutorRecord {
  [key: string]: unknown
}

const str = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined

const num = (value: unknown): number | undefined => {
  const parsed = typeof value === 'string' ? Number(value) : value
  return typeof parsed === 'number' && Number.isFinite(parsed) ? parsed : undefined
}

const list = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value.map((item) => String(item)).filter(Boolean)
    : undefined

/** Read the first key that is actually present on the record. */
const pick = (record: RawTutorRecord, ...keys: string[]): unknown => {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key]
  }
  return undefined
}

/**
 * Map one database record onto the shape the creatives need.
 *
 * Field names are matched by alias, so it copes with the usual variations
 * (`picture` / `avatar` / `photoUrl`, `_id` / `id` / `clerkId`) without the
 * caller having to reshape anything first.
 */
export const toAdTutor = (record: RawTutorRecord): AdTutor => {
  const id =
    str(pick(record, 'id', '_id', 'clerkId', 'username')) ??
    str(pick(record, 'name')) ??
    'tutor'

  return {
    id,
    name: str(pick(record, 'name', 'displayName', 'fullName')) ?? 'Tutor',
    subject: str(pick(record, 'subject', 'primarySubject', 'specialty', 'title')),
    headline: str(pick(record, 'headline', 'tagline', 'bio')),
    avatarUrl: str(pick(record, 'avatarUrl', 'picture', 'avatar', 'photoUrl', 'image')),
    countryFlag: str(pick(record, 'countryFlag', 'flag')),
    countryName: str(pick(record, 'countryName', 'country', 'location')),
    rating: num(pick(record, 'rating', 'averageRating', 'score')),
    reviewCount: num(pick(record, 'reviewCount', 'reviews', 'numReviews')),
    lessonCount: num(pick(record, 'lessonCount', 'lessons', 'lessonsTaught')),
    studentCount: num(pick(record, 'studentCount', 'students', 'numStudents')),
    languages: list(pick(record, 'languages', 'speaks')),
    hourlyRate: num(pick(record, 'hourlyRate', 'rate', 'pricePerHour')),
    currency: str(pick(record, 'currency')) ?? 'USD',
    quote: str(pick(record, 'quote', 'testimonial', 'featuredReview')),
    quoteAuthor: str(pick(record, 'quoteAuthor', 'testimonialAuthor')),
    tags: list(pick(record, 'tags', 'skills', 'subjects')),
    profileUrl:
      str(pick(record, 'profileUrl', 'url', 'href')) ??
      (str(pick(record, 'username')) ? `/tutors/${str(pick(record, 'username'))}` : undefined),
  }
}

export const toAdTutors = (records: RawTutorRecord[]): AdTutor[] =>
  records.map(toAdTutor)

export interface GetAdTutorsOptions {
  limit?: number
  /** Filter to a single subject, e.g. "Spanish Tutor". */
  subject?: string
  /** Drop tutors below this rating — worth doing before generating creatives. */
  minRating?: number
}

/**
 * Fetch the tutors the ad library should feature.
 *
 * There is no tutor collection in the schema yet, so this currently serves the
 * sample roster. When the collection lands, swap the body for the query and
 * pipe the result through `toAdTutors()` — every template and the batch
 * generator pick it up with no further changes:
 *
 *   await connectToDatabase()
 *   const docs = await Tutor.find(query).limit(limit).lean()
 *   return toAdTutors(docs as RawTutorRecord[])
 */
export const getAdTutors = async (
  options: GetAdTutorsOptions = {},
): Promise<AdTutor[]> => {
  const { limit = 0, subject, minRating } = options

  // Preview fixtures: invented people, carrying `isSample` so the gallery and
  // render route can warn. Nothing built on these may be published.
  let tutors = SAMPLE_TUTORS

  if (subject) {
    tutors = tutors.filter((tutor) => tutor.subject === subject)
  }

  if (minRating !== undefined) {
    tutors = tutors.filter((tutor) => (tutor.rating ?? 0) >= minRating)
  }

  return limit > 0 ? tutors.slice(0, limit) : tutors
}

/** True when any tutor in the set is a preview fixture rather than a real one. */
export const containsSampleTutors = (tutors: AdTutor[]): boolean =>
  tutors.some((tutor) => tutor.isSample)
