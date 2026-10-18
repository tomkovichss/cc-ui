# VideoCard — spec

Source: the list row in the Issues video list and the current code: `src/entities/Video/VideoCard/ui/VideoCard.tsx` over `src/shared/ui/BaseVideoCard/ui/BaseVideoCard.tsx`, types in `src/shared/types/video.ts`. Figma frames: new `25:198`, last opened `43:760`, seen `43:787` (CC-UI file). Where the frames and this spec disagree, **Figma wins on looks** (see Implementation notes); the spec still defines API and behaviour. Items marked **new** are not in the app today.
Target: new component `VideoCard` in `cattle-care-ui` (`src/components/VideoCard.tsx`, `VideoCard.module.css`, `VideoCard.stories.tsx`), exported from `src/index.ts`. Format follows `docs/Modal.spec.md`. Implemented; the app keeps its own `VideoCard` until it migrates.

## 1. Goal and scope

One row component for every "list of videos" screen, so the thumbnail, meta text, worker block, comment and bookmark look and behave the same everywhere. Today the row is split between `BaseVideoCard` (frame, thumbnail, comment, click handling) and thin wrappers that fill the middle (`VideoCard`, `EfficiencyVideoCard`, `RoutinesQualityVideoCard`, prep-lag and post-calving cards).

**In scope (cc-ui):** row surface (viewed / unviewed / last-opened), thumbnail with fallbacks, meta column slot, worker block, comment, trailing actions slot, keyboard and pointer activation, responsive layout, skeleton.
**Out of scope (stays in `farm-cattle-care-com`):** the `<Link>` wrapper and `handleVideoCardClick`, `lastViewedVideo` store, `FavoriteVideo` (bookmark) and its API call, category and score translation, date formatting (`formatVideoTime`), the archive-by-age rule (see §3, passed in as a prop), the other wrappers' middle content (efficiency, routines, prep-lag).

## 2. API

Current props (`VideoCardProps` + `BaseVideoCard`):

```tsx
interface Video { dateTime, category, note, score, comment, isViewed, employee, ... }   // Partial<Video>
interface VideoCardProps extends Partial<Video> {
  preview: string          // required
  uuid: number             // required
  onClick?: () => void
  className?: string
  extraOptions?: ReactNode
}
```

Proposed cc-ui API: presentational only, no store, no `dayjs`, no translations, no `next/image`.

```tsx
interface VideoCardProps {
  /** Thumbnail URL. */
  preview: string
  /** Shown if `preview` fails; the card does not decide between inaccessible and archived. */
  previewFallback?: 'inaccessible' | 'archived'        // default 'inaccessible'
  onPreviewError?: () => void                         // lets the app log or switch the fallback
  /** Already formatted. */
  dateTime?: string
  title?: ReactNode                                   // category
  description?: ReactNode                             // note
  meta?: ReactNode                                    // extra lines under the title (severity)
  worker?: { name: string; photo?: string; pending?: boolean }
  comment?: string
  viewed?: boolean                                    // default false → tinted
  current?: boolean                                   // last opened glow
  onClick?: () => void                                // makes the row role="button"
  actions?: ReactNode                                 // trailing slot (bookmark)
  labels?: { worker: string; comment: string; pending: string; inaccessible: string; archived: string }
  className?: string
  'data-testid'?: string
}
```

Notes:
- The app keeps a thin adapter in `src/entities/Video/VideoCard` with the old props (`employee`, `isViewed`, `uuid`, `extraOptions`) so `VideosList`, `RecommendationsVideosList` and the other wrappers do not change.
- `BaseVideoCard` becomes `VideoCard` with `children` replaced by `title` / `description` / `meta` slots; the wrappers that pass free-form children (`EfficiencyVideoCard`, `RoutinesQualityVideoCard`) get a `children` escape hatch for the middle column until they are migrated.
- Keep `data-testid="video-card-{uuid}"` default in the adapter: e2e depends on it.
- Strings "Worker:", "Comment:", "card still in progress" are hard-coded English today; the cc-ui component takes them through `labels` and the app passes translations.

## 3. Behaviour

- **Activation:** if `onClick` is set the row is `role="button"`, `tabIndex=0`, `aria-label="Video {comment}"` or `"Video {uuid}"`; Enter and Space activate (Space `preventDefault`). With no `onClick` the row is a plain `div`. In the app the row sits inside a `<Link>`, so navigation comes from the link and the row itself usually has no `onClick`; the **new** cc-ui version must not nest an interactive role in a link when `onClick` is absent (already true).
- **Bookmark:** the trailing slot sits inside the clickable row. Clicking it must not open the video (stop propagation lives in `FavoriteVideo` today; verify, and in cc-ui document that `actions` content owns this).
- **Thumbnail fallback chain** (app logic, to be kept in the adapter): `preview` fails → no `dateTime`: Inaccessible; `dateTime` less than 30 days old: Inaccessible; 30 days or older: **Archived**. If the static fallback also fails, stop (no loop). The date is parsed from the part before the first comma. cc-ui takes the result as `previewFallback`; the 30-day rule is not in the component.
- **Date-time:** the app formats with `formatVideoTime` (short date, then the rest after the comma, e.g. "Oct 09, 12:32AM"). cc-ui receives the string.
- **Worker photo:** if the photo fails, swap to `WorkerEmptyImage.svg` and show "card still in progress" under the name. cc-ui: `worker.pending` plus an empty-avatar state; the swap happens in the component on `onError`.
- **Unviewed / viewed:** `isViewed === false` → tinted. Undefined counts as unviewed (`!isViewed`), keep that.
- **Last opened:** `current` when the store's `lastViewedVideo.id === uuid`.
- **Responsive:** the worker block hides below `lg`; the grid wraps by auto-fit at 200 px columns. **New:** below `sm` the row stacks thumbnail on top of text, or keeps the 72 × 48 thumbnail left with one text column (decision for design; see §9).
- **Truncation:** comment is one line with ellipsis; category and note wrap. **New:** give the note `line-clamp-2` so one long note does not make a row taller than its neighbours.
- **Image loading:** lazy and async; the first rows may need `priority` (**new**, optional).

## 4. States

| State | Look |
|---|---|
| Default, unviewed | tinted fill, all parts |
| Viewed | transparent fill |
| Last opened | inset blue glow |
| Hover | **new**: `--depth-5` overlay (none today; whole row is a link) |
| Focus-visible | **new**: 2 px focus ring inset (none today) |
| Pressed | none |
| No worker | grid has meta + comment only (Efficiency, Routines, Post-calving, Prep-lag lists; in Issues the worker shows only for `sourceEvent === 'issues'`) |
| No comment | empty placeholder cell |
| Severity 1-3 | extra line |
| Preview inaccessible / archived | grey tile with lock icon / archive icon and caption |
| Worker photo failed | empty avatar + "card still in progress" |
| Loading | **new**: `VideoCard.Skeleton`, 72 × 48 block + 3 text bars (reuse cc-ui `Skeleton`) |
| Disabled | not applicable |

## 5. Accessibility

- Thumbnail `alt`: "Video preview: {comment}" or "Video preview {uuid}"; once the fallback tile shows, alt should say that the preview is unavailable (**new**, today it keeps the old alt).
- Worker photo `alt` is "Photo of {name}" (English, not translated today); take it from `labels`.
- Row name is "Video {comment}" only when interactive; when wrapped in a link the link text comes from the content, which is long and repetitive ("Towel accidents Face and then cow (1) ..."). Consider `aria-label` on the link in the app (**new**).
- The tint is the only "unviewed" signal. **New:** add a visually hidden "New" text or a small dot so it is not colour only.
- Contrast: `text-tertiary` on the blue tint must meet AA (check with the final tint value).
- Touch target: the bookmark button must be at least 44 × 44 inside the row.

## 6. Tokens

Map only to existing cc-ui tokens, **add no new colours** except the two flagged.

| Now | cc-ui |
|---|---|
| `border-strokes` | `--border` (or keep `--strokes` if cc-ui has it) |
| `bg-fix-my-name-and-darkmode` | **missing** — add `--card-unviewed` (current value is a light blue, about `#E8F3FC` in the screenshot) |
| glow `rgba(0,144,217,1)` | **missing** — add `--card-current-ring` or reuse a brand token |
| `text-tertiary / secondary / primary` | same names |
| `label-md`, `body-md` | cc-ui type scale (medium weight 550) |
| radius 4 (thumb) / 12 (avatar) | `--radius-xs`/own px / `--radius-base` |
| grey "Inaccessible" tile | `--depth-5` fill, `--text-tertiary` |
| spacing 4 / 16 / 20 | px in the CSS |

Dark theme: the token is literally named `...-and-darkmode`, so the app has a dark value for the unviewed fill. Ship it as part of `--card-unviewed` in both themes.

## 7. Storybook and tests

