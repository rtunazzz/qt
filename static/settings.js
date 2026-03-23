let currentPrefs;

function initSettings() {
  if (tryImport()) return;

  currentPrefs = readPrefs();
  const form = document.getElementById("settings-form");

  renderEcosystemDefaults(form, currentPrefs);
  renderOverrides();
  initAddOverride();
  initExport();
  renderFooter();
}

function tryImport() {
  const param = new URLSearchParams(window.location.search).get("c");
  if (!param) return false;

  let prefs;
  try {
    prefs = JSON.parse(atob(param));
  } catch {
    return false;
  }

  const banner = document.createElement("div");
  banner.className = "import-banner";
  banner.innerHTML = `
    <span class="import-text">Import shared settings? This will replace your current config.</span>
    <div class="import-actions">
      <button class="import-accept" id="import-accept">Import</button>
      <button class="import-decline" id="import-decline">Cancel</button>
    </div>`;
  document.body.prepend(banner);
  requestAnimationFrame(() => banner.classList.add("visible"));

  document.getElementById("import-accept").addEventListener("click", () => {
    writePrefs(prefs);
    window.location.replace("/settings");
  });

  document.getElementById("import-decline").addEventListener("click", () => {
    banner.classList.remove("visible");
    setTimeout(() => {
      banner.remove();
      initSettings();
    }, 300);
    window.history.replaceState({}, "", "/settings");
  });

  return true;
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).catch(() => copyFallback(text));
  }
  return copyFallback(text);
}

function copyFallback(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  return Promise.resolve();
}

function initExport() {
  const btn = document.getElementById("export-btn");
  btn.addEventListener("click", () => {
    const encoded = btoa(JSON.stringify(currentPrefs));
    const url = `${window.location.origin}/settings?c=${encoded}`;
    copyText(url).then(() => {
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = "Export";
        btn.classList.remove("copied");
      }, 1500);
    });
  });
}

function saveCurrentPrefs() {
  const form = document.getElementById("settings-form");
  const prefs = {
    sol: {},
    evm: {},
    overrides: currentPrefs.overrides || {},
  };

  for (const eco of ["sol", "evm"]) {
    for (const action of ACTIONS) {
      const select = form.querySelector(`#${eco}-${action}`);
      if (select?.value) prefs[eco][action] = select.value;
    }
  }

  writePrefs(prefs);
  currentPrefs = prefs;
}

function renderEcosystemDefaults(form, prefs) {
  for (const eco of ["sol", "evm"]) {
    const chains = chainsForEcosystem(eco);

    for (const action of ACTIONS) {
      const select = form.querySelector(`#${eco}-${action}`);
      if (!select) continue;

      const platforms = new Map();
      for (const chain of chains) {
        for (const p of getPlatformsForChain(chain, action)) {
          platforms.set(p.id, p);
        }
      }

      select.innerHTML = "";
      for (const [id, p] of platforms) {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = p.name;
        select.appendChild(opt);
      }

      select.value = prefs[eco]?.[action] || select.options[0]?.value || "";
      select.addEventListener("change", saveCurrentPrefs);
    }
  }
}

function removeOverride(chainId, action) {
  delete currentPrefs.overrides[chainId][action];
  if (!Object.keys(currentPrefs.overrides[chainId]).length) {
    delete currentPrefs.overrides[chainId];
  }
  saveCurrentPrefs();
  renderOverrides();
}

function renderOverrides() {
  const list = document.getElementById("overrides-list");
  const overrides = currentPrefs.overrides || {};
  const items = [];

  for (const [chainId, actions] of Object.entries(overrides)) {
    const chain = CHAINS[chainId];
    if (!chain) continue;
    for (const [action, platformId] of Object.entries(actions)) {
      const platform = PLATFORM_MAP[platformId];
      if (!platform) continue;
      items.push({ chainId, chain, action, platform });
    }
  }

  if (!items.length) {
    list.innerHTML = '<div class="override-empty">No overrides configured</div>';
    return;
  }

  list.innerHTML = items.map(({ chainId, chain, action, platform }) =>
    `<div class="override-item">
      <div class="override-info">
        <span class="badge sm ${chain.ecosystem}">${chain.name}</span>
        <span class="override-action">${action}</span>
        <span class="override-arrow">\u2192</span>
        <span class="override-platform">${platform.name}</span>
      </div>
      <button type="button" class="remove-btn" data-chain="${chainId}" data-action="${action}">\u00d7</button>
    </div>`
  ).join("");

  list.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => removeOverride(btn.dataset.chain, btn.dataset.action));
  });
}

