import { defineChain } from 'viem'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'
import { arbitrum, optimismSepolia } from 'wagmi/chains'

const polygonAmoy = defineChain({
  id: 80_002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc-amoy.polygon.technology'],
    },
  },
  blockExplorers: {
    default: {
      name: 'OK LINK',
      url: 'https://www.oklink.com/amoy',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 3127388,
    },
  },
  testnet: true,
})

const TEST_NETWORKS = [
  {
    ...polygonAmoy,
    code: 'amoy',
    currency: polygonAmoy.nativeCurrency.symbol,
    decimals: polygonAmoy.nativeCurrency.decimals,
    scanUrl: polygonAmoy.blockExplorers.default.url,
    pages: ['exchange'],
    defaultFor: 'local',
  }, {
    ...optimismSepolia,
    code: 'optimism-sepolia',
    currency: optimismSepolia.nativeCurrency.symbol,
    decimals: optimismSepolia.nativeCurrency.decimals,
    scanUrl: optimismSepolia.blockExplorers.default.url,
    pages: ['exchange'],
  }
]

const MAINNET_NETWORKS = [
  {
    ...arbitrum,
    code: 'arbitrum',
    currency: arbitrum.nativeCurrency.symbol,
    decimals: arbitrum.nativeCurrency.decimals,
    scanUrl: arbitrum.blockExplorers.default.url,
    pages: ['exchange']
  }
]

export const CHAINS = [
  // ...(process.env.NEXT_PUBLIC_APP_ENV == 'local' ? TEST_NETWORKS : []),
  ...MAINNET_NETWORKS,
  ...TEST_NETWORKS,
]

export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: CHAINS,
  ssr: true,
  transports: CHAINS.reduce((acc, chain) => {
    return {
      ...acc,
      [chain.id]: http(),
    }
  }, {}),
})