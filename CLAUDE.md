# qt

Static site (vanilla HTML/CSS/JS) deployed to Cloudflare Pages. No build step, no bundler.

## Commands

- Deploy: push to `main` (triggers `.github/workflows/deploy.yml`)
- No test suite, linter, or build command

## Adding a platform

1. Add entry to `PLATFORMS` in `static/config.js`
2. If platform uses non-standard chain IDs in URLs, add mapping to `CHAIN_SLUGS`
3. Add `<span class="platform-tag {category}">` to the hero platforms grid in `index.html`

## Adding a chain

1. Add to `CHAINS` in `static/config.js`
2. Add slug mappings in `CHAIN_SLUGS` for platforms that need them
3. Add to relevant platforms' `chains` arrays
4. Add `<code>` tag to hero footer in `index.html`

## Conventions

- Commit messages: `type: description` (feat, fix, refactor, update, chore, docs)
- PRs: summary section only, no test plan section
