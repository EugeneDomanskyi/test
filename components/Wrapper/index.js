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
// import SidebarToshiBanner from '@/components/Exchange/Sidebar/SidebarToshiBanner'

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
  const stats = useSelector(({ $point }) => $point.stats)
  const blockchain = useSelector($app.get.blockchain)

  const [isInIframe, setIsInIframe] = useState(false)
  const [showStickyBanner, setShowStickyBanner] = useState(false)

  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, !isApp, platform ?? 'Web')

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    window.addEventListener('beforeunload', handleUserSession);

    if (window.self !== window.top) {
      setIsInIframe(true)
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      window.removeEventListener('beforeunload', handleUserSession)
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
    if (wallet && stats?.liquidity_mining) {
      localStorage.setItem('pointsExistingUser', true);
    }
  }, [wallet, stats])

  useEffect(() => {
    const existingUser = localStorage.getItem('pointsExistingUser');
    if (page === '' && ! isApp && ! existingUser) {
      const bannerShown = localStorage.getItem('stickyShown')
      const popupShown = localStorage.getItem('pointsPopupShown')
      setShowStickyBanner(!bannerShown)
    } else {
      setShowStickyBanner(false)
    }
  }, [page])

  const handleUserSession = () => {
    const currentTime = new Date().getTime();
    const bannerTS = localStorage.getItem('stickyShownTS');
    const popupTS = localStorage.getItem('pointsPopupShownTS');

    // remove sticky banner and points popup after 24 hours
    if (bannerTS && (currentTime - bannerTS) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('stickyShown');
      localStorage.removeItem('stickyShownTS');
    }

    if (popupTS && (currentTime - popupTS) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('pointsPopupShown');
      localStorage.removeItem('pointsPopupShownTS');
    }
  }

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

  const handleInteraction = (type) => {
    const timestamp = new Date().getTime();
    localStorage.setItem(`${type}TS`, timestamp);
  }

  const handleOpenBanner = () => {
    router.push('/points-dashboard')
    localStorage.setItem('stickyShown', true)
    const timestamp = localStorage.getItem('stickyShownTS');
    if (!timestamp) {
      handleInteraction('stickyShown')
    }
    Amplitude.event('Points Banner V1', {'Page': Amplitude.page(), 'Activity': 'Redirected'})
  }

  const handleCloseBanner = () => {
    setShowStickyBanner(false)
    localStorage.setItem('stickyShown', true)
    const timestamp = localStorage.getItem('stickyShownTS');
    if (!timestamp) {
      handleInteraction('stickyShown')
    }
    Amplitude.event('Points Banner V1', {'Page': Amplitude.page(), 'Activity': 'Closed'})
  }
  
  return (
    <div style={{ height: '100%' }}>
      {
        !isInIframe
          ? <div style={{ height: '100%', position: 'relative', transition: '.4s' }}>
              <Analytics />
              <StickyBanner onClose={handleCloseBanner} onOpen={handleOpenBanner} show={showStickyBanner} />
              {!isCampaign && !isApp ? <Header /> : null}
              <div style={{marginTop: page !== '' ? -72 : 0, height: showStickyBanner ? 'calc(100% - 28px)' : '100%'}}>
                {children}
                {!isCampaign && !isApp && !isExchange && !isPD ? <Footer /> : null}
              </div>
            </div>
          : <Footer />
      }
    </div>
  )
}

export default Wrapper