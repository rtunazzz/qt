const CHAINS = {
  sol:        { name: "Solana",     ecosystem: "sol",  chainId: 1399811149, slug: "solana" },
  eth:        { name: "Ethereum",   ecosystem: "evm",  chainId: 1,          slug: "ethereum" },
  base:       { name: "Base",       ecosystem: "evm",  chainId: 8453,       slug: "base" },
  bsc:        { name: "BSC",        ecosystem: "evm",  chainId: 56,         slug: "bsc" },
  arb:        { name: "Arbitrum",   ecosystem: "evm",  chainId: 42161,      slug: "arbitrum" },
  op:         { name: "Optimism",   ecosystem: "evm",  chainId: 10,         slug: "optimism" },
  matic:      { name: "Polygon",    ecosystem: "evm",  chainId: 137,        slug: "polygon" },
  avax:       { name: "Avalanche",  ecosystem: "evm",  chainId: 43114,      slug: "avalanche" },
  ftm:        { name: "Fantom",     ecosystem: "evm",  chainId: 250,        slug: "fantom" },
  sonic:      { name: "Sonic",      ecosystem: "evm",  chainId: 146,        slug: "sonic" },
  blast:      { name: "Blast",      ecosystem: "evm",  chainId: 81457,      slug: "blast" },
  mantle:     { name: "Mantle",     ecosystem: "evm",  chainId: 5000,       slug: "mantle" },
  sui:        { name: "Sui",        ecosystem: "sui",  chainId: null,       slug: "sui" },
  tron:       { name: "Tron",       ecosystem: "tron", chainId: null,       slug: "tron" },
  ton:        { name: "TON",        ecosystem: "ton",  chainId: null,       slug: "ton" },
  btc:        { name: "Bitcoin",    ecosystem: "btc",  chainId: null,       slug: "bitcoin" },
  shape:      { name: "Shape",      ecosystem: "evm",  chainId: 360,        slug: "shape" },
  worldchain: { name: "Worldchain", ecosystem: "evm",  chainId: 480,        slug: "worldchain" },
  apechain:   { name: "ApeChain",   ecosystem: "evm",  chainId: 33139,      slug: "apechain" },
  morph:      { name: "Morph",      ecosystem: "evm",  chainId: 2818,       slug: "morph" },
  unichain:   { name: "Unichain",   ecosystem: "evm",  chainId: 130,        slug: "unichain" },
  monad:      { name: "Monad",      ecosystem: "evm",  chainId: 143,        slug: "monad" },
  abstract:   { name: "Abstract",   ecosystem: "evm",  chainId: 2741,       slug: "abstract" },
  ink:        { name: "Ink",        ecosystem: "evm",  chainId: 57073,      slug: "ink" },
  soneium:    { name: "Soneium",    ecosystem: "evm",  chainId: 1868,       slug: "soneium" },
  berachain:  { name: "Berachain",  ecosystem: "evm",  chainId: 80094,      slug: "berachain" },
  hyperevm:   { name: "HyperEVM",   ecosystem: "evm",  chainId: 999,        slug: "hyperevm" },
  story:      { name: "Story",      ecosystem: "evm",  chainId: 1514,       slug: "story" },
  xlayer:     { name: "X Layer",    ecosystem: "evm",  chainId: 196,        slug: "xlayer" },
  plasma:     { name: "Plasma",     ecosystem: "evm",  chainId: 9745,       slug: "plasma" },
  flow:       { name: "Flow",       ecosystem: "evm",  chainId: 747,        slug: "flow" },
  megaeth:    { name: "MegaETH",    ecosystem: "evm",  chainId: 4326,       slug: "megaeth" },
  tempo:      { name: "Tempo",      ecosystem: "evm",  chainId: 4217,       slug: "tempo" },
  robinhood:  { name: "Robinhood",  ecosystem: "evm",  chainId: 4663,       slug: "robinhood" },
  arc:        { name: "Arc",        ecosystem: "evm",  chainId: 5042,       slug: "arc" },
  stable:     { name: "Stable",     ecosystem: "evm",  chainId: 988,        slug: "stable" },
};

