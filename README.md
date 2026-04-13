<p align="center">
  <img src="assets/header.svg" alt="qt — links, shorter." width="900">
</p>

<p align="center">
  <a href="https://qt.rtuna.dev"><strong>qt.rtuna.dev</strong></a>
</p>

---

**qt** — one link, every platform. Users choose where it takes them.

Send a single `qt.rtuna.dev` link in your Discord embeds, Telegram notifications, or anywhere else — each user gets redirected to the trading platform, charting tool, or block explorer they actually prefer. No more hardcoding DexScreener for someone who uses Birdeye, or Jupiter for someone on Axiom.

## How it works

```
qt.rtuna.dev/{chain}/{token}            →  default action (trade)
qt.rtuna.dev/{chain}/{token}/trade      →  trading platform
qt.rtuna.dev/{chain}/{token}/chart      →  charting tool
qt.rtuna.dev/{chain}/{token}/explore    →  block explorer
```

Users configure their preferred platforms at [qt.rtuna.dev/settings](https://qt.rtuna.dev/settings). Preferences are stored locally in browser cookies — no accounts, no server-side data.

## Why use qt links?

- **One link, many destinations** — embed a single URL in your bot, alert, or message. Each user lands on their preferred platform.
- **Great for embeds** — Discord bots, Telegram alerts, and notification services can use qt links instead of picking one platform for everyone.
- **Privacy-focused** — zero server-side storage. All preferences live in the user's browser.
- **Referral-ready** — platform referral codes are baked into the redirects.

## Stack

- Vanilla HTML + JavaScript — no frameworks, no build step
- All preferences stored client-side via cookies
- Hosted on Cloudflare Pages
- Auto-deploys on push to `main`

## Self-hosting with your own reflinks

Fork the repo and deploy to Cloudflare Pages. Customize referral codes without touching code by setting environment variables under **Pages → Settings → Environment variables** (Production):

- `REF` — default referral slug used for every reflink-aware platform. Defaults to `rtuna` if unset.
- `REF_<PLATFORM>` — per-platform override. Uppercase the platform id and replace hyphens with underscores.

Reflink-aware platforms and their env var names:

| Platform id | Env var |
|---|---|
| `photon-sol` | `REF_PHOTON_SOL` |
| `photon-base` | `REF_PHOTON_BASE` |
| `photon-tron` | `REF_PHOTON_TRON` |
| `axiom` | `REF_AXIOM` |
| `bloom-sol` | `REF_BLOOM_SOL` |
| `bloom-evm` | `REF_BLOOM_EVM` |
| `gmgn` | `REF_GMGN` |
| `padre` | `REF_PADRE` |
| `sigma` | `REF_SIGMA` |
| `sigma-vip` | `REF_SIGMA_VIP` |
| `based` | `REF_BASED` |
| `based-vip` | `REF_BASED_VIP` |
| `banana` | `REF_BANANA` |
| `maestro` | `REF_MAESTRO` |

Notes:

- Changes take effect on the next request for the edge redirect path — no redeploy needed.
- Each platform embeds the slug differently (Telegram username, numeric id, opaque code). Test your slug with each platform before committing it.
- Setting `REF` globally resets every platform to that slug and clears the built-in per-platform defaults. To keep the defaults and only tweak individual platforms, leave `REF` unset and use `REF_<PLATFORM>` per platform.
- If no env vars are set, deployments keep the built-in defaults (see `DEFAULT_REFLINKS` in `static/redirect-data.js`).
- Service worker caching: returning visitors with an installed service worker take a client-side fast path that resolves redirects in the browser. The SW reads its reflinks from a `self.REFLINKS` global the worker injects into `/static/redirect-data.js` (served `no-store`). A new env var value is picked up the next time the SW re-fetches that script — typically on its next update cycle. Until then, those clients keep redirecting with the old refs while the edge path uses the new ones. To force-propagate immediately after changing env vars, push a no-op change to `sw.js` so the SW byte-changes and reinstalls.

## License

MIT
