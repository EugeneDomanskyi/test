import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'

import { trackEvent } from '@/libs/analytics.lib'

import $collection from '@/store/collection'

const Header = dynamic(import('@/components/Header'), { ssr: false })
const Footer = dynamic(import('@/components/Footer'), { ssr: false })

const Wrapper = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {
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

      dispatch($collection.set.loading(true))
      const top = await $collection.api.top({ limit: 10 })
      if (top && top.hasOwnProperty('collections')) {
        const ids = top.collections.map(item => item.id)
        const result = await $collection.api.all({ contract: ids })
        if (result && result.hasOwnProperty('collections')) {
          dispatch($collection.set.all(result.collections.map(item => {
            return {
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
      }
      dispatch($collection.set.loading(false))
    })()
  })

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Wrapper