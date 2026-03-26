const CHAINS = {
  sol:        { ecosystem: "sol",  chainId: 1399811149, slug: "solana" },
  eth:        { ecosystem: "evm",  chainId: 1,          slug: "ethereum" },
  base:       { ecosystem: "evm",  chainId: 8453,       slug: "base" },
  bsc:        { ecosystem: "evm",  chainId: 56,         slug: "bsc" },
  arb:        { ecosystem: "evm",  chainId: 42161,      slug: "arbitrum" },
  op:         { ecosystem: "evm",  chainId: 10,         slug: "optimism" },
  matic:      { ecosystem: "evm",  chainId: 137,        slug: "polygon" },
  avax:       { ecosystem: "evm",  chainId: 43114,      slug: "avalanche" },
  ftm:        { ecosystem: "evm",  chainId: 250,        slug: "fantom" },
  sonic:      { ecosystem: "evm",  chainId: 146,        slug: "sonic" },
  blast:      { ecosystem: "evm",  chainId: 81457,      slug: "blast" },
  mantle:     { ecosystem: "evm",  chainId: 5000,       slug: "mantle" },
  sui:        { ecosystem: "sui",  chainId: null,       slug: "sui" },
  tron:       { ecosystem: "tron", chainId: null,       slug: "tron" },
  ton:        { ecosystem: "ton",  chainId: null,       slug: "ton" },
  btc:        { ecosystem: "btc",  chainId: null,       slug: "bitcoin" },
  shape:      { ecosystem: "evm",  chainId: 360,        slug: "shape" },
  worldchain: { ecosystem: "evm",  chainId: 480,        slug: "worldchain" },
  apechain:   { ecosystem: "evm",  chainId: 33139,      slug: "apechain" },
  morph:      { ecosystem: "evm",  chainId: 2818,       slug: "morph" },
  unichain:   { ecosystem: "evm",  chainId: 130,        slug: "unichain" },
  monad:      { ecosystem: "evm",  chainId: 143,        slug: "monad" },
  abstract:   { ecosystem: "evm",  chainId: 2741,       slug: "abstract" },
  ink:        { ecosystem: "evm",  chainId: 57073,      slug: "ink" },
  soneium:    { ecosystem: "evm",  chainId: 1868,       slug: "soneium" },
  berachain:  { ecosystem: "evm",  chainId: 80094,      slug: "berachain" },
  hyperevm:   { ecosystem: "evm",  chainId: 999,        slug: "hyperevm" },
  story:      { ecosystem: "evm",  chainId: 1514,       slug: "story" },
  xlayer:     { ecosystem: "evm",  chainId: 196,        slug: "xlayer" },
  plasma:     { ecosystem: "evm",  chainId: 9745,       slug: "plasma" },
  flow:       { ecosystem: "evm",  chainId: 747,        slug: "flow" },
  megaeth:    { ecosystem: "evm",  chainId: 4326,       slug: "megaeth" },
  tempo:      { ecosystem: "evm",  chainId: 4217,       slug: "tempo" },
};

const ACTIONS = ["trade", "chart", "explore"];

function chainId(chain) {
  const id = CHAINS[chain].chainId;
  if (id === null) throw new Error(`No chainId for chain "${chain}"`);
  return String(id);
}

function slug(overrides, chain) {
  return overrides?.[chain] ?? CHAINS[chain].slug ?? chain;
}

const ALL_EVM = Object.entries(CHAINS).filter(([_, c]) => c.ecosystem === "evm").map(([id]) => id);

