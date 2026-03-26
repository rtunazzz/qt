# qt

Static site (vanilla HTML/CSS/JS) deployed to Cloudflare Pages. No build step, no bundler. Redirect routes are handled by a Cloudflare Pages Function at the edge (`functions/[[path]].js`).

## Commands

- Deploy: push to `main` (triggers `.github/workflows/deploy.yml`)
- No test suite, linter, or build command

## Adding a platform

1. Add entry to `PLATFORMS` in `static/config.js`
2. Choose resolver: `R.chainId()` (numeric chain IDs), `R.slug()` (canonical names), or custom `buildUrl` (platforms that use the chain key directly need no resolver)
3. If using `R.slug()` and a platform uses non-standard names for some chains, pass overrides: `R.slug({ eth: "ether" })`
4. Add matching entry to `PLATFORMS` in `functions/[[path]].js` (edge redirect uses its own inlined config)
5. Add `<span class="platform-tag {category}">` to the hero platforms grid in `index.html`

## Adding a chain

1. Add entry to `CHAINS` in `static/config.js` with `name`, `ecosystem`, `chainId`, and `slug`
2. Add chain key to relevant platforms' `chains` arrays (most slug/chainId-based platforms work automatically)
3. If a platform uses a non-standard slug for this chain, add override to its `R.slug({...})` call
4. Add matching entry to `CHAINS` in `functions/[[path]].js` (edge redirect uses its own inlined config)
5. Add `<code>` tag to hero footer in `index.html`

## Conventions

- Commit messages: `type: description` (feat, fix, refactor, update, chore, docs)
- PRs: summary section only, no test plan section
