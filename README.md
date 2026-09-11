# cattle-care-ui

Shared, presentational React components extracted from [cc-workers-schedule](../cc-workers-schedule), for reuse across other Cattle Care projects (e.g. `cattle-care`, `cc-farmer-ui`).

## What's here

- `src/components/` — presentational components (props in, JSX out, CSS Modules). No app state, no data-layer imports.
- `src/styles/tokens.css` — shared design tokens (CSS custom properties: colors, surfaces, borders).
- `src/utils/format.ts` — small formatting helpers.
- `src/index.ts` — the package's public entry point (barrel export).

Components are typed and documented via Storybook stories (`*.stories.tsx`) colocated next to each component.

### Font

Components assume the **Inter** font (400/500) is loaded by the consuming app, e.g.:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />
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
| `Checkbox` | Custom animated checkbox |
| `HighlightText` | Wraps matching substrings in `<mark>` |
| `FilterSection` | Generic labeled option list with optional search + select-all |
| `UiElementsSidebar` | Static nav sidebar for a component catalog page |
| icons (`ChevronLeftIcon`, etc.) | Inline SVG icon set |

More components from the source app (`Board`, `ShiftCard`, `VideoPanel`, etc.) are coupled to app-specific state/data and haven't been extracted yet — they'd need a props/callback-driven refactor first.
