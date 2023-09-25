import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'
import { useAccount } from 'wagmi'
import { getNetwork } from '@wagmi/core'
import amplitude from 'amplitude-js'
import Smartlook from 'smartlook-client'

import { trackEvent } from '@/libs/analytics.lib'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WrapperTokens from '@/components/Wrapper/WrapperTokens'
import WrapperCollections from '@/components/Wrapper/WrapperCollections'

const Wrapper = ({ children }) => {
  const router = useRouter()
  const isNfts = router.asPath?.includes('nfts')
  const isSwap = router.pathname.includes('/swap')
  const isTokens = router.asPath?.includes('tokens')
  const isLanding = router.pathname.includes('/landing')

  const { address, isConnected } = useAccount()

  console.log('isTokens', isTokens);

  useEffect(() => {
    if (isConnected && address) {
      const identifyObj = new amplitude.Identify()
      identifyObj.set('wallet', address)
      amplitude.identify(identifyObj)
      Smartlook.identify(address)
      const network = getNetwork()
      fetch(
        `https://39bd5ye5v9.execute-api.eu-north-1.amazonaws.com/connected_wallets?wallet_address=${address}&chain_id=${network.chain.id}`,
        {
          method: 'POST'
        }
      )
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
      {!isLanding ? (
        <Header />
      ) : null}

      {isTokens ? (
        <WrapperTokens>
          {children}
        </WrapperTokens>
      ) : null}

      {isNfts || isSwap ? (
        <WrapperCollections>
          {children}
        </WrapperCollections>
      ) : null}

      {!isNfts && !isSwap && !isTokens ? (
        children
      ) : null}

      {!isNfts && !isTokens && !isLanding ? (
        <Footer />
      ) : null}
    </>
  )
}

export default Wrapper