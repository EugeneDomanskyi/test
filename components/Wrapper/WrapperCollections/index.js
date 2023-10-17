import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'


import useWalletConnect from '@/myhooks/wallet-connect'
import useOrders from '@/myhooks/useOrders'
import Stream from '@/libs/stream.lib'

import $app from '@/store/app'
import $token from '@/store/token'
import $collection, { template } from '@/store/collection'
import $exchange from '@/store/exchange'
import $orders from '@/store/orders'

const WrapperCollections = ({ children }) => {
  const router = useRouter()
  const [queryBlockchainCode, queryCollectionId] = router.query.segments?.slice(-2) || []
  const isNfts = router.pathname.includes('/nfts') || router.query.segments?.includes('nfts')

  const { wallet, network, isContractAddress } = useWalletConnect()

  const { updateOrders } = useOrders({tokenAddress: queryCollectionId, type: 'nfts'})

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const pageBlockchains = useSelector($app.get.pageBlockchains('nfts'))

  const collections = useSelector(({ $collection }) => $collection.all)
  const searched = useSelector(({ $collection }) => $collection.searched)
  const current = useSelector(({ $collection }) => $collection.current)
  const searching = useSelector(({ $collection }) => $collection.searching)
  const fetching = useSelector(({ $collection }) => $collection.fetching)
  const sort = useSelector(({ $collection }) => $collection.sort)
  const search = useSelector(({ $collection }) => $collection.search)
  const pages = useSelector(({ $collection }) => $collection.pages)

  const [isBlockchain, setIsBlockchain] = useState(false)

  const sortRef = useRef(sort)
  const searchRef = useRef(search)
  const pageRef = useRef(pages.current)
  const blockchainCode = useRef(blockchain.code)
  const wsCollectionIds = useRef([])

  const initWSConnection = (code) => {
    Stream.connect(code)
    Stream.on('collection.updated', (eventName, eventData) => {
      dispatch($collection.set.updateItem({
        ...eventData,
        blockchain: blockchain.code,
        currency: blockchain.currency,
      }))
    })
  }

  useEffect(() => {
    if (queryCollectionId && blockchain.code) {
      initCollection(queryCollectionId, blockchain.code)
    }
  }, [queryCollectionId, blockchain.code])

  const initCollection = (queryCollectionId) => {
    dispatch($exchange.set.loading(true))
    $exchange.api.get.sales({
      collection: queryCollectionId,
      blockchain: blockchain.code,
      includeDeleted: false,
      includeTokenMetadata: false,
      sortDirection: 'desc',
      limit: 800,
    }).then(sales => {
      if (sales) {
        dispatch($exchange.set.sales(sales))
        dispatch($orders.set.trades({type: 'nfts', data: sales}))
      }
      dispatch($exchange.set.loading(false))
    })
  }

  const wsSubscribe = (ids) => {
    const newIds = ids.filter(id => {
      if (!wsCollectionIds.current.includes(id)) {
        wsCollectionIds.current.push(id)
        return true
      }

      return false
    })

    if (newIds.length) {
      Stream.subscribe('collection.updated', newIds)
    }
  }

  useEffect(() => {
    updateOrders()
  }, [blockchain.code, wallet, queryCollectionId])

  useEffect(() => {
    Stream.on('sale', (event, data) => {
      switch (event) {
        case 'sale.created':
          dispatch($exchange.set.saleAdd(data))
          break
        case 'sale.updated':
          dispatch($exchange.set.saleUpdate(data))
          break
      }
    })
    Stream.on('bid', (event, data) => {
      if (wallet && wallet.toLowerCase() !== data.maker.toLowerCase()) {
        return
      }
      dispatch($exchange.set.orderUpdate(data))
    })
    Stream.on('ask', (event, data) => {
      if (wallet && wallet.toLowerCase() !== data.maker.toLowerCase()) {
        return
      }
      dispatch($exchange.set.orderUpdate(data))
    })
  }, [wallet])

  useEffect(() => {
    if (queryCollectionId) {
      Stream.subscribe('sale.*', [queryCollectionId])
    }

    return () => {
      Stream.unsubscribe('sale.*')
    }
  }, [queryCollectionId])

  useEffect(() => {
    if (queryCollectionId && wallet) {
      Stream.subscribe('bid.*', [queryCollectionId], {maker: wallet})
      Stream.subscribe('ask.*', [queryCollectionId], {maker: wallet})
    }
    
    return () => {
      Stream.unsubscribe('bid.*')
      Stream.unsubscribe('ask.*')
    }
  }, [queryCollectionId, wallet])

  useEffect(() => {
    if (router.isReady) {
      const tempBlockhainCode = queryBlockchainCode ?? blockchain.code

      if (tempBlockhainCode) {
        if ( ! pageBlockchains.map(item => item.code).includes(tempBlockhainCode)) {
          dispatch($app.set.code('ethereum'))
        } else {
          if (tempBlockhainCode != blockchain.code) {
            dispatch($app.set.code(tempBlockhainCode))
          }
        }
      }

      setIsBlockchain(true)
    }
  }, [router.isReady, queryBlockchainCode])

  useEffect(() => {
    if (router.isReady && isBlockchain && (fetching || ! isNfts)) {
      initWSConnection(blockchain.code)
      getCollectionList()
      dispatch($collection.set.fetching(false))
    }
  }, [router.isReady, fetching, isBlockchain])

  const getCollectionList = async () => {
    dispatch($collection.set.loading(true))

    const result = await $collection.api.all(queryParams(
      blockchain.code,
      pages.current,
      sort,
      search
    ))

    if (result && result.hasOwnProperty('collections')) {
      const tempCollections = result.collections

      dispatch($collection.set.pages({next: result?.continuation}))

      const tempAll = tempCollections.map(item => {
        return {
          ...item,
          blockchain: blockchain.code,
          currency: network(blockchain.code)?.currency,
        }
      })
      
      if (search == '') {
        dispatch($collection.set.searched([]))
        dispatch($collection.set.all(tempAll))
        dispatch($collection.set.searchEmpty(false))
        
      } else {
        dispatch($collection.set.searched(tempAll))
        dispatch($collection.set.searching(true))
        dispatch($collection.set.searchEmpty(!tempAll.length))
      }

      if (isNfts && ! current?.id) {
        const [first] = tempCollections
        router.replace(`/nfts/${blockchain.code}/${first.id}`, undefined, { scroll: false })
      }

      wsSubscribe(tempAll.map(item => item.id))
    }

    dispatch($collection.set.loading(false))
  }

  useEffect(() => {
    (async () => {
      if (router.isReady && isNfts) {
        let tempCollectionId = null
        const temp = window.location.pathname.split('/')
        if (temp.length == 4) {
          tempCollectionId = temp.pop().replace(/^\/|\/$/g, '') || null
        }
        
        const realCollectionId = queryCollectionId ?? tempCollectionId
        if ( ! realCollectionId && collections.length) {
          let id = current?.id
          if ( ! id) {
            const [first] = collections
            id = first.id
          }
          router.replace(`/nfts/${blockchain.code}/${id}`, undefined, { scroll: false })
          return
        }

        if (realCollectionId) {
          const currentCollection = await getCollection(realCollectionId)
          dispatch($collection.set.current(currentCollection))
          dispatch($app.set.marketInfo(currentCollection))

          wsSubscribe([currentCollection.id])
        }

        if ( ! collections.length) {
          dispatch($collection.set.fetching(true))
        }
      }
    })()
  }, [router.isReady, isNfts, queryCollectionId])

  const queryParams = (blockchainCode, page, sortType, searchQuery, customParams) => {
    const [sortBy] = sortType.split(':')

    let orderBy = sortBy.toLowerCase()
    switch (orderBy) {
      case 'volume':
        orderBy = '1DayVolume'
        break
      case 'price':
        orderBy = 'floorAskPrice'
        break
      case 'name':
        orderBy = 'createdAt'
        break
    }

    // Need to make Server Side Sort
    orderBy = '1DayVolume'

    const defaultParams = {
      blockchain: blockchainCode,
      sortBy: orderBy,
      limit: 10,
    }

    if (searchQuery != '') {
      if (isContractAddress(searchQuery)) {
        defaultParams.id = searchQuery
      } else {
        defaultParams.name = searchQuery
      }
    } else {
      defaultParams.minFloorAskPrice = '0.000001'
      //defaultParams.maxFloorAskPrice = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null
    }

    let continuation = null
    if (page != 'init' && searchQuery == '') {
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
      const result = await $collection.api.all(queryParams(
        blockchain.code,
        null,
        sort,
        '',
        { id: address, limit: 1 }
      ))

      if (result && result.hasOwnProperty('collections')) {
        if (result.collections.length) {
          const [current] = result.collections
          current.blockchain = blockchain.code
          current.currency = network(blockchain.code)?.currency
          collection = template(current)
        } else {
          console.log('Collection was not found in current blockchain')
        }
      }
    }

    return collection ?? {}
  }

  useEffect(() => {
    if (blockchain.code != blockchainCode.current) {
      blockchainCode.current = blockchain.code
      dispatch($collection.set.current({}))
      dispatch($collection.set.fetching(true))
      initWSConnection(blockchain.code)
      dispatch($token.set.all([]))
      dispatch($token.set.current({}))
    }
  }, [blockchain.code])

  useEffect(() => {
    if (sort != sortRef.current) {
      sortRef.current = sort
      //dispatch($collection.set.fetching(true))

      dispatch($collection.set.update({value: sorting(collections, sort), key: 'all'}))
      if (searching) {
        dispatch($collection.set.update({value: sorting(searched, sort), key: 'searched'}))
      }
    }
  }, [sort])

  const sorting = (items, order) => {
    const sortedItems = [...items]
    sortedItems.sort((a, b) => {
      const [orderBy, orderDirection] = order.toLowerCase().split(':')
      if (orderBy == 'name') {
        const aa = a[orderBy].toUpperCase()
        const bb = b[orderBy].toUpperCase()
        return orderDirection == 'asc' ? aa.localeCompare(bb) : bb.localeCompare(aa)
      } else {
        return orderDirection == 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy]
      }
    })

    return sortedItems
  }

  useEffect(() => {
    if (search != searchRef.current) {
      searchRef.current = search
      if (search != '') {
        dispatch($collection.set.fetching(true))
      } else {
        dispatch($collection.set.searching(false))
        dispatch($collection.set.searchEmpty(false))
      }
    }
  }, [search])

  useEffect(() => {
    if (pages.current != pageRef.current) {
      pageRef.current = pages.current
      dispatch($collection.set.fetching(true))
    }
  }, [pages])

  return children
}

export default WrapperCollections