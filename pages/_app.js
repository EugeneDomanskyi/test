import { Provider } from 'react-redux'
import dynamic from 'next/dynamic'
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, mainnet, bsc } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import merge from 'lodash.merge'
import { ToastContainer, toast } from 'react-toastify'

import store from '@/store'

import AppLayout from '@/components/AppLayout'

import '@rainbow-me/rainbowkit/styles.css'
import 'react-toastify/dist/ReactToastify.css'
import '@uniswap/widgets/fonts.css'
import '@/styles/globals.css'
import Head from 'next/head'

//const initialChain = process.env.NEXT_PUBLIC_APP_ENV == 'production' ? [mainnet, polygon] : [goerli, polygonMumbai]
const initialChain = [polygon, mainnet, bsc]
const { chains, provider } = configureChains(
  initialChain, [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
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

const Modal = dynamic(() => import('@/components/Modal'), {ssr: false})

function MyApp({ Component, pageProps }) { 
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={RainbowTheme}>
        <Provider store={store}>
          <Head>
            <title>NFT20 | NFT Trading Platform</title>
          </Head>

          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>

          <Modal />
          <ToastContainer autoClose={3000} />
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
