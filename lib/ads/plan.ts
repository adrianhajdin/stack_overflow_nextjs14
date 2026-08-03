import type { AdFormatId, AdTutor } from '@/types/ads'
import { AD_TEMPLATES, getAdTemplate } from '@/components/ads/registry'
import { AD_FORMATS } from './formats'
import { unverifiedClaims } from '@/constants/claims'

/**
 * Turns the ad library into a posting schedule and a paid-campaign plan.
 *
 * Everything here is derived from the registry, so adding a template or a
 * format changes the calendar automatically — the schedule cannot drift from
 * the creatives it is scheduling. Nothing in this file talks to a social or
 * ad platform; it produces the CSVs a human imports.
 */

/** The weekly cadence from the TutorBoost Content OS: 2 short, 1 long, 1 case study. */
export interface CalendarSlot {
  /** ISO weekday, 1 = Monday. */
  weekday: number
  kind: 'Short post' | 'Long form' | 'Case study'
  /** Formats this slot can use, best first. */
  formats: AdFormatId[]
  /** Pins the slot to one template, e.g. the case study is always a spotlight. */
  templateId?: string
  channels: string[]
}

export const WEEKLY_SLOTS: CalendarSlot[] = [
  {
    weekday: 2,
    kind: 'Short post',
    formats: ['square'],
    channels: ['Instagram feed', 'Facebook feed'],
  },
  {
    weekday: 3,
    kind: 'Long form',
    formats: ['poster', 'portrait'],
    channels: ['Blog hero', 'LinkedIn'],
  },
  {
    weekday: 4,
    kind: 'Short post',
    formats: ['story'],
    channels: ['Instagram Stories', 'TikTok'],
  },
  {
    weekday: 5,
    kind: 'Case study',
    formats: ['square', 'story'],
    templateId: 'tutor-spotlight',
    channels: ['Instagram feed', 'LinkedIn'],
  },
]

export interface CalendarEntry {
  /** ISO date, YYYY-MM-DD. */
  date: string
  week: number
  slot: CalendarSlot['kind']
  audience: 'tutor' | 'student'
  templateId: string
  templateName: string
  format: AdFormatId
  dimensions: string
  channels: string
  /** Featured tutor, for the slots that spotlight one. */
  tutor?: string
  /** Doubles as the export filename stem. */
  creativeKey: string
  /** Where to preview or screenshot this exact creative. */
  renderPath: string
  status: 'Blocked' | 'Ready'
  blocker: string
}

const iso = (date: Date) => date.toISOString().slice(0, 10)

/** Monday of the week containing `from`, or the next Monday if `from` is later. */
const startOfWeek = (from: Date): Date => {
  const date = new Date(from)
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() - day + 1)
  return date
}

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

/**
 * The first slot format this template actually supports, or undefined.
 *
 * Returning undefined rather than falling back matters: the fallback would
 * schedule, say, a 1080x1080 square into a Stories slot, and the calendar
 * would look correct while the asset was the wrong shape for the placement.
 */
const formatFor = (
  templateFormats: AdFormatId[],
  slotFormats: AdFormatId[],
): AdFormatId | undefined =>
  slotFormats.find((format) => templateFormats.includes(format))

export interface BuildCalendarOptions {
  /** First Monday of the schedule. Defaults to the week of `today`. */
  start?: Date
  weeks?: number
  /** Tutors to feature in the case-study slots. */
  tutors?: AdTutor[]
}

/**
 * Build the posting schedule.
 *
 * Templates rotate round-robin so no two consecutive weeks repeat a creative,
 * and the audience alternates naturally because the registry interleaves tutor
 * and student templates. Every row starts `Blocked` while any claim is
 * unverified or the tutor is a preview fixture — the calendar refuses to
 * present an unpublishable creative as ready to post.
 */
export const buildContentCalendar = ({
  start,
  weeks = 4,
  tutors = [],
}: BuildCalendarOptions = {}): CalendarEntry[] => {
  const outstanding = unverifiedClaims()
  const firstMonday = startOfWeek(start ?? new Date())

  // A rotation queue rather than an index: a template that cannot fill the
  // current slot stays at the front and gets first refusal on the next one.
  // With an index it would be consumed and skipped every cycle, and a template
  // that fits few slots — the terms table, which has no story size — would
  // never be scheduled at all.
  const queue = AD_TEMPLATES.filter((template) => template.id !== 'tutor-spotlight')
  const entries: CalendarEntry[] = []

  let tutorIndex = 0

  for (let week = 0; week < weeks; week += 1) {
    for (const slot of WEEKLY_SLOTS) {
      // Rotate past any template that cannot fill this slot's placement,
      // rather than forcing it in at the wrong aspect ratio.
      let template = slot.templateId ? getAdTemplate(slot.templateId) : undefined
      let format = template
        ? formatFor(template.formats, slot.formats)
        : undefined

      if (!slot.templateId) {
        const position = queue.findIndex((candidate) =>
          formatFor(candidate.formats, slot.formats),
        )

        if (position !== -1) {
          const [picked] = queue.splice(position, 1)
          queue.push(picked)
          template = picked
          format = formatFor(picked.formats, slot.formats)
        }
      }

      if (!template || !format) continue

      const { width, height } = AD_FORMATS[format]

      const tutor = slot.templateId ? tutors[tutorIndex++ % Math.max(1, tutors.length)] : undefined

      const stem = tutor ? tutor.id : 'brand'
      const query = new URLSearchParams({ template: template.id, format })
      if (tutor) query.set('tutor', tutor.id)

      const blockers = [
        tutor?.isSample && 'Featured tutor is preview data',
        outstanding.length > 0 && `${outstanding.length} unverified claims`,
      ].filter(Boolean) as string[]

      entries.push({
        date: iso(addDays(firstMonday, week * 7 + slot.weekday - 1)),
        week: week + 1,
        slot: slot.kind,
        audience: template.audience,
        templateId: template.id,
        templateName: template.name,
        format,
        dimensions: `${width}x${height}`,
        channels: slot.channels.join(' / '),
        tutor: tutor?.name,
        creativeKey: `${template.id}__${format}__${stem}`,
        renderPath: `/ads/render?${query.toString()}`,
        status: blockers.length ? 'Blocked' : 'Ready',
        blocker: blockers.join('; '),
      })
    }
  }

  return entries
}

