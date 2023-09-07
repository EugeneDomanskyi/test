import { useRef } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { createClient } from '@reservoir0x/reservoir-sdk'
import nookies from 'nookies'
import { getSelectorsByUserAgent } from 'react-device-detect'
import amplitude from 'amplitude-js'
import * as Sentry from '@sentry/nextjs'

import { getDefaultWallets, RainbowKitProvider, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import merge from 'lodash.merge'
import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector'

import { CHAINS } from '@/config'
import store from '@/store'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'

import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@uniswap/widgets/fonts.css'
import '@/styles/globals.css'

Sentry.init({
  dsn: 'https://a48fc91863a08075997f5355b49858cc@o4505192627830784.ingest.sentry.io/4505793143242752',
  // integrations: [
  //   new Sentry.BrowserTracing(),
  //   new Sentry.Replay(),
  // ],
  // Performance Monitoring
  tracesSampleRate: 0.5, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

createClient({
  chains: CHAINS,
  source: "tegro.com"
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
  CHAINS, [
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
    wallets: [rainbowMagicConnector({ chains: CHAINS })],
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
  
  let isMobile = false
  if (ctx.req?.headers?.['user-agent']) {
    const res = getSelectorsByUserAgent(ctx.req?.headers?.['user-agent'])
    isMobile = res?.isMobile
  }

  return {
    initialData: {
      blockchain: cookies.blockchain,
      isMobile,
    }
  }
}

export default MyApp