function setSelectOptions(select, placeholder, options) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  select.disabled = !options;
  if (!options) return;
  for (const [value, label] of options) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    select.appendChild(opt);
  }
}

function initAddOverride() {
  const chainSelect = document.getElementById("add-chain");
  const actionSelect = document.getElementById("add-action");
  const platformSelect = document.getElementById("add-platform");
  const addBtn = document.getElementById("add-btn");

  setSelectOptions(chainSelect, "Chain...",
    Object.entries(CHAINS).map(([id, c]) => [id, c.name]));

  chainSelect.addEventListener("change", () => {
    setSelectOptions(platformSelect, "Platform...");
    addBtn.disabled = true;

    if (!chainSelect.value) {
      setSelectOptions(actionSelect, "Action...");
      return;
    }

    setSelectOptions(actionSelect, "Action...",
      ACTIONS.filter((a) => getPlatformsForChain(chainSelect.value, a).length)
        .map((a) => [a, a.charAt(0).toUpperCase() + a.slice(1)]));
  });

  actionSelect.addEventListener("change", () => {
    addBtn.disabled = true;

    if (!actionSelect.value) {
      setSelectOptions(platformSelect, "Platform...");
      return;
    }

    setSelectOptions(platformSelect, "Platform...",
      getPlatformsForChain(chainSelect.value, actionSelect.value)
        .map((p) => [p.id, p.name]));
  });

  platformSelect.addEventListener("change", () => {
    const hasValue = !!platformSelect.value;
    addBtn.disabled = !hasValue;
    addBtn.classList.toggle("pending", hasValue);
  });

  addBtn.addEventListener("click", () => {
    const chain = chainSelect.value;
    const action = actionSelect.value;
    const platform = platformSelect.value;
    if (!chain || !action || !platform) return;

    if (!currentPrefs.overrides) currentPrefs.overrides = {};
    if (!currentPrefs.overrides[chain]) currentPrefs.overrides[chain] = {};
    currentPrefs.overrides[chain][action] = platform;

    chainSelect.value = "";
    setSelectOptions(actionSelect, "Action...");
    setSelectOptions(platformSelect, "Platform...");
    addBtn.disabled = true;
    addBtn.classList.remove("pending");

    saveCurrentPrefs();
    renderOverrides();
  });
}

function renderFooter() {
  const host = window.location.hostname === "localhost"
    ? "qt.dev"
    : window.location.host;

  const container = document.getElementById("footer-routes");

  const base = `${host}/<span class="dim">{chain}</span>/<span class="dim">{token}</span>`;
  const routes = [
    { suffix: "", desc: "trade (default)" },
    { suffix: "/trade", desc: "trade" },
    { suffix: "/chart", desc: "chart" },
    { suffix: "/explore", desc: "explore" },
  ];

  let html = '<div class="footer-title">Usage</div>';
  html += '<div class="footer-table">';
  for (const r of routes) {
    const suffix = r.suffix ? `<span class="accent">${r.suffix}</span>` : "";
    html += `<div class="footer-route">`;
    html += `<code>${base}${suffix}</code>`;
    html += `<span class="footer-desc">\u2192 ${r.desc}</span>`;
    html += `</div>`;
  }
  html += '</div>';

  html += '<div class="footer-chains"><span>Chains</span>';
  for (const id of Object.keys(CHAINS)) {
    html += `<code class="chain-tag">${id}</code>`;
  }
  html += '</div>';

  container.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", initSettings);
