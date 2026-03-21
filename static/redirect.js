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

function redirect() {
  const route = parsePath();
  if (!route) {
    window.location.replace("/");
    return;
  }

  const prefs = readPrefs();
  const action = route.action || "trade";
  const platformId = resolve(prefs, route.chain, action);

  if (!platformId) {
    window.location.replace("/");
    return;
  }

  const platform = PLATFORM_MAP[platformId];
  if (!platform) {
    window.location.replace("/");
    return;
  }

  const url = platform.buildUrl(route.chain, route.token);
  window.location.replace(url);
}

redirect();
