# AGENTS.md

Instructions for AI coding agents installing and using **cattle-care-ui** in another repository.

## Install

```sh
npm install cattle-care-ui react react-dom
```

`react` and `react-dom` are peer dependencies (`^19.0.0`). If the target project is on an older
React major, do not force-install — flag the version mismatch to the user instead of proceeding.

## Wire it up

1. Import the compiled stylesheet **once**, in the app's root entry point (e.g. `main.tsx`,
   `App.tsx`, or a root layout file). Do this before any of the app's own global stylesheets if
   the app defines CSS custom properties with the same names as this library's tokens
   (`--text-primary`, `--border`, `--brand-main`, etc. — see `src/styles/tokens.css` in this repo
   for the full token list) so precedence is intentional rather than accidental:
   ```ts
   import 'cattle-care-ui/style.css';
   ```
2. Import components as named exports from the package root — there are no subpath imports per
   component:
   ```tsx
   import { Button, Tabs, Card } from 'cattle-care-ui';
   ```
3. No bundler configuration is required for this package. All CSS Modules used internally are
   pre-compiled into the single stylesheet from step 1 — do **not** add `*.module.css` loader
   config on the consumer's account of this package; that's only relevant if the consumer's own
   app code separately uses CSS Modules.

## Components available

Import names match the ones re-exported from `src/index.ts` in this repo: `Button`, `Card`, `Tag`,
`Toolbar`, `Checkbox`, `RadioButton`, `TextField`, `Menu`, `MenuDivider`, `MenuItem`,
`HighlightText`, `FilterSection`, `UiElementsSidebar`, `Tabs`, plus utility functions
`formatDuration`, `formatDurationHMS`. Check each component's props via the generated `.d.ts` types
(editor autocomplete/hover) rather than guessing — the published package includes full TypeScript
declarations.

## Font requirement

Components assume the **Inter** variable font is loaded by the consuming app (not bundled with
this package). Load the full weight range so intermediate `font-weight` values render correctly:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
```

## Known limitation

This library's design tokens are plain, unprefixed CSS custom properties (`--text-primary`,
`--border`, `--brand-main`, ...) declared at `:root`. If the consuming app already defines global
variables with the same names, whichever stylesheet is imported last wins for those names — there
is no namespacing. If a collision causes visibly wrong theming, check import order first before
assuming a bug.

## Do not

- Do not vendor/copy component source files into the consuming repo instead of installing the
  package — that defeats the point of having a shared, versioned design system and causes drift.
- Do not modify `node_modules/cattle-care-ui` directly to "fix" something — if a component has a
  bug or is missing a variant/prop, make that change in this repo (`cattle-care-ui`) and publish a
  new version instead.
- Do not guess prop names or shapes — read the `.d.ts` types or the corresponding `.stories.tsx`
  file in this repo for real usage examples.
