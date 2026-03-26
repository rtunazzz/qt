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
