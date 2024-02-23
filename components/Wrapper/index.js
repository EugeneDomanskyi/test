import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import useApp from '@/myhooks/useApp'
import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'

import App from '@/components/App'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const Analytics = dynamic(import('@/components/Analytics'), {ssr: false})

const Wrapper = ({ children }) => {
  const dispatch = useDispatch()

  const router = useRouter()
  const isCampaign = router.asPath?.includes('/campaign')
  const isExchange = router.asPath?.includes('/exchange')

  const { isApp, platform } = useApp()
  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, !isApp, platform ?? 'Web')

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

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
    <div>
      <App.TopBanner id="tegro-at-ethdenver" mode="dark">
        <App.Flex align={['center', 'flex-start']} justify="center" direction={['row', 'column']} gap={16}>
          <App.Text>🐯 Tegro will be at ETHDenver 2024 (27 Feb - 4 Mar, 2024) - Let&apos;s meet! 👋</App.Text>
          <App.Button href="https://bit.ly/meet-ashish-tegro" small>Let&apos;s meet!</App.Button>
        </App.Flex>
      </App.TopBanner>

      <div style={{height: '100%', position: 'relative', transition: '.4s', overflowX: 'hidden'}}>
        <Analytics />
        {!isCampaign && !isApp ? <Header /> : null}
        {children}
        {!isCampaign && !isApp && !isExchange ? <Footer /> : null}
      </div>
    </div>
  )
}

export default Wrapper