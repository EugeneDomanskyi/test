import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import { userAgentFromString } from 'next/server'
import merge from 'lodash.merge'
import { I18nextProvider } from 'react-i18next'
import nookies from 'nookies'
import { BanditContextProvider } from '@bandit-network/quest-widget'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'

import WagmiHelper from '@/libs/WagmiHelper'
import store from '@/store'
import i18nInit from '@/libs/i18n'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'
import Head from '@/components/Head'

import '@bandit-network/quest-widget/dist/styles.css'
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

  const wagmiConfig = WagmiHelper.createWagmiConfig(initialData.chains)
  const currentChain = WagmiHelper.getChainByCode(initialData.blockchain, initialData.chains)

  useEffect(() => {
    if (router?.query?.vid) {
      localStorage.setItem('ms_vid', router.query.vid)
    }
  }, [])

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18nInit(initialData.language)}>
          <RainbowKitProvider theme={RainbowTheme} initialChain={currentChain}>
            <BanditContextProvider cluster={"mainnet"} apiKey={process.env.NEXT_PUBLIC_BANDIT_API_KEY}>
              <Provider store={storeRef}>
                <Head route={ssRoute} />
                <Wrapper>
                  <Component {...pageProps} />
                </Wrapper>
                <App.Alert />
              </Provider>
            </BanditContextProvider>
          </RainbowKitProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  let ssRoute = ''
  let isMobile = null

  let isApp = null
  let platform = null

  let chains = []
  let blockchain = null

  if (ctx?.req) {
    ssRoute = ctx.req.url

    const { device } = userAgentFromString(ctx.req.headers['user-agent'])
    isMobile = device.type === 'mobile'

    isApp = ctx.req.headers['x-tegro-app'] == 'native'
    // isApp = true
    platform = ctx.req.headers['x-tegro-platform']

    chains = await WagmiHelper.fetchChains(ctx)
    blockchain = WagmiHelper.getCurrentChainCode(ctx, chains)
  }
  
  return {
    initialData: {
      language: nookies.get()?.language ?? 'en',
      isMobile,
      isApp,
      platform,
      blockchain,
      chains,
    },
    ssRoute,
  }
}

export default MyApp
