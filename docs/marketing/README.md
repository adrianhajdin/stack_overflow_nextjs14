# TutorBoost ad library — runbook

How a creative gets from the repo to a live placement, and what stops it.

## The gate

Nothing here is publishable yet. Two things block it:

1. **The tutors are invented.** `SAMPLE_TUTORS` are preview fixtures — names,
   ratings, review counts, availability and bios are made up. They carry
   `isSample: true`, and every calendar row featuring one is marked `Blocked`.
2. **13 claims are unverified.** See the checklist at the top of `/ads`. While
   a claim is `null` in `constants/claims.ts` the creatives omit it, so an ad
   exported today is missing stat blocks rather than carrying invented ones.

Both are visible in the generated sheets, in the `Review status` and `Blocker`
columns. Filter for `Ready` before importing anything anywhere.

## Clearing the gate

1. Point `getAdTutors()` in `lib/ads/tutors.ts` at the real tutor collection.
   The mapper (`toAdTutor`) already handles the usual field-name variations.
2. Fill in `constants/claims.ts`. Each entry needs a value, a **source**
   specific enough to re-check, and an `asOf` date. Leave anything you cannot
   substantiate as `null` — the ads are designed to look right without it.
3. Confirm the four policy claims that were seeded from the brand artwork:
   the 15% rate, "forever", every lesson paid, no unpaid trials. These are
   currently sourced to "confirm against pricing page / tutor terms", which is
   not a source. They are the claims a customer would hold you to.
4. Reload `/ads`. The checklist turns green when nothing is outstanding.

## Planning sheets

Generated from the registry, so adding a template updates next week's plan
automatically. Download from `/ads`, or:

    /ads/plan?type=calendar          posting schedule
    /ads/plan?type=meta              Meta Ads Manager import sheet
    /ads/plan?type=google            Google Ads asset sheet

    &weeks=8&start=2026-09-07        optional

The calendar follows the weekly cadence already written into the TutorBoost
Content OS page in Notion — 2 short posts, 1 long form, 1 case study — mapped
to Tue / Wed / Thu / Fri. Templates rotate so no creative repeats week to week,
and the case-study slot always features one tutor via the spotlight template.

## Exporting the images

Each calendar row carries a `Render path`. Point a headless browser at it and
screenshot the `[data-ad-key]` element:

    /ads/render?template=tutor-spotlight&format=square&tutor=<id>

The creative is laid out at true pixel size, so the screenshot is the asset —
no scaling step. The `Creative key` column is the filename stem the import
sheets expect (`<key>.png`), so exports and campaign rows line up.

## Ad manager

There is no ad-manager integration in this workspace — no Meta, Google, TikTok
or LinkedIn Ads access. The sheets above are import files you upload by hand.

This matches the current plan on the TutorBoost Notion page, which lists paid
ads under "only after offer + funnel are proven" and Google Ads as Phase 2 with
API access still to be applied for.

Account, budget and audience columns are deliberately left blank in the import
sheets. Those are commercial decisions.

## Social publishing

Also not connected. The calendar is a schedule to work from, not a queue that
posts itself. If you want scheduled publishing, the usual route is Buffer /
Later / Meta Business Suite — all of which accept a CSV import in roughly the
shape of `type=calendar`.