function resolveChainId(chain) {
  const id = CHAINS[chain].chainId;
  if (id === null) throw new Error(`No chainId for chain "${chain}"`);
  return String(id);
}

function resolveSlug(overrides, chain) {
  return overrides?.[chain] ?? CHAINS[chain].slug ?? chain;
}

function explorerPath(kind, { tx = "tx", block = "block", def }) {
  return kind === "tx" ? tx : kind === "block" ? block : def;
}

const COOKIE_NAME = "qt";

function chainsForEcosystem(eco) {
  return Object.entries(CHAINS).filter(([_, c]) => c.ecosystem === eco).map(([id]) => id);
}

const CATEGORY_ALIAS = { trade2: "trade" };

function categoryFor(action) {
  return CATEGORY_ALIAS[action] || action;
}

function getPlatformsForChain(chain, category) {
  return PLATFORMS.filter((p) => p.categories.includes(categoryFor(category)) && p.chains.includes(chain));
}

function getEcosystem(chain) {
  return CHAINS[chain]?.ecosystem;
}

const ALL_EVM = chainsForEcosystem("evm");

const PLATFORMS = [
  { id: "jupiter", name: "Jupiter", categories: ["trade", "chart"], chains: ["sol"], params: ["sell", "buy"],
    buildUrl: (c, t) => `https://jup.ag/swap/SOL-${t}` },
  { id: "photon-sol", name: "Photon", categories: ["trade", "chart"], chains: ["sol"],
    buildUrl: (c, t) => `https://photon-sol.tinyastro.io/en/r/@rtunazzz/${t}` },
  { id: "axiom", name: "Axiom", categories: ["trade", "chart"], chains: ["sol", "bsc", "robinhood"],
    buildUrl: (c, t) => {
      if (c === "sol") return `https://axiom.trade/t/${t}/@rtuna`;
      const slug = { bsc: "bnb" };
      return `https://axiom.trade/meme/${t}?chain=${slug[c] ?? c}`;
    } },
  { id: "bloom-sol", name: "Bloom", categories: ["trade"], chains: ["sol"],
    buildUrl: (c, t) => `https://t.me/BloomSolana_bot?start=ref_rtuna_ca_${t}` },
  { id: "uniswap", name: "Uniswap", categories: ["trade", "chart"], chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "blast", "unichain", "worldchain", "soneium"], params: ["inputCurrency"],
    resolveChain: (c) => resolveSlug({ bsc: "bnb" }, c),
    buildUrl: (c, t, s) => `https://app.uniswap.org/swap?outputCurrency=${t}&chain=${s}` },
  { id: "1inch", name: "1inch", categories: ["trade"], chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "ftm", "blast", "mantle"],
    resolveChain: resolveChainId,
    buildUrl: (c, t, s) => `https://app.1inch.io/#/${s}/simple/swap/ETH/${t}` },
  { id: "photon-base", name: "Photon", categories: ["trade", "chart"], chains: ["base"],
    buildUrl: (c, t) => `https://photon-base.tinyastro.io/en/r/@rtunazzz/${t}` },
  { id: "gmgn", name: "GMGN", categories: ["trade", "chart"], chains: ["sol", "eth", "base", "bsc", "tron", "blast", "monad", "megaeth", "hyperevm", "xlayer", "robinhood", "arc", "stable"],
    buildUrl: (c, t) => `https://gmgn.ai/${c}/token/rtuna_${t}` },
  { id: "sigma", name: "Sigma", categories: ["trade"], chains: ["eth", "base", "bsc", "avax", "sol", "robinhood", "arc"],
    variants: [
      { id: "default", name: "Standard", bot: "Sigma_buyBot" },
      { id: "sell", name: "Sell", bot: "Sigma_SellBot" },
      { id: "vip", name: "VIP", bot: "SigmaTradingVIP_bot" },
      { id: "ambassador", name: "Ambassador", bot: "sigma_ambassador_bot" },
      ...Array.from({ length: 9 }, (_, i) => ({ id: `t${i + 3}`, name: `Server ${i + 3}`, bot: `SigmaTrading${i + 3}_bot` })),
    ],
    buildUrl: (c, t, _, v) => `https://t.me/${v.bot}?start=x1865619192-${t}-${c}` },
  { id: "based", name: "Based Bot", categories: ["trade"], chains: ["sol", "eth", "base", "bsc", "arb", "avax", "abstract", "hyperevm", "ink", "story", "xlayer", "plasma", "unichain", "monad", "megaeth", "tempo", "robinhood", "arc", "stable"],
    variants: [
      { id: "default", name: "Standard", bot: "based_eth_bot" },
      ...Array.from({ length: 4 }, (_, i) => ({ id: `based${i + 2}`, name: `Server ${i + 2}`, bot: `based${i + 2}_eth_bot` })),
      { id: "vip-us-west", name: "VIP (US West)", bot: "based_vip_bot" },
      { id: "vip-eu", name: "VIP (EU)", bot: "based_vip_eu_bot" },
      { id: "vip-us-east", name: "VIP (US East)", bot: "based_vip_us_bot" },
      { id: "exclusive", name: "Exclusive", bot: "based_exclusive_bot" },
    ],
    buildUrl: (c, t, _, v) => `https://t.me/${v.bot}?start=r_rtunazzz_b_${t}` },
  { id: "based-web", name: "Based Bot Web", categories: ["trade", "chart"], chains: ["sol", "eth", "base", "bsc", "arb", "avax", "abstract", "hyperevm", "ink", "story", "xlayer", "plasma", "unichain", "monad", "megaeth", "tempo", "robinhood", "arc", "stable"],
    buildUrl: (c, t) => {
      const pathSlug = { hyperevm: "hype" };
      return `https://basedbot.app/r/rtunazzz/token/${pathSlug[c] ?? c}/${t}`;
    } },
  { id: "banana", name: "Banana Gun", categories: ["trade"], chains: ["eth", "base", "bsc", "megaeth", "robinhood"],
    variants: [
      { id: "default", name: "Standard", bot: "BananaGun_bot" },
      ...Array.from({ length: 19 }, (_, i) => ({ id: `t${i + 2}`, name: `Server ${i + 2}`, bot: `BananaGun${i + 2}_bot` })),
    ],
    buildUrl: (c, t, _, v) => `https://t.me/${v.bot}?start=snp_rtunazzz_${t}` },
  { id: "banana-old", name: "Banana Gun Old", categories: ["trade"], chains: ["eth", "base", "bsc"],
    variants: [
      { id: "default", name: "Standard", bot: "BananaGunSniper_bot" },
      ...Array.from({ length: 16 }, (_, i) => ({ id: `t${i + 2}`, name: `Server ${i + 2}`, bot: `BananaGunSniper${i + 2}_bot` })),
    ],
    buildUrl: (c, t, _, v) => `https://t.me/${v.bot}?start=snp_rtunazzz_${t}` },
  { id: "bloom-evm", name: "Bloom", categories: ["trade"], chains: ["eth", "base", "bsc", "hyperevm", "robinhood"],
    buildUrl: (c, t) => `https://t.me/BloomEVMbot?start=ref_tuna_ca_${t}` },
  { id: "fomo", name: "FOMO", categories: ["trade", "chart"], chains: ["sol", "eth", "base", "bsc", "monad", "robinhood"],
    resolveChain: resolveChainId,
    buildUrl: (c, t, s) => `https://fomo.family/coin?address=${t}&chainId=${s}` },
  { id: "azura", name: "Azura", categories: ["trade", "chart"], chains: ["sol", "eth", "base", "bsc", "arb"],
    resolveChain: resolveChainId,
    buildUrl: (c, t, s) => `https://app.azura.xyz/spot/${s}/${t}` },
  { id: "photon-tron", name: "Photon", categories: ["trade", "chart"], chains: ["tron"],
    buildUrl: (c, t) => `https://photon-tron.tinyastro.io/en/r/@rtunazzz/${t}` },
  { id: "maestro", name: "Maestro", categories: ["trade"], chains: [...ALL_EVM, "tron", "ton"],
    buildUrl: (c, t) => `https://t.me/MaestroSniperBot?start=${t}-rtunazzz` },
  { id: "padre", name: "Padre", categories: ["trade", "chart"], chains: ["sol", "eth", "base", "bsc", "robinhood"],
    resolveChain: (c) => resolveSlug({ eth: "eth" }, c),
    buildUrl: (c, t, s) => `https://trade.padre.gg/trade/${s}/${t}?rk=tuna` },
  { id: "shuriken", name: "Shuriken", categories: ["trade"], chains: ["sui", "tron", "eth", "base", "bsc", "arb", "avax", "ftm"],
    buildUrl: (c, t) => `https://t.me/ShurikenTradeBot?start=${t}` },
  { id: "solscan", name: "Solscan", categories: ["explore"], chains: ["sol"],
    buildUrl: (c, t, s, v, sp, kind) => `https://solscan.io/${explorerPath(kind, { def: "token" })}/${t}` },
  { id: "etherscan", name: "Etherscan", categories: ["explore"], chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "ftm", "blast", "mantle", "sonic", "worldchain", "apechain", "unichain", "monad", "abstract", "hyperevm", "plasma", "megaeth", "berachain", "robinhood", "stable"],
    buildUrl: (c, t, s, v, sp, kind) => {
      const d = { eth: "etherscan.io", base: "basescan.org", bsc: "bscscan.com", arb: "arbiscan.io", op: "optimistic.etherscan.io", matic: "polygonscan.com", avax: "snowscan.xyz", ftm: "ftmscan.com", blast: "blastscan.io", mantle: "mantlescan.xyz", sonic: "sonicscan.org", worldchain: "worldscan.org", apechain: "apescan.io", unichain: "uniscan.xyz", monad: "monadscan.com", abstract: "abscan.org", hyperevm: "hyperevmscan.io", plasma: "plasmascan.to", megaeth: "mega.etherscan.io", berachain: "beratrail.io", robinhood: "robinscan.io", stable: "stablescan.xyz" };
      return `https://${d[c] || "etherscan.io"}/${explorerPath(kind, { def: "address" })}/${t}`;
    } },
  { id: "blockscout", name: "Blockscout", categories: ["explore"], chains: ["eth", "base", "arb", "matic", "soneium", "shape", "story", "morph", "ink", "flow", "tempo", "robinhood", "arc"],
    buildUrl: (c, t, s, v, sp, kind) => {
      const d = { eth: "eth.blockscout.com", base: "base.blockscout.com", arb: "arbitrum.blockscout.com", matic: "polygon.blockscout.com", soneium: "soneium.blockscout.com", shape: "shapescan.xyz", story: "www.storyscan.io", morph: "explorer.morph.network", ink: "explorer.inkonchain.com", flow: "evm.flowscan.io", tempo: "explore.tempo.xyz", robinhood: "robinhoodchain.blockscout.com", arc: "arc-mainnet.cloud.blockscout.com" };
      return `https://${d[c] || "explorer.blockscout.com"}/${explorerPath(kind, { def: "address" })}/${t}`;
    } },
  { id: "suiscan", name: "Suiscan", categories: ["explore"], chains: ["sui"],
    buildUrl: (c, t, s, v, sp, kind) => `https://suiscan.xyz/mainnet/${explorerPath(kind, { block: "checkpoint", def: "coin" })}/${t}` },
  { id: "tronscan", name: "Tronscan", categories: ["explore"], chains: ["tron"],
    buildUrl: (c, t, s, v, sp, kind) => `https://tronscan.org/#/${explorerPath(kind, { tx: "transaction", def: "token20" })}/${t}` },
  { id: "mempool", name: "Mempool", categories: ["explore"], chains: ["btc"],
    buildUrl: (c, t, s, v, sp, kind) => `https://mempool.space/${explorerPath(kind, { def: "address" })}/${t}` },
  { id: "oklink", name: "OKLink", categories: ["explore"], chains: ["xlayer"],
    buildUrl: (c, t, s, v, sp, kind) => `https://www.oklink.com/x-layer/${explorerPath(kind, { def: "token" })}/${t}` },
  { id: "dexscreener", name: "DexScreener", categories: ["chart"], chains: ["sol", "sui", "tron", "ton", ...ALL_EVM], params: ["maker"],
    resolveChain: (c) => resolveSlug(null, c),
    buildUrl: (c, t, s) => `https://dexscreener.com/${s}/${t}` },
  { id: "geckoterminal", name: "GeckoTerminal", categories: ["chart"], chains: ["sol", "sui", "tron", "ton", ...ALL_EVM],
    resolveChain: (c) => resolveSlug({ eth: "eth", sui: "sui-network", matic: "polygon_pos", avax: "avax", ftm: "ftm" }, c),
    buildUrl: (c, t, s) => `https://www.geckoterminal.com/${s}/pools/${t}` },
  { id: "dextools", name: "DEXTools", categories: ["chart"], chains: ["sol", "sui", "tron", "ton", ...ALL_EVM], params: ["maker"],
    resolveChain: (c) => resolveSlug({ eth: "ether", bsc: "bnb" }, c),
    buildUrl: (c, t, s) => `https://www.dextools.io/app/en/${s}/pair-explorer/${t}` },
  { id: "birdeye", name: "Birdeye", categories: ["chart"], chains: ["sol", "eth", "base", "bsc", "arb", "op", "avax", "sui"],
    resolveChain: (c) => resolveSlug(null, c),
    buildUrl: (c, t, s) => `https://birdeye.so/token/${t}?chain=${s}` },
  { id: "defined", name: "Defined", categories: ["chart"], chains: ["sol", "sui", "tron", ...ALL_EVM], params: ["quoteToken", "preferredQuoteTokenAddress", "maker"],
    buildUrl: (c, t) => `https://www.defined.fi/${c}/${t}` },
  { id: "redefined", name: "ReDefined", categories: ["chart"], chains: ["sol", "sui", "tron", ...ALL_EVM], params: ["quoteToken", "preferredQuoteTokenAddress", "maker"],
    buildUrl: (c, t) => `https://re.defined.fi/token/${c}/${t}?ref=16VUY` },
];

