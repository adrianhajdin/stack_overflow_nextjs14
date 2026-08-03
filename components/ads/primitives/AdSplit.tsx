import React from 'react'
import type { AdFormatId } from '@/types/ads'

interface AdSplitProps {
  format: AdFormatId
  /** The photo / visual half. Omit for copy-only creatives. */
  media?: React.ReactNode
  /** How much of the creative's width the media panel takes. */
  mediaShare?: number
  /**
   * Copy beside media (`row`) or above it (`column`). Defaults to `row` in
   * every format — including the tall ones, where the master art still runs
   * the photo down the right-hand edge rather than stacking it underneath.
   */
  direction?: 'row' | 'column'
  mediaFirst?: boolean
  padding?: number
  /**
   * Scales the copy column's contents. Everything inside a creative is sized
   * in `em`, so setting the column's font-size grows or shrinks the whole
   * stack at once — see `contentScale()` in lib/ads/formats.
   */
  contentScale?: number
  children: React.ReactNode
}

/**
 * The layout every split creative shares: a copy half and a media half that
 * sit side by side in landscape formats and stack in portrait ones.
 *
 * Centralising this is what lets a single template fill a 1200x628
 * leaderboard and a 1080x1920 story without a bespoke layout for each.
 */
const AdSplit = ({
  format,
  media,
  mediaShare = 0.45,
  direction,
  mediaFirst = false,
  padding = 5,
  contentScale = 1,
  children,
}: AdSplitProps) => {
  const flexDirection = direction ?? 'row'
  const isColumn = flexDirection === 'column'

  const mediaNode = media && (
    <div
      style={{
        flex: 'none',
        [isColumn ? 'height' : 'width']: `${mediaShare * 100}%`,
        [isColumn ? 'width' : 'height']: '100%',
        position: 'relative',
      }}
    >
      {media}
    </div>
  )

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection,
        height: '100%',
        width: '100%',
      }}
    >
      {mediaFirst && mediaNode}

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: `${padding}em`,
          overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: `${contentScale}em` }}>{children}</div>
      </div>

      {!mediaFirst && mediaNode}
    </div>
  )
}

export default AdSplit
