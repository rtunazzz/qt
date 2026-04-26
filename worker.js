function readPrefs(cookieHeader) {
  if (!cookieHeader) return DEFAULT_PREFS;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return DEFAULT_PREFS;
  try {
    return JSON.parse(atob(match[1]));
  } catch (err) {
    console.error("[qt] corrupt preferences cookie:", err.message);
    return DEFAULT_PREFS;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const route = parseRoute(url.pathname);
    if (!route) return env.ASSETS.fetch(request);

    const prefs = readPrefs(request.headers.get("cookie"));
    const platformId = resolve(prefs, route.chain, route.action);
    if (!platformId) return env.ASSETS.fetch(request);

    try {
      const dest = buildRedirectUrl(platformId, route.chain, route.token, url.searchParams);
      return new Response(null, {
        status: 302,
        headers: {
          Location: dest,
          "Cache-Control": "private, no-store",
        },
      });
    } catch (err) {
      console.error(`[qt] redirect build failed for ${route.chain}/${route.token} -> ${platformId}:`, err.message);
      return env.ASSETS.fetch(request);
    }
  },
};