const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

const ACTIONS = ["trade", "trade2", "chart", "explore"];

const SAME_AS_TRADE = "@trade";
const SENTINEL_ACTIONS = new Set(["trade2", "chart"]);

const EXPLORE_ALIASES = { tx: "explore", block: "explore" };
const ROUTE_ACTIONS = new Set([...ACTIONS, ...Object.keys(EXPLORE_ALIASES)]);
const KIND_SEGMENT = { explore: "address", tx: "tx", block: "block" };

const DEFAULT_PREFS = {
  sol: { trade: "axiom", trade2: SAME_AS_TRADE, chart: "dexscreener", explore: "solscan" },
  evm: { trade: "based", trade2: SAME_AS_TRADE, chart: "dexscreener", explore: "etherscan" },
  sui: { explore: "suiscan" },
  tron: { explore: "tronscan" },
  btc: { explore: "mempool" },
  overrides: {},
};

function parseRoute(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2 || parts.length > 3) return null;
  const chain = parts[0].toLowerCase();
  const token = parts[1];
  const action = parts[2]?.toLowerCase() || "trade";
  if (!CHAINS[chain]) return null;
  if (!ROUTE_ACTIONS.has(action)) return null;
  return { chain, token, action };
}

const DEFAULT_VARIANT = "default";

