import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import Amplitude from '@/libs/amplitude.lib'
import useAppHelper from '@/myhooks/useAppHelper'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $app from '@/store/app'
import $point from '@/store/point'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

const Analytics = dynamic(import('@/components/Analytics'), {ssr: false})

const Wrapper = ({ children }) => {
  useAppHelper()

  const { wallet, connection } = useWagmiHelper()

  const router = useRouter()
  const isCampaign = router.asPath?.includes('/campaign')
  const isExchange = router.asPath?.includes('/exchange')
  const [_, page] = router.asPath.split('/')
  const isPD = router.asPath?.includes('/points-dashboard')
  const { referral } = router.query

  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)
  const platform = useSelector(({ $app }) => $app.platform)
  const blockchain = useSelector($app.get.blockchain)

  const [isInIframe, setIsInIframe] = useState(false)

  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, !isApp, platform ?? 'Web')

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)

    if (window.self !== window.top) {
      setIsInIframe(true)
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  useEffect(() => {
    Amplitude.event(`Page Visited`, {
      'Page': Amplitude.page(),
      'Chain ID': blockchain?.id,
      'Source': isApp ? 'App' : 'Web',
    })
  }, [page])

  useEffect(() => {
    if (!connection.loading && connection.connected && wallet) {
      registerUser()
    }
  }, [connection, wallet])

  useEffect(() => {
    if (referral) {
      localStorage.setItem('referral', referral)
    }
  }, [referral])

  const registerUser = async () => {
    await $point.api.register({ wallet_address: wallet, referral_code: localStorage.getItem('referral') ?? '' })
    const result = await $point.api.referral(wallet)
    if (result && result?.data) {
      dispatch($point.set.referral(result?.data))
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
      {
        ! isInIframe
          ? <div style={{height: '100%', position: 'relative', transition: '.4s', overflowX: 'hidden'}}>
              <Analytics />
              {!isCampaign && !isApp ? <Header /> : null}
              {children}
              {!isCampaign && !isApp && !isExchange && !isPD ? <Footer /> : null}
            </div>
          : <Footer />
      }
    </div>
  )
}

export default Wrapper