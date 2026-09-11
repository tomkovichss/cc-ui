# cattle-care-ui

Shared, presentational React components extracted from [cc-workers-schedule](../cc-workers-schedule), for reuse across other Cattle Care projects (e.g. `cattle-care`, `cc-farmer-ui`).

## What's here

- `src/components/` — presentational components (props in, JSX out, CSS Modules). No app state, no data-layer imports.
- `src/styles/tokens.css` — shared design tokens (CSS custom properties: colors, surfaces, borders).
- `src/utils/format.ts` — small formatting helpers.
- `src/index.ts` — the package's public entry point (barrel export).

Components are typed and documented via Storybook stories (`*.stories.tsx`) colocated next to each component.

### Font

Components assume the **Inter** font is loaded by the consuming app. Load the variable weight range (not a discrete list) so any `font-weight` value — including in-between ones like `450` — renders correctly instead of snapping to the nearest loaded static weight:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
```

It is not bundled with this package.

## Development

```bash
npm install
npm run storybook       # dev server at http://localhost:6006
npm run build-storybook # static build to storybook-static/
npm run typecheck
```

## Visual review (Chromatic)

This repo has the `@chromatic-com/storybook` addon and a `chromatic` script wired up. To connect it to a project:

1. Sign up / log in at [chromatic.com](https://www.chromatic.com/) with this GitHub repo.
2. Copy the generated **project token**.
3. Run locally: `CHROMATIC_PROJECT_TOKEN=<token> npm run chromatic`
   — or add it as a `CHROMATIC_PROJECT_TOKEN` secret in GitHub Actions for CI-based publishing on every push.

## Adding a component

1. Move the component + its `.module.css` into `src/components/`, with app-specific state/context replaced by props/callbacks.
2. Add a `<Component>.stories.tsx` next to it.
3. Export it from `src/index.ts`.
4. Run `npm run typecheck` and `npm run build-storybook` to verify.

## Consuming from another project

Distribution (npm registry vs. git dependency) hasn't been set up yet — pick one when a second project needs to consume this package:

- **npm via GitHub Packages**: publish with a GitHub Actions workflow on tag/release, install with `npm install @<scope>/cattle-care-ui`.
- **Git dependency**: `npm install github:tomkovichss/cattle-care-ui`, no publish step, but versioning is by commit/tag only.

## Components currently included

| Component | Notes |
|---|---|
| `Button` | `primary`/`secondary`/`tertiary` variants with ripple-fill hover (originally from `ConfirmDialog`'s `.btn-primary`/`.btn-secondary` global classes), `sm`/`base`/`lg` sizes, disabled state |
| `Card` | Visual shell only (surface, radius, hover ring, `completed`/`stacked`/`interactive`/`dragging` states), generalized from `ShiftCard`. Drag-and-drop and content stay with the consumer. |
| `Tag` | Generalizes the repeated tag/pill/badge pattern found in `ShiftCard`, `WorkerRow`, `BpoRow`, `BacklogSidebar`, `VideoPanel`, `AppHeader`, `FiltersMenu`. Variants: `neutral`, `pill`, `accent`, `success`, `danger`, `count`. |
| `Toolbar` | Visual shell only (floating search bar, keyboard-shortcut badge, `children` slot for filter/sort controls), generalized from `Toolbar`. The original's `FiltersBar` content and absolute page positioning stay with the consumer — this only ships the search input + layout shell. |
| `Checkbox` | Custom animated checkbox |
| `HighlightText` | Wraps matching substrings in `<mark>` |
| `FilterSection` | Generic labeled option list with optional search + select-all |
| `UiElementsSidebar` | Static nav sidebar for a component catalog page |
| icons (`ChevronLeftIcon`, etc.) | Inline SVG icon set |

More components from the source app (`Board`, full `ShiftCard` composition, `VideoPanel`, etc.) are coupled to app-specific state/data and haven't been extracted yet — they'd need a props/callback-driven refactor first.

### Notes on token cleanup

While extracting `Tag`, two untokenized colors from the source app were reconciled:
- `#e3f6ea` / `#2f8a52` (success bg/text, used for "completed"/"time spent" states) → added as `--success-bg` (paired with the existing `--success-text`).
- `#fbe2e2` / `#b23a3a` (a second, undocumented "danger" pair used for the idle-worker stat) → consolidated into the existing `--danger-bg`/`--danger-text` tokens rather than kept as a duplicate. If the source app's visual distinction between these two reds was intentional, flag it before porting `Tag`'s danger variant back.

`Button`'s primary variant originally used `--accent` (`#0090d9`) as its idle background with white text — only ~3.5:1 contrast, failing WCAG AA for normal text (4.5:1 required). Its idle background now uses the darker `--accent-hover` (`#007ebd`, ~4.6:1, passes AA); the hover/press ripple fill uses translucent white/black (`rgba(255,255,255,0.08)` / `rgba(0,0,0,0.08)`) instead of a solid color.
