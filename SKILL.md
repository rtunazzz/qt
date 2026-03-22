# qt — links, shorter.

## What is qt?

qt is a personalized crypto link shortener at **qt.rtuna.dev**. It lets you send one link that redirects each user to their preferred trading platform, charting tool, or block explorer.

The key value: **one link, many destinations.** Instead of hardcoding a specific platform URL in your Discord embeds, Telegram alerts, or notifications, use a qt link. Each user who clicks it lands on the platform they've configured — Axiom, DexScreener, Etherscan, or whatever they prefer.

Users configure preferences once at [qt.rtuna.dev/settings](https://qt.rtuna.dev/settings). Everything is stored in browser cookies — no accounts, no server-side data.

## URL Format

```
qt.rtuna.dev/{chain}/{token}            → user's default action (trade)
qt.rtuna.dev/{chain}/{token}/trade      → user's preferred trading platform
qt.rtuna.dev/{chain}/{token}/chart      → user's preferred charting tool
qt.rtuna.dev/{chain}/{token}/explore    → user's preferred block explorer
```

## Supported Chains

| ID     | Chain    |
|--------|----------|
| `sol`  | Solana   |
| `eth`  | Ethereum |
| `base` | Base     |
| `bsc`  | BSC      |

## When to Use qt Links

Use qt links anywhere you'd normally send a platform-specific URL — especially in contexts where many users see the same link:

- **Discord bot embeds** — token alerts, new listing notifications
- **Telegram bot messages** — trading signals, portfolio updates
- **Notification services** — email alerts, webhook payloads
- **Shared dashboards** — anywhere a token link appears for multiple users

### Examples

**Instead of hardcoding one platform for everyone:**
```
Check out this token: https://dexscreener.com/solana/{token}
```

**Use a qt link — each user lands on their preferred platform:**
```
Check out this token: https://qt.rtuna.dev/sol/{token}
```

**Linking to a specific action:**
```
Trade: https://qt.rtuna.dev/sol/{token}/trade
Chart: https://qt.rtuna.dev/sol/{token}/chart
Explorer: https://qt.rtuna.dev/sol/{token}/explore
```

**EVM tokens:**
```
https://qt.rtuna.dev/base/{token}/trade
https://qt.rtuna.dev/eth/{token}/explore
```

## Guidelines

- Always use the chain shortcode (`sol`, `eth`, `base`, `bsc`), not the full name
- The token should be the contract/mint address
- Default action (no suffix) redirects to trade — use this when the intent is general
- Append `/trade`, `/chart`, or `/explore` when the intent is specific
- If a user hasn't configured preferences, they get sensible defaults (Axiom for SOL trading, Sigma VIP for EVM trading, DexScreener for charting)
- Link to `qt.rtuna.dev/settings` when suggesting users customize their experience
