import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'

const Header = dynamic(import('@/components/Header'), { ssr: false })
const Footer = dynamic(import('@/components/Footer'), { ssr: false })

const Wrapper = ({ children }) => {
  const { usdt } = useWalletConnect()
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)

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
      const result = await $collection.api.all({
        blockchain: blockchain.code,
        sortBy: '1DayVolume',
        limit: 10,
        displayCurrency: usdt[blockchain.code],
        maxFloorAskPrice: process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null,
      })

      if (result && result.hasOwnProperty('collections')) {
        dispatch($collection.set.all(result.collections.map(item => {
          return {
            blockchain: blockchain.code,
            address: item.id,
            image: item.image,
            name: item.name,
            slug: item.slug,
            price: item.floorAsk?.price?.amount?.decimal,
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