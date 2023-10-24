import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { useAccount } from 'wagmi'
import { getNetwork } from '@wagmi/core'
import amplitude from 'amplitude-js'
import Smartlook from 'smartlook-client'
import dynamic from 'next/dynamic'

import { trackEvent, getPageName } from '@/libs/analytics.lib'

import Header from '@/components/Header'

const WrapperExchange = dynamic(() => import('@/components/Wrapper/WrapperExchange'), {ssr: false})
const WrapperCollections = dynamic(() => import('@/components/Wrapper/WrapperCollections'), {ssr: false})

const Wrapper = ({ children, isMobile }) => {
  const router = useRouter()
  const isNfts = router.asPath?.includes('nfts')
  const isSwap = router.pathname.includes('/swap')
  const isExchange = router.asPath?.includes('exchange')

  const { address, isConnected } = useAccount()

  const [headerHeight, setHeaderHeight] = useState(64)

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
    if (router.query) {
      const utmParams = Object.entries(router.query).filter(([key]) => key.startsWith('utm_')).reduce((acc, [key, value]) => ({...acc, [key]: value}), {})
      if (Object.keys(utmParams).length) {
        amplitude.getInstance().setUserProperties(utmParams)
      }
    }
  }, [address, router.query])

  useEffect(() => {
    const deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      localStorage.setItem('device_id', uuid())
    }
  }, [])

  useEffect(() => {
    trackEvent('Page Visited', {
      'Page Name': getPageName(),
    })
  }, [router.asPath])

  const handleHeaderHeightCounted = (height) => {
    setHeaderHeight(height)
  }
  
  return (
    <div style={{paddingTop: headerHeight, transition: '.4s'}}>
      <Header onHeightCounted={handleHeaderHeightCounted} />

      {isExchange ? (
        <WrapperExchange isMobile={isMobile}>
          {children}
        </WrapperExchange>
      ) : null}

      {isNfts || isSwap ? (
        <WrapperCollections>
          {children}
        </WrapperCollections>
      ) : null}

      {!isNfts && !isSwap && !isExchange ? (
        children
      ) : null}
    </div>
  )
}

export default Wrapper