function parsePlatformId(id) {
  if (typeof id !== "string" || !id) return null;
  const idx = id.indexOf(":");
  if (idx === -1) return { base: id, variant: null };
  return { base: id.slice(0, idx), variant: id.slice(idx + 1) || null };
}

function resolveVariant(platform, variantId) {
  if (!platform.variants?.length) return undefined;
  const target = variantId || DEFAULT_VARIANT;
  return platform.variants.find((v) => v.id === target)
    || platform.variants.find((v) => v.id === DEFAULT_VARIANT)
    || platform.variants[0];
}

function fillTemplate(template, chain, token, searchParams, kind) {
  const meta = CHAINS[chain] || {};
  const vars = {
    token,
    chain,
    chainId: meta.chainId != null ? String(meta.chainId) : "",
    slug: meta.slug || chain,
    kind: KIND_SEGMENT[kind] || KIND_SEGMENT.explore,
  };
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (key in vars) return vars[key];
    if (searchParams?.has(key)) return searchParams.get(key);
    return "";
  });
}

function findCustom(customLinks, id) {
  if (!Array.isArray(customLinks) || !id?.startsWith("custom-")) return null;
  return customLinks.find((e) => e && e.id === id) ?? null;
}

function customPlatform(entry) {
  return {
    id: entry.id,
    name: entry.name,
    categories: ACTIONS,
    chains: Object.keys(CHAINS),
    custom: true,
    buildUrl: (c, t, _s, _v, searchParams, kind) => fillTemplate(entry.url, c, t, searchParams, kind),
  };
}

