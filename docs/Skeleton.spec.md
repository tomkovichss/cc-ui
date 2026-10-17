# Skeleton — spec

Source: mockup of a three-column page placeholder (profile card, feed cards, icon + two-line list) shared by the product owner; no Figma node yet.
Target: new component `Skeleton` in `cattle-care-ui` (`src/components/Skeleton.tsx`, `Skeleton.module.css`, `Skeleton.stories.tsx`), exported from `src/index.ts`.

## 1. Goal and scope

A presentational grey placeholder block shown instead of a spinner while content loads. It is a primitive: one block, no page layouts.

**In scope:** the block itself (rect / text / circle), pulse animation, reduced-motion handling, accessibility attributes, a Storybook page that composes it into the mockup layout.
**Out of scope (stays in `farm-cattle-care-com`):** page and widget skeletons (`WorkersPageSkeleton`, `EfficiencyCardSkeleton`, ...), `loading.tsx` wiring, `Suspense` / `isLoading` switching, delayed display (anti-flicker).

## 2. Visual (from the mockup)

| Part | Value |
|---|---|
| Page background | `--bg` (#f7f7f7) |
| Card surface | white |
| Placeholder fill on white cards | `--surface-muted` (#e5e7e9) at rest; verify against mockup (≈ #e6ebf1) and pick the nearest existing token, do not add a literal |
| Text line height | 14 px (mockup bars 14 px high), `--radius-xs`-or-smaller; use 4 px |
| Rect radius | `--radius-xs` (8 px) by default, overridable |
| Circle | `border-radius: 50%` |
| Avatar sizes seen | 96 (profile), 40 (feed) |
| Icon tile sizes seen | 48 square, `--radius-xs` |

Open question for design: the profile banner uses a darker grey (≈ #d1d9e0) than the other blocks. Either add a `tone="strong"` prop or let consumers pass a class. Default proposal: ship one tone, add `tone` only if design confirms.

## 3. API

```tsx
type SkeletonVariant = 'rect' | 'text' | 'circle';

interface SkeletonProps {
  /** `rect` (default) is a block, `text` is a 14px-high line with a small radius, `circle` is round. */
  variant?: SkeletonVariant;
  /** Width and height. Number = px, string = any CSS length. For `circle`, `size` sets both. */
  width?: number | string;
  height?: number | string;
  /** `circle` only: shorthand for width = height. */
  size?: number | string;
  /** Turn the pulse off, e.g. for a screenshot or when many blocks are on screen. */
  animated?: boolean; // default true
  className?: string;
  'data-testid'?: string;
}
```

Notes:
- Default size: `rect` fills its parent width and 16 px high, `text` fills width and 14 px, `circle` 40 px. Consumers size it through props or `className`; no fixed pixel sizes baked into layouts.
- Only `width` / `height` / `size` go to inline `style`; everything else is CSS Module classes. Class order follows `Spinner`: `[styles.skeleton, styles[variant], className]`.
- Optional helper in the same file: `SkeletonGroup` is **not** part of v1. Keep the API to one component.

## 4. Behaviour

- **Animation:** opacity pulse, `1 → 0.5 → 1`, 1.5 s, `ease-in-out`, infinite. Pure CSS keyframes (no JS).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables the animation and leaves a static block (a skeleton does not need motion to be understood).
- **No layout of its own:** `display: block`, no margin. Spacing comes from the parent (`gap`).
- **Server-safe:** no hooks, no state, no browser APIs. It must render inside a server `loading.tsx`. (The bundle already starts with `'use client'` since 0.1.19; that must still be fine.)
- **Forced colors:** the fill is a token, so nothing special is needed; check in a forced-colors emulation that the block does not vanish, and if it does, add a `1px` transparent outline.

## 5. Accessibility

- The block is decorative: `aria-hidden="true"`. It carries no role and no label.
- The announcement belongs to the container that the consumer renders: `aria-busy="true"` on the loading region and, when needed, a visually hidden `role="status"` text. Document this in the story; do not build it into `Skeleton`.
- Contrast is intentionally low (placeholder, not content); no WCAG contrast requirement applies to `aria-hidden` decorative elements.

## 6. Tokens

Reuse existing tokens only: `--surface-muted` (fill), `--radius-xs` (rect), `--bg` (story background). Add no new colour tokens. If the mockup shade differs from `--surface-muted`, raise it with design rather than hard-coding a literal (the Spinner brand blues are the only accepted literal exception).

## 7. Storybook

`Skeleton.stories.tsx` (match the style of `Spinner` / `Card` stories):
1. **Playground** with controls for `variant`, `width`, `height`, `size`, `animated`.
2. **Variants**: rect, text, circle side by side.
3. **Composition** reproducing the mockup: profile card, two feed cards (avatar + two text lines + two body lines), three icon-tile rows. This is the reference the app-side page skeletons are checked against.
4. **Reduced motion** note in the docs block.

## 8. Release checklist

- [ ] `Skeleton.tsx`, `Skeleton.module.css`, `Skeleton.stories.tsx`
- [ ] Export from `src/index.ts`
- [ ] Add `Skeleton` to the component list in `AGENTS.md`
- [ ] Lint, typecheck, build (`dist`) and Storybook build pass
- [ ] Version bump; publish via GitHub Release (done by the user)
- [ ] App side: bump `cattle-care-ui` in `farm-cattle-care-com`, build the workers skeleton as the pilot

## 9. Acceptance criteria

- Three variants render and size correctly from props and from `className`.
- Pulse runs by default, stops with `animated={false}` and under `prefers-reduced-motion`.
- Renders without errors inside a server component / `loading.tsx` in the app.
- The composition story matches the mockup layout within a few px.
- No new tokens and no literal colours in the CSS.
