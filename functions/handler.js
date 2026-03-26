function readPrefs(cookieHeader) {
  if (!cookieHeader) return DEFAULT_PREFS;
  const match = cookieHeader.match(/(?:^|; )qt=([^;]*)/);
  if (!match) return DEFAULT_PREFS;
  try {
    return JSON.parse(atob(match[1]));
  } catch {
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

  const s = platform.resolveChain ? platform.resolveChain(chain) : chain;
  let dest = platform.buildUrl(chain, token, s);

  if (platform.params?.length) {
    const incoming = url.searchParams;
    const target = new URL(dest);
    for (const key of platform.params) {
      if (incoming.has(key)) target.searchParams.set(key, incoming.get(key));
    }
    dest = target.toString();
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: dest,
      "Cache-Control": "private, no-store",
    },
  });
}
