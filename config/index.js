import { polygonMumbai } from '@wagmi/chains'

const mumbaiWithCustomRPC = {
  ...polygonMumbai,
  rpcUrls: {
    ...polygonMumbai.rpcUrls,
    default: {
      http: ['https://rpc-mumbai.maticvigil.com/'],
    },
    public: {
      http: ['https://rpc-mumbai.maticvigil.com/'],
    },
  }
}

const TEST_NETWORKS = [
  {
    ...mumbaiWithCustomRPC,
    code: 'mumbai',
    currency: polygonMumbai.nativeCurrency.symbol,
    decimals: polygonMumbai.nativeCurrency.decimals,
    scanUrl: polygonMumbai.blockExplorers.etherscan.url,
    pages: ['earn', 'exchange', 'faucet'],
    raffle: {
      subgraph: 'https://api.thegraph.com/subgraphs/name/gulshanweb3/raffle-mumbai',
      contract: '0x9bfdfdac362f810ff15240045e600a7468caf91c',
      factory: '0x3897BdBAFA001CA14576Cb07ecdfbC1BcdF09ca7',
      alchemy: 'MATIC_MUMBAI',
      txUrl: 'https://mumbai.polygonscan.com/tx/',
      rewardEndpoint: 'https://us-central1-vibrant-waters-399406.cloudfunctions.net/rewards-status',
    },
    defaultFor: 'local',
  },
]

export const CHAINS = [
  ...(process.env.NEXT_PUBLIC_APP_ENV == 'local' ? TEST_NETWORKS : []),
]