import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import useWalletConnect from '@/myhooks/wallet-connect'
import useApp from '@/myhooks/useApp'
import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'

import App from '@/components/App'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileAppHeader from '@/components/Header/MobileAppHeader'

const Analytics = dynamic(import('@/components/Analytics'), {ssr: false})

const Wrapper = ({ children }) => {
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)

  const { changeNetwork } = useWalletConnect()

  const router = useRouter()
  const isCampaign = router.asPath?.includes('/campaign')
  const isExchange = router.asPath?.includes('/exchange')

  const [isInIframe, setIsInIframe] = useState(false);

  const { isApp, platform } = useApp()
  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, !isApp, platform ?? 'Web')

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    if (window.self !== window.top) {
      setIsInIframe(true)
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      changeNetwork(blockchain.code)
    }
  }

  const getWindowSize = () => {
    if (typeof window !== 'undefined') {
      const {innerWidth, innerHeight} = window
      return {width: innerWidth, height: innerHeight}
    }
  
    return {width: null, height: null}
  }

  const handleWindowResize = () => {
    dispatch($app.set.size(getWindowSize()))
  }

  return (
    <div style={{ height: '100%' }}>
      {/* <App.TopBanner id="tegro-at-ethdenver" mode="dark">
        <App.Flex align={['center', 'flex-start']} justify="center" direction={['row', 'column']} gap={16}>
          <App.Text>🐯 Tegro will be at ETHDenver 2024 (27 Feb - 4 Mar, 2024)</App.Text>
          <App.Button href="https://bit.ly/meet-ashish-tegro" small>Let&apos;s meet!</App.Button>
        </App.Flex>
      </App.TopBanner> */}

      {
        ! isInIframe
          ? <div style={{height: '100%', position: 'relative', transition: '.4s', overflowX: 'hidden'}}>
              <Analytics />
              {!isCampaign && !isApp ? <Header /> : null}
              { isApp ? <MobileAppHeader /> : null }
              {children}
              {!isCampaign && !isApp && !isExchange ? <Footer /> : null}
            </div>
          : <Footer />
      }
    </div>
  )
}

export default Wrapper