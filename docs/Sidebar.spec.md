# Sidebar — spec

Source: Figma `CattleCare — Farmer UI (2026)`, node `140:2848` "Navigation - Main navigation (Cattle Care)".
Target: new component `Sidebar` in `cattle-care-ui` (`src/components/Sidebar.tsx`, `Sidebar.module.css`, `Sidebar.stories.tsx`), exported from `src/index.ts`.

## 1. Goal and scope

A presentational, slot-based app-shell sidebar. It knows nothing about Next.js, routing, auth, farms or i18n; the consuming app supplies all of that through props and slots.

**In scope:** layout shell, spacing, borders, scroll behaviour, a built-in language switcher row, a footer with user email and a menu trigger, built on existing cc-ui components.
**Out of scope (stays in `farm-cattle-care-com`):** `usePathname` and active-item logic, `next/link`, farm list and farm switching, session/email, `next-intl`, permissions (which items to show), the mobile drawer/overlay behaviour.

## 2. Anatomy (Figma, 280 × 855, white background)

```
┌ Sidebar (280w, bg white, border-right 1px #e0e0e0) ┐
│ Content (padding 16, flex column, flex 1, scroll)   │
│  ├ Header row (gap 8, h 40)                         │
│  │   ├ Logo (40×40)                                 │
│  │   └ Farm selector (flex 1, min-w 180, h 36)      │
│  ├ Switcher (mt 16, h 44)  Milk Barn | Calf Barn    │
│  └ Nav (mt 20, gap 8)                               │
│      └ NavItem × N (h 44)                           │
│ ─ border-top/bottom 1px #e0e0e0 ─                   │
│ Footer (pl 20, pr 16, py 16)                        │
│   ├ Email (15/24, weight 550)                       │
│   ├ Language row: English | Español                 │
│   └ Menu trigger (48 wide, ⋮ icon 24)               │
└─────────────────────────────────────────────────────┘
```

Figma vertical rhythm: header 40 → gap 16 → switcher 44 → gap 16 + 20 bottom margin → nav list (items 44, gap 8). Footer is 81 high (16 + 48 + 16 + border).

## 3. Props / API

```tsx
interface SidebarProps {
  /** Top row: logo + farm selector. */
  header: ReactNode;
  /** Optional block under the header (e.g. Milk Barn / Calf Barn). */
  switcher?: ReactNode;
  /** Navigation: a NavList with NavItems. */
  children: ReactNode;
  /** Bottom block. Use SidebarFooter or any node. */
  footer?: ReactNode;
  /** Accessible name of the <nav>. */
  'aria-label'?: string;
  className?: string;
}

interface SidebarFooterProps {
  /** Primary line, usually the user's email. Truncates with an ellipsis. */
  title: ReactNode;
  /** Secondary line, e.g. <LanguageSwitch />. */
  subtitle?: ReactNode;
  /** Right-hand slot, e.g. a Menu trigger button. */
  action?: ReactNode;
}
```

Optional small helper: `LanguageSwitch` `{ items: {value,label}[]; value; onChange }`, rendering `English | Español`. If it is not worth a public component, the app composes it from plain buttons in the `subtitle` slot (decide in review; the Figma has a hidden tab-list variant of this row, so a Tabs-based variant is possible).

Composition example (what the stories and the app render):

```tsx
<Sidebar
  aria-label="Main navigation"
  header={<><Logo /><Dropdown variant="field" size="sm" options={farms} value={farm} onChange={setFarm} aria-label="Farm" /></>}
  switcher={<Tabs variant="box" items={barns} value={barn} onChange={setBarn} />}
  footer={<SidebarFooter title="farmermail@gmail.com" subtitle={<LanguageSwitch … />} action={<Menu trigger={<Button variant="tertiary" aria-label="More" icon={<MoreVertical />} />}>…</Menu>} />}
>
  <NavList>
    <NavItem as={Link} href="…" icon={<UsersIcon />} active>Milk Barn Workers</NavItem>
    …
  </NavList>
</Sidebar>
```

