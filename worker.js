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

function buildReflinks(env) {
  // If env.REF is set, the forker owns the whole config — start with an empty
  // overrides map so pre-refactor per-platform defaults don't leak through.
  // If env.REF is unset, inherit from DEFAULT_REFLINKS so deployments without
  // any env var setup return byte-identical redirects.
  const hasGlobalRef = env && typeof env.REF === "string" && env.REF;
  const out = hasGlobalRef
    ? { default: env.REF, overrides: {} }
    : { default: DEFAULT_REFLINKS.default, overrides: { ...DEFAULT_REFLINKS.overrides } };

  if (env && typeof env === "object") {
    for (const key of Object.keys(env)) {
      if (!key.startsWith("REF_")) continue;
      const val = env[key];
      if (typeof val !== "string" || !val) continue;
      // REF_PHOTON_SOL → photon-sol. Skip malformed keys like REF_ or REF__FOO
      // that would yield an empty or hyphen-prefixed id.
      const platformId = key.slice(4).toLowerCase().replace(/_/g, "-");
      if (!platformId || platformId.startsWith("-")) continue;
      out.overrides[platformId] = val;
    }
  }
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Intercept the SW's copy of redirect-data.js and append env-resolved
    // reflinks as `self.REFLINKS`. The SW loads this via importScripts and
    // reads the global. Built fresh per request so env var changes propagate
    // without a redeploy.
    if (url.pathname === "/static/redirect-data.js") {
      const upstream = await env.ASSETS.fetch(request);
      if (!upstream.ok) return upstream;
      const body = await upstream.text();
      const reflinks = buildReflinks(env);
      const injected = `${body}\nself.REFLINKS = ${JSON.stringify(reflinks)};\n`;
      return new Response(injected, {
        status: 200,
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const route = parseRoute(url.pathname);
    if (!route) return env.ASSETS.fetch(request);

    const prefs = readPrefs(request.headers.get("cookie"));
    const platformId = resolve(prefs, route.chain, route.action);
    if (!platformId) return env.ASSETS.fetch(request);

    const platform = PLATFORM_MAP[platformId];
    if (!platform) return env.ASSETS.fetch(request);

    try {
      const reflinks = buildReflinks(env);
      const dest = buildRedirectUrl(platform, route.chain, route.token, url.searchParams, reflinks);
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
