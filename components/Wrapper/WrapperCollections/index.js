import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'
import $collection from '@/store/collection'

const WrapperCollections = ({ children }) => {
  const router = useRouter()
  const [collectionId] = router.query.collectionId || []
  const isExchange = router.pathname.includes('/exchange')

  const { network } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const blockchains = useSelector(({ $app }) => $app.blockchains)
  const { fetching, page, current } = useSelector(({ $collection }) => $collection)
  const { collections, searched } = useSelector($collection.get.all)

  const blockchainCode = useRef(blockchain.code)

  useEffect(() => {
    (async () => {
      if (router.isReady) {
        if (! isExchange || isExchange && fetching) {
          dispatch($collection.set.loading(true))

          const result = await $collection.api.all(queryParams(blockchainCode.current, page, {minFloorAskPrice: '0.000001', maxFloorAskPrice: process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null }))
          if (result && result.hasOwnProperty('collections')) {
            dispatch($collection.set.searched([]))
            dispatch($collection.set.all(result.collections.map(item => {
              return {
                ...item,
                blockchain: blockchainCode.current,
                currency: network(blockchainCode.current)?.currency,
              }
            })))
            dispatch($collection.set.pages(result?.continuation))

            if (isExchange && ! current?.address) {
              const [first] = result.collections
              router.replace(first.id, undefined, { scroll: false })
            }
          }

          dispatch($collection.set.loading(false))
          dispatch($collection.set.fetching(false))
          // initWSConnection(blockchainCode.current)
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

        if ( ! realCollectionId && ! current?.address && collections.length) {
          const [first] = collections
          router.replace(first.address, undefined, { scroll: false })
          return
        }

        if (realCollectionId) {
          const currentCollection = await getCollection(realCollectionId)
          dispatch($collection.set.current(currentCollection))
        }

        if ( ! collections.length && currentBlockchainCode == blockchainCode.current) {
          dispatch($collection.set.fetching(true))
        }
      }
    })()
  }, [collectionId, isExchange])

  const queryParams = (blockchainCode, page, customParams) => {
    const defaultParams = {
      blockchain: blockchainCode,
      sortBy: '1DayVolume',
      limit: 10,
      // minFloorAskPrice: '0.000001',
      // displayCurrency: usdt[blockchainCode],
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
          current.blockchain = blockchainCode.current
          current.currency = network(blockchainCode.current)?.currency
          collection = template(current)
        } else {
          let collectionWasFound = false
          for (const chain of blockchains) {
            if ( ! collectionWasFound && chain.code != blockchainCode.current) {
              const result = await $collection.api.all(queryParams(chain.code, page, { id: address, limit: 1 }))

              if (result && result.hasOwnProperty('collections') && result.collections.length) {
                const [current] = result.collections
                collectionWasFound = true
                blockchainCode.current = chain.code
                current.currency = network(chain.code)?.currency
                dispatch($app.set.code(chain.code))
                current.blockchain = chain.code
                collection = template(current)
              }
            }
          }
        }
      }
    }

    return collection ?? {}
  }

  useEffect(() => {
    if (blockchain.code != blockchainCode.current) {
      blockchainCode.current = blockchain.code
      dispatch($collection.set.fetching(true))
    }
  }, [blockchain.code])

  const initWSConnection = async (blockchain) => {
    dispatch($app.set.socketConnected(false))
    await Stream.connect(blockchain)
    dispatch($app.set.socketConnected(true))

    Stream.subscribe('collection.updated', result.collections.map(c => c.id))
    Stream.on('collection.updated', (data) => {
      console.log('collection.updated', data)
    })
  }

  return children
}

export default WrapperCollections