import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import Socket from '@/libs/ws.lib'
import Amplitude from '@/libs/amplitude.lib'
import useAppHelper from '@/myhooks/useAppHelper'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $app from '@/store/app'
import $gem from '@/store/gem'
import $auction from '@/store/auction'
import $alert from '@/store/alert'

import App from '@/components/App'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StickyBanner from '@/components/StickyBanner'
import SidebarBanner from '@/components/Exchange/Sidebar/SidebarBanner'
import OnboardingBanner from '@/components/Exchange/Sidebar/OnboardingBanner'
import AuctionLandingBanner from '@/components/Auction/AuctionLandingBanner'

const Analytics = dynamic(import('@/components/Analytics'), {ssr: false})

const Wrapper = ({ children }) => {
  useAppHelper()

  const { wallet, connection } = useWagmiHelper()

  const router = useRouter()
  const isLanding = router.asPath == '/'
  const isBot = router.asPath?.includes('/bot')
  const isCampaign = router.asPath?.includes('/campaign')
  const isExchange = router.asPath?.includes('/exchange')
  const [_, page] = router.asPath.split('/')
  const isGD = router.asPath?.includes('/gems-dashboard')
  const isAuctions = router.asPath?.includes('/auctions')
  const { referral } = router.query

  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const platform = useSelector(({ $app }) => $app.platform)
  const stickyBannerVisible = useSelector(({ $app }) => $app.stickyBannerVisible)
  const auctionBannerVisible = useSelector(({ $app }) => $app.auctionBannerVisible)
  const blockchain = useSelector($app.get.blockchain)
  const debug = useSelector(({ $auction }) => $auction.debug)

  const [isInIframe, setIsInIframe] = useState(false)
  const [showTournamentBanner, setShowTournamentBanner] = useState(false)

  Amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, !isApp, platform ?? 'Web')

  useEffect(() => {
    Socket.init(() => {}, handleCloseConnection).then(() => {
      dispatch($app.set.socketConnected(true))
    })

    window.addEventListener('resize', handleWindowResize)

    if (window.self !== window.top) {
      setIsInIframe(true)
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize)
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

  useEffect(() => {
    if (referral) {
      localStorage.setItem('referral', referral)
    }
  }, [referral])

  const handleCloseConnection = () => {
    Socket.init(() => {}, handleCloseConnection)
  }

  const registerUser = async () => {
    const create = await $gem.api.register({ wallet_address: wallet, referral_code: localStorage.getItem('referral') ?? '' })
    if (create) {
      dispatch($app.set.userRegistered(true))
      dispatch($app.set.user(create.user))
      
      if (create?.is_points_added) {
        dispatch($alert.set.success({title: '50 Gems Credited'}))
      }
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
  
  return (
    <div style={{ height: '100%' }}>
      {isBot ? (
        children
      ) : (
        !isInIframe ? (
          <div style={{ height: '100%', position: 'relative', transition: '.4s', overflowX: 'hidden' }}>
            <Analytics />
            <StickyBanner />

            {isLanding ? (
              <AuctionLandingBanner />
            ) : null}

            {!isCampaign && !isApp ? <Header /> : null}

            <div style={{marginTop: page !== '' ? (isMobile ? -48 : -72) : 0, height: stickyBannerVisible ? 'calc(100% - 28px)' : '100%'}}>
              {children}
              {!isCampaign && !isApp && !isExchange && !isGD && !isAuctions ? <Footer /> : null}
            </div>

            {page === 'exchange' && !isApp && showTournamentBanner  ? <SidebarBanner /> : null}
            {page === 'exchange' && !isApp ? <OnboardingBanner /> : null}
          </div>
        ) : (
          <Footer />
        )
      )}

      {
        debug && debug.length > 0 && (
          <App.Flex column center sx={{position: 'absolute', overflowY: 'auto', zIndex: 1111, top: 0, left: 0, right: 0, maxHeight: 360, padding: 8, gap: 8, background: 'rgba(0,0,0,0.5)'}}>
            <App.Text>Debug mode</App.Text>
            <App.Flex fullWidth column gap={8}>
              {
                debug.map((item, index) => (
                  <App.Text sx={{wordWrap: 'break-word', borderBottom: '1px solid #fff', paddingBottom: 4}} key={index}>{item}</App.Text>
                ))
              }
            </App.Flex>
          </App.Flex>
        )
      }
    </div>
  )
}

export default Wrapper