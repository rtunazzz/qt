const CHAINS = {
  sol: { name: "Solana", ecosystem: "sol" },
  eth: { name: "Ethereum", ecosystem: "evm" },
  base: { name: "Base", ecosystem: "evm" },
  bsc: { name: "BSC", ecosystem: "evm" },
};

const CHAIN_SLUGS = {
  dexscreener: { sol: "solana", eth: "ethereum", base: "base", bsc: "bsc" },
  geckoterminal: { sol: "solana", eth: "eth", base: "base", bsc: "bsc" },
  dextools: { sol: "solana", eth: "ether", base: "base", bsc: "bnb" },
  birdeye: { sol: "solana", eth: "ethereum", base: "base", bsc: "bsc" },
  uniswap: { eth: "ethereum", base: "base", bsc: "bnb" },
  "1inch": { eth: "1", base: "8453", bsc: "56" },
  fomo: { sol: "1399811149", eth: "1", base: "8453", bsc: "56" },
  azura: { sol: "1399811149", eth: "1", base: "8453", bsc: "56" },
};

const PLATFORMS = [
  {
    id: "jupiter",
    name: "Jupiter",
    category: "trade",
    chains: ["sol"],
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
    id: "gmgn",
    name: "GMGN",
    category: "trade",
    chains: ["sol"],
    buildUrl: (chain, token) => `https://gmgn.ai/sol/token/rtuna_${token}`,
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
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://app.uniswap.org/swap?outputCurrency=${token}&chain=${CHAIN_SLUGS.uniswap[chain] || chain}`,
  },
  {
    id: "1inch",
    name: "1inch",
    category: "trade",
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://app.1inch.io/#/${CHAIN_SLUGS["1inch"][chain] || "1"}/simple/swap/ETH/${token}`,
  },
  {
    id: "photon-base",
    name: "Photon",
    category: "trade",
    chains: ["base"],
    buildUrl: (chain, token) => `https://photon-base.tinyastro.io/en/r/@rtunazzz/${token}`,
  },
  {
    id: "gmgn-evm",
    name: "GMGN",
    category: "trade",
    chains: ["eth", "base", "bsc"],
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
    chains: ["eth", "base"],
    buildUrl: (chain, token) => `https://t.me/based_eth_bot?start=r_rtunazzz_b_${token}`,
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
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://t.me/BloomEVMbot?start=ref_tuna_ca_${token}`,
  },
  {
    id: "fomo",
    name: "FOMO",
    category: "trade",
    chains: ["sol", "eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://fomo.family/coin?address=${token}&chainId=${CHAIN_SLUGS.fomo[chain]}`,
  },
  {
    id: "azura",
    name: "Azura",
    category: "trade",
    chains: ["sol", "eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://app.azura.xyz/spot/${CHAIN_SLUGS.azura[chain]}/${token}`,
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
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => {
      const domains = { eth: "etherscan.io", base: "basescan.org", bsc: "bscscan.com" };
      return `https://${domains[chain] || "etherscan.io"}/token/${token}`;
    },
  },
  {
    id: "blockscout",
    name: "Blockscout",
    category: "explore",
    chains: ["eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://explorer.blockscout.com/address/${token}`,
  },

  {
    id: "dexscreener",
    name: "DexScreener",
    category: "chart",
    chains: ["sol", "eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://dexscreener.com/${CHAIN_SLUGS.dexscreener[chain] || chain}/${token}`,
  },
  {
    id: "geckoterminal",
    name: "GeckoTerminal",
    category: "chart",
    chains: ["sol", "eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://www.geckoterminal.com/${CHAIN_SLUGS.geckoterminal[chain] || chain}/pools/${token}`,
  },
  {
    id: "dextools",
    name: "DEXTools",
    category: "chart",
    chains: ["sol", "eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://www.dextools.io/app/en/${CHAIN_SLUGS.dextools[chain] || chain}/pair-explorer/${token}`,
  },
  {
    id: "birdeye",
    name: "Birdeye",
    category: "chart",
    chains: ["sol", "eth", "base", "bsc"],
    buildUrl: (chain, token) => `https://birdeye.so/token/${token}?chain=${CHAIN_SLUGS.birdeye[chain] || chain}`,
  },
  {
    id: "defined",
    name: "Defined",
    category: "chart",
    chains: ["sol", "eth", "base", "bsc"],
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
