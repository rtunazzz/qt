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

function composeId(base, variantId) {
  if (!base || base === SAME_AS_TRADE) return base;
  const platform = PLATFORM_MAP[base];
  if (!platform?.variants?.length) return base;
  if (!variantId || variantId === DEFAULT_VARIANT) return base;
  return `${base}:${variantId}`;
}

function fillVariantOptions(vsel, variants) {
  vsel.innerHTML = "";
  for (const v of variants) {
    const opt = document.createElement("option");
    opt.value = v.id;
    opt.textContent = v.name;
    vsel.appendChild(opt);
  }
}

function variantFieldFor(select) {
  const next = select.closest(".field")?.nextElementSibling;
  return next?.classList?.contains("variant-field") ? next : null;
}

function syncVariantWrap(select, currentVariantId) {
  const parsed = parsePlatformId(select.value);
  const platform = parsed && PLATFORM_MAP[parsed.base];
  const variants = platform?.variants;
  let field = variantFieldFor(select);

  if (!variants?.length) {
    if (field) field.hidden = true;
    return;
  }

  if (!field) {
    field = document.createElement("div");
    field.className = "field variant-field";
    const label = document.createElement("label");
    label.textContent = "Instance";
    const wrap = document.createElement("div");
    wrap.className = "select-wrap variant-wrap";
    const vsel = document.createElement("select");
    wrap.appendChild(vsel);
    field.appendChild(label);
    field.appendChild(wrap);
    select.closest(".field").after(field);
    vsel.addEventListener("change", saveCurrentPrefs);
  }

  field.hidden = false;
  const vsel = field.querySelector("select");
  fillVariantOptions(vsel, variants);
  vsel.value = variants.some((v) => v.id === currentVariantId)
    ? currentVariantId
    : (variants.find((v) => v.id === DEFAULT_VARIANT)?.id ?? variants[0].id);
}

function readSelectValue(select) {
  const field = variantFieldFor(select);
  if (field && !field.hidden) {
    return composeId(select.value, field.querySelector("select").value);
  }
  return select.value;
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
      if (!select?.value) continue;
      prefs[eco][action] = readSelectValue(select);
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
      if (action === "chart") {
        const opt = document.createElement("option");
        opt.value = SAME_AS_TRADE;
        opt.textContent = "Same as Trading";
        select.appendChild(opt);
      }
      for (const [id, p] of platforms) {
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = p.name;
        select.appendChild(opt);
      }

      const stored = prefs[eco]?.[action];
      const parsed = parsePlatformId(stored);
      const firstReal = [...select.options].find((o) => o.value && o.value !== SAME_AS_TRADE);
      const baseExists = parsed && [...select.options].some((o) => o.value === parsed.base);
      select.value = (baseExists ? parsed.base : firstReal?.value) || select.options[0]?.value || "";
      syncVariantWrap(select, parsed?.variant);
      select.addEventListener("change", () => {
        syncVariantWrap(select);
        saveCurrentPrefs();
      });

      if (action === "chart") {
        const hint = document.querySelector(`.hint-field[data-hint-for="${eco}-chart"]`);
        if (hint) {
          const sync = () => { hint.hidden = select.value !== SAME_AS_TRADE; };
          sync();
          select.addEventListener("change", sync);
        }
      }
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
      if (action === "chart" && platformId === SAME_AS_TRADE) {
        items.push({ chainId, chain, action, platformName: "Same as Trading" });
        continue;
      }
      const parsed = parsePlatformId(platformId);
      const platform = parsed && PLATFORM_MAP[parsed.base];
      if (!platform) continue;
      const variant = resolveVariant(platform, parsed.variant);
      const platformName = variant && parsed.variant
        ? `${platform.name} \u00b7 ${variant.name}`
        : platform.name;
      items.push({ chainId, chain, action, platformName });
    }
  }

  if (!items.length) {
    list.innerHTML = '<div class="override-empty">No overrides configured</div>';
    return;
  }

  list.innerHTML = items.map(({ chainId, chain, action, platformName }) =>
    `<div class="override-item">
      <div class="override-info">
        <span class="badge sm ${chain.ecosystem}">${chain.name}</span>
        <span class="override-action">${action}</span>
        <span class="override-arrow">\u2192</span>
        <span class="override-platform">${platformName}</span>
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
  const variantWrap = document.getElementById("add-variant-wrap");
  const variantSelect = document.getElementById("add-variant");
  const addBtn = document.getElementById("add-btn");

  const hideVariant = () => {
    variantWrap.hidden = true;
    variantSelect.innerHTML = "";
  };

  setSelectOptions(chainSelect, "Chain...",
    Object.entries(CHAINS).map(([id, c]) => [id, c.name]));

  chainSelect.addEventListener("change", () => {
    setSelectOptions(platformSelect, "Platform...");
    hideVariant();
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
    hideVariant();

    if (!actionSelect.value) {
      setSelectOptions(platformSelect, "Platform...");
      return;
    }

    const options = getPlatformsForChain(chainSelect.value, actionSelect.value)
      .map((p) => [p.id, p.name]);
    if (actionSelect.value === "chart" && getPlatformsForChain(chainSelect.value, "trade").length) {
      options.unshift([SAME_AS_TRADE, "Same as Trading"]);
    }
    setSelectOptions(platformSelect, "Platform...", options);
  });

  platformSelect.addEventListener("change", () => {
    const hasValue = !!platformSelect.value;
    addBtn.disabled = !hasValue;
    addBtn.classList.toggle("pending", hasValue);

    const platform = PLATFORM_MAP[platformSelect.value];
    if (platform?.variants?.length) {
      fillVariantOptions(variantSelect, platform.variants);
      variantWrap.hidden = false;
    } else {
      hideVariant();
    }
  });

  addBtn.addEventListener("click", () => {
    const chain = chainSelect.value;
    const action = actionSelect.value;
    const platform = platformSelect.value;
    if (!chain || !action || !platform) return;

    const value = variantWrap.hidden ? platform : composeId(platform, variantSelect.value);

    if (!currentPrefs.overrides) currentPrefs.overrides = {};
    if (!currentPrefs.overrides[chain]) currentPrefs.overrides[chain] = {};
    currentPrefs.overrides[chain][action] = value;

    chainSelect.value = "";
    setSelectOptions(actionSelect, "Action...");
    setSelectOptions(platformSelect, "Platform...");
    hideVariant();
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
