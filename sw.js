importScripts("/static/redirect-data.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;

  const url = new URL(e.request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2 || parts.length > 3) return;

  const chain = parts[0].toLowerCase();
  const token = parts[1];
  const action = parts[2]?.toLowerCase() || "trade";

  if (!CHAINS[chain]) return;
  if (!ACTIONS.includes(action)) return;

  e.respondWith(
    self.cookieStore.get("qt").then((cookie) => {
      let prefs = DEFAULT_PREFS;
      if (cookie?.value) {
        try { prefs = JSON.parse(atob(cookie.value)); } catch {}
      }

      const platformId = resolve(prefs, chain, action);
      if (!platformId) return fetch(e.request);

      const platform = PLATFORM_MAP[platformId];
      if (!platform) return fetch(e.request);

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

      return Response.redirect(dest, 302);
    })
  );
});
