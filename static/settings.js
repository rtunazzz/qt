let currentPrefs;

function initSettings() {
  currentPrefs = readPrefs();
  const form = document.getElementById("settings-form");

  renderEcosystemDefaults(form, currentPrefs);
  renderOverrides();
  initAddOverride();
  renderFooter();
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
    const chains = eco === "sol" ? ["sol"] : ["eth", "base", "bsc"];

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

function resetSelect(select, placeholder, disabled = true) {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  select.disabled = disabled;
}

function populateSelect(select, items) {
  resetSelect(select, select.options[0]?.textContent || "...", false);
  for (const { value, label } of items) {
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

  function resetForm() {
    chainSelect.value = "";
    resetSelect(actionSelect, "Action...");
    resetSelect(platformSelect, "Platform...");
    addBtn.disabled = true;
    addBtn.classList.remove("pending");
  }

  populateSelect(chainSelect, Object.entries(CHAINS).map(([id, c]) => ({ value: id, label: c.name })));

  chainSelect.addEventListener("change", () => {
    resetSelect(platformSelect, "Platform...");
    addBtn.disabled = true;

    if (!chainSelect.value) {
      resetSelect(actionSelect, "Action...");
      return;
    }

    populateSelect(actionSelect,
      ACTIONS.filter((a) => getPlatformsForChain(chainSelect.value, a).length)
        .map((a) => ({ value: a, label: a.charAt(0).toUpperCase() + a.slice(1) }))
    );
  });

  actionSelect.addEventListener("change", () => {
    addBtn.disabled = true;

    if (!actionSelect.value) {
      resetSelect(platformSelect, "Platform...");
      return;
    }

    populateSelect(platformSelect,
      getPlatformsForChain(chainSelect.value, actionSelect.value)
        .map((p) => ({ value: p.id, label: p.name }))
    );
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

    resetForm();
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
