import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import Amplitude from '@/libs/amplitude.lib'
import useAppHelper from '@/myhooks/useAppHelper'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $app from '@/store/app'
import $gem from '@/store/gem'
import $alert from '@/store/alert'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyBanner from '@/components/StickyBanner'
import SidebarBanner from '@/components/Exchange/Sidebar/SidebarBanner'
import OnboardingBanner from '@/components/Exchange/Sidebar/OnboardingBanner'

const Analytics = dynamic(import('@/components/Analytics'), {ssr: false})

const Wrapper = ({ children }) => {
  useAppHelper()

  const { wallet, connection } = useWagmiHelper()

  const router = useRouter()
  const isCampaign = router.asPath?.includes('/campaign')
  const isExchange = router.asPath?.includes('/exchange')
  const [_, page] = router.asPath.split('/')
  const isGD = router.asPath?.includes('/gems-dashboard')
  const { referral } = router.query

  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const platform = useSelector(({ $app }) => $app.platform)
  const stats = useSelector(({ $gem }) => $gem.stats)
  const blockchain = useSelector($app.get.blockchain)

  const [isInIframe, setIsInIframe] = useState(false)
  const [showStickyBanner, setShowStickyBanner] = useState(false)
  const [showTournamentBanner, setShowTournamentBanner] = useState(false)

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
    const onboardingStep = localStorage.getItem('onboardingStep')
    if (onboardingStep == 3) {
      setShowTournamentBanner(true)
    }

    if (page != 'gems-dashboard') {
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

  // useEffect(() => {
  //   if (wallet) {
  //     fetchUserInfo()
  //   }
  // }, [wallet])

  useEffect(() => {
    if (referral) {
      localStorage.setItem('referral', referral)
    }
  }, [referral])

  useEffect(() => {
    if (wallet && stats?.liquidity_mining) {
      localStorage.setItem('gemsExistingUser', true);
    }
  }, [wallet, stats])

  useEffect(() => {
    const existingUser = localStorage.getItem('gemsExistingUser');
    if (page === '' && ! isApp && ! existingUser) {
      const bannerShown = localStorage.getItem('stickyShown')
      const popupShown = localStorage.getItem('gemsPopupShown')
      setShowStickyBanner(!bannerShown)
    } else {
      setShowStickyBanner(false)
    }
  }, [page])

  const handleUserSession = () => {
    const currentTime = new Date().getTime();
    const bannerTS = localStorage.getItem('stickyShownTS');
    const popupTS = localStorage.getItem('gemsPopupShownTS');

    // remove sticky banner and gems popup after 24 hours
    if (bannerTS && (currentTime - bannerTS) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('stickyShown');
      localStorage.removeItem('stickyShownTS');
    }

    if (popupTS && (currentTime - popupTS) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('gemsPopupShown');
      localStorage.removeItem('gemsPopupShownTS');
    }
  }

  const registerUser = async () => {
    const create = await $gem.api.register({ wallet_address: wallet, referral_code: localStorage.getItem('referral') ?? '' })
    if (create && create?.is_points_added) {
      dispatch($alert.set.success({title: '100 Gems Credited'}))
    }

    fetchUserInfo()

    const onboardingStep = localStorage.getItem('onboardingStep')
    if (!onboardingStep) {
      localStorage.setItem('onboardingStep', 0)
    }
  }

  const fetchUserInfo = async () => {
    const result = await $gem.api.referral(wallet)
    if (result) {
      dispatch($gem.set.referral(result))
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
    router.push('/gems-dashboard')
    localStorage.setItem('stickyShown', true)
    const timestamp = localStorage.getItem('stickyShownTS');
    if (!timestamp) {
      handleInteraction('stickyShown')
    }
    Amplitude.event('Gems Banner V1', {'Page': Amplitude.page(), 'Activity': 'Redirected'})
  }

  const handleCloseBanner = () => {
    setShowStickyBanner(false)
    localStorage.setItem('stickyShown', true)
    const timestamp = localStorage.getItem('stickyShownTS');
    if (!timestamp) {
      handleInteraction('stickyShown')
    }
    Amplitude.event('Gems Banner V1', {'Page': Amplitude.page(), 'Activity': 'Closed'})
  }
  
  return (
    <div style={{ height: '100%' }}>
      {
        !isInIframe
          ? <div style={{ height: '100%', position: 'relative', transition: '.4s', overflowX: 'hidden' }}>
              <Analytics />
              <StickyBanner onClose={handleCloseBanner} onOpen={handleOpenBanner} show={showStickyBanner} />
              {!isCampaign && !isApp ? <Header /> : null}
              <div style={{marginTop: page !== '' ? (isMobile ? -48 : -72) : 0, height: showStickyBanner ? 'calc(100% - 28px)' : '100%'}}>
                {children}
                {!isCampaign && !isApp && !isExchange && !isGD ? <Footer /> : null}
              </div>

              {page === 'exchange' && !isApp && showTournamentBanner  ? <SidebarBanner /> : null}
              {page === 'exchange' && !isApp ? <OnboardingBanner /> : null}
            </div>
          : <Footer />
      }
    </div>
  )
}

export default Wrapper