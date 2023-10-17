import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
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
import { UniversalWalletConnector } from '@magiclabs/wagmi-connector'

import { CHAINS } from '@/config'
import store from '@/store'
import $token from '@/store/token'
import $collection from '@/store/collection'

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

let firstTimeLoaded = false
let globalList = []

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
    
    const connector = new UniversalWalletConnector({
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

function MyApp({ Component, pageProps, initialData, currentPage, currentAddress, currentSymbol, ssRoute, marketInfo, marketsList }) {
  const storeRef = useRef(store(initialData)).current

  useEffect(() => {
    Smartlook.init('cf71ed516173943775e4d8cc10245b95b9ed7de0')
  }, [])
  
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={RainbowTheme}>
        <Provider store={storeRef}>
          <Head route={ssRoute} currentPage={currentPage} currentSymbol={currentSymbol} marketInfo={marketInfo} />

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

  let ssRoute = ''
  let marketInfo = {}
  let marketsList = globalList

  if (ctx?.req) {
    const routeArr = ctx?.req?.url.split('/') || []
    const [addrArr] = routeArr.slice(-1)
    currentAddress = addrArr.split('?')[0]
    ssRoute = (ctx.req.url)
    if (!firstTimeLoaded) {
      // const list = await getAssetsFile()
      // if (list && Array.isArray(list)) {
      //   marketsList = list
      //   globalList = list
      //   marketInfo = list.find(item => item.address === currentAddress) || {}
      //   firstTimeLoaded = true
      // }
    }
  }
  
  return {
    initialData: {
      blockchain: cookies.blockchain,
      isMobile,
      marketsList,
    },
    currentPage,
    currentAddress,
    currentSymbol,
    ssRoute,
    marketInfo,
    marketsList,
  }
}

export default MyApp
