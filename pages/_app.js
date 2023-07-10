import { Provider } from 'react-redux'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { createClient } from '@reservoir0x/reservoir-sdk'

import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, mainnet, bsc } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import merge from 'lodash.merge'

import store from '@/store'

import App from '@/components/App'

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
      id: 56,
      baseApiUrl: 'https://api-bsc.reservoir.tools',
      active: true,
      default: true,
      apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    }, {
      id: 137,
      baseApiUrl: 'https://api-polygon.reservoir.tools',
      active: true,
      apiKey: process.env.NEXT_PUBLIC_RESERVOIR_API_KEY,
    },
  ],
})

//const initialChain = process.env.NEXT_PUBLIC_APP_ENV == 'production' ? [mainnet, polygon] : [goerli, polygonMumbai]
const initialChain = [polygon, mainnet, bsc]
const { chains, publicClient, webSocketPublicClient } = configureChains(
  initialChain, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
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

function MyApp({ Component, pageProps }) { 
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={RainbowTheme}>
        <Provider store={store}>
          <Head>
            <title>NFT20 | NFT Trading Platform</title>
          </Head>

          <App.Layout>
            <Component {...pageProps} />
          </App.Layout>

          <App.Modal />
          <ToastContainer autoClose={3000} />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
