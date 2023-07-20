import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'
import Stream from '@/libs/stream.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'
import { useRouter } from 'next/router'

const Header = dynamic(import('@/components/Header'), { ssr: false })
const Footer = dynamic(import('@/components/Footer'), { ssr: false })

const Wrapper = ({ children }) => {
  const router = useRouter()
  const [collectionId] = router.query.collectionId || []

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
      if (router.isReady) {
        const params = {
          blockchain: blockchain.code,
          sortBy: '1DayVolume',
          limit: 10,
          displayCurrency: usdt[blockchain.code],
        }

        let totalResult = []
        if (collectionId) {
          const result = await $collection.api.all({ ...params, id: collectionId })
          if (result && result.hasOwnProperty('collections')) {
            if (result.collections.length) {
              totalResult = [
                ...result.collections,
              ]
            }
          }
        }
        console.log('totalResult', totalResult)
        // params.maxFloorAskPrice = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null
        const result = await $collection.api.all(params)

        if (result && result.hasOwnProperty('collections')) {
          totalResult = [
            ...totalResult,
            ...result.collections
          ]
        }

        dispatch($collection.set.all(totalResult))
        dispatch($collection.set.loading(false))
        initWSConnection(blockchain.code)
        // Stream.subscribe('collection.updated', result.collections.map(c => c.id))
        // Stream.on('collection.updated', (data) => {
        //   console.log('collection.updated', data)
        // })
      }
    })()
  }, [blockchain, router.isReady])

  const initWSConnection = async (blockchain) => {
    dispatch($app.set.socketConnected(false))
    await Stream.connect(blockchain)
    dispatch($app.set.socketConnected(true))
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default Wrapper