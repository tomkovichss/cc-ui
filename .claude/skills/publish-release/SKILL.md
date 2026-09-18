---
name: publish-release
description: Push pending git changes and publish a new version of cattle-care-ui to npm. Trigger on phrases like "запушь и обнови npm", "push and publish", "release this", "обнови npm", "publish a new version", "выпусти релиз", or any request to push commits AND get the change live on the npm registry. Do NOT trigger for a plain "push to git" with no mention of npm/publishing — that's just a git push, skip the version bump/release steps.
---

# Publish a new cattle-care-ui release to npm

This repo (`tomkovichss/cc-ui`, published to npm as `cattle-care-ui`) publishes automatically via
`.github/workflows/publish.yml` **only when a GitHub Release is published** — not on every push to
`master`. "Push to git" alone never updates npm. Follow these steps every time, in order — skipping
steps is what caused past failures.

## Steps

1. **Check git status first.** `git status --short` and `git diff --stat`. If there are local
   uncommitted changes (including ones made outside this session — check for file-changed-on-disk
   system reminders), review the diff, then commit and push them with a real commit message
   (see repo-root CLAUDE.md / system reminders for attribution lines). If `git log
   origin/master..HEAD` is already empty, nothing to push — move to step 2.

2. **Verify the build is clean before bumping the version:**
   ```sh
   npm run typecheck
   npm run build
   ```
   Both must exit clean. Never bump/release on a red build.

3. **Bump the version in `package.json`.** Semver patch bump (`0.1.x` → `0.1.x+1`) for anything
   that isn't a breaking API change, unless the user says otherwise. Commit this as its own commit
   (`Bump to 0.1.x`), push it.

4. **Create the GitHub Release**, which is what actually triggers the publish workflow:
   ```sh
   gh release create v0.1.x --title "v0.1.x" --notes "<one-line summary of what changed>"
   ```
   The tag must match the version you just set in `package.json` (prefixed with `v`).

5. **Watch the workflow run**, don't just fire-and-forget:
   ```sh
   gh run list --workflow=publish.yml --limit 2
   gh run watch <run-id>
   ```
   If it fails, check the log before retrying — see **Known failure modes** below, most past
   failures were one of these exact four things.

6. **After a successful run, confirm npm actually has it** — npm publish can succeed in CI but
   take a minute or two to become queryable:
   ```sh
   npm view cattle-care-ui version
   ```
   If it still shows the old version, use `ScheduleWakeup` (~120s) to check again rather than
   polling synchronously — report back to the user once confirmed rather than leaving it hanging.

## Known failure modes (all hit before, check these first on any failure)

- **`403 Two-factor authentication or granular access token with bypass 2fa enabled is required`**
  — the `NPM_TOKEN` repo secret isn't set up right. It must be either an npm **Classic token of
  type "Automation"**, or a **Granular Access Token with "Bypass two-factor authentication"
  explicitly enabled** at creation. A normal read/write granular token without that checkbox will
  fail every time. Tell the user to regenerate the token with the correct type/flag and update the
  `NPM_TOKEN` GitHub secret — this isn't something fixable from the workflow side.

- **`422 ... Unsupported GitHub Actions source repository visibility: "private"`** (only if
  `--provenance` is used in `publish.yml`) — npm provenance requires the source GitHub repo to be
  **public**. If the repo is private, either make it public or drop `--provenance` from the
  `npm publish` command (and drop the `id-token: write` permission, no longer needed without it).

- **`422 ... "repository.url" is "", expected to match "https://github.com/<owner>/<repo>" from
  provenance`** — `package.json` needs a `"repository": { "type": "git", "url":
  "https://github.com/<owner>/<repo>" }` field matching the actual (current) repo URL exactly.
  If the repo gets renamed on GitHub, update this field (and the local `git remote -v` URL) in the
  same pass — check `gh repo view --json name,owner,url` if unsure of the current name.

- **A `re-run` of a failed workflow job does not pick up a `publish.yml` fix you just pushed** —
  GitHub Actions re-runs use the workflow file version pinned to that original run, not the latest
  commit. After fixing `publish.yml`, don't `gh run rerun` — instead delete and recreate the
  release (`gh release delete vX.Y.Z --yes --cleanup-tag` then `gh release create vX.Y.Z ...`
  again) so the workflow re-triggers fresh against the current `master`.

- **`tsc -b --noEmit -p tsconfig.lib.json` errors with `Unknown build option '-p'`** — `tsc -b`
  (build mode) takes the project path as a bare positional argument, not after `-p`. Correct form:
  `tsc -b tsconfig.lib.json` (this is already how the `build` script in `package.json` is written —
  don't reintroduce the `-p` flag if editing that script).

- **Publishing the same version twice** — npm rejects re-publishing an already-published version
  outright. Always confirm the version was actually bumped (step 3) before creating the release.

## Reference

Full context on how this pipeline was originally set up (Vite lib-mode build, CSS bundling
strategy, `vite-plugin-dts`, `exports` map, `AGENTS.md` for downstream consumers) lives in
`README.md`'s "Consuming from another project" section and `AGENTS.md` at the repo root — read
those if something about the build itself (not the publish step) looks wrong.