/** RFC 4180 escaping — quotes doubled, fields with commas or quotes wrapped. */
const csvCell = (value: unknown): string => {
  const text = value === undefined || value === null ? '' : String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export const toCsv = (rows: Record<string, unknown>[]): string => {
  if (rows.length === 0) return ''

  const headers = Object.keys(rows[0])
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n')
}

export const calendarCsv = (options?: BuildCalendarOptions): string =>
  toCsv(
    buildContentCalendar(options).map((entry) => ({
      Date: entry.date,
      Week: entry.week,
      Slot: entry.slot,
      Audience: entry.audience,
      Template: entry.templateName,
      'Template ID': entry.templateId,
      Format: entry.format,
      Dimensions: entry.dimensions,
      Channels: entry.channels,
      Tutor: entry.tutor ?? '',
      'Creative key': entry.creativeKey,
      'Render path': entry.renderPath,
      Status: entry.status,
      Blocker: entry.blocker,
    })),
  )

/**
 * Meta Ads Manager import sheet.
 *
 * Not an API push — this is the column set Meta's bulk importer expects, with
 * the creative filenames matching what the batch export produces. Account,
 * budget and audience columns are intentionally left blank: those are
 * commercial decisions, not something to guess.
 */
export const metaCampaignCsv = (options?: BuildCalendarOptions): string => {
  const entries = buildContentCalendar(options).filter(
    (entry) => entry.format !== 'poster',
  )

  return toCsv(
    entries.map((entry) => {
      const template = getAdTemplate(entry.templateId)
      const deck = template?.defaults

      return {
        'Campaign Name': `TutorBoost — ${entry.audience === 'tutor' ? 'Tutor acquisition' : 'Student acquisition'}`,
        'Campaign Objective': 'Outcome Traffic',
        'Campaign Status': 'PAUSED',
        'Ad Set Name': `${entry.templateName} — ${entry.format}`,
        'Ad Set Status': 'PAUSED',
        'Daily Budget': '',
        'Audience Name': '',
        'Ad Name': entry.creativeKey,
        'Ad Status': 'PAUSED',
        'Image File Name': `${entry.creativeKey}.png`,
        'Title': deck?.headline.map((line) => line.text).join(' ') ?? '',
        'Body': deck?.subhead ?? '',
        'Link Description': deck?.footnote ?? '',
        'Call to Action': deck?.cta.label ?? '',
        'Website URL': `https://tutorboost.org${deck?.cta.href ?? '/'}`,
        'Review status': entry.status,
        'Blocker': entry.blocker,
      }
    }),
  )
}

/**
 * Google Ads asset sheet, for a Performance Max or Display campaign.
 * Same caveat as Meta: import-ready columns, no account credentials.
 */
export const googleCampaignCsv = (options?: BuildCalendarOptions): string => {
  const entries = buildContentCalendar(options)

  return toCsv(
    entries.map((entry) => {
      const template = getAdTemplate(entry.templateId)
      const deck = template?.defaults
      const headline = deck?.headline.map((line) => line.text).join(' ') ?? ''

      return {
        Campaign: `TutorBoost — ${entry.audience === 'tutor' ? 'Tutors' : 'Students'}`,
        'Campaign Status': 'Paused',
        'Ad Group': entry.templateName,
        'Ad Group Status': 'Paused',
        'Asset Type': 'Image',
        'Asset File': `${entry.creativeKey}.png`,
        Dimensions: entry.dimensions,
        // Google truncates at 30 / 90 characters; flagged rather than silently cut.
        Headline: headline,
        'Headline length': headline.length,
        Description: deck?.subhead ?? '',
        'Final URL': `https://tutorboost.org${deck?.cta.href ?? '/'}`,
        'Review status': entry.status,
        Blocker: entry.blocker,
      }
    }),
  )
}
