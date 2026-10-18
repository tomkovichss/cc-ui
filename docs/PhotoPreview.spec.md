# PhotoPreview — spec

Source: the worker-photo hover already built into `VideoCard` (commit `ffb165c`, "120px worker photo preview on hover"), and a local copy of it in `farm-cattle-care-com` for the workers table (`WorkerPhotoPreview.tsx`, trigger = the worker name cell).
Target: new component `PhotoPreview` in `cattle-care-ui` (`src/components/PhotoPreview.tsx`, `PhotoPreview.module.css`, `PhotoPreview.stories.tsx`), exported from `src/index.ts`. `VideoCard` is refactored to use it.

## 1. Goal and scope

An enlarged photo that appears next to the mouse cursor while the pointer is over a trigger element. One implementation instead of two (VideoCard internals and the app's workers table).

**In scope:** pointer tracking, portal rendering, viewport flipping, dismissal on scroll/resize, broken-image handling, the refactor of `VideoCard` onto it, Storybook page.
**Out of scope (stays in `farm-cattle-care-com`):** which element is the trigger and which rows have photos, row click and navigation, the workers-table markup. Touch/keyboard preview, lightbox / click-to-zoom.

## 2. Visual (taken from the existing VideoCard preview, do not redesign)

| Part | Value |
|---|---|
| Size | 120 × 120 px (prop `size`, default 120) |
| Radius | 16 px |
| Fit | `object-fit: cover` |
| Shadow | `0 4px 16px rgba(0, 0, 0, 0.16)` |
| Offset from cursor | 12 px on both axes |
| Viewport margin | 8 px |
| z-index | 1000 (above sticky table cells, modals excluded) |
| Pointer events | `none` (the preview never steals hover from the trigger) |

Move the three constants (`SIZE`, `OFFSET`, `MARGIN`) and `photoPreviewPosition` out of `VideoCard.tsx` into the new file; keep the values.

## 3. API

Same shape as `Tooltip`: it wraps one element and attaches pointer handlers to it, so the trigger can be a `<td>`, an `<img>`, a button, etc.

```tsx
interface PhotoPreviewProps {
  /** Photo URL. Missing, empty or broken: nothing is shown and the child renders untouched. */
  src?: string;
  /** Preview side length in px. Default 120. */
  size?: number;
  /** A single element that accepts pointer handlers. */
  children: ReactElement<{
    onPointerEnter?: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove?: (e: PointerEvent<HTMLElement>) => void;
    onPointerLeave?: (e: PointerEvent<HTMLElement>) => void;
  }>;
}
```

Usage in the app:

```tsx
<PhotoPreview src={worker.photo}>
  <td className="...">{worker.name}</td>
</PhotoPreview>
```

Notes:
- `cloneElement` merges handlers: the child's own `onPointerEnter` / `onPointerMove` / `onPointerLeave` still run (call them first, then ours), as `Tooltip` does.
- No `ref` is needed (position comes from `clientX/clientY`), unlike `Tooltip`.
- No wrapper element is added, so it is safe inside `<tr>` / `<table>`.
- `VideoCard` calls it around the worker avatar `<img>` and drops its own `cursor` state, effect and portal.

## 4. Behaviour

- **Show:** on `pointerenter` and `pointermove` with `pointerType === 'mouse'` only. Touch and pen never open it (hover does not exist there).
- **Follow:** the preview tracks the cursor on every `pointermove`; position is `photoPreviewPosition(x, y)` (existing logic): beside the cursor, flipped to the other side when it would overflow the right or bottom edge, never closer than the margin to the left or top.
- **Hide:** on `pointerleave`, and on any `scroll` (capture phase, so scrolling any ancestor counts) or window `resize`, since fixed coordinates go stale. The listeners exist only while the preview is open.
- **Broken image:** on `onError` of the preview `<img>` remember the failed `src`; do not show it again until `src` changes. No placeholder.
- **Render:** `createPortal(..., document.body)`, `position: fixed`, so it is never clipped by `overflow` of the table scroll container.
- **Server-safe:** the portal and `window` access only run after a pointer event, so nothing breaks on SSR (the bundle is `'use client'`).
- **Unmount while open:** the preview disappears with the component (state lives inside it).

## 5. Accessibility

- The preview is decorative: `alt=""` and `aria-hidden="true"`. The worker name is already the trigger's text.
- It does not open on keyboard focus. It is an enhancement, not the only way to see the photo (the photo is also in the worker profile and the card).
- Reduced motion: no animation is used, so nothing to disable. If a fade-in is added later, it must respect `prefers-reduced-motion`.

## 6. Tokens

Reuse the existing `.photoPreview` rules from `VideoCard.module.css` (move them to `PhotoPreview.module.css`). No new colour tokens; the shadow literal is the one already accepted in `VideoCard`.

## 7. Storybook

`PhotoPreview.stories.tsx`:
1. **Playground** with controls for `src` and `size`.
2. **On a table row**: a small table with a sticky first column, hover on the name cell shows the photo (checks the portal is not clipped by `overflow-x: auto`).
3. **Viewport edges**: triggers placed at the right and bottom of the story so the flip is visible.
4. **Broken and missing `src`**: nothing appears, child unchanged.

## 8. Release checklist

- [ ] `PhotoPreview.tsx`, `PhotoPreview.module.css`, `PhotoPreview.stories.tsx`
- [ ] Export from `src/index.ts`
- [ ] Refactor `VideoCard` onto `PhotoPreview`; behaviour and look unchanged (check the existing VideoCard story)
- [ ] Add `PhotoPreview` to the component list in `AGENTS.md`
- [ ] Lint, typecheck, build (`dist`) and Storybook build pass
- [ ] Version bump; publish via GitHub Release (done by the user)
- [ ] App side: bump `cattle-care-ui` in `farm-cattle-care-com`, replace `WorkerPhotoPreview.tsx` and the `useWorkerPhotoPreview` wiring in `WorkersTable.tsx` with `<PhotoPreview src={worker.photo}>` around the name `<td>`, delete the local file

## 9. Acceptance criteria

- Hovering the trigger with a mouse shows a 120 px photo next to the cursor and it follows the cursor; leaving, scrolling or resizing hides it.
- Near the right or bottom edge it flips to stay on screen.
- Not clipped inside a horizontally scrolling table, and shown above sticky cells.
- Touch and pen pointers do not open it. No `src`, or a broken one, shows nothing.
- The trigger's own pointer handlers still fire.
- `VideoCard` looks and behaves exactly as before after the refactor.