const PLATFORMS = [
  { id: "jupiter", category: "trade", chains: ["sol"], params: ["sell", "buy"], buildUrl: (c, t) => `https://jup.ag/swap/SOL-${t}` },
  { id: "photon-sol", category: "trade", chains: ["sol"], buildUrl: (c, t) => `https://photon-sol.tinyastro.io/en/r/@rtunazzz/${t}` },
  { id: "axiom", category: "trade", chains: ["sol"], buildUrl: (c, t) => `https://axiom.trade/t/${t}/@rtuna` },
  { id: "bloom-sol", category: "trade", chains: ["sol"], buildUrl: (c, t) => `https://t.me/BloomSolana_bot?start=ref_rtuna_ca_${t}` },
  { id: "uniswap", category: "trade", chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "blast", "unichain"], params: ["inputCurrency"], resolveChain: (c) => slug({ bsc: "bnb" }, c), buildUrl: (c, t, s) => `https://app.uniswap.org/swap?outputCurrency=${t}&chain=${s}` },
  { id: "1inch", category: "trade", chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "ftm", "blast", "mantle"], resolveChain: (c) => chainId(c), buildUrl: (c, t, s) => `https://app.1inch.io/#/${s}/simple/swap/ETH/${t}` },
  { id: "photon-base", category: "trade", chains: ["base"], buildUrl: (c, t) => `https://photon-base.tinyastro.io/en/r/@rtunazzz/${t}` },
  { id: "gmgn", category: "trade", chains: ["sol", "eth", "base", "bsc", "tron"], buildUrl: (c, t) => `https://gmgn.ai/${c}/token/rtuna_${t}` },
  { id: "sigma-vip", category: "trade", chains: ["eth", "base", "bsc"], buildUrl: (c, t) => `https://t.me/SigmaTradingVIP_bot?start=x1865619192-${t}-${c}` },
  { id: "sigma", category: "trade", chains: ["eth", "base", "bsc"], buildUrl: (c, t) => `https://t.me/Sigma_buyBot?start=x1865619192-${t}-${c}` },
  { id: "based", category: "trade", chains: ["sol", "eth", "base", "bsc", "arb", "avax", "abstract", "hyperevm", "ink", "story", "xlayer", "plasma", "unichain", "monad", "megaeth", "tempo"], buildUrl: (c, t) => `https://t.me/based_eth_bot?start=r_rtunazzz_b_${t}` },
  { id: "based-vip", category: "trade", chains: ["sol", "eth", "base", "bsc", "arb", "avax", "abstract", "hyperevm", "ink", "story", "xlayer", "plasma", "unichain", "monad", "megaeth", "tempo"], buildUrl: (c, t) => `https://t.me/based_vip_bot?start=r_rtunazzz_b_${t}` },
  { id: "banana", category: "trade", chains: ["eth", "base", "bsc"], buildUrl: (c, t) => `https://t.me/BananaGunSniper_bot?start=snp_rtunazzz_${t}` },
  { id: "bloom-evm", category: "trade", chains: ["eth", "base", "bsc", "hyperevm"], buildUrl: (c, t) => `https://t.me/BloomEVMbot?start=ref_tuna_ca_${t}` },
  { id: "fomo", category: "trade", chains: ["sol", "eth", "base", "bsc"], resolveChain: (c) => chainId(c), buildUrl: (c, t, s) => `https://fomo.family/coin?address=${t}&chainId=${s}` },
  { id: "azura", category: "trade", chains: ["sol", "eth", "base", "bsc"], resolveChain: (c) => chainId(c), buildUrl: (c, t, s) => `https://app.azura.xyz/spot/${s}/${t}` },
  { id: "photon-tron", category: "trade", chains: ["tron"], buildUrl: (c, t) => `https://photon-tron.tinyastro.io/en/r/@rtunazzz/${t}` },
  { id: "maestro", category: "trade", chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "tron", "ton"], buildUrl: (c, t) => `https://t.me/MaestroSniperBot?start=${t}-rtunazzz` },
  { id: "shuriken", category: "trade", chains: ["sui", "tron", "eth", "base", "bsc", "arb", "avax", "ftm"], buildUrl: (c, t) => `https://t.me/ShurikenTradeBot?start=${t}` },
  { id: "solscan", category: "explore", chains: ["sol"], buildUrl: (c, t) => `https://solscan.io/token/${t}` },
  { id: "etherscan", category: "explore", chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "ftm", "blast", "mantle", "sonic"], buildUrl: (c, t) => { const d = { eth: "etherscan.io", base: "basescan.org", bsc: "bscscan.com", arb: "arbiscan.io", op: "optimistic.etherscan.io", matic: "polygonscan.com", avax: "snowscan.xyz", ftm: "ftmscan.com", blast: "blastscan.io", mantle: "mantlescan.xyz", sonic: "sonicscan.org" }; return `https://${d[c] || "etherscan.io"}/token/${t}`; } },
  { id: "blockscout", category: "explore", chains: ["eth", "base", "arb", "matic"], resolveChain: (c) => slug({ eth: "eth" }, c), buildUrl: (c, t, s) => `https://${s}.blockscout.com/address/${t}` },
  { id: "dexscreener", category: "chart", chains: ["sol", "sui", "tron", "ton", ...ALL_EVM], params: ["maker"], resolveChain: (c) => slug(null, c), buildUrl: (c, t, s) => `https://dexscreener.com/${s}/${t}` },
  { id: "geckoterminal", category: "chart", chains: ["sol", "sui", "tron", "ton", ...ALL_EVM], resolveChain: (c) => slug({ eth: "eth", sui: "sui-network", matic: "polygon_pos", avax: "avax", ftm: "ftm" }, c), buildUrl: (c, t, s) => `https://www.geckoterminal.com/${s}/pools/${t}` },
  { id: "dextools", category: "chart", chains: ["sol", "sui", "tron", "ton", ...ALL_EVM], params: ["maker"], resolveChain: (c) => slug({ eth: "ether", bsc: "bnb" }, c), buildUrl: (c, t, s) => `https://www.dextools.io/app/en/${s}/pair-explorer/${t}` },
  { id: "birdeye", category: "chart", chains: ["sol", "eth", "base", "bsc", "arb", "op", "avax", "sui"], resolveChain: (c) => slug(null, c), buildUrl: (c, t, s) => `https://birdeye.so/token/${t}?chain=${s}` },
  { id: "defined", category: "chart", chains: ["sol", "eth", "base", "bsc", "arb", "op", "matic", "avax", "blast", "sui", "tron"], params: ["quoteToken", "preferredQuoteTokenAddress", "maker"], buildUrl: (c, t) => `https://www.defined.fi/${c}/${t}` },
];

