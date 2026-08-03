import type { AdAudience, AdFormatId, AdSpec, AdTutor } from '@/types/ads'
import { AD_TEMPLATES, getAdTemplate } from '@/components/ads/registry'

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export interface BuildAdsOptions {
  /** Restrict to these templates. Defaults to every registered template. */
  templateIds?: string[]
  /** Restrict to these sizes. Defaults to every format each template supports. */
  formats?: AdFormatId[]
  /** Only build creatives aimed at this audience. */
  audience?: AdAudience
  /** Skip templates that do not feature a specific tutor. */
  tutorDrivenOnly?: boolean
  /** Safety valve for large rosters — 0 means no limit. */
  limit?: number
}

/**
 * Expand a set of tutors into a flat list of renderable ad specs.
 *
 * This is the bridge between the tutor collection and the ad library: hand it
 * `await getAdTutors()` and it returns one spec per
 * (template x format x tutor group) combination, each with a stable `key` that
 * doubles as the export filename.
 *
 *   const specs = buildAdsForTutors(await getAdTutors(), {
 *     templateIds: ['tutor-spotlight'],
 *     formats: ['square', 'story'],
 *   })
 *
 * Rendering is left to the caller so this stays usable from a server action, a
 * batch export script or the preview gallery alike.
 */
export const buildAdsForTutors = (
  tutors: AdTutor[],
  options: BuildAdsOptions = {},
): AdSpec[] => {
  const {
    templateIds,
    formats,
    audience,
    tutorDrivenOnly = false,
    limit = 0,
  } = options

  const templates = AD_TEMPLATES.filter((template) => {
    if (templateIds && !templateIds.includes(template.id)) return false
    if (audience && template.audience !== audience) return false
    if (tutorDrivenOnly && template.tutorSlots === 0) return false
    return true
  })

  const specs: AdSpec[] = []

  for (const template of templates) {
    const templateFormats = formats
      ? template.formats.filter((format) => formats.includes(format))
      : template.formats

    for (const format of templateFormats) {
      // A template with no tutor slots is a single creative; one with N slots
      // produces a creative per group of N tutors.
      const groups =
        template.tutorSlots === 0
          ? [[] as AdTutor[]]
          : chunk(tutors, template.tutorSlots)

      for (const group of groups) {
        if (template.tutorSlots > 0 && group.length === 0) continue

        const stem =
          template.tutorSlots === 1 && group[0]
            ? slug(group[0].id || group[0].name)
            : template.tutorSlots > 1 && group.length
              ? group.map((tutor) => slug(tutor.id || tutor.name)).join('-')
              : 'brand'

        specs.push({
          key: `${template.id}__${format}__${stem}`,
          templateId: template.id,
          format,
          tutors: group,
          cta:
            template.tutorSlots === 1 && group[0]?.profileUrl
              ? { ...template.defaults.cta, href: group[0].profileUrl }
              : undefined,
        })

        if (limit > 0 && specs.length >= limit) return specs
      }
    }
  }

  return specs
}

/**
 * Resolve a spec back to the props a template needs.
 * Returns null when the spec references a template that is no longer registered.
 */
export const resolveAdSpec = (spec: AdSpec) => {
  const template = getAdTemplate(spec.templateId)
  if (!template) return null

  return {
    template,
    props: {
      format: spec.format,
      tutors: spec.tutors.length ? spec.tutors : undefined,
      copy: spec.copy,
      cta: spec.cta,
    },
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items]

  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size))
  }
  return out
}
