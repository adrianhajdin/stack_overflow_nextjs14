import { NextResponse } from 'next/server'
import {
  calendarCsv,
  googleCampaignCsv,
  metaCampaignCsv,
} from '@/lib/ads/plan'
import { getAdTutors } from '@/lib/ads/tutors'

/**
 * Downloadable planning sheets, generated from the ad registry.
 *
 *   /ads/plan?type=calendar          posting schedule
 *   /ads/plan?type=meta              Meta Ads Manager import sheet
 *   /ads/plan?type=google            Google Ads asset sheet
 *
 * Optional: &weeks=8&start=2026-09-07
 *
 * Generated rather than hand-maintained so the schedule cannot drift from the
 * creatives — add a template and next week's plan includes it. Every row
 * carries its own review status, so an unpublishable creative stays visibly
 * blocked all the way through to the import file.
 */

const BUILDERS = {
  calendar: calendarCsv,
  meta: metaCampaignCsv,
  google: googleCampaignCsv,
} as const

type PlanType = keyof typeof BUILDERS

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const type = (searchParams.get('type') ?? 'calendar') as PlanType
  const build = BUILDERS[type]

  if (!build) {
    return NextResponse.json(
      { error: `Unknown plan type "${type}".`, valid: Object.keys(BUILDERS) },
      { status: 400 },
    )
  }

  const weeksParam = Number.parseInt(searchParams.get('weeks') ?? '', 10)
  const weeks = Number.isFinite(weeksParam)
    ? Math.min(Math.max(weeksParam, 1), 26)
    : 4

  const startParam = searchParams.get('start')
  const parsedStart = startParam ? new Date(startParam) : undefined
  const start =
    parsedStart && !Number.isNaN(parsedStart.valueOf()) ? parsedStart : undefined

  const tutors = await getAdTutors()
  const csv = build({ weeks, start, tutors })

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="tutorboost-${type}-plan.csv"`,
      // Always reflect the current registry and claims state.
      'Cache-Control': 'no-store',
    },
  })
}
