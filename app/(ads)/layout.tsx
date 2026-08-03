import React from 'react'

/**
 * Bare layout for the ad tooling: no navbar, no sidebars.
 *
 * Creatives are laid out at true pixel sizes, so any app chrome would fight
 * with them — and the export route needs a page containing nothing but the ad.
 */
const AdsLayout = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-light-800">{children}</main>
)

export default AdsLayout
