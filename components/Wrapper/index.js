import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { getNetwork } from '@wagmi/core'
import amplitude from 'amplitude-js'
import Smartlook from 'smartlook-client'
import dynamic from 'next/dynamic'
import { useSelector, useDispatch } from 'react-redux'

import $app from '@/store/app'
import { trackEvent, getPageName } from '@/libs/analytics.lib'
import { CHAINS } from '@/config'

import Header from '@/components/Header'

const WrapperExchange = dynamic(() => import('@/components/Wrapper/WrapperExchange'), {ssr: false})
const WrapperCollections = dynamic(() => import('@/components/Wrapper/WrapperCollections'), {ssr: false})

const Wrapper = ({ children, _isMobile }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const isNfts = router.asPath?.includes('nfts')
  const isSwap = router.pathname.includes('/swap')
  const isExchange = router.asPath?.includes('exchange')

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { isLoading, switchNetwork } = useSwitchNetwork()

  const storedBlockchain = useSelector($app.get.blockchain)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const prevChain = useRef({stored: null})

  // switch blockchain handler
  useEffect(() => {
    if (!isLoading && isConnected && storedBlockchain.id !== chain?.id && switchNetwork) {
      if (storedBlockchain.id !== prevChain.current.stored) {
        // switch from website
        console.log('switch from website')
        switchNetwork(storedBlockchain.id)
        prevChain.current.stored = storedBlockchain.id
        return
      }
      const network = CHAINS.find(network => network.id === chain.id)
      dispatch($app.set.code(network.code))
      prevChain.current.stored = network.id
    }
  }, [storedBlockchain?.id, chain?.id, isLoading, isConnected, switchNetwork])

  useEffect(() => {
    setTimeout(() => {
      prevChain.current.stored = storedBlockchain.id
    }, 1000)
  }, [])

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

    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  useEffect(() => {
    trackEvent('Page Visited', {
      'Page Name': getPageName(),
    })
  }, [router.asPath])

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
    <div style={{height: '100%', paddingTop: 64, transition: '.4s', overflowX: 'hidden'}}>
      <Header />

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