`header` is a free slot, so the logo asset is owned by the app (or a separate `Logo` export), not baked into `Sidebar`.

## 4. Reuse of existing cc-ui components

| Figma part | cc-ui component | Notes / gaps |
|---|---|---|
| Nav item | `NavItem` + `NavList` | See gaps below |
| Farm selector | `Dropdown` (`variant="field"`, `size="sm"`) | Trigger h 36, radius 10, border `#e3e3e3` ≈ `--border-input`; verify no label rendered |
| Milk Barn / Calf Barn | `Tabs variant="box"` | Track h 44, padding 4, radius 12, bg rgba(0,0,0,.05) ≈ `--depth-5`; selected pill h 36, radius 10 (cc-ui box uses 8, check) |
| ⋮ menu | `Menu` / `MenuItem` + tertiary `Button` | Trigger area 48 × 48, icon 24 |
| Language row | new `LanguageSwitch` or app-level | Text-only toggle, see §6 |

### Gaps in `NavItem` vs Figma (to resolve before/with this task)

| Property | Figma | Current `NavItem` | Proposal |
|---|---|---|---|
| Height | 44 | `--control-height-base` = 44 | ok |
| Horizontal padding | 12 | 16 | change to 12 (check other NavItem usages) |
| Icon size | 20 | 16 | 20 in sidebar; add `size`/CSS var or change default |
| Gap icon–label | 12 (active item shows 8, treat as a Figma inconsistency, use 12) | 12 | ok |
| Radius | 10 (active) / 12 (idle) | 10 | use 10 for both (`--radius-sm`) |
| Font | Inter 15 / 24, weight 450, letter-spacing 0.1px | `--control-font-size`, regular, -0.01em | confirm tokens; likely 15px; letter-spacing differs |
| Active bg | `--brand-primary` #0090d9 | `--brand-dark` #007ebd | **Mismatch — ask design which is right**; Figma uses `brand-primary`/`brand-main` = #0090d9 |
| Idle color | `--text-secondary` #4d5356 | `--text-secondary` #5c5f61 | Figma variable value differs from cc-ui token; use the token, flag to design |

## 5. Visual spec

