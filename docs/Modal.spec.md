# Modal — spec

Source: Figma `CattleCare — Farmer UI (2026)`, page "Page 10", node `142:9861` (frame `Modal Dialog` with `Type=vertical / horizontal / Mobile`, plus "Placement" and "Dialog Guidelines"). The file is built on **another design system** (font Trigonix, tokens like `surface/border`, `spacing/6`, `brand/600`): take structure, proportions and behaviour from it, map colours / radii to cc-ui tokens (§6). Current app behaviour comes from `src/shared/ui/Modals` (`ActionModal`, `FormModal`, `FullScreenModal`, base `TemplateModal`).
Target: new components `Modal` and `ConfirmDialog` in `cattle-care-ui` (`src/components/Modal.tsx`, `Modal.module.css`, `Modal.stories.tsx`, `ConfirmDialog.tsx`), exported from `src/index.ts`. Format follows `docs/Skeleton.spec.md` in cc-ui; copy this file there when the work starts.

## 1. Goal and scope

Replace the three hand-rolled Tailwind modals with one cc-ui primitive that matches the new dialog design, so every dialog in the app looks and behaves the same and new windows are assembled from parts.

**In scope (cc-ui):** window surface, backdrop, parts (cover, icon badge, title, description, hint, body, footer), vertical / horizontal layouts, mobile presentations, optional close button, animation, focus, Escape / backdrop close, scroll, `ConfirmDialog` preset.
**Out of scope (stays in `farm-cattle-care-com`):** modal content (forms, validation, API calls, `UserManagement`, `AggressionPassword`, ...), `ModalStackProvider` and the `#container` portal root, hotkeys list, URL-driven open state, `FullScreenModal` (right-hand drawer, not a dialog).

## 2. Visual (from Figma)

One component, three types. All sizes are from the file.

### Shared

| Part | Value |
|---|---|
| Surface | white card, 1 px border (`surface/border`), radius **16 px**, soft shadow `0 2 36 depth-04`, `overflow: clip` |
| Sections | `message` (padding 24, **1 px bottom divider**) and `button-group` / `modal-controls` (padding 16, no divider). Optional `cover` on top (200 px high, tinted, bottom divider, 24 padding, centred 32 px placeholder) |
| Icon badge | circle, 1 px border, tinted fill; 56 px with 24 px icon (96 / 44 on mobile). Optional (`icon` prop in Figma). Tint is neutral by default and **brand tint** (soft top-down gradient) in the payment example, so the badge takes a `tone` |
| Title | 18 / 24, medium (mobile 24 / 28), `text-primary` |
| Description | 16 / 24, regular, `text-secondary` |
| Hint | 14 / 20, regular, `text-tertiary`; optional third text line |
| Text gap | 4 px between title, description, hint |
| Buttons | height 44 (mobile 56), radius 10 (mobile 12), label 14 / 20 medium (mobile 18 / 28), three styles: **primary** (brand gradient, white text), **secondary** (white, border, light shadow), **danger** (soft red fill + red border + red text). Optional 16 px leading icon |
| Button gap | 12 px |

### `vertical` — 320 px wide

Centred column. Optional cover, then `message`: icon badge on top, text centred below (gap 12). Then `button-group`: buttons **stacked, full width**, in order primary, secondary, danger. Guideline: "for most cases where we ask short questions".

### `horizontal` — 520 px wide

`message` is a row: icon badge (56) on the left, content column (gap 12) on the right with left-aligned text and an optional **content slot** under it (e.g. a labelled text field with caption / error message, a dropdown). `modal-controls` is a row aligned to the right, buttons in the order danger, secondary, primary. There is no left-aligned third action (see guidelines). The **close "×"** (44 × 44 ghost button, 12 px inset) exists only on the cover; without a cover the dialog has no × and is dismissed through its Cancel button, Escape or the backdrop. Guideline: "for dialogs with additional controls or longer questions".

### `Mobile` — small widths and POS devices

Same content as vertical but larger: badge 96, title 24 / 28, buttons 56 high with radius 10 → 12 and 18 px labels, stacked full width. Two placements in the file:
- **bottom sheet** (~365 × 366, anchored to the bottom edge, content height);
- **full screen** (373 × 775): message area grows (`flex: 1`) and centres its content vertically, buttons stay at the bottom.

### Placement

Desktop: centred in the viewport over the page (320 × 296 example on a 1440 × 800 frame). The file draws no backdrop; decision: the scrim is `--depth-10` (`rgba(16, 24, 32, .1)`), an existing cc-ui token.

### Guidelines in the file (become Storybook docs)

