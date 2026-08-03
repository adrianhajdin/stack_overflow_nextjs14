import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import Logo from '@/components/brand/Logo'
import { AD_TEMPLATES } from '@/components/ads/registry'
import { AdSpecRenderer } from '@/components/ads/AdRenderer'
import { AD_FORMATS, fitScale } from '@/lib/ads/formats'
import { buildAdsForTutors } from '@/lib/ads/generate'
import { containsSampleTutors, getAdTutors } from '@/lib/ads/tutors'
import { BRAND } from '@/constants/brand'
import { unverifiedClaims } from '@/constants/claims'

export const metadata: Metadata = {
  title: `Ad library | ${BRAND.name}`,
  description:
    'Every TutorBoost ad template, in every size, rendered from live tutor data.',
}

/** Preview width for a thumbnail, in CSS pixels. */
const THUMB_WIDTH = 460

const AdTile = ({
  spec,
  title,
  subtitle,
}: {
  spec: Parameters<typeof AdSpecRenderer>[0]['spec']
  title: string
  subtitle: string
}) => {
  const format = AD_FORMATS[spec.format]
  const scale = fitScale(spec.format, THUMB_WIDTH)

  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-xl border border-light-700 bg-white shadow-light-200">
        <AdSpecRenderer spec={spec} scale={scale} />
      </div>

      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-dark-300">{title}</span>
        <span className="text-xs text-light-500">
          {subtitle} &middot; {format.width}&times;{format.height}
        </span>
      </figcaption>

      <Link
        href={`/ads/render?template=${spec.templateId}&format=${spec.format}${
          spec.tutors[0] ? `&tutor=${spec.tutors[0].id}` : ''
        }`}
        className="text-xs font-medium text-primary-500 hover:underline"
      >
        Open at full size &rarr;
      </Link>
    </figure>
  )
}

/**
 * Everything standing between this library and a publishable ad.
 *
 * Deliberately at the top of the page and hard to miss: the creatives below
 * look finished, and the whole risk is someone exporting one without noticing
 * that the data behind it is invented.
 */
const PrePublishChecklist = ({ usingSampleData }: { usingSampleData: boolean }) => {
  const outstanding = unverifiedClaims()

  if (!usingSampleData && outstanding.length === 0) {
    return (
      <section className="rounded-xl border border-green-600/30 bg-green-50 p-5">
        <h2 className="text-base font-bold text-green-900">
          Cleared to publish
        </h2>
        <p className="mt-1 text-sm text-green-900/80">
          Every claim in the library is backed by a source, and no preview
          fixtures are in use.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-xl border-2 border-primary-500 bg-primary-100 p-5">
      <h2 className="text-base font-bold text-dark-100">
        Not cleared to publish
      </h2>

      {usingSampleData && (
        <p className="mt-2 text-sm text-dark-300">
          <strong>Preview data in use.</strong> The tutors below are invented —
          names, ratings, review counts, availability and bios. Do not export
          any of these creatives. Point{' '}
          <code className="rounded bg-white px-1.5 py-0.5">getAdTutors()</code>{' '}
          at the real tutor collection first.
        </p>
      )}

      {outstanding.length > 0 && (
        <>
          <p className="mt-3 text-sm text-dark-300">
            <strong>{outstanding.length} unverified claims.</strong> These are
            currently omitted from every creative. To state one, fill in its
            value, source and date in{' '}
            <code className="rounded bg-white px-1.5 py-0.5">
              constants/claims.ts
            </code>
            .
          </p>

          <ul className="mt-3 flex flex-col gap-1.5">
            {outstanding.map((item) => (
              <li key={`${item.group}-${item.key}`} className="text-sm">
                <span className="font-mono text-xs text-primary-500">
                  {item.group}.{item.key}
                </span>{' '}
                <span className="text-dark-500">— {item.impact}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

const AdLibraryPage = async () => {
  const tutors = await getAdTutors()
  const usingSampleData = containsSampleTutors(tutors)

  // Brand creatives: every template in each size it supports.
  const brandSpecs = buildAdsForTutors(tutors, { formats: undefined }).filter(
    (spec) => {
      const template = AD_TEMPLATES.find((t) => t.id === spec.templateId)
      // One example per template/format; the per-tutor run is shown separately.
      return template?.tutorSlots !== 1
    },
  )

  // The batch run: one spotlight per tutor, proving the data-driven path.
  const perTutorSpecs = buildAdsForTutors(tutors, {
    templateIds: ['tutor-spotlight'],
    formats: ['square'],
  })

  const byTemplate = AD_TEMPLATES.map((template) => ({
    template,
    specs: brandSpecs.filter((spec) => spec.templateId === template.id),
  })).filter((group) => group.specs.length > 0)

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-16 px-8 py-12">
      <header className="flex flex-col gap-4">
        <Logo size="lg" tone="light" />

        <div>
          <h1 className="text-4xl font-bold tracking-tight text-dark-100">
            Ad library
          </h1>
          <p className="mt-2 max-w-3xl text-base text-dark-500">
            {AD_TEMPLATES.length} templates across{' '}
            {Object.keys(AD_FORMATS).length} sizes, all rendered from the same{' '}
            <code className="rounded bg-light-700 px-1.5 py-0.5 text-sm">
              AdTutor
            </code>{' '}
            records. Swap <code className="rounded bg-light-700 px-1.5 py-0.5 text-sm">
              getAdTutors()
            </code>{' '}
            over to the tutor collection and every creative below regenerates
            from live data.
          </p>
        </div>
      </header>

      <PrePublishChecklist usingSampleData={usingSampleData} />

      <section className="rounded-xl border border-light-700 bg-white p-5">
        <h2 className="text-base font-bold text-dark-100">Planning sheets</h2>
        <p className="mt-1 text-sm text-dark-500">
          Generated from this registry, so they never drift from the creatives.
          Every row carries its own review status — a blocked creative stays
          blocked all the way into the import file.
        </p>

        <div className="mt-3 flex flex-wrap gap-4">
          {[
            { type: 'calendar', label: 'Posting calendar' },
            { type: 'meta', label: 'Meta Ads import sheet' },
            { type: 'google', label: 'Google Ads asset sheet' },
          ].map((sheet) => (
            <a
              key={sheet.type}
              href={`/ads/plan?type=${sheet.type}&weeks=4`}
              className="text-sm font-medium text-primary-500 hover:underline"
            >
              {sheet.label} (CSV) &darr;
            </a>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold text-dark-100">
            One ad per tutor
          </h2>
          <p className="mt-1 text-sm text-dark-500">
            {perTutorSpecs.length} creatives generated by iterating{' '}
            {tutors.length} tutor records through the spotlight template.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(460px,1fr))] gap-8">
          {perTutorSpecs.map((spec) => (
            <AdTile
              key={spec.key}
              spec={spec}
              title={spec.tutors[0]?.name ?? 'Tutor'}
              subtitle={AD_FORMATS[spec.format].label}
            />
          ))}
        </div>
      </section>

      {byTemplate.map(({ template, specs }) => (
        <section key={template.id} className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-dark-100">
              {template.name}
            </h2>
            <p className="mt-1 text-sm text-dark-500">
              {template.description}
              <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary-500">
                {template.audience}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(460px,1fr))] gap-8">
            {specs.map((spec) => (
              <AdTile
                key={spec.key}
                spec={spec}
                title={AD_FORMATS[spec.format].label}
                subtitle={AD_FORMATS[spec.format].channel}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default AdLibraryPage
