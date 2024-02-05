import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { useRouter } from 'next/router'
import { userAgentFromString } from 'next/server'
import nookies from 'nookies'
import merge from 'lodash.merge'

import { getDefaultWallets, RainbowKitProvider, darkTheme, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { CHAINS } from '@/config'
import store from '@/store'
import $app from '@/store/app'

import App from '@/components/App'
import Wrapper from '@/components/Wrapper'
import Head from '@/components/Head'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/globals.css'
import '@/styles/roulette_design.css'

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

function MyApp({ Component, pageProps, initialData, ssRoute }) {
  const router = useRouter()
  const storeRef = useRef(store(initialData)).current

  useEffect(() => {
    if (router?.query?.vid) {
      localStorage.setItem('ms_vid', router.query.vid)
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
  let isApp = null
  let platform = null
  let initWallet = null
  let devMode = null
  let chains = []

  if (ctx?.req) {
    ssRoute = ctx.req.url

    const { device } = userAgentFromString(ctx.req.headers['user-agent'])
    isMobile = device.type === 'mobile'

    isApp = ctx.req.headers['x-tegro-app'] == 'native'
    platform = ctx.req.headers['x-tegro-platform']
    initWallet = ctx.req.headers['x-tegro-wallet'] == 'null' ? null : ctx.req.headers['x-tegro-wallet']
    devMode = ctx.req.headers['x-tegro-dev-mode'] == 'true' ? true : null

    const result = await $app.api.chains()
    if (result) {
      chains = result.map(item => {
        return {
          id: item.ChainId,
          token: {
            symbol: item.DefaultQuoteTokenSymbol,
            address: item.DefaultQuoteTokenContractAddress.toLowerCase(),
            image: item.Logo || (item.DefaultQuoteTokenSymbol == 'USDT' ? '/images/icon-usdt.png' : '') || `https://storage.googleapis.com/token-assets/assets/${item?.Name}/${item.DefaultQuoteTokenContractAddress.toLowerCase()}.png`
          },
          contract: {
            exchange: item.ExchangeContract.toLowerCase(),
            settlement: item.SettlementContract.toLowerCase(),
          },
        }
      })
    }
  }
  
  return {
    initialData: {
      blockchain: cookies.blockchain,
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
