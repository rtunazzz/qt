function initSettings() {
  const prefs = readPrefs();
  const form = document.getElementById("settings-form");

  renderDefaultAction(form, prefs);
  renderEcosystemDefaults(form, prefs);
  renderChainOverrides(form, prefs);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveSettings(form);
  });
}

function renderDefaultAction(form, prefs) {
  const select = form.querySelector("#default-action");
  select.value = prefs.action || "trade";
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

function renderChainOverrides(form, prefs) {
  const container = document.getElementById("overrides");
  container.innerHTML = "";

  for (const [chainId, chain] of Object.entries(CHAINS)) {
    const section = document.createElement("details");
    section.className = "chain-override";

    const summary = document.createElement("summary");
    const overrideCount = Object.keys(prefs.overrides?.[chainId] || {}).length;
    summary.textContent = `${chain.name}${overrideCount ? ` (${overrideCount} override${overrideCount > 1 ? "s" : ""})` : ""}`;
    section.appendChild(summary);

    for (const action of ACTIONS) {
      const platforms = getPlatformsForChain(chainId, action);
      if (!platforms.length) continue;

      const row = document.createElement("div");
      row.className = "override-row";

      const label = document.createElement("label");
      label.textContent = action.charAt(0).toUpperCase() + action.slice(1);
      label.setAttribute("for", `override-${chainId}-${action}`);

      const select = document.createElement("select");
      select.id = `override-${chainId}-${action}`;
      select.name = `override-${chainId}-${action}`;

      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = "— Use default —";
      select.appendChild(defaultOpt);

      for (const p of platforms) {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        select.appendChild(opt);
      }

      select.value = prefs.overrides?.[chainId]?.[action] || "";

      row.appendChild(label);
      row.appendChild(select);
      section.appendChild(row);
    }

    container.appendChild(section);
  }
}

function saveSettings(form) {
  const prefs = {
    action: form.querySelector("#default-action").value,
    sol: {},
    evm: {},
    overrides: {},
  };

  for (const eco of ["sol", "evm"]) {
    for (const action of ACTIONS) {
      const select = form.querySelector(`#${eco}-${action}`);
      if (select?.value) prefs[eco][action] = select.value;
    }
  }

  for (const [chainId] of Object.entries(CHAINS)) {
    const chainOverrides = {};
    for (const action of ACTIONS) {
      const select = form.querySelector(`#override-${chainId}-${action}`);
      if (select?.value) chainOverrides[action] = select.value;
    }
    if (Object.keys(chainOverrides).length) {
      prefs.overrides[chainId] = chainOverrides;
    }
  }

  writePrefs(prefs);

  const btn = form.querySelector("button[type=submit]");
  const original = btn.textContent;
  btn.textContent = "Saved!";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 1200);
}

document.addEventListener("DOMContentLoaded", initSettings);
