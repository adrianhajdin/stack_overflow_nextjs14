import React from 'react'
import type { AdIconName } from '@/types/ads'
import { BRAND, BRAND_COLORS } from '@/constants/brand'
import AdIcon from './AdIcon'

export interface AdComparisonRow {
  icon?: AdIconName
  label: string
  /** What TutorBoost does. Always present — it is our own verified policy. */
  us: string
  /**
   * What other platforms do. Present only when a sourced competitor claim
   * backs it; the column disappears entirely when nothing is sourced.
   */
  them?: string
}

interface AdComparisonTableProps {
  rows: AdComparisonRow[]
  size?: number
  themLabel?: string
  usLabel?: string
}

/**
 * The terms table.
 *
 * With sourced competitor data it runs two columns, us against them. Without
 * it the competitor column is dropped and the table simply states TutorBoost's
 * own terms — which is the honest version of the same creative rather than a
 * broken one. A row whose competitor value is unsourced shows an em dash.
 */
const AdComparisonTable = ({
  rows,
  size = 1.35,
  themLabel = 'Other platforms',
  usLabel = BRAND.name,
}: AdComparisonTableProps) => {
  const showThem = rows.some((row) => row.them !== undefined)

  const cell: React.CSSProperties = {
    // Relative to the cell's own font-size, already `${size}em`.
    padding: '0.72em 0.85em',
    fontSize: `${size}em`,
    lineHeight: 1.25,
    verticalAlign: 'middle',
  }

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
      }}
    >
      <thead>
        <tr>
          <th style={{ ...cell, width: showThem ? '38%' : '55%' }} />
          {showThem && (
            <th
              style={{
                ...cell,
                fontWeight: 600,
                color: BRAND_COLORS.inkSoft,
                textAlign: 'center',
                backgroundColor: BRAND_COLORS.white,
              }}
            >
              {themLabel}
            </th>
          )}
          <th
            style={{
              ...cell,
              fontWeight: 700,
              color: BRAND_COLORS.white,
              textAlign: 'center',
              backgroundColor: BRAND_COLORS.orange,
            }}
          >
            {usLabel}
          </th>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <td
              style={{
                ...cell,
                borderTop: `0.05em solid ${BRAND_COLORS.hairline}`,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5em',
                  fontWeight: 600,
                  color: BRAND_COLORS.ink,
                }}
              >
                {row.icon && <AdIcon name={row.icon} size="1.35em" />}
                {row.label}
              </span>
            </td>

            {showThem && (
              <td
                style={{
                  ...cell,
                  textAlign: 'center',
                  color: BRAND_COLORS.inkSoft,
                  backgroundColor: BRAND_COLORS.white,
                  borderTop: `0.05em solid ${BRAND_COLORS.hairline}`,
                }}
              >
                {row.them ?? '—'}
              </td>
            )}

            <td
              style={{
                ...cell,
                textAlign: 'center',
                fontWeight: 700,
                color: BRAND_COLORS.orange,
                backgroundColor: BRAND_COLORS.orangeSoft,
                borderTop: `0.05em solid ${BRAND_COLORS.orangeTint}`,
              }}
            >
              {row.us}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default AdComparisonTable