const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

const DEFAULT_PREFS = {
  sol: { trade: "axiom", chart: "dexscreener", explore: "solscan" },
  evm: { trade: "sigma-vip", chart: "dexscreener", explore: "etherscan" },
  overrides: {},
};

function readPrefs(cookieHeader) {
  if (!cookieHeader) return DEFAULT_PREFS;
  const match = cookieHeader.match(/(?:^|; )qt=([^;]*)/);
  if (!match) return DEFAULT_PREFS;
  try {
    return JSON.parse(atob(match[1]));
  } catch {
    return DEFAULT_PREFS;
  }
}

function resolve(prefs, chain, action) {
  const override = prefs.overrides?.[chain]?.[action];
  if (override) return override;
  const eco = CHAINS[chain]?.ecosystem;
  if (!eco) return null;
  const ecoDefault = prefs[eco]?.[action];
  if (ecoDefault) return ecoDefault;
  const available = PLATFORMS.filter((p) => p.category === action && p.chains.includes(chain));
  return available.length ? available[0].id : null;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const parts = url.pathname.split("/").filter(Boolean);

  if (parts.length < 2 || parts.length > 3) return context.next();

  const chain = parts[0].toLowerCase();
  const token = parts[1];
  const action = parts[2]?.toLowerCase() || "trade";

  if (!CHAINS[chain]) return context.next();
  if (!ACTIONS.includes(action)) return context.next();

  const prefs = readPrefs(context.request.headers.get("cookie"));
  const platformId = resolve(prefs, chain, action);
  if (!platformId) return context.next();

  const platform = PLATFORM_MAP[platformId];
  if (!platform) return context.next();

  const s = platform.resolveChain ? platform.resolveChain(chain) : chain;
  let dest = platform.buildUrl(chain, token, s);

  if (platform.params?.length) {
    const incoming = url.searchParams;
    const target = new URL(dest);
    for (const key of platform.params) {
      if (incoming.has(key)) target.searchParams.set(key, incoming.get(key));
    }
    dest = target.toString();
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: dest,
      "Cache-Control": "private, no-store",
    },
  });
}
