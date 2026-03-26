importScripts("/static/redirect-data.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  if (!self.cookieStore) return;

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
        try { prefs = JSON.parse(atob(cookie.value)); } catch (err) {
          console.warn("[qt] failed to parse preferences cookie:", err.message);
        }
      }

      const platformId = resolve(prefs, chain, action);
      if (!platformId) return fetch(e.request);

      const platform = PLATFORM_MAP[platformId];
      if (!platform) return fetch(e.request);

      return Response.redirect(buildRedirectUrl(platform, chain, token, url.searchParams), 302);
    }).catch((err) => {
      console.warn("[qt sw] redirect failed, falling through to edge:", err.message);
      return fetch(e.request);
    })
  );
});
