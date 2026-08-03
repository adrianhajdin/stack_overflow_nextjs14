import React from 'react'
import type { AdIconName } from '@/types/ads'
import { BRAND_COLORS } from '@/constants/brand'
import AdIcon from './AdIcon'

export interface AdSubject {
  icon: AdIconName
  name: string
  detail: string
}

interface AdSubjectGridProps {
  subjects: AdSubject[]
  size?: number
  /** Columns per row. The list wraps when it runs out. */
  columns?: number
}

/** The "Find the right tutor for you" subject strip on the student poster. */
const AdSubjectGrid = ({
  subjects,
  size = 1.15,
  columns = 6,
}: AdSubjectGridProps) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      backgroundColor: BRAND_COLORS.orangeSoft,
      borderRadius: `${size * 1.4}em`,
      padding: `${size * 1.6}em ${size * 0.6}em`,
    }}
  >
    {subjects.map((subject, i) => (
      <div
        key={subject.name}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${size * 0.55}em`,
          padding: `0 ${size * 0.9}em`,
          textAlign: 'center',
          borderRight:
            (i + 1) % columns !== 0 && i < subjects.length - 1
              ? `0.05em solid ${BRAND_COLORS.orangeTint}`
              : undefined,
        }}
      >
        <AdIcon name={subject.icon} size={`${size * 2.1}em`} />

        <span
          style={{
            fontSize: `${size * 1.18}em`,
            fontWeight: 700,
            color: BRAND_COLORS.ink,
            lineHeight: 1.2,
          }}
        >
          {subject.name}
        </span>

        <span
          style={{
            fontSize: `${size * 0.95}em`,
            color: BRAND_COLORS.inkSoft,
            lineHeight: 1.3,
          }}
        >
          {subject.detail}
        </span>
      </div>
    ))}
  </div>
)

export default AdSubjectGrid