function buildRedirectUrl(platformId, chain, token, searchParams, customLinks, kind) {
  const parsed = parsePlatformId(platformId);
  const custom = parsed && findCustom(customLinks, parsed.base);
  const platform = custom ? customPlatform(custom) : (parsed && PLATFORM_MAP[parsed.base]);
  if (!platform) throw new Error(`Unknown platform "${platformId}"`);
  const variant = resolveVariant(platform, parsed.variant);
  const s = platform.resolveChain ? platform.resolveChain(chain) : chain;
  let dest = platform.buildUrl(chain, token, s, variant, searchParams, kind);
  if (platform.params?.length && platform.params.some((k) => searchParams.has(k))) {
    const target = new URL(dest);
    for (const key of platform.params) {
      if (searchParams.has(key)) target.searchParams.set(key, searchParams.get(key));
    }
    dest = target.toString();
  }
  return dest;
}

function isValidFor(id, chain, customLinks) {
  const parsed = parsePlatformId(id);
  if (!parsed) return false;
  if (findCustom(customLinks, parsed.base)) return true;
  const platform = PLATFORM_MAP[parsed.base];
  if (!platform || !platform.chains.includes(chain)) return false;
  if (parsed.variant && !platform.variants?.some((v) => v.id === parsed.variant)) return false;
  return true;
}

