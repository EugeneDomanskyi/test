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
import $collection, { template } from '@/store/collection'

const Header = dynamic(import('@/components/Header'), { ssr: false })
const Footer = dynamic(import('@/components/Footer'), { ssr: false })

const Wrapper = ({ children }) => {
  const router = useRouter()
  const [collectionId] = router.query.collectionId || []
  const isExchange = router.pathname.includes('/exchange')

  const { usdt } = useWalletConnect()
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const { blockchains } = useSelector(({ $app }) => $app)
  const { fetching, page, current: collection } = useSelector(({ $collection }) => $collection)
  const { collections, searched } = useSelector($collection.get.all)

  const blockchainCode = useRef(blockchain.code)

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
      if (router.isReady) {
        if ( ! isExchange || isExchange && fetching) {
          dispatch($collection.set.loading(true))

          const result = await $collection.api.all(queryParams(blockchainCode.current, page, { maxFloorAskPrice: process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null }))
          if (result && result.hasOwnProperty('collections')) {
            dispatch($collection.set.searched([]))
            dispatch($collection.set.all(result.collections))
            dispatch($collection.set.pages(result?.continuation))

            if (isExchange && ! collection?.address) {
              const [first] = result.collections
              router.replace(first.id, undefined, { scroll: false })
            }
          }

          dispatch($collection.set.loading(false))
          dispatch($collection.set.fetching(false))
          initWSConnection(blockchainCode.current)
          // Stream.subscribe('collection.updated', result.collections.map(c => c.id))
          // Stream.on('collection.updated', (data) => {
          //   console.log('collection.updated', data)
          // })
        }
      }
    })()
  }, [fetching, router.isReady])

  useEffect(() => {
    (async () => {
      if (isExchange) {
        let tempCollectionId = null
        const temp = window.location.pathname.split('exchange')
        if (temp.length > 1) {
          tempCollectionId = temp[1].replace(/^\/|\/$/g, '') || null
        }
        
        const currentBlockchainCode = blockchainCode.current
        const realCollectionId = collectionId ?? tempCollectionId
        if (realCollectionId) {
          const currentCollection = await getCollection(realCollectionId)
          dispatch($collection.set.current(currentCollection))
        }

        if ( ! collections.length && currentBlockchainCode == blockchainCode.current) {
          dispatch($collection.set.fetching(true))
        }
      }
    })()
  }, [collectionId])

  useEffect(() => {
    if (blockchain.code != blockchainCode.current) {
      blockchainCode.current = blockchain.code
      dispatch($collection.set.fetching(true))
    }
  }, [blockchain.code])

  const getCollection = async (address) => {
    let collection = collections.find(item => item.address == address)
    if ( ! collection) {
      collection = searched.find(item => item.address == address)
    }

    if ( ! collection) {
      const result = await $collection.api.all(queryParams(blockchainCode.current, page, { id: address, limit: 1 }))
      if (result && result.hasOwnProperty('collections')) {
        if (result.collections.length) {
          const [current] = result.collections
          collection = template(current)
        } else {
          let collectionWasFound = false
          for (const chain of blockchains) {
            if ( ! collectionWasFound && chain.code != blockchainCode.current) {
              const result = await $collection.api.all(queryParams(chain.code, page, { id: address, limit: 1 }))

              if (result && result.hasOwnProperty('collections') && result.collections.length) {
                collectionWasFound = true
                blockchainCode.current = chain.code
                dispatch($app.set.code(chain.code))

                const [current] = result.collections
                collection = template(current)
              }
            }
          }
        }
      }
    }

    return collection ?? {}
  }

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

      {!isExchange ? (
        <Footer />
      ) : null}
    </>
  )
}

export default Wrapper