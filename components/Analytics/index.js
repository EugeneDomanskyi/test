import { useEffect } from 'react'
import { useRouter } from 'next/router'
import amplitude from 'amplitude-js'
import Smartlook from 'smartlook-client'
import { v4 as uuid } from 'uuid'
import { useAccount, useNetwork } from 'wagmi'

const Analytics = () => {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  useEffect(() => {
    const deviceId = localStorage.getItem('device_id')
    if (!deviceId) {
      localStorage.setItem('device_id', uuid())
    }
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      const identifyObj = new amplitude.Identify()
      identifyObj.set('wallet', address)
      amplitude.identify(identifyObj)

      Smartlook.identify(address)
    }
  }, [address, isConnected])

  // useEffect(() => {
  //   if (isConnected && address && chain?.id) {
  //     fetch(`https://39bd5ye5v9.execute-api.eu-north-1.amazonaws.com/connected_wallets?wallet_address=${address}&chain_id=${chain.id}`, { method: 'POST' })
  //   }
  // }, [address, isConnected, chain?.id])

  useEffect(() => {
    if (router.query) {
      const utmParams = Object.entries(router.query).filter(([key]) => key.startsWith('utm_')).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      if (Object.keys(utmParams).length) {
        amplitude.getInstance().setUserProperties(utmParams)
      }
    }
  }, [router.query])
}

export default Analytics