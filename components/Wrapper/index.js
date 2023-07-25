import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { loadIntercom } from 'next-intercom'
import { v4 as uuid } from 'uuid'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'
import Stream from '@/libs/stream.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'

const Header = dynamic(import('@/components/Header'), { ssr: false })
const Footer = dynamic(import('@/components/Footer'), { ssr: false })

const Wrapper = ({ children }) => {
  const router = useRouter()
  const [collectionId] = router.query.collectionId || []

  const { usdt } = useWalletConnect()
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const { blockchains } = useSelector(({ $app }) => $app)
  const { page } = useSelector(({ $collection }) => $collection)

  const isInit = useRef(true)
  const updateCollections = useRef(true)

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
      if (updateCollections.current) {
        if (router.isReady) {
          dispatch($collection.set.loading(true))

          let blockchainCode = blockchain.code
          let totalResult = []

          if (collectionId && isInit.current) {
            isInit.current = false

            const result = await $collection.api.all(queryParams(blockchainCode, page, { id: collectionId, limit: 1 }))
            if (result && result.hasOwnProperty('collections')) {
              if (result.collections.length) {
                totalResult = [
                  ...result.collections,
                ]
              } else {
                let check = false
                for (const chain of blockchains) {
                  if ( ! check && chain.code != blockchain.code) {
                    const temp = await $collection.api.all(queryParams(chain.code, page, { id: collectionId, limit: 1 }))

                    if (temp && temp.hasOwnProperty('collections') && temp.collections.length) {
                      check = true
                      blockchainCode = chain.code
                      dispatch($app.set.code(chain.code))
                      updateCollections.current = false

                      totalResult = [
                        ...temp.collections,
                      ]
                    }
                  }
                }
              }
            }
          }

          const result = await $collection.api.all(queryParams(blockchainCode, page, { maxFloorAskPrice: process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null }))

          if (result && result.hasOwnProperty('collections')) {
            if (! collectionId || collectionId && result.collections.find(item => item.id == collectionId)) {
              totalResult = result.collections
            } else {
              totalResult = [
                ...totalResult,
                ...result.collections
              ]
            }

            dispatch($collection.set.pages(result?.continuation))
          }

          dispatch($collection.set.searched([]))
          dispatch($collection.set.all(totalResult))
          dispatch($collection.set.loading(false))
          initWSConnection(blockchain.code)
          // Stream.subscribe('collection.updated', result.collections.map(c => c.id))
          // Stream.on('collection.updated', (data) => {
          //   console.log('collection.updated', data)
          // })
        }
      } else {
        updateCollections.current = true
      }
    })()
  }, [blockchain, router.isReady])

  const queryParams = (blockchainCode, page, customParams) => {
    const defaultParams = {
      blockchain: blockchainCode,
      sortBy: '1DayVolume',
      limit: 10,
      displayCurrency: usdt[blockchainCode],
      // id: '0x4d544035500d7ac1b42329c70eb58e77f8249f0f',
    }

    let continuation = null
    if (page != 'init') {
      continuation = page
    }

    return {
      ...defaultParams,
      ...customParams,
      continuation,
    }
  }

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