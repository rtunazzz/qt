# qt

Static site (vanilla HTML/CSS/JS) deployed to Cloudflare Pages. No build step, no bundler. Redirect routes are handled by a Cloudflare Pages Function assembled at deploy time from `static/redirect-data.js` + `functions/handler.js`.

## Commands

- Deploy: push to `main` (triggers `.github/workflows/deploy.yml`)
- No test suite, linter, or build command

## Architecture

- `static/redirect-data.js` — single source of truth for CHAINS, PLATFORMS, resolvers, and redirect resolution logic
- `functions/handler.js` — edge function request handler (onRequest export). At deploy, `cat redirect-data.js handler.js` produces `dist/functions/[[path]].js`
- `sw.js` — service worker that loads redirect-data.js via `importScripts` for local redirect resolution
- `static/config.js` — settings-only helpers (readPrefs, writePrefs, getPlatformsForChain, etc.)

## Adding a platform

1. Add entry to `PLATFORMS` in `static/redirect-data.js`
2. Choose resolver: `resolveChainId(c)` (numeric chain IDs), `resolveSlug(overrides, c)` (canonical names), or omit (platforms that use the chain key directly need no resolver)
3. If using `resolveSlug` and a platform uses non-standard names for some chains, pass overrides: `resolveSlug({ eth: "ether" }, c)`
4. Add `<span class="platform-tag {category}">` to the hero platforms grid in `index.html`
5. If the platform uses a referral code, accept `(c, t, s, ref)` in `buildUrl` and template `${ref}` into the slug position. Add the platform's current ref to `DEFAULT_REFLINKS.overrides` in `static/redirect-data.js` (skip if it equals the default slug `rtuna`), and document the new `REF_<PLATFORM_ID>` env var in the README table. Platform ids must not contain underscores — they collide with the `_` → `-` env var name mapping.

## Adding a chain

1. Add entry to `CHAINS` in `static/redirect-data.js` with `name`, `ecosystem`, `chainId`, and `slug`
2. Add chain key to relevant platforms' `chains` arrays (most slug/chainId-based platforms work automatically)
3. If a platform uses a non-standard slug for this chain, add override to its `resolveSlug({...}, c)` call
4. Add `<code>` tag to hero footer in `index.html`

## Conventions

- Commit messages: `type: description` (feat, fix, refactor, update, chore, docs)
- PRs: summary section only, no test plan section
