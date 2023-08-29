import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'
import { useAccount } from 'wagmi'
import amplitude from 'amplitude-js'

import { trackEvent } from '@/libs/analytics.lib'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WrapperTokens from '@/components/Wrapper/WrapperTokens'
import WrapperCollections from '@/components/Wrapper/WrapperCollections'

const Wrapper = ({ children }) => {
  const router = useRouter()
  const isExchange = router.pathname.includes('/exchange')
  const isTokens = router.pathname.includes('/tokens')

  const {address, isConnected} = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      const identifyObj = new amplitude.Identify()
      identifyObj.set('wallet', address)
      amplitude.identify(identifyObj)
    }
  }, [address, isConnected])

  useEffect(() => {
    const deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      localStorage.setItem('device_id', uuid())
    }

    loadIntercom({
      user_id: deviceId,
      appId: process.env.NEXT_PUBLIC_INTERCOM_APP_ID,
      ssr: false,
      initWindow: false,
      delay: 0,
    })

    trackEvent('Page Visited')
  }, [])

  return (
    <>
      <Header />

      {isTokens ? (
        <WrapperTokens>
          {children}
        </WrapperTokens>
      ) : (
        <WrapperCollections>
          {children}
        </WrapperCollections>
      )}

      {!isExchange && !isTokens ? (
        <Footer />
      ) : null}
    </>
  )
}

export default Wrapper