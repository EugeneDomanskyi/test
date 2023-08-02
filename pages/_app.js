import { useRef } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { createClient } from '@reservoir0x/reservoir-sdk'
import nookies from 'nookies'
import { getSelectorsByUserAgent } from 'react-device-detect'
import amplitude from 'amplitude-js'

import { getDefaultWallets, RainbowKitProvider, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, mainnet, goerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import merge from 'lodash.merge'
import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector'

import store from '@/store'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'

import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@uniswap/widgets/fonts.css'
import '@/styles/globals.css'

createClient({
  chains: [
    {
      id: 1,
      baseApiUrl: 'https://api.reservoir.tools',
      active: true,
      apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    }, {
      id: 5,
      baseApiUrl: 'https://api-goerli.reservoir.tools/',
      active: true,
      apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    }, /* {
      id: 56,
      baseApiUrl: 'https://api-bsc.reservoir.tools',
      active: true,
      default: true,
      apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    }, */ {
      id: 137,
      baseApiUrl: 'https://api-polygon.reservoir.tools',
      active: true,
      apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    },
  ],
  source: "tegro.com"
})

//const initialChain = process.env.NEXT_PUBLIC_APP_ENV == 'production' ? [mainnet, polygon] : [goerli, polygonMumbai]
const initialChain = [polygon, mainnet]
if (process.env.NEXT_PUBLIC_APP_ENV == 'local') {
  initialChain.push(goerli)
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  initialChain, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
    publicProvider(),
  ]
)

const rainbowMagicConnector = ({ chains }) => ({
  id: 'magic',
  name: 'Magic',
  iconUrl: '/images/icon-magic.png',
  iconBackground: '#fff',
  createConnector: () => {
    const [initialChain] = chains.map((chain) => {
      const [rpcUrl] = chain.rpcUrls.public.http
      return {
        rpcUrl: rpcUrl,
        chainId: chain.id,
      }
    })
    
    const connector = new MagicConnectConnector({
      chains: chains,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY,
        magicSdkConfiguration: {
          network: initialChain,
        },
      },
    });
    return {
      connector,
    };
  },
})

const { wallets: [popularWallets] } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains,
})

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [rainbowMagicConnector({ chains: initialChain })],
  },
  popularWallets
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectors,
  publicClient,
  webSocketPublicClient,
})

const RainbowTheme = merge(darkTheme({overlayBlur: 'small'}), {
  colors: {
    accentColor: '#6753d1',
    actionButtonSecondaryBackground: '#fff',
    modalBackground: '#120F25',
    modalBorder: '#252236',
    actionButtonBorderMobile: '#2E1C8C',
  },
  radii: {
    modal: '20px',
    actionButton: '8px',
  },
  fonts: {
    body: 'Gilroy',
  },
})

amplitude.getInstance().init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY)

function MyApp({ Component, pageProps, initialData }) {
  const storeRef = useRef(store(initialData)).current
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={RainbowTheme}>
        <Provider store={storeRef}>
          <Head>
            <title>TEGRO | NFT Trading Platform</title>
          </Head>

          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>

          <App.Modal />
          <ToastContainer autoClose={3000} />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

MyApp.getInitialProps = async ({ctx}) => {
  const cookies = nookies.get(ctx)
  const res = getSelectorsByUserAgent(ctx.req?.headers?.['user-agent'])
  return {
    initialData: {
      blockchain: cookies.blockchain,
      isMobile: res?.isMobile,
    }
  }
}

export default MyApp
