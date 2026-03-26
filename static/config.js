const COOKIE_NAME = "qt";

function chainsForEcosystem(eco) {
  return Object.entries(CHAINS).filter(([_, c]) => c.ecosystem === eco).map(([id]) => id);
}

function getPlatformsForChain(chain, category) {
  return PLATFORMS.filter((p) => p.category === category && p.chains.includes(chain));
}

function getEcosystem(chain) {
  return CHAINS[chain]?.ecosystem;
}

function readPrefs() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return DEFAULT_PREFS;
  try {
    return JSON.parse(atob(match[1]));
  } catch {
    return DEFAULT_PREFS;
  }
}

function writePrefs(prefs) {
  const encoded = btoa(JSON.stringify(prefs));
  document.cookie = `${COOKIE_NAME}=${encoded};path=/;max-age=31536000;SameSite=Lax`;
}
