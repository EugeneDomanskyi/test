import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
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
  const { blockchains } = useWalletConnect()
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
      let topCollections = []
      for (const blockchain of blockchains) {
        const top = await $collection.api.top({ blockchain: blockchain.code, limit: 10 })
        if (top && top.hasOwnProperty('collections')) {
          topCollections = [
            ...topCollections,
            ...top.collections.map(item => {
              return {
                blockchain: blockchain.code,
                address: item.id,
                image: item.image,
                name: item.name,
              }
            })
          ]
        }
      }
      dispatch($collection.set.all(topCollections))

      if (topCollections.length) {
        let topCollectionsInfo = []
        for (const blockchain of blockchains) {
          const ids = topCollections.filter(item => item.blockchain == blockchain.code).map(item => item.address)
          const result = await $collection.api.all({ blockchain: blockchain.code, contract: ids })
          if (result && result.hasOwnProperty('collections')) {
            topCollectionsInfo = [
              ...topCollectionsInfo,
              ...result.collections.map(item => {
                return {
                  blockchain: blockchain.code,
                  address: item.id,
                  image: item.image,
                  name: item.name,
                  slug: item.slug,
                  price: item.floorAsk?.price?.amount?.usd,
                  volume: item.volume['1day'],
                  tvl: item.volume['allTime'],
                }
              })
            ]
          }
        }

        topCollectionsInfo.sort((a, b) => b.tvl - a.tvl)
        dispatch($collection.set.all(topCollectionsInfo))
      }
      dispatch($collection.set.loading(false))
    })()
  }, [])

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Wrapper