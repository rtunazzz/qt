<p align="center">
  <img src="assets/header.svg" alt="qt — personalized crypto link shortcuts" width="900">
</p>

<p align="center">
  <a href="https://qt.rtuna.dev"><strong>qt.rtuna.dev</strong></a>
</p>

---

**qt** turns long crypto URLs into short, personalized redirects with your preferred platforms and referral codes baked in.

Visit `qt.rtuna.dev/{chain}/{token}` and get redirected to your trading platform, charting tool, or block explorer — based on preferences stored in your browser cookies.

## How it works

```
qt.rtuna.dev/sol/EPjFWdd5...   →  redirects to your default action (trade)
qt.rtuna.dev/sol/EPjFWdd5.../trade    →  trading platform
qt.rtuna.dev/sol/EPjFWdd5.../chart    →  charting tool
qt.rtuna.dev/sol/EPjFWdd5.../explore  →  block explorer
```

Configure defaults at [qt.rtuna.dev/settings](https://qt.rtuna.dev/settings).

## Supported chains

| Chain | ID |
|---|---|
| Solana | `sol` |
| Ethereum | `eth` |
| Base | `base` |
| BSC | `bsc` |

## Stack

- Vanilla HTML + JavaScript — no frameworks, no build step
- Privacy-focused — zero server-side data storage, all preferences live in your browser cookies
- Hosted on Cloudflare Pages
- Auto-deploys on push to `main`

## License

MIT
