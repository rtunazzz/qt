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

## License

MIT
