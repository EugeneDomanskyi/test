import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'

import { trackEvent } from '@/libs/analytics.lib'

import $collection from '@/store/collection'

const Header = dynamic(import('@/components/Header'), { ssr: false })
const Footer = dynamic(import('@/components/Footer'), { ssr: false })

const Wrapper = ({ children }) => {
  const dispatch = useDispatch()
  const { blockchain } = useSelector(({ $app }) => $app)

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

    trackEvent('Dex Page Visited')
  }, [])

  useEffect(() => {
    (async () => {
      dispatch($collection.set.loading(true))
      const result = await $collection.api.all({ blockchain, sortBy: '1DayVolume', limit: 10 })
      if (result && result.hasOwnProperty('collections')) {
        dispatch($collection.set.all(result.collections.map(item => {
          return {
            blockchain,
            address: item.id,
            image: item.image,
            name: item.name,
            slug: item.slug,
            price: item.floorAsk?.price?.amount?.usd,
            volume: item.volume['1day'],
            tvl: item.volume['allTime'],
          }
        })))
      }
      dispatch($collection.set.loading(false))
    })()
  }, [blockchain])

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Wrapper