import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import { userAgentFromString } from 'next/server'
import nookies, { parseCookies } from 'nookies'
import merge from 'lodash.merge'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'

import Chains, { wagmiConfig } from '@/libs/Chains.lib'
import store from '@/store'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'
import Head from '@/components/Head'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.css'
import '@/styles/roulette_design.css'

const queryClient = new QueryClient()

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

function MyApp({ Component, pageProps, initialData, ssRoute }) {
  const router = useRouter()
  const storeRef = useRef(store(initialData)).current

  let currentChain = initialData.chains.find(item => item.code == initialData.blockchain)

  useEffect(() => {
    if (router?.query?.vid) {
      localStorage.setItem('ms_vid', router.query.vid)
    }

    (async () => {
      if (!currentChain) {
        const code = parseCookies(null)?.blockchain
        if (code) {
          currentChain = await Chains.chainByCode(code)
        }
      }
    })()
  }, [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={RainbowTheme} initialChain={currentChain}>
          <Provider store={storeRef}>
            <Head route={ssRoute} />
            <Wrapper>
              <Component {...pageProps} />
            </Wrapper>
            <App.Alert />
          </Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  let ssRoute = ''
  let isMobile = null
  let isApp = null
  let platform = null
  let initWallet = null
  let devMode = null
  let chains = []
  let blockchain = null

  if (ctx?.req) {
    ssRoute = ctx.req.url

    const { device } = userAgentFromString(ctx.req.headers['user-agent'])
    isMobile = device.type === 'mobile'

    isApp = ctx.req.headers['x-tegro-app'] == 'native'
    platform = ctx.req.headers['x-tegro-platform']
    initWallet = ctx.req.headers['x-tegro-wallet'] == 'null' ? null : ctx.req.headers['x-tegro-wallet']
    devMode = ctx.req.headers['x-tegro-dev-mode'] == 'true' ? true : null

    const domainName = ctx.req ? ctx.req.headers.host : window.location.hostname
    chains = await Chains.list(domainName)

    const cookies = nookies.get(ctx, 'blockchain')
    blockchain = cookies.blockchain
    if (!blockchain) {
      blockchain = chains[0]?.code
      nookies.set(ctx, 'blockchain', blockchain, {path: '/'})
    } else {
      if (!chains.some(item => item.code == blockchain)) {
        blockchain = chains[0]?.code
        nookies.set(ctx, 'blockchain', blockchain, {path: '/'})
      }
    }
  }
  
  return {
    initialData: {
      blockchain,
      isMobile,
      isApp,
      platform,
      initWallet,
      devMode,
      chains,
    },
    ssRoute,
  }
}

export default MyApp
