function readPrefs(cookieHeader) {
  if (!cookieHeader) return DEFAULT_PREFS;
  const match = cookieHeader.match(/(?:^|; )qt=([^;]*)/);
  if (!match) return DEFAULT_PREFS;
  try {
    return JSON.parse(atob(match[1]));
  } catch (err) {
    console.error("[qt] corrupt preferences cookie:", err.message);
    return DEFAULT_PREFS;
  }
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length < 2 || parts.length > 3) return context.next();

  const chain = parts[0].toLowerCase();
  const token = parts[1];
  const action = parts[2]?.toLowerCase() || "trade";

  if (!CHAINS[chain]) return context.next();
  if (!ACTIONS.includes(action)) return context.next();

  const prefs = readPrefs(context.request.headers.get("cookie"));
  const platformId = resolve(prefs, chain, action);
  if (!platformId) return context.next();

  const platform = PLATFORM_MAP[platformId];
  if (!platform) return context.next();

  try {
    const dest = buildRedirectUrl(platform, chain, token, url.searchParams);
    return new Response(null, {
      status: 302,
      headers: {
        Location: dest,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error(`[qt] redirect build failed for ${chain}/${token} -> ${platformId}:`, err.message);
    return context.next();
  }
}
