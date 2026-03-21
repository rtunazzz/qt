let currentPrefs;

function initSettings() {
  currentPrefs = readPrefs();
  const form = document.getElementById("settings-form");

  renderEcosystemDefaults(form, currentPrefs);
  renderOverrides();
  initAddOverride();
  renderFooter();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveSettings(form);
  });
}

function renderEcosystemDefaults(form, prefs) {
  for (const eco of ["sol", "evm"]) {
    for (const action of ACTIONS) {
      const select = form.querySelector(`#${eco}-${action}`);
      if (!select) continue;

      const chains = eco === "sol" ? ["sol"] : ["eth", "base", "bsc"];
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
    }
  }
}

function renderOverrides() {
  const list = document.getElementById("overrides-list");
  list.innerHTML = "";

  const overrides = currentPrefs.overrides || {};
  let hasAny = false;

  for (const [chainId, actions] of Object.entries(overrides)) {
    const chain = CHAINS[chainId];
    if (!chain) continue;

    for (const [action, platformId] of Object.entries(actions)) {
      const platform = PLATFORM_MAP[platformId];
      if (!platform) continue;
      hasAny = true;

      const row = document.createElement("div");
      row.className = "override-item";

      const info = document.createElement("div");
      info.className = "override-info";

      const chainBadge = document.createElement("span");
      chainBadge.className = `override-chain ${chain.ecosystem}`;
      chainBadge.textContent = chain.name;

      const actionLabel = document.createElement("span");
      actionLabel.className = "override-action";
      actionLabel.textContent = action;

      const arrow = document.createElement("span");
      arrow.className = "override-arrow";
      arrow.textContent = "\u2192";

      const platformLabel = document.createElement("span");
      platformLabel.className = "override-platform";
      platformLabel.textContent = platform.name;

      info.appendChild(chainBadge);
      info.appendChild(actionLabel);
      info.appendChild(arrow);
      info.appendChild(platformLabel);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "\u00d7";
      removeBtn.addEventListener("click", () => {
        delete currentPrefs.overrides[chainId][action];
        if (!Object.keys(currentPrefs.overrides[chainId]).length) {
          delete currentPrefs.overrides[chainId];
        }
        renderOverrides();
      });

      row.appendChild(info);
      row.appendChild(removeBtn);
      list.appendChild(row);
    }
  }

  if (!hasAny) {
    const empty = document.createElement("div");
    empty.className = "override-empty";
    empty.textContent = "No overrides configured";
    list.appendChild(empty);
  }
}

function initAddOverride() {
  const chainSelect = document.getElementById("add-chain");
  const actionSelect = document.getElementById("add-action");
  const platformSelect = document.getElementById("add-platform");
  const addBtn = document.getElementById("add-btn");

  chainSelect.innerHTML = '<option value="">Chain...</option>';
  for (const [id, chain] of Object.entries(CHAINS)) {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = chain.name;
    chainSelect.appendChild(opt);
  }

  chainSelect.addEventListener("change", () => {
    const chain = chainSelect.value;
    actionSelect.innerHTML = '<option value="">Action...</option>';
    platformSelect.innerHTML = '<option value="">Platform...</option>';
    platformSelect.disabled = true;
    addBtn.disabled = true;

    if (!chain) {
      actionSelect.disabled = true;
      return;
    }

    actionSelect.disabled = false;
    for (const action of ACTIONS) {
      if (getPlatformsForChain(chain, action).length) {
        const opt = document.createElement("option");
        opt.value = action;
        opt.textContent = action.charAt(0).toUpperCase() + action.slice(1);
        actionSelect.appendChild(opt);
      }
    }
  });

  actionSelect.addEventListener("change", () => {
    const chain = chainSelect.value;
    const action = actionSelect.value;
    platformSelect.innerHTML = '<option value="">Platform...</option>';
    addBtn.disabled = true;

    if (!action) {
      platformSelect.disabled = true;
      return;
    }

    platformSelect.disabled = false;
    for (const p of getPlatformsForChain(chain, action)) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      platformSelect.appendChild(opt);
    }
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
    actionSelect.innerHTML = '<option value="">Action...</option>';
    actionSelect.disabled = true;
    platformSelect.innerHTML = '<option value="">Platform...</option>';
    platformSelect.disabled = true;
    addBtn.disabled = true;
    addBtn.classList.remove("pending");

    renderOverrides();
  });
}

function flushPendingOverride() {
  const chain = document.getElementById("add-chain").value;
  const action = document.getElementById("add-action").value;
  const platform = document.getElementById("add-platform").value;
  if (!chain || !action || !platform) return;

  if (!currentPrefs.overrides) currentPrefs.overrides = {};
  if (!currentPrefs.overrides[chain]) currentPrefs.overrides[chain] = {};
  currentPrefs.overrides[chain][action] = platform;
}

function renderFooter() {
  const host = window.location.hostname === "localhost"
    ? "qt.dev"
    : window.location.host;

  const container = document.getElementById("footer-routes");

  const routes = [
    { path: "/{chain}/{token}", desc: "redirect using default action (trade)" },
    { path: "/{chain}/{token}/trade", desc: "open in trading platform" },
    { path: "/{chain}/{token}/chart", desc: "open in charting tool" },
    { path: "/{chain}/{token}/explore", desc: "open in block explorer" },
  ];

  const chains = Object.entries(CHAINS).map(([id, c]) => `${id} (${c.name})`).join(", ");

  let html = '<div class="footer-title">Usage</div>';
  html += '<div class="footer-table">';
  for (const r of routes) {
    html += `<div class="footer-route">`;
    html += `<code>${host}${r.path}</code>`;
    html += `<span>${r.desc}</span>`;
    html += `</div>`;
  }
  html += '</div>';
  html += `<div class="footer-chains">Supported chains: <code>${chains}</code></div>`;

  container.innerHTML = html;
}

function saveSettings(form) {
  flushPendingOverride();

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

  const btn = form.querySelector(".save-btn");
  const textEl = btn.querySelector(".save-text");
  const iconEl = btn.querySelector(".save-icon");
  textEl.textContent = "Saved";
  iconEl.textContent = "\u2713";
  btn.disabled = true;
  setTimeout(() => {
    textEl.textContent = "Save preferences";
    iconEl.innerHTML = "&rarr;";
    btn.disabled = false;
  }, 1200);
}

document.addEventListener("DOMContentLoaded", initSettings);