- A dialog is a modal window that interrupts and disables the app until confirmed, dismissed or a required action is taken; use sparingly.
- Use for stopping destructive actions, confirming irreversible choices, gathering info required to proceed. Avoid for non-essential or marketing messages and for high-stakes flows such as checkout.
- **Do not add a third action** like "Learn more" that navigates away; use an inline expansion, or give the information before the dialog. The file's own example shows a left "Learn more" slot; that is the anti-pattern the guideline warns about and is **not** reproduced: footers have only the primary / secondary / danger buttons.
- **Errors go inline**, next to the field (text field caption / error message). Only general failures (network, save failed) appear in a basic dialog after the confirming action fails. On mobile, show errors where the user can see them while fixing.
#### Example pairs (badges and texts as drawn in Figma)

All dialogs below are `vertical`, 320 px, with a danger-tinted icon badge unless noted. Buttons are stacked, destructive first.

| Rule | Badge | Dialog | Verdict |
|---|---|---|---|
| Use a dialog only when a decision is required | **Do** | "Delete this card?" / "The card will be permanently removed from your account." / buttons "Yes, delete this card" (danger), "No, thanks" | destructive, irreversible choice: right use |
| | **Don't** | "Upload completed" / "Profile picture updated." / button "OK" (success-tinted check badge) | non-essential success message: use a toast or inline status, not a dialog |
| Headlines are brief, clear and actionable | **OK** | "Delete this card?" / "Yes, delete this card", "No, thanks" | acceptable |
| | **Ambiguous** | "Are you sure?" / "Yes", "No" | unclear what Yes / No do |
| | **Better** | "Delete Visa card ending 9012?" / "Yes, delete card", "No, thanks" | names the object, the button repeats the action |
| Errors: be careful in dialogs | **Do** | no dialog: text field "Username" with value "Bill", error caption "Username already taken." under the field (not a dialog) | field errors stay inline |
| | **Don't** | "Failed to save" / "One or more fields in the form contain errors." / "Close" (frown icon) | a dialog that hides the fields the user needs to fix |
| | **Caution** | "Failed to save" / "Something went wrong with your connection. Try again shortly." / "Cancel" | general failures only (network, save failed) after the confirming action fails; single dismiss button |

Rules as written in the file: "Headlines should be brief, clear and actionable"; "Be careful with displaying errors in dialogues": modals block the context of the UI, so most errors appear inline where they occur; general errors such as network issues preventing saving or submitting can appear in a basic dialog when the confirming action fails.

These pairs go into the Storybook docs block and are the copy examples for `ConfirmDialog` (button labels repeat the action; never bare Yes / No).

Decisions (confirmed by the product owner): scrim = `--depth-10`; no × in the horizontal layout without a cover, so a visible Cancel is mandatory; no third / start footer slot.

## 3. API

```tsx
type ModalLayout = 'vertical' | 'horizontal';          // 320 / 520 px
type MobilePresentation = 'sheet' | 'fullscreen';       // below the sm breakpoint

interface ModalProps {
  open: boolean;
  /** Called after the exit animation, on Escape, backdrop click or the × button. */
  onClose: () => void;
  layout?: ModalLayout;                    // default 'vertical'
  mobile?: MobilePresentation;             // default 'sheet'
  /** Render the window as a <form>; a type="submit" footer button then works natively. */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Disable Escape / backdrop / × (e.g. while a request is in flight). */
  dismissible?: boolean;                   // default true
  /** Skip the animation when already open on mount (URL-restored). */
  instantInitialOpen?: boolean;
  portalSelector?: string;                 // default '#container'
  'aria-labelledby'?: string;              // defaults to the Modal.Title id
  'data-testid'?: string;
  className?: string;
  children: ReactNode;
}

Modal.Cover:       { children?, onClose? }  // 200 px tinted area; renders the × when onClose is given
Modal.Message:     { children }              // the padded, divided text section; lays out icon + text per `layout`
Modal.Icon:        { children: ReactNode, tone?: 'neutral' | 'brand' | 'danger' }  // 56 px badge (96 on mobile)
Modal.Title:       { children, id? }         // <h2>
Modal.Description: { children }
Modal.Hint:        { children }
Modal.Body:        { children }              // content slot under the text (fields, dropdown)
Modal.Footer:      { children }              // buttons only; order and direction come from `layout`

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;                    // default 'Cancel'
  tone?: 'default' | 'dangerous';          // dangerous = destructive confirm button, role="alertdialog"
  loading?: boolean;                       // disables buttons and dismissal
  'data-testid'?: string;
}
```

