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
import StickyBanner from '@/components/StickyBanner'
import PointsPopup from '@/components/Points/PointsPopup'

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
  const [showStickyBanner, setShowStickyBanner] = useState(false)
  const [showPointsPopup, setShowPointsPopup] = useState(false)

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
    if (page != 'points-dashboard') {
      Amplitude.event(`Page Visited`, {
        'Page': Amplitude.page(),
        'Chain ID': blockchain?.id,
        'Source': isApp ? 'App' : 'Web',
      })
    }
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

  useEffect(() => {
    if ((page === 'exchange' || page === '') && ! isApp) {
      const bannerShown = localStorage.getItem('stickyShown')
      setShowStickyBanner(!bannerShown)
    } else {
      setShowStickyBanner(false)
    }
  }, [page])

  useEffect(() => {
    if ((page === 'exchange' || page === '') && ! isApp) {
      const popupShown = localStorage.getItem('pointsPopupShown')
      setShowPointsPopup(!popupShown)
    } else {
      setShowPointsPopup(false)
    }
  }, [page])

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

  const handleOpenBanner = () => {
    router.push('/points-dashboard')
    localStorage.setItem('stickyShown', true)
    Amplitude.event('Points Banner V1', {'Page': Amplitude.page(), 'Activity': 'Redirected'})
  }

  const handleCloseBanner = () => {
    setShowStickyBanner(false)
    Amplitude.event('Points Banner V1', {'Page': Amplitude.page(), 'Activity': 'Closed'})
  }

  const handleClickStart = () => {
    router.push('/points-dashboard')
    localStorage.setItem('pointsPopupShown', 'true')
    setShowPointsPopup(false)
    Amplitude.event('Points Popup V1', {'Page': Amplitude.page(), 'Activity': 'Redirected'})
  }

  const handleClosePopup = () => {
    setShowPointsPopup(false)
    Amplitude.event('Points Popup V1', {'Page': Amplitude.page(), 'Activity': 'Closed'})
  }
  
  return (
    <div style={{ height: '100%' }}>
      {
        !isInIframe
          ? <div style={{ height: '100%', position: 'relative', transition: '.4s', overflowX: 'hidden' }}>
              <Analytics />
              {
                showPointsPopup
                  ? <PointsPopup onClose={handleClosePopup} onStart={handleClickStart} />
                  : null
              }
              <StickyBanner onClose={handleCloseBanner} onOpen={handleOpenBanner} show={showStickyBanner} />
              {!isCampaign && !isApp ? <Header /> : null}
              <div style={{marginTop: page !== '' ? -72 : 0}}>
                {children}
              </div>
              {!isCampaign && !isApp && !isExchange && !isPD ? <Footer /> : null}
            </div>
          : <Footer />
      }
    </div>
  )
}

export default Wrapper