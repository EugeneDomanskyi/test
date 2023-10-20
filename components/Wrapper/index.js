import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { useAccount } from 'wagmi'
import { getNetwork } from '@wagmi/core'
import amplitude from 'amplitude-js'
import Smartlook from 'smartlook-client'

import { trackEvent } from '@/libs/analytics.lib'

import Header from '@/components/Header'
import WrapperExchange from '@/components/Wrapper/WrapperExchange'
import WrapperCollections from '@/components/Wrapper/WrapperCollections'
import App from '@/store/app'

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
    const deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      localStorage.setItem('device_id', uuid())
    }

    trackEvent('Page Visited')
  }, [])

  const handleHeaderHeightCounted = (height) => {
    setHeaderHeight(height)
    console.log('Header height is: ', height);
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