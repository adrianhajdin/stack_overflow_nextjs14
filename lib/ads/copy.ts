import type { AdCopyDeck, AdTutor } from '@/types/ads'

/** Layer per-instance copy over a template's defaults. */
export const mergeCopy = (
  defaults: AdCopyDeck,
  overrides?: Partial<AdCopyDeck>,
): AdCopyDeck => ({ ...defaults, ...overrides })

/**
 * Resolve `{name}`-style placeholders against a tutor record.
 *
 * Lets a copy deck be written once — "Learn with {name}. {subject} on your
 * schedule." — and reused across the whole tutor collection.
 */
export const fillTutorTokens = (text: string, tutor?: AdTutor): string => {
  if (!tutor) return text

  const tokens: Record<string, string | undefined> = {
    name: tutor.name,
    subject: tutor.subject,
    headline: tutor.headline,
    country: tutor.countryName,
    rating: tutor.rating?.toFixed(1),
    reviews: tutor.reviewCount?.toString(),
    lessons: tutor.lessonCount?.toLocaleString('en-US'),
    students: tutor.studentCount?.toString(),
    rate: formatRate(tutor),
    languages: tutor.languages?.join(', '),
  }

  return text.replace(/\{(\w+)\}/g, (match, key: string) => tokens[key] ?? match)
}

/** Apply token substitution across a whole copy deck. */
export const fillCopyDeck = (deck: AdCopyDeck, tutor?: AdTutor): AdCopyDeck => {
  if (!tutor) return deck

  return {
    ...deck,
    eyebrow: fillTutorTokens(deck.eyebrow, tutor),
    headline: deck.headline.map((line) => ({
      ...line,
      text: fillTutorTokens(line.text, tutor),
      accentTail: line.accentTail
        ? fillTutorTokens(line.accentTail, tutor)
        : undefined,
    })),
    subhead: fillTutorTokens(deck.subhead, tutor),
    bullets: deck.bullets.map((bullet) => ({
      ...bullet,
      text: fillTutorTokens(bullet.text, tutor),
      subtext: bullet.subtext
        ? fillTutorTokens(bullet.subtext, tutor)
        : undefined,
    })),
    cta: { ...deck.cta, label: fillTutorTokens(deck.cta.label, tutor) },
    footnote: fillTutorTokens(deck.footnote, tutor),
    disclaimer: fillTutorTokens(deck.disclaimer, tutor),
  }
}

export const formatRate = (tutor: AdTutor): string | undefined => {
  if (tutor.hourlyRate === undefined) return undefined

  const symbol = { USD: '$', EUR: '€', GBP: '£' }[tutor.currency ?? 'USD'] ?? '$'
  return `${symbol}${tutor.hourlyRate}`
}
