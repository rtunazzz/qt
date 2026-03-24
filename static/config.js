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
};

const R = {
  chainId: () => (chain) => {
    const id = CHAINS[chain].chainId;
    if (id === null) throw new Error(`No chainId for chain "${chain}"`);
    return String(id);
  },
  slug: (overrides) => (chain) => overrides?.[chain] ?? CHAINS[chain].slug ?? chain,
};

function chainsForEcosystem(eco) {
  return Object.entries(CHAINS).filter(([_, c]) => c.ecosystem === eco).map(([id]) => id);
}

const ALL_EVM = chainsForEcosystem("evm");

const PLATFORMS = [
  {
    id: "jupiter",
    name: "Jupiter",
    category: "trade",
    chains: ["sol"],
    params: ["sell", "buy"],
    buildUrl: (chain, token) => `https://jup.ag/swap/SOL-${token}`,
  },
  {
    id: "photon-sol",
    name: "Photon",
    category: "trade",
    chains: ["sol"],
    buildUrl: (chain, token) => `https://photon-sol.tinyastro.io/en/r/@rtunazzz/${token}`,
  },
  {
    id: "axiom",
    name: "Axiom",
    category: "trade",
    chains: ["sol"],
    buildUrl: (chain, token) => `https://axiom.trade/t/${token}/@rtuna`,
  },
  {
    id: "bloom-sol",
    name: "Bloom",
    category: "trade",
    chains: ["sol"],
    buildUrl: (chain, token) => `https://t.me/BloomSolana_bot?start=ref_rtuna_ca_${token}`,
  },

  {
    id: "uniswap",
    name: "Uniswap",
    category: "trade",
    chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "blast", "unichain"],
    params: ["inputCurrency"],
    resolveChain: R.slug({ bsc: "bnb" }),
    buildUrl: (chain, token, slug) => `https://app.uniswap.org/swap?outputCurrency=${token}&chain=${slug}`,
  },
  {
    id: "1inch",
    name: "1inch",
    category: "trade",
    chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "ftm", "blast", "mantle"],
    resolveChain: R.chainId(),
    buildUrl: (chain, token, slug) => `https://app.1inch.io/#/${slug}/simple/swap/ETH/${token}`,
  },
  {
    id: "photon-base",
    name: "Photon",
    category: "trade",
    chains: ["base"],
    buildUrl: (chain, token) => `https://photon-base.tinyastro.io/en/r/@rtunazzz/${token}`,
  },
  {
    id: "gmgn",
    name: "GMGN",
    category: "trade",
    chains: ["sol", "eth", "base", "bsc", "tron"],
    buildUrl: (chain, token) => `https://gmgn.ai/${chain}/token/rtuna_${token}`,
  },
  {
    id: "sigma-vip",
    name: "Sigma VIP",
    category: "trade",
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://t.me/SigmaTradingVIP_bot?start=x1865619192-${token}-${chain}`,
  },
  {
    id: "sigma",
    name: "Sigma",
    category: "trade",
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://t.me/Sigma_buyBot?start=x1865619192-${token}-${chain}`,
  },
  {
    id: "based",
    name: "Based Bot",
    category: "trade",
    chains: ["sol", "eth", "base", "bsc", "arb", "avax", "abstract", "hyperevm", "ink", "story", "xlayer", "plasma", "unichain", "monad", "megaeth", "tempo"],
    buildUrl: (chain, token) => `https://t.me/based_eth_bot?start=r_rtunazzz_b_${token}`,
  },
  {
    id: "based-vip",
    name: "Based Bot VIP",
    category: "trade",
    chains: ["sol", "eth", "base", "bsc", "arb", "avax", "abstract", "hyperevm", "ink", "story", "xlayer", "plasma", "unichain", "monad", "megaeth", "tempo"],
    buildUrl: (chain, token) => `https://t.me/based_vip_bot?start=r_rtunazzz_b_${token}`,
  },
  {
    id: "banana",
    name: "Banana Gun",
    category: "trade",
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://t.me/BananaGunSniper_bot?start=snp_rtunazzz_${token}`,
  },
  {
    id: "bloom-evm",
    name: "Bloom",
    category: "trade",
    chains: ["eth", "base", "bsc", "hyperevm"],
    buildUrl: (chain, token) => `https://t.me/BloomEVMbot?start=ref_tuna_ca_${token}`,
  },
  {
    id: "fomo",
    name: "FOMO",
    category: "trade",
    chains: ["sol", "eth", "base", "bsc"],
    resolveChain: R.chainId(),
    buildUrl: (chain, token, slug) => `https://fomo.family/coin?address=${token}&chainId=${slug}`,
  },
  {
    id: "azura",
    name: "Azura",
    category: "trade",
    chains: ["sol", "eth", "base", "bsc"],
    resolveChain: R.chainId(),
    buildUrl: (chain, token, slug) => `https://app.azura.xyz/spot/${slug}/${token}`,
  },

  {
    id: "photon-tron",
    name: "Photon",
    category: "trade",
    chains: ["tron"],
    buildUrl: (chain, token) => `https://photon-tron.tinyastro.io/en/r/@rtunazzz/${token}`,
  },

  {
    id: "maestro",
    name: "Maestro",
    category: "trade",
    chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "tron", "ton"],
    buildUrl: (chain, token) => `https://t.me/MaestroSniperBot?start=${token}-rtunazzz`,
  },
  {
    id: "shuriken",
    name: "Shuriken",
    category: "trade",
    chains: ["sui", "tron", "eth", "base", "bsc", "arb", "avax", "ftm"],
    buildUrl: (chain, token) => `https://t.me/ShurikenTradeBot?start=${token}`,
  },

  {
    id: "solscan",
    name: "Solscan",
    category: "explore",
    chains: ["sol"],
    buildUrl: (chain, token) => `https://solscan.io/token/${token}`,
  },
  {
    id: "etherscan",
    name: "Etherscan",
    category: "explore",
    chains: ["eth", "base", "bsc", "arb", "op", "matic", "avax", "ftm", "blast", "mantle", "sonic"],
    buildUrl: (chain, token) => {
      const domains = {
        eth: "etherscan.io", base: "basescan.org", bsc: "bscscan.com",
        arb: "arbiscan.io", op: "optimistic.etherscan.io", matic: "polygonscan.com",
        avax: "snowscan.xyz", ftm: "ftmscan.com", blast: "blastscan.io",
        mantle: "mantlescan.xyz", sonic: "sonicscan.org",
      };
      return `https://${domains[chain] || "etherscan.io"}/token/${token}`;
    },
  },
  {
    id: "blockscout",
    name: "Blockscout",
    category: "explore",
    chains: ["eth", "base", "arb", "matic"],
    resolveChain: R.slug({ eth: "eth" }),
    buildUrl: (chain, token, slug) => `https://${slug}.blockscout.com/address/${token}`,
  },

  {
    id: "dexscreener",
    name: "DexScreener",
    category: "chart",
    chains: ["sol", "sui", "tron", "ton", ...ALL_EVM],
    params: ["maker"],
    resolveChain: R.slug(),
    buildUrl: (chain, token, slug) => `https://dexscreener.com/${slug}/${token}`,
  },
  {
    id: "geckoterminal",
    name: "GeckoTerminal",
    category: "chart",
    chains: ["sol", "sui", "tron", "ton", ...ALL_EVM],
    resolveChain: R.slug({ eth: "eth", sui: "sui-network", matic: "polygon_pos", avax: "avax", ftm: "ftm" }),
    buildUrl: (chain, token, slug) => `https://www.geckoterminal.com/${slug}/pools/${token}`,
  },
  {
    id: "dextools",
    name: "DEXTools",
    category: "chart",
    chains: ["sol", "sui", "tron", "ton", ...ALL_EVM],
    params: ["maker"],
    resolveChain: R.slug({ eth: "ether", bsc: "bnb" }),
    buildUrl: (chain, token, slug) => `https://www.dextools.io/app/en/${slug}/pair-explorer/${token}`,
  },
  {
    id: "birdeye",
    name: "Birdeye",
    category: "chart",
    chains: ["sol", "eth", "base", "bsc", "arb", "op", "avax", "sui"],
    resolveChain: R.slug(),
    buildUrl: (chain, token, slug) => `https://birdeye.so/token/${token}?chain=${slug}`,
  },
  {
    id: "defined",
    name: "Defined",
    category: "chart",
    chains: ["sol", "eth", "base", "bsc", "arb", "op", "matic", "avax", "blast", "sui", "tron"],
    params: ["quoteToken", "preferredQuoteTokenAddress", "maker"],
    buildUrl: (chain, token) => `https://www.defined.fi/${chain}/${token}`,
  },
];

const PLATFORM_MAP = Object.fromEntries(PLATFORMS.map((p) => [p.id, p]));

function getPlatformsForChain(chain, category) {
  return PLATFORMS.filter((p) => p.category === category && p.chains.includes(chain));
}

function getEcosystem(chain) {
  return CHAINS[chain]?.ecosystem;
}

const COOKIE_NAME = "qt";
const ACTIONS = ["trade", "chart", "explore"];

const DEFAULT_PREFS = {
  sol: { trade: "axiom", chart: "dexscreener", explore: "solscan" },
  evm: { trade: "sigma-vip", chart: "dexscreener", explore: "etherscan" },
  overrides: {},
};

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
