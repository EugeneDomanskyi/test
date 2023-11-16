import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { createClient } from '@reservoir0x/reservoir-sdk'
import nookies from 'nookies'
import amplitude from 'amplitude-js'
import * as Sentry from '@sentry/nextjs'
import Smartlook from 'smartlook-client'
import merge from 'lodash.merge'

import { getDefaultWallets, RainbowKitProvider, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import * as MagicConnectors from '@magiclabs/wagmi-connector/dist/lib/connectors/universalWalletConnector'

import { CHAINS } from '@/config'
import { fetchPrices, getTokens } from '@/api_services/tokens'
import store from '@/store'
import $token, { fullToTemplate, template as tokenTemplate } from '@/store/token'
import $collection, { template as collectionTemplate } from '@/store/collection'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'
import Head from '@/components/Head'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.css'
import '@/styles/roulette_design.css'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://b6059579615abe9ca86108562cbeb308@o1399663.ingest.sentry.io/4505906094538752',
    // integrations: [
    //   new Sentry.BrowserTracing(),
    //   new Sentry.Replay(),
    // ],
    // Performance Monitoring
    tracesSampleRate: 0.1, // Capture 100% of the transactions, reduce in production!
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
    const formattedChains = chains.map((chain) => {
      const [rpcUrl] = chain.rpcUrls.public.http
      return {
        rpcUrl: rpcUrl,
        chainId: chain.id,
      }
    })
    const [initialChain] = formattedChains

    const connector = new MagicConnectors.UniversalWalletConnector({
      chains: chains,
      options: {
        networks: formattedChains,
        apiKey: process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY,
        magicSdkConfiguration: {
          network: initialChain,
        },
      },
    })

    return {
      connector,
    }
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
    wallets: [rainbowMagicConnector({ chains: chains })],
  },
  popularWallets
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectors,
  publicClient,
  webSocketPublicClient,
})

const RainbowTheme = merge(darkTheme({ overlayBlur: 'small' }), {
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

function MyApp({ Component, pageProps, initialData, currentInfo, currentPage, currentAddress, currentSymbol, ssRoute, marketInfo, marketsList }) {
  const storeRef = useRef(store(initialData, currentPage, currentInfo)).current

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV !== 'local') {
      Smartlook.init('cf71ed516173943775e4d8cc10245b95b9ed7de0')
    }
  }, [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={RainbowTheme}>
        <Provider store={storeRef}>
          <Head route={ssRoute} currentInfo={currentInfo} currentPage={currentPage} currentSymbol={currentSymbol} />

          <Wrapper isMobile={initialData.isMobile}>
            <Component {...pageProps} />
          </Wrapper>

          <App.Modal />
          <ToastContainer autoClose={3000} />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  const cookies = nookies.get(ctx)
  let isMobile = false
  if (ctx.req?.headers?.['user-agent']) {
    isMobile = ctx.req.headers['user-agent'].match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
  }
  let currentInfo = {}
  let currentPage = ''
  let currentAddress = ''
  let currentSymbol = ''
  if (ctx?.req) {
    const [_, page, blockchain, address] = ctx.req.url.split('/')

    currentPage = page
    currentAddress = (address ?? '').toLowerCase()
    if (currentPage === 'exchange') {
      if (blockchain && address) {
        const currentChain = CHAINS.find(chain => chain.code === blockchain)
        if (currentChain) {
          const post = {
            currentPage: 1,
            perPage: 1,
            orderBy: 'name',
            orderDirection: 'asc',
            searchText: address,
            searchField: 'contract_address',
          }

          const [token] = await getTokens(currentChain, post)
          if (token) {
            currentInfo = {
              ...token,
              blockchain: currentChain.code,
            }
            currentSymbol = token.symbol.toUpperCase()

            const prices = await fetchPrices(currentChain, [token])
            if (prices[token.id]) {
              currentInfo = {
                ...currentInfo,
                ...prices[token.id],
              }
            }

            currentInfo = tokenTemplate(currentInfo)
          }
        }
      }
    } else if (currentPage === 'nfts') {
      const res = await $collection.api.all({ id: address, limit: 1, blockchain: blockchain })
      if (res && Array.isArray(res?.collections) && res?.collections.length) {
        const [current] = res.collections
        currentSymbol = current.name
        current.blockchain = blockchain
        currentInfo = collectionTemplate(current)
      }
    }
  }

  let ssRoute = ''
  let marketInfo = {}
  let marketsList = []

  if (ctx?.req) {
    const routeArr = ctx?.req?.url.split('/') || []
    const [addrArr] = routeArr.slice(-1)
    currentAddress = addrArr.split('?')[0]
    ssRoute = (ctx.req.url)
  }

  return {
    initialData: {
      blockchain: cookies.blockchain,
      isMobile,
      marketsList,
    },
    currentInfo,
    currentPage,
    currentAddress,
    currentSymbol,
    ssRoute,
    marketInfo,
    marketsList,
  }
}

export default MyApp