Notes:
- Footer buttons are cc-ui `Button` (`primary` / `secondary` / `dangerous`); `Modal.Footer` sets the order and direction from `layout` (vertical: stacked, full width, primary first; horizontal: row, right-aligned, primary last). On mobile the footer always stacks and buttons use their 56 px size. If `Button` has no 56 px size, add `size="lg"` in cc-ui first (the file's mobile size) rather than overriding it in the modal.
- The mock has the danger button as a soft red fill. Check that `Button variant="dangerous"` matches; if not, raise it with design rather than restyling inside the modal.
- Compound parts as today's `FormModal.Head / Content / Footer`; heading id shared via context (`ModalHeadingIdContext` today).
- Keep the data-testids `modal-close` (the ×) and the per-modal `data-testid` on the dialog element: e2e depends on them.
- CSS Modules + tokens, not Tailwind. Classes `[styles.modal, styles[layout], className]`, like `Spinner`.
- The app-side adapter keeps `isOpen` so the 23 consumer files do not change (§9).

## 4. Behaviour

Everything below is current `TemplateModal` / `ActionModal` behaviour and is the contract to preserve, plus the marked **new** items.

- **Portal:** into `#container`, only after mount (SSR-safe, `null` on the server).
- **Open / close:** mount, then switch to visible on the next tick so the fade runs. Close: fade-out for 200 ms (`MODAL_ANIMATION_DELAY`), then `onClose`. Keep the `closeInitiatedRef` guard from `FullScreenModal` so an async `open` update (router-driven) never re-opens a closing window.
- **Animation:** desktop window fades `0 → 1` with the `--depth-10` scrim, 200 ms. **New:** mobile bottom sheet slides up from the bottom edge, same duration; full screen fades. `prefers-reduced-motion` and `instantInitialOpen` render the final state at once.
- **Escape** closes only the topmost modal (stack stays in the app; cc-ui gets an optional `isTop` hook point, default always top). `preventDefault`, active in form fields.
- **Backdrop click** closes; clicks inside do not bubble. **New:** a drag that starts inside the window and ends on the backdrop must not close it.
- **Focus:** trapped inside (`react-focus-lock` today, no autofocus); **new:** returns to the opener on close.
- **Scroll:** the page behind does not scroll (and does not jump: keep scrollbar-width compensation); the window scrolls internally with `max-height` ≈ 80 dvh, divider-separated sections: **message scrolls, footer stays visible**.
- **Mobile (below `sm`):** vertical / confirm dialogs use `mobile='sheet'`; forms with content use `mobile='fullscreen'`. This replaces today's rule "FormModal is full-screen on mobile".
- **Stacking:** `z-index: 40` today; check against `z-menu` so dropdowns opened inside a modal are not hidden. A confirm opened from inside another modal stacks above it.
- **Submit:** with `onSubmit` the whole window is a `<form>`; Enter submits; primary is `type="submit"`, others `type="button"`.
- **Loading:** `loading` / `dismissible={false}` block Escape, backdrop and ×.
- **Inline errors:** field errors render in the field's caption inside `Modal.Body`; the modal does not own error state. A general failure re-opens as a basic `ConfirmDialog`-style info dialog (single secondary button) from the app side.

## 5. Accessibility

- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → `Modal.Title` id (`useId`), overridable; `aria-describedby` → `Modal.Description` when present.
- `ConfirmDialog tone="dangerous"` uses `role="alertdialog"`.
- The × is an icon-only `Button` with `aria-label="Close"` (localised in the app adapter). Because the horizontal layout without a cover has no ×, every such dialog **must** have a visible dismiss button in the footer (Cancel) — enforced in stories / docs.
- Badge icon is decorative: `aria-hidden`.
- Reduced motion, focus return and Escape as in §4. Contrast of tertiary text on white meets AA.
- Touch targets: buttons ≥ 44 px (56 on mobile) already in the design.

## 6. Tokens

The Figma file uses another system; map as follows and **add no new colours**.

| Figma | cc-ui |
|---|---|
| `surface/card` | `--card-surface` |
| `surface/border` (8 % black) | `--border` (nearest) |
| `surface/depth-04` (badge fill, soft shadow) | `--depth-5` |
| `surface/depth-08` (cover fill) | `--depth-10` |
| `text-primary / secondary / tertiary` | same names |
| `text-faded` (placeholder) | `--text-tertiary` or the field's own |
| `brand/600 → 700` gradient (primary button) | already inside `Button variant="primary"` |
| `brand/level-1, level-2` (badge tint) | `--brand-main-10`, `--brand-main-15` |
| `danger/level-1`, `level-3`, `danger/main` | `--danger-bg`, `rgba(var(--danger-rgb), .24)`, `--danger-text-dark`; or `Button dangerous` |
| radius 8 / 10 / 12 | `--radius-xs` / `--radius-sm` / `--radius-base` |
| radius **16** (window) | **missing** — add `--radius-lg: 16px` |
| shadow `0 2 36 depth-04` | **missing** — add `--shadow-soft` |
| scrim (not in the file) | `--depth-10` |
| spacing 4 / 8 / 12 / 16 / 24 | px values in the CSS (cc-ui has no spacing tokens) |
| Trigonix medium | Inter, weight via the cc-ui scale (550) |

Dark theme is not in the Figma file: ship light only unless design supplies it; the app's current dark palette (`--float-panel`) is not carried over.

## 7. Storybook

`Modal.stories.tsx`:
1. **Playground**: `layout`, `mobile`, `dismissible`, icon tone, cover on / off.
2. **Vertical** (short question): icon + title + description + hint, three stacked buttons; with and without cover and icon.
3. **Horizontal with content**: text field with caption / error, danger + secondary + primary in a row;; Cancel is always present.
4. **Mobile**: bottom sheet and full screen (viewport stories).
5. **ConfirmDialog**: default and dangerous.
6. **Dropdown inside a modal** (stacking).
7. **Long content**: message scrolls, footer pinned.
8. **Stacked**: confirm over a form modal; Escape closes only the top one.
9. **Reference frames**: one story per Figma frame (`142:10465`, `142:10479`, `142:10496`, and the payment example `142:10958`), used to check the implementation within a few px.
10. **Guidelines** docs block from §2.

## 8. Tests (vitest, in cc-ui)

- open / close with the 200 ms delay, `onClose` fires once
- Escape closes only the top modal; backdrop click closes; click inside does not; drag from inside to backdrop does not
- `dismissible={false}` / `loading` block all dismissals
- focus trapped and returned to the opener
- `onSubmit` on Enter and on the submit button; Cancel does not submit
- footer order per `layout`; stacked on mobile
- renders nothing on the server, no hydration warning

## 9. Migration in `farm-cattle-care-com`

Rule from the cc-ui migration: only chrome changes; handlers and form value shapes that reach the backend stay identical.

1. Publish cc-ui with `Modal` / `ConfirmDialog`; bump the dependency.
2. Keep `src/shared/ui/Modals/{ActionModal,FormModal}` as **adapters** with the old API (`isOpen`, `onClose`, `.Head`, `.Content`, `.Footer`, `data-testid`) over cc-ui, as done for `DropDown` / `TextField`. `ActionModal` → `layout="vertical"`, `FormModal` → `layout="horizontal"` (`mobile="fullscreen"`). No consumer changes in this step.
3. Visible changes to expect: width 345 → 320 and 480 → 520, radius 24 → 16, panel gets a border and soft shadow, header / footer divided by a line, 44 px buttons in the new order, × only with a cover, the free-form `FormModal` paddings go away.
4. Pilot on the simple confirms (`Logout`, `ArchiveReport`, `DeleteIssue`) → `ConfirmDialog`.
5. Then forms (`EditUserModal`, `WelfareAlertFormModal`, `SendInviteModal`, ...): content goes into `Modal.Body`; check any with no visible Cancel and add one.
6. `FullScreenModal` is untouched. Remove adapters once nothing imports the old paths; keep `ModalStackProvider`.

Affected today: 23 files using `ActionModal` (7 usages), `FormModal` (4), `FullScreenModal` (4).

## 10. Release checklist

- [ ] `Modal.tsx`, `Modal.module.css`, `Modal.stories.tsx`, `ConfirmDialog.tsx`
- [ ] Tokens `--radius-lg`, `--shadow-soft` added to `tokens.css` (scrim reuses `--depth-10`)
- [ ] `Button` 56 px size (if missing) and `dangerous` look checked against the file
- [ ] Export from `src/index.ts`; add to the component list in `AGENTS.md`
- [ ] Decide focus-lock and hotkeys: peer deps vs. a small in-house trap (cc-ui has neither today)
- [ ] Lint, typecheck, build (`dist`), Storybook build, tests pass
- [ ] Version bump; publish via GitHub Release (done by the user)
- [ ] App side: bump `cattle-care-ui`, ship adapters, run e2e on every modal (`modal-close`, per-modal testids)

## 11. Acceptance criteria

- Each Figma frame (vertical, horizontal, mobile sheet / full screen, payment example) is reproduced within a few px, using only cc-ui tokens plus the two added ones.
- Existing modals work unchanged through the adapters; e2e selectors still match.
- Escape closes only the topmost modal; focus returns to the opener; no page scroll or jump while open.
- Long content scrolls inside with the footer pinned; mobile uses sheet / full screen per prop.
- Every dialog has a visible dismiss path.
