import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Smartlook from 'smartlook-client'
import * as Sentry from '@sentry/nextjs'
import { useAccount } from 'wagmi'

import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'

if (process.env.NEXT_PUBLIC_APP_ENV !== 'local') {
  Sentry.init({
    dsn: 'https://b6059579615abe9ca86108562cbeb308@o1399663.ingest.sentry.io/4505906094538752',
    tracesSampleRate: 0.1, // Capture 100% of the transactions, reduce in production!
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

const Analytics = () => {
  const router = useRouter()
  const { address, isConnected } = useAccount()

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_APP_ENV !== 'local') {
      Smartlook.init(process.env.NEXT_PUBLIC_SMARTLOOK_API_KEY)
    }

    if (isConnected && address) {
      Amplitude.identify(address)

      if (process.env.NEXT_PUBLIC_APP_ENV !== 'local') {
        Smartlook.identify(address)
      }

      const vid = localStorage.getItem('ms_vid')
      if (vid) {
        $app.api.vid({
          wallet_address: address,
          vid,
        })
      }
    }
  }, [address, isConnected])

  useEffect(() => {
    if (router.query) {
      const utmParams = Object.entries(router.query).filter(([key]) => key.startsWith('utm_')).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
      if (Object.keys(utmParams).length) {
        Amplitude.utm(utmParams)
      }
    }
  }, [router.query])
}

export default Analytics