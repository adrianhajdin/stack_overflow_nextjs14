import React from 'react'
import type { AdFormatId, AdSpec, AdTutor } from '@/types/ads'
import { getAdTemplate } from './registry'
import { resolveAdSpec } from '@/lib/ads/generate'

interface AdRendererProps {
  templateId: string
  format?: AdFormatId
  tutors?: AdTutor[]
  scale?: number
  className?: string
}

/**
 * Render a creative by template id.
 *
 * The indirection matters for batch work: a spec is plain JSON, so ads can be
 * enumerated, stored or passed over the wire and only turned into React at the
 * point of rendering.
 */
export const AdRenderer = ({
  templateId,
  format,
  tutors,
  scale = 1,
  className,
}: AdRendererProps) => {
  const template = getAdTemplate(templateId)
  if (!template) return null

  const Creative = template.component
  const resolvedFormat = format ?? template.formats[0]

  return (
    <Creative
      format={resolvedFormat}
      tutors={tutors}
      scale={scale}
      className={className}
    />
  )
}

/** Render a spec produced by `buildAdsForTutors()`. */
export const AdSpecRenderer = ({
  spec,
  scale = 1,
  className,
}: {
  spec: AdSpec
  scale?: number
  className?: string
}) => {
  const resolved = resolveAdSpec(spec)
  if (!resolved) return null

  const Creative = resolved.template.component

  return <Creative {...resolved.props} scale={scale} className={className} />
}

export default AdRenderer