`VideoCard.stories.tsx`:
1. **Playground** with all props.
2. **Unviewed / viewed / current**.
3. **With worker, without worker**, worker photo failed.
4. **With comment, no comment**, very long comment, very long note.
5. **Severity 1, 2, 3** and absent.
6. **Preview fallbacks**: inaccessible, archived, broken URL.
7. **With bookmark action**, bookmarked and not.
8. **Mobile** viewport.
9. **List**: ten rows to check the dividers and column alignment (the screenshot is the reference).
10. **Skeleton**.

The existing story `src/entities/Video/VideoCard/ui/VideoCard.story.tsx` has two stories (`Common`, `WithComment`); the `WithComment` text there is not suitable to carry over.

Tests (vitest, in cc-ui):
- Enter and Space activate; no role when `onClick` is absent
- image error swaps to the fallback and does not loop
- worker photo error shows the pending line
- `viewed`, `current` classes
- worker block hidden below `lg` (class contract)
- comment placeholder keeps the grid cell count

App side (vitest): adapter maps `isViewed`, `employee`, `extraOptions`; 30-day rule gives `archived` / `inaccessible`; the severity line shows only for scores 1 to 3.

## 8. Migration in `farm-cattle-care-com`

Rule from the cc-ui migration: only chrome changes; handlers and values that reach the backend stay identical.

1. Publish cc-ui with `VideoCard`; bump the dependency.
2. Rewrite `BaseVideoCard` as an adapter over cc-ui `VideoCard` (keeps `useClientStore`, `dayjs` fallback rule, `getStaticFile`, `data-testid`). `VideoCard` wrapper fills `title` / `description` / `meta` / `worker`.
3. Migrate the other wrappers one at a time: `EfficiencyVideoCard`, `RoutinesQualityVideoCard`, `PrepLagTimeVideoCard`, `PostCalvingDelayVideoCard` (the last two have their own image-fallback code, duplicated from `BaseVideoCard`: remove the copies).
4. Visible changes to expect: hover and focus states, "New" marker, two-line note clamp, mobile layout, localised labels.
5. `VideosList` and `RecommendationsVideosList` are unchanged (same props through the adapter).

Used in: `VideosList`, `RecommendationsVideosList`, `VideosThroughput`, `RoutinesQualityVideos`, `PrepLagTimeVideos`, `PostCalvingDelayVideos`, `EfficiencyCard` (via the wrappers).

## 9. Open questions for design

- Mobile layout below `lg`: the worker block is hidden now; is that intended, or should a small avatar show?
- Colour of the severity line and whether it needs an icon.
- The unviewed tint plus "New" marker, and the hover / focus look.
- Should the bookmark sit top right (as in the screenshot) or vertically centred on narrow widths?
- Archived tile: new artwork or the current `VideoArchived.png`.

## 10. Release checklist

- [ ] `VideoCard.tsx`, `VideoCard.module.css`, `VideoCard.stories.tsx`, tests
- [ ] Tokens `--card-unviewed` (light and dark), `--card-current-ring` added
- [ ] Export from `src/index.ts`; add to the component list in `AGENTS.md`
- [ ] Lint, typecheck, build (`dist`), Storybook build, tests pass
- [ ] Version bump; publish via GitHub Release (done by the user)
- [ ] App side: bump `cattle-care-ui`, ship adapter, e2e on `video-card-{uuid}` and the list navigation

## 11. Acceptance criteria

- The Issues list renders as in the screenshot (thumbnail tile, date, category, note, worker block, bookmark, 1 px dividers) within a few px.
- Every consumer keeps working through the adapter with no prop changes; e2e selectors still match.
- Broken previews end in a fallback tile and never loop; the 30-day archived rule is unchanged.
- Keyboard: Tab reaches each row, Enter and Space activate, focus is visible.
- Unviewed is distinguishable without colour.

## 12. Implementation notes (differences from the sections above)

- **Unviewed** = white card plus a blue "New" badge under the thumbnail (Figma), not a tinted fill. No `--card-unviewed` token was added. `viewed` unset still counts as unviewed.
- **Hover / press / focus** are the `Card` ones: 2 px `--brand-main` ring, `:active` scale, 2 px focus outline; only when `onClick` is set. No `--depth-5` overlay.
- **Last opened** reuses `--brand-main-30` (inset 2 px); no `--card-current-ring` token.
- `labels` also has `new`; defaults are English (`Worker:`, `Comment:`, ...). Extra props: `previewAlt`, `aria-label`.
- Tests: none yet; Storybook `play` functions cover keyboard activation, bookmark not activating the row, and the broken-preview fallback.
- Open design points from section 9 remain open (mobile avatar, severity colour, archived artwork).
