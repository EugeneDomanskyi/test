import { useEffect } from 'react'
import { useRouter } from 'next/router'
import amplitude from 'amplitude-js'
import Smartlook from 'smartlook-client'
import { useAccount } from 'wagmi'

const Analytics = () => {
  const router = useRouter()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      const identifyObj = new amplitude.Identify()
      identifyObj.set('wallet', address)
      amplitude.identify(identifyObj)

      Smartlook.identify(address)
    }
  }, [address, isConnected])

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