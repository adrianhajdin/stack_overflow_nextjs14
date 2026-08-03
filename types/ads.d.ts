import type { ComponentType } from 'react'

/**
 * The shape an ad creative needs from a tutor record.
 *
 * Deliberately loose: only `id` and `name` are required so a row straight out
 * of the tutor collection can be passed in, and every template degrades
 * gracefully when a field is missing (no avatar → initials, no rating → the
 * rating chip is dropped, and so on).
 */
export interface AdTutor {
  id: string
  name: string
  /**
   * Marks a preview fixture rather than a real person. Set on everything in
   * SAMPLE_TUTORS; the gallery and render route warn when it is present, so a
   * creative built on invented data cannot be exported unnoticed.
   */
  isSample?: boolean
  /** e.g. "English Tutor" — rendered under the name on tutor cards. */
  subject?: string
  /** One-line pitch, used as the headline on single-tutor spotlight ads. */
  headline?: string
  avatarUrl?: string
  /** Flag emoji, e.g. "🇺🇸". Rendered next to the rating. */
  countryFlag?: string
  countryName?: string
  /** 0–5. Rendered to one decimal place. */
  rating?: number
  reviewCount?: number
  lessonCount?: number
  studentCount?: number
  languages?: string[]
  hourlyRate?: number
  /** ISO 4217, defaults to USD. */
  currency?: string
  /** A student testimonial to feature on the creative. */
  quote?: string
  quoteAuthor?: string
  /** Subject/skill chips. */
  tags?: string[]
  /** Deep link used for the CTA and the tracked destination URL. */
  profileUrl?: string

  // --- Profile-card fields -------------------------------------------------
  // Only the profile-card creative reads these; every other template ignores
  // them, and the card drops whichever ones are missing.

  /** Shows the verified check beside the name. */
  verified?: boolean
  /** Shows the "Super Tutor" chip over the photo. */
  superTutor?: boolean
  yearsExperience?: number
  /** First-person "About me" paragraph. */
  bio?: string
  /** Human-readable slot, e.g. "Today at 6:00 PM". */
  nextAvailability?: string
  /** Presence of a URL shows the "Watch intro" overlay on the photo. */
  introVideoUrl?: string
}

/** Named ad sizes. Pixel dimensions live in AD_FORMATS. */
export type AdFormatId =
  | 'leaderboard' // 1200 x 628  paid social / display hero
  | 'square' // 1080 x 1080 IG / FB feed
  | 'portrait' // 1080 x 1350 IG portrait
  | 'story' // 1080 x 1920 IG / TikTok story
  | 'poster' // 1024 x 1536 print / long-form landing hero
  | 'wide' //  970 x 250  billboard
  | 'mrec' //  300 x 250  medium rectangle
  | 'skyscraper' //  300 x 600 half page

export interface AdFormat {
  id: AdFormatId
  label: string
  width: number
  height: number
  /** Where the creative is typically placed — surfaced in the gallery UI. */
  channel: string
}

/** Who the creative is talking to. Drives copy deck selection. */
export type AdAudience = 'tutor' | 'student'

export interface AdCtaSpec {
  label: string
  href?: string
}

export interface AdBullet {
  text: string
  /** Optional second line of supporting copy. */
  subtext?: string
  /** Icon key resolved through the ad icon set. */
  icon?: AdIconName
}

export type AdIconName =
  | 'percent'
  | 'dollar'
  | 'user'
  | 'users'
  | 'trend'
  | 'calendar'
  | 'shield'
  | 'chat'
  | 'clock'
  | 'star'
  | 'check'
  | 'globe'
  | 'book'
  | 'flask'
  | 'rocket'
  | 'graduation'
  | 'heart'
  | 'play'
  | 'verified'
  | 'support'

export interface AdHeadlineLine {
  text: string
  /** Renders in brand orange rather than ink. */
  accent?: boolean
  /**
   * Trailing words on the same line rendered in the opposite colour, for
   * headlines that switch mid-line ("tutor **is here.**").
   */
  accentTail?: string
}

/** The props every ad template accepts. */
export interface AdTemplateProps {
  format?: AdFormatId
  /** Tutors to feature. Templates take as many as they have room for. */
  tutors?: AdTutor[]
  /** Per-instance copy overrides, merged over the template's defaults. */
  copy?: Partial<AdCopyDeck>
  cta?: AdCtaSpec
  /** Scales the whole creative down for on-screen preview (1 = full size). */
  scale?: number
  className?: string
}

/** The copy a template can be re-skinned with, without touching its layout. */
export interface AdCopyDeck {
  eyebrow: string
  headline: AdHeadlineLine[]
  subhead: string
  bullets: AdBullet[]
  cta: AdCtaSpec
  footnote: string
  disclaimer: string
}

export interface AdTemplate {
  id: string
  name: string
  description: string
  audience: AdAudience
  /** Formats this template's layout is designed to fill. */
  formats: AdFormatId[]
  /** How many tutor records the layout can show. 0 = tutor-agnostic. */
  tutorSlots: number
  component: ComponentType<AdTemplateProps>
  defaults: AdCopyDeck
}

/** A single renderable ad, produced by the batch generator. */
export interface AdSpec {
  /** Stable React key / filename stem, e.g. "tutor-spotlight__square__anna". */
  key: string
  templateId: string
  format: AdFormatId
  tutors: AdTutor[]
  copy?: Partial<AdCopyDeck>
  cta?: AdCtaSpec
}
