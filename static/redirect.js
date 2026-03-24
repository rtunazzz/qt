function resolve(prefs, chain, action) {
  const override = prefs.overrides?.[chain]?.[action];
  if (override) return override;

  const eco = getEcosystem(chain);
  if (!eco) return null;

  const ecoDefault = prefs[eco]?.[action];
  if (ecoDefault) return ecoDefault;

  const available = getPlatformsForChain(chain, action);
  return available.length ? available[0].id : null;
}

function parsePath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  const chain = parts[0].toLowerCase();
  const token = parts[1];
  const action = parts[2]?.toLowerCase();

  if (!CHAINS[chain]) return null;
  if (action && !ACTIONS.includes(action)) return null;

  return { chain, token, action };
}

function appendParams(url, allowed) {
  if (!allowed?.length) return url;
  const incoming = new URLSearchParams(window.location.search);
  const dest = new URL(url);
  for (const key of allowed) {
    if (incoming.has(key)) dest.searchParams.set(key, incoming.get(key));
  }
  return dest.toString();
}

function redirect() {
  const route = parsePath();
  if (!route) return;

  const prefs = readPrefs();
  const action = route.action || "trade";
  const platformId = resolve(prefs, route.chain, action);
  if (!platformId) return;

  const platform = PLATFORM_MAP[platformId];
  if (!platform) return;

  const slug = platform.resolveChain ? platform.resolveChain(route.chain) : route.chain;
  const url = platform.buildUrl(route.chain, route.token, slug);
  window.location.replace(appendParams(url, platform.params));
}

redirect();
