import { arbitrum, mainnet, polygon, goerli, optimism } from 'wagmi/chains'

const TEST_NETWORK = {
  ...goerli,
  code: 'goerli',
  currency: goerli.nativeCurrency.symbol,
  decimals: goerli.nativeCurrency.decimals,
  baseApiUrl: 'https://api-goerli.reservoir.tools',
  scanUrl: goerli.blockExplorers.etherscan.url,
  apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
  coingecko: 'ethereum',
  platform: 'ethereum',
  usdtContract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  wrapped: {
    contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    name: 'Wrapped Ether',
    shortName: 'WETH',
  },
}

export const CHAINS = [
  {
    ...mainnet,
    code: 'ethereum',
    currency: mainnet.nativeCurrency.symbol,
    decimals: mainnet.nativeCurrency.decimals,
    baseApiUrl: 'https://api.reservoir.tools',
    scanUrl: mainnet.blockExplorers.etherscan.url,
    apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    coingecko: 'ethereum',
    platform: 'ethereum',
    usdtContract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    wrapped: {
      contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      name: 'Wrapped Ether',
      shortName: 'WETH',
    },
  }, {
    ...polygon,
    code: 'polygon',
    currency: polygon.nativeCurrency.symbol,
    decimals: polygon.nativeCurrency.decimals,
    baseApiUrl: 'https://api-polygon.reservoir.tools',
    scanUrl: polygon.blockExplorers.etherscan.url,
    apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    coingecko: 'matic-network',
    platform: 'polygon-pos',
    usdtContract: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    wrapped: {
      contract: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      name: 'Wrapped Matic',
      shortName: 'WMATIC',
    },
  }, {
    ...arbitrum,
    code: 'arbitrum',
    currency: arbitrum.nativeCurrency.symbol,
    decimals: arbitrum.nativeCurrency.decimals,
    baseApiUrl: 'https://api-arbitrum.reservoir.tools',
    scanUrl: arbitrum.blockExplorers.etherscan.url,
    apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    coingecko: '',
    platform: 'arbitrum-one',
    usdtContract: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    wrapped: {
      contract: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      shortName: 'WETH',
    },
  }, {
    ...optimism,
    code: 'optimism',
    currency: optimism.nativeCurrency.symbol,
    decimals: optimism.nativeCurrency.decimals,
    baseApiUrl: 'https://api-optimism.reservoir.tools',
    scanUrl: optimism.blockExplorers.etherscan.url,
    apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    coingecko: '',
    platform: 'arbitrum-one',
    usdtContract: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    wrapped: {
      contract: '0x4200000000000000000000000000000000000006',
      name: 'Wrapped Ether',
      shortName: 'WETH',
    },
  },
  ...(process.env.NEXT_PUBLIC_APP_ENV == 'local' ? [TEST_NETWORK] : [])
]

export const INCH_CONTRACTS = {
  1: "0x1111111254eeb25477b68fb85ed929f73a960582",
  10: "0x1111111254eeb25477b68fb85ed929f73a960582",
  56: "0x1111111254eeb25477b68fb85ed929f73a960582",
  100: "0x1111111254eeb25477b68fb85ed929f73a960582",
  137: "0x1111111254eeb25477b68fb85ed929f73a960582",
  250: "0x1111111254eeb25477b68fb85ed929f73a960582",
  324: "0x6e2b76966cbd9cf4cc2fa0d76d24d5241e0abc2f",
  8217: "0x1111111254eeb25477b68fb85ed929f73a960582",
  42161: "0x1111111254eeb25477b68fb85ed929f73a960582",
  43114: "0x1111111254eeb25477b68fb85ed929f73a960582",
  1313161554: "0x1111111254eeb25477b68fb85ed929f73a960582"
}

