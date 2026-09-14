---
name: apply-css-edits
description: Apply CSS edits the user pastes or describes (a diff, a rule change, "make the radius bigger", a whole replacement block, etc.) to this component library's *.module.css files as a background subagent, so the edit doesn't consume the current conversation's turn. Trigger on phrases like "apply this CSS in the background", "update these styles without blocking me", "run this style edit as a background task", or when the user hands over CSS changes and says to handle them separately/async.
---

# Apply CSS edits in the background

This skill exists so CSS tweaks (a pasted diff, a token change, "bump padding on X", a full rule
rewrite) get applied by a **separate background agent**, not inline in the current conversation.
The current session stays free; the user gets a task notification when the edit lands.

## What to do when this skill is invoked

1. **Gather the edit.** Take whatever the user gave you verbatim — pasted CSS, a diff, or a plain
   description of the change — plus which component(s) it targets if they said so. Only ask a
   clarifying question if the target file is genuinely ambiguous (e.g. a token name that appears
   in several components) — don't ask about style choices covered by the conventions below.

2. **Spawn one background agent per logical edit** using the `Agent` tool with
   `subagent_type: "general-purpose"` (a fresh agent — it needs no memory of this conversation,
   just the edit and the conventions below). Do **not** use `fork` here: the point is a fully
   separate, independently-reportable unit of work, not a continuation of this session's context.

3. **Return immediately** after launching. Tell the user it's running in the background and that
   they'll get a notification when it's done. Do not wait, poll, or narrate progress.

## Prompt to give the spawned agent

Build a fully self-contained prompt (the agent has zero context otherwise). Include:

- Repo root: `/Users/sergeytomkovich/ShipStudio/cattle-care-ui`
- The literal CSS edit/instruction the user provided, unmodified.
- These project conventions (the agent must follow them even if the pasted CSS doesn't):
  - Each component lives as `src/components/<Name>.tsx` + `<Name>.module.css` (+ `<Name>.stories.tsx`).
  - Shared design tokens are CSS custom properties in `src/styles/tokens.css` (`--accent`,
    `--border`, `--border-input`, `--text`, `--text-muted`, `--card-surface`, `--surface-sunken`,
    `--surface-muted`, `--danger-bg`, `--danger-text`, `--success-bg`, `--success-text`,
    `--disabled-bg`, `--disabled-text`, etc.) — reuse existing tokens, don't hardcode colors that
    already have a token.
  - **Never use a literal `border` as the visible edge of an interactive/surface element**
    (buttons, text fields, menus, panels, tags, toolbars). Use
    `box-shadow: inset 0 0 0 1px var(--token)` instead (an outset shadow if the design calls for
    it), and combine with drop shadows in one `box-shadow` list where both apply — see
    `Menu.module.css`, `Toolbar.module.css`, `TextField.module.css`, `Checkbox.module.css`,
    `RadioButton.module.css` and `FilterSection.module.css` for the pattern. `border: none` to
    reset a native element's default border is fine.
  - Match existing transition timing/easing already used on the component being touched rather
    than inventing new values.
- Explicit steps for the agent to run:
  1. Locate the exact file(s) the edit targets.
  2. Apply the edit, translating any literal `border:` in the user's pasted CSS into the
     box-shadow equivalent per the rule above, unless the user explicitly says to keep a real
     border.
  3. Run `npm run typecheck` and `npm run lint` in the repo root; fix anything the edit broke.
  4. Report back a short summary: files changed, a one-line diff description, and whether any
     translation (border → box-shadow, hardcoded color → token) was applied beyond the literal
     request.

## Notes

- If the user's request is large enough or risky enough that they'd want to review it before it
  touches their working tree, pass `isolation: "worktree"` on the `Agent` call so it lands on an
  isolated branch instead of the current checkout — offer this when the edit is broad (e.g.
  "restyle every component") rather than a small single-file tweak.
- Never spawn more than one agent for a single coherent edit just to parallelize — only split into
  multiple background agents when the user hands over genuinely independent edits (e.g. two
  unrelated components) that don't share files.