Tokens (Figma variable → cc-ui token → value):
- `text-primary` → `--text-primary` #090b0b (Figma #090a0b, ~same)
- `text-secondary` → `--text-secondary` (Figma #4d5356 vs cc-ui #5c5f61, see above)
- `brand-main` / `brand-primary` → `--brand-main` #0090d9
- border `#e0e0e0` → `--border`
- disabled / neutral separator `#c5c5c5` → no token; use `--border` or add `--text-disabled-soft` (discuss)

Sidebar shell:
- width 280 (fixed in Figma; component should be `width: 100%` of its container and the app sets 280), background white (`--card-surface`/white), `border-right: 1px solid var(--border)`, full height (`height: 100%`, `display:flex; flex-direction:column`).
- Content region: `flex: 1; min-height: 0; overflow-y: auto; padding: 16px`.
- Footer: `flex-shrink: 0; border-top: 1px solid var(--border)` (Figma draws a bottom border on the content and the footer; render one divider between them and none at the very bottom unless design confirms).

Header: `display:flex; gap:8px; align-items:center`. Logo 40 × 40. Selector `flex:1`, h 36, `min-width:180px`, text 15/20 weight 450 `--text-primary`, chevron 20.

Switcher: margin-top 16, full width, two equal tabs, label 15/17.5 weight 450; selected `--text-primary` on white pill with 1px `rgba(0,0,0,.1)` border; unselected `#5c5f61`.

Nav: margin-top 16 (+20 collapsed spacing in Figma = 36 total from switcher; verify against the screenshot), `gap: 8px`.

Footer: padding 16 16 16 20; email 15/24 weight 550 `--text-primary`, ellipsis; language row 13/20 weight 450: current language `--text-secondary`, separator `|` 14px `#c5c5c5`, other language `--brand-main` with `text-decoration: underline dotted`; action area 48 × 48 aligned centre.

## 6. States and behaviour

- **NavItem:** idle / hover (glide highlight from `NavList`) / pressed / active (`aria-current="page"`, filled brand, white text) / focus-visible (2px outline). Already implemented in `NavItem`.
- **Switcher:** controlled `value` + `onChange` (Tabs). Hidden when `switcher` is not passed (e.g. a farm without a Calf Barn).
- **Language switch:** the active language is plain text (not interactive); the other is a button styled as a link. Controlled `value` + `onChange`; `lang` attribute on the labels (`lang="es"`).
- **Overflow:** long farm name and long email truncate with an ellipsis (`min-width:0`); long nav labels truncate (already in `NavItem`). Content region scrolls when there are more items than fit; footer stays pinned.
- **Menu (⋮):** opens a `Menu` anchored to the trigger, closes on outside click / Esc (existing `Menu` behaviour).
- **Responsive:** not in the Figma frame. The component renders only the desktop sidebar. Collapse/drawer on mobile is the app's job; do not add it here without a design.

## 7. Accessibility

- Root is `<aside>` containing a `<nav aria-label>`; only the nav list lives inside `<nav>`, header/footer are outside it.
- Active item uses `aria-current="page"` (NavItem does this).
- Icon-only controls (⋮, farm dropdown chevron) need an `aria-label`.
- Language switch: buttons with `lang`, current one `aria-current="true"`.
- Tab order: logo/farm selector → switcher → nav items → language → menu.
- Contrast: white text on #0090d9 is ≈ 3.5:1 for 15px/450 text, **below AA (4.5:1)**; the existing `--brand-dark` #007ebd gives ≈ 4.4:1. Another reason to settle the active colour with design.

## 8. Assets

Figma exports, to be taken from the file (not redrawn): logo `Pasted-20240229-225954 1` (40 × 40 raster), icons (20 × 20): chevron, users, film, file-chart, scatter, trend-up, language/globe (hidden variant), `more-vertical` (24). Check whether cc-ui already ships an icon set before adding SVGs; if not, icons stay supplied by the app through the `icon` props, and the stories use inline SVG placeholders.

## 9. Storybook stories (`Sidebar.stories.tsx`)

1. **Default** — matches the Figma frame: Milk Barn selected, "Milk Barn Workers" active, 5 items, English active.
2. **Calf Barn** — other switcher value, different nav items.
3. **No switcher** — farm without Calf Barn.
4. **Long content** — long farm name, long email, long item labels (ellipsis).
5. **Many items** — nav scrolls, footer stays visible.
6. **Spanish** — Español active.
7. **Interactive** — controlled state for tabs, active item, language, farm.
Render each in a fixed 280 × 855 frame; add `parameters.layout = 'fullscreen'`.

## 10. Acceptance criteria

- Default story matches Figma `140:2848` pixel-for-pixel at 280 × 855 (compare screenshots; spacing and font metrics per §5).
- No hardcoded colours if a token exists; any new token is added to `tokens.css` and shown in the Colors story.
- No dependencies on Next.js or the app; routing via `as` on `NavItem`.
- Keyboard-operable end to end; axe addon reports no violations in all stories.
- Exported from `src/index.ts`; types published in `dist`; `npm run build` (lib) and Storybook build pass.
- README component list updated.
- Not committed or published until the owner says so.

## 11. Open questions for design / owner

1. Active nav item colour: `#0090d9` (Figma) or `--brand-dark` #007ebd (current `NavItem`, better contrast)?
2. `--text-secondary`: Figma #4d5356 vs cc-ui #5c5f61. Which is canonical?
3. Is the 20px icon in `NavItem` the new standard, or only for the sidebar?
4. Is the language row a part of cc-ui (`LanguageSwitch`) or app-only?
5. Is there a collapsed/mobile variant in Figma we should spec next?
6. Who owns the logo: part of the library or supplied by the app?
