import React from 'react'
import type { Metadata } from 'next'
import type { AdFormatId } from '@/types/ads'
import { getAdTemplate } from '@/components/ads/registry'
import { AD_FORMATS } from '@/lib/ads/formats'
import { containsSampleTutors, getAdTutors } from '@/lib/ads/tutors'
import { BRAND } from '@/constants/brand'
import { unverifiedClaims } from '@/constants/claims'

export const metadata: Metadata = {
  title: `Ad render | ${BRAND.name}`,
  robots: { index: false, follow: false },
}

interface RenderPageProps {
  searchParams: {
    template?: string
    format?: string
    /** Tutor id to feature. Omit to use the top of the roster. */
    tutor?: string
    /** Comma-separated ids, for templates that show several tutors. */
    tutors?: string
  }
}

/**
 * A single creative on an otherwise empty page, at true pixel size.
 *
 * This is the export surface: point a headless browser at
 *
 *   /ads/render?template=tutor-spotlight&format=square&tutor=anna
 *
 * and screenshot the `[data-ad-key]` element to get a pixel-exact PNG. Because
 * the page takes its parameters from the query string, a batch export is just
 * a loop over `buildAdsForTutors()` output.
 */
const AdRenderPage = async ({ searchParams }: RenderPageProps) => {
  const template = getAdTemplate(searchParams.template ?? '')

  if (!template) {
    return (
      <div className="p-10 font-mono text-sm">
        Unknown template <strong>{searchParams.template ?? '(none)'}</strong>.
      </div>
    )
  }

  const requested = searchParams.format as AdFormatId | undefined
  const format =
    requested && AD_FORMATS[requested] && template.formats.includes(requested)
      ? requested
      : template.formats[0]

  const roster = await getAdTutors()

  const ids = (searchParams.tutors ?? searchParams.tutor ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)

  // Preserve the requested order, then top up from the roster so templates
  // with several slots always have enough tutors to fill them.
  const selected = ids.length
    ? ids
        .map((id) => roster.find((tutor) => tutor.id === id))
        .filter((tutor): tutor is (typeof roster)[number] => Boolean(tutor))
    : []

  const tutors = selected.length
    ? [...selected, ...roster.filter((tutor) => !selected.includes(tutor))]
    : roster

  const Creative = template.component
  const usingSampleData = containsSampleTutors(tutors)
  const outstanding = unverifiedClaims()

  return (
    <div className="inline-block">
      <Creative format={format} tutors={tutors} scale={1} />

      {/*
        Warnings sit *below* the creative, never on top of it. The export
        tooling screenshots the [data-ad-key] element, so the image stays
        pixel-clean while anyone opening this page in a browser still sees
        what is wrong with what they are about to export.
      */}
      {(usingSampleData || outstanding.length > 0) && (
        <div className="max-w-[900px] border-t-4 border-primary-500 bg-primary-100 p-5 text-sm">
          <p className="font-bold text-dark-100">Not cleared to publish</p>

          {usingSampleData && (
            <p className="mt-1 text-dark-300">
              This creative is rendered from invented preview tutors. Wire up
              real tutor data before exporting.
            </p>
          )}

          {outstanding.length > 0 && (
            <p className="mt-1 text-dark-300">
              {outstanding.length} claims are unverified and have been omitted
              from the creative above. See the checklist on{' '}
              <a href="/ads" className="font-medium text-primary-500 underline">
                /ads
              </a>
              .
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdRenderPage
