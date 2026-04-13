importScripts("/static/redirect-data.js");

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  if (!self.cookieStore) return;

  const url = new URL(e.request.url);
  const route = parseRoute(url.pathname);
  if (!route) return;

  e.respondWith(
    self.cookieStore.get(COOKIE_NAME).then((cookie) => {
      let prefs = DEFAULT_PREFS;
      if (cookie?.value) {
        try { prefs = JSON.parse(atob(cookie.value)); } catch (err) {
          console.warn("[qt sw] failed to parse preferences cookie:", err.message);
        }
      }

      const platformId = resolve(prefs, route.chain, route.action);
      if (!platformId) return fetch(e.request);

      const platform = PLATFORM_MAP[platformId];
      if (!platform) return fetch(e.request);

      return Response.redirect(buildRedirectUrl(platform, route.chain, route.token, url.searchParams, self.REFLINKS), 302);
    }).catch((err) => {
      console.warn("[qt sw] redirect failed, falling through to edge:", err.message);
      return fetch(e.request);
    })
  );
});
