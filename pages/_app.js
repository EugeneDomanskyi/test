import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import { createClient } from '@reservoir0x/reservoir-sdk'
import nookies from 'nookies'
import { getSelectorsByUserAgent } from 'react-device-detect'
import amplitude from 'amplitude-js'
import * as Sentry from '@sentry/nextjs'
import Smartlook from 'smartlook-client'

import { getDefaultWallets, RainbowKitProvider, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import merge from 'lodash.merge'
import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector'

import { CHAINS } from '@/config'
import store from '@/store'
import $token from '@/store/token'
import $collection from '@/store/collection'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'

import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@uniswap/widgets/fonts.css'
import '@/styles/globals.css'
import '@/styles/roulette_design.css'

if (process.env.NEXT_PUBLIC_APP_ENV == 'production') {
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
}

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

function MyApp({ Component, pageProps, initialData, currentPage, currentAddress, currentSymbol }) {
  const storeRef = useRef(store(initialData)).current

  useEffect(() => {
    Smartlook.init('cf71ed516173943775e4d8cc10245b95b9ed7de0')
  }, [])

  const getTitle = () => {
    if (!currentSymbol) {
      return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
    }
    switch (currentPage) {
      case 'nfts':
        return `${currentSymbol} Trading and Charts | Tegro: The CEX-DEX`
      case 'tokens':
        return `${currentSymbol}/USDT Trading and Charts | Tegro: The CEX-DEX`
      default:
        return 'Tegro: The CEX-DEX | Buy, Sell, & Trade Tokens or NFTs'
    }
  }

  const getDescription = () => {
    if (!currentSymbol) {
      return 'Buy, sell, and trade Tokens or NFTs instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade Tokens and NFTs at the best prices.'
    }
    switch (currentPage) {
      case 'nfts':
        return `Buy, sell, and trade ${currentSymbol} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${currentSymbol} at the best prices.`
      case 'tokens':
        return `Buy, sell, and trade ${currentSymbol}/USDT instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${currentSymbol} at the best prices.`
      default:
        return 'Buy, sell, and trade Tokens or NFTs instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade Tokens and NFTs at the best prices.'
    }
  }
  
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={RainbowTheme}>
        <Provider store={storeRef}>
          <Head>
            <title>{getTitle()}</title>
            <meta content={getDescription()} property="description" key="description" />
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
  let currentPage = ''
  let currentAddress = ''
  let currentSymbol = ''
  if (ctx?.req) {
    const [_, page, blockchain, address] = ctx.req.url.split('/')
    
    currentPage = page
    currentAddress = address
    if (currentPage === 'tokens') {
      if (blockchain && address) {
        const network = CHAINS.find(chain => chain.code === blockchain)
        if (network) {
          const res = await $token.api.coingecko.full({platform: network.platform, address: address})
          if (res) {
            currentSymbol = res.symbol.toUpperCase()
          }
        }
      }
    } else if (currentPage === 'nfts') {
      const res = await $collection.api.all({ id: address, limit: 1, blockchain: blockchain })
      if (res && Array.isArray(res?.collections)) {
        const [current] = res.collections
        currentSymbol = current.name
      }
    }
  }
  

  return {
    initialData: {
      blockchain: cookies.blockchain,
      isMobile,
    },
    currentPage,
    currentAddress,
    currentSymbol,
  }
}

export default MyApp
