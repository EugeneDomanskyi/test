import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import { userAgentFromString } from 'next/server'
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

import { CHAINS } from '@/config'
import store from '@/store'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'
import Head from '@/components/Head'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.css'
import '@/styles/roulette_design.css'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://b6059579615abe9ca86108562cbeb308@o1399663.ingest.sentry.io/4505906094538752',
    tracesSampleRate: 0.1, // Capture 100% of the transactions, reduce in production!
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  CHAINS, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID }),
  publicProvider(),
]
)

const { wallets: [popularWallets] } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains,
})

const connectors = connectorsForWallets([
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

function MyApp({ Component, pageProps, initialData, ssRoute }) {
  const router = useRouter()
  const storeRef = useRef(store(initialData)).current

  useEffect(() => {
    if (router?.query?.vid) {
      localStorage.setItem('ms_vid', router.query.vid)
    }
    
    if (process.env.NEXT_PUBLIC_APP_ENV !== 'local') {
      Smartlook.init('cf71ed516173943775e4d8cc10245b95b9ed7de0')
    }
  }, [])

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={RainbowTheme}>
        <Provider store={storeRef}>
          <Head route={ssRoute} />

          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>

          <App.Alert />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  const cookies = nookies.get(ctx)

  let ssRoute = ''
  let isMobile = null

  if (ctx?.req) {
    ssRoute = ctx.req.url

    const { device } = userAgentFromString(ctx.req.headers['user-agent'])
    isMobile = device.type === 'mobile'
  }

  return {
    initialData: {
      blockchain: cookies.blockchain,
      isMobile,
    },
    ssRoute,
  }
}

export default MyApp