function resolveDirect(prefs, chain, action) {
  const eco = CHAINS[chain]?.ecosystem;
  if (!eco) return null;

  const custom = prefs.custom;
  const override = prefs.overrides?.[chain]?.[action];
  if (isValidFor(override, chain, custom)) return override;

  const ecoDefault = prefs[eco]?.[action];
  if (isValidFor(ecoDefault, chain, custom)) return ecoDefault;

  const first = PLATFORMS.find((p) => p.categories.includes(categoryFor(action)) && p.chains.includes(chain));
  return first?.id ?? null;
}

function resolve(prefs, chain, action) {
  action = EXPLORE_ALIASES[action] || action;
  if (SENTINEL_ACTIONS.has(action)) {
    const eco = CHAINS[chain]?.ecosystem;
    const override = prefs.overrides?.[chain]?.[action];
    const ecoDefault = eco ? prefs[eco]?.[action] : null;

    const overrideValid = isValidFor(override, chain, prefs.custom);
    const useSentinel =
      override === SAME_AS_TRADE ||
      (!overrideValid && ecoDefault === SAME_AS_TRADE);

    if (useSentinel) {
      const traded = resolveDirect(prefs, chain, "trade");
      if (traded) return traded;
    }
  }

  return resolveDirect(prefs, chain, action);
}
