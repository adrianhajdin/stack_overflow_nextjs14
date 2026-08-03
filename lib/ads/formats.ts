import type { AdFormat, AdFormatId } from '@/types/ads'

/**
 * Every ad size the library can render, at true pixel dimensions.
 *
 * Templates lay themselves out against these numbers rather than against
 * viewport breakpoints, so a creative is identical on screen and in an
 * exported PNG. Add a size here and any template that lists it in `formats`
 * can render it.
 */
export const AD_FORMATS: Record<AdFormatId, AdFormat> = {
  leaderboard: {
    id: 'leaderboard',
    label: 'Leaderboard',
    width: 1200,
    height: 628,
    channel: 'Paid social / display hero',
  },
  square: {
    id: 'square',
    label: 'Square',
    width: 1080,
    height: 1080,
    channel: 'Instagram / Facebook feed',
  },
  portrait: {
    id: 'portrait',
    label: 'Portrait',
    width: 1080,
    height: 1350,
    channel: 'Instagram portrait',
  },
  story: {
    id: 'story',
    label: 'Story',
    width: 1080,
    height: 1920,
    channel: 'Stories / Reels / TikTok',
  },
  poster: {
    id: 'poster',
    label: 'Poster',
    width: 1024,
    height: 1536,
    channel: 'Print / landing hero',
  },
  wide: {
    id: 'wide',
    label: 'Billboard',
    width: 970,
    height: 250,
    channel: 'Display billboard',
  },
  mrec: {
    id: 'mrec',
    label: 'Medium rectangle',
    width: 300,
    height: 250,
    channel: 'Display MREC',
  },
  skyscraper: {
    id: 'skyscraper',
    label: 'Half page',
    width: 300,
    height: 600,
    channel: 'Display skyscraper',
  },
}

export const AD_FORMAT_IDS = Object.keys(AD_FORMATS) as AdFormatId[]

export const getAdFormat = (id: AdFormatId): AdFormat => AD_FORMATS[id]

/** True when the format is taller than it is wide — templates stack vertically. */
export const isPortraitFormat = (id: AdFormatId): boolean => {
  const { width, height } = AD_FORMATS[id]
  return height > width
}

/** True for the small display units, where copy has to be cut back hard. */
export const isCompactFormat = (id: AdFormatId): boolean =>
  id === 'mrec' || id === 'wide' || id === 'skyscraper'

/**
 * Scale needed to fit a format inside `maxWidth` px of screen — used by the
 * preview gallery so full-size creatives can be shown as thumbnails.
 */
export const fitScale = (id: AdFormatId, maxWidth: number): number =>
  Math.min(1, maxWidth / AD_FORMATS[id].width)

/**
 * Width available to a split creative's copy column, in `em`.
 *
 * `em` is 1% of the ad width (see AdFrame), so the whole canvas is 100em wide
 * and this is just arithmetic on percentages. Templates feed the result to
 * `fitHeadlineSize` to pick type that fits the column in every format.
 */
export const copyWidthEm = (
  id: AdFormatId,
  mediaShare: number,
  padding: number,
): number => 100 * (1 - mediaShare) - 2 * padding

/**
 * Height available to a split creative's copy column, in `em`.
 * The media panel runs full height beside the copy, so the column always gets
 * the whole canvas height less its padding.
 */
export const copyHeightEm = (
  id: AdFormatId,
  _mediaShare: number,
  padding: number,
): number => {
  const { width, height } = AD_FORMATS[id]
  return (height / width) * 100 - 2 * padding
}

/**
 * How much to scale a copy column's contents for the height it has.
 *
 * Templates are authored against the tightest case — the leaderboard, whose
 * copy column is only ~46em tall — and this grows the stack for formats with
 * room to spare. Because every element inside a creative is sized in `em`,
 * applying the result as the column's `font-size` scales the whole stack
 * proportionally, which is what lets one template serve eight formats.
 */
export const contentScale = (
  heightEm: number,
  { design = 46, min = 0.9, max = 1.8 } = {},
): number => Math.max(min, Math.min(max, heightEm / design))

/** Convenience: the split-column metrics a template needs, in one call. */
export const splitMetrics = (
  id: AdFormatId,
  mediaShare: number,
  padding: number,
  /** Raise `design` for a denser template so it scales up less aggressively. */
  options?: Parameters<typeof contentScale>[1],
) => {
  const widthEm = copyWidthEm(id, mediaShare, padding)
  const heightEm = copyHeightEm(id, mediaShare, padding)
  const scale = contentScale(heightEm, options)

  return {
    widthEm,
    heightEm,
    scale,
    /** Column width expressed in the scaled column's own `em` units. */
    innerWidthEm: widthEm / scale,
  }
}
