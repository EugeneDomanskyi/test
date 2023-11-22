import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { CHAINS } from '@/config'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import useOrders from '@/myhooks/useOrders'
import Stream from '@/libs/stream.lib'

import $app from '@/store/app'
import $collection, { template } from '@/store/collection'
import $exchange from '@/store/exchange'
import $orders from '@/store/orders'

const WrapperCollections = ({ children }) => {
  const { isMobile } = usePropsHelper()

  const router = useRouter()
  const [address] = router.query.address || []
  const blockchain = router.query.blockchain
  const isNfts = router.pathname.includes('/nfts') || router.query.segments?.includes('nfts')

  const { wallet, network, isContractAddress } = useWalletConnect()

  const { updateOrders } = useOrders({tokenAddress: address, type: 'nfts'})

  const dispatch = useDispatch()
  const storedBlockchain = useSelector($app.get.blockchain)
  const pageBlockchains = useSelector($app.get.pageBlockchains('nfts'))

  const collections = useSelector(({ $collection }) => $collection.all)
  const searched = useSelector(({ $collection }) => $collection.searched)
  const current = useSelector(({ $collection }) => $collection.current)
  const searching = useSelector(({ $collection }) => $collection.searching)
  const loading = useSelector(({ $collection }) => $collection.loading)
  const sort = useSelector(({ $collection }) => $collection.sort)
  const search = useSelector(({ $collection }) => $collection.search)
  const pages = useSelector(({ $collection }) => $collection.pages)

  const [wrongAddress, setWrongAddress] = useState(false)
  const [isBlockchain, setIsBlockchain] = useState(false)

  const sortRef = useRef(sort)
  const searchRef = useRef(search)
  const pageRef = useRef(pages.current)
  const blockchainCode = useRef(storedBlockchain.code)
  const wsCollectionIds = useRef([])

  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(address)
  const emptyAddress = address === '0x'

  const currentChain = CHAINS.find(chain => chain.code === storedBlockchain.code)

  const collectionsPerPage = 20

  const initWSConnection = (code) => {
    Stream.connect(code)
    Stream.on('collection.updated', (eventName, eventData) => {
      dispatch($collection.set.updateItem({
        ...eventData,
        blockchain: storedBlockchain.code,
        currency: storedBlockchain.currency,
      }))
    })
  }

  useEffect(() => {
    initWSConnection()
    if (isNfts && storedBlockchain.code !== blockchain) {
      const newBlockchain = ['ethereum', 'polygon', 'arbitrum', 'bsc', 'avalanche'].includes(storedBlockchain.code) ? storedBlockchain.code : blockchain
      dispatch($app.set.code(newBlockchain))
      dispatch($collection.set.loading(true))
      router.replace(`/nfts/${newBlockchain}/0x`)
    }
  }, [isNfts, storedBlockchain, blockchain])

  // fetch list for blockchain
  useEffect(() => {
    if (isNfts && currentChain.code !== blockchain) {
      return
    }

    getCollectionList()
  }, [isNfts, search, pages.current, currentChain.code, blockchain])

  // fetch current if address is correct
  useEffect(() => {
    (async () => {
      if (isAddress && (currentChain.code === blockchain) && !current?.address) {
        const existInList = collections.find(collection => collection.id === address)
        if (!existInList) {
          const collection = await getCollection(address)
          if (collection) {
            dispatch($collection.set.current(collection))
            return
          }
          setWrongAddress(true)
          return
        }
        dispatch($collection.set.current(existInList))
      } else if (!isAddress && !emptyAddress) {
        setWrongAddress(true)
      }
    })()
  }, [isAddress, blockchain, address, current?.address])

  // set current from list
  useEffect(() => {
    if (isNfts && (wrongAddress || !isAddress) && (storedBlockchain.code === blockchain) && collections.length && !isMobile && !loading) {
      dispatch($collection.set.current(collections[0]))
      router.replace(`/nfts/${blockchain}/${collections[0].id}`)
    }
  }, [isNfts, wrongAddress, collections.length, blockchain, storedBlockchain.code, isMobile, loading])

  useEffect(() => {
    if (address && blockchain) {
      initCollection(address, blockchain)
    }
  }, [address, blockchain])

  const initCollection = (queryCollectionId, code) => {
    dispatch($exchange.set.loading(true))
    $exchange.api.get.sales({
      collection: queryCollectionId,
      blockchain: code,
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
  }, [blockchain, wallet, address])

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
    if (address) {
      Stream.subscribe('sale.*', [address])
    }

    return () => {
      Stream.unsubscribe('sale.*')
    }
  }, [address])

  useEffect(() => {
    if (address && wallet) {
      Stream.subscribe('bid.*', [address], {maker: wallet})
      Stream.subscribe('ask.*', [address], {maker: wallet})
    }
    
    return () => {
      Stream.unsubscribe('bid.*')
      Stream.unsubscribe('ask.*')
    }
  }, [address, wallet])

  const getCollectionList = async () => {
    if (search != '') {
      dispatch($collection.set.loading(true))
    } else {
      dispatch($collection.set.searching(false))
    }

    const result = await $collection.api.all(queryParams(
      storedBlockchain.code,
      pages.current,
      sort,
      search
    ))

    if (result && result.hasOwnProperty('collections')) {
      const tempCollections = result.collections

      const tempAll = tempCollections.map(item => {
        return {
          ...item,
          blockchain: storedBlockchain.code,
          currency: storedBlockchain.currency,
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

      dispatch($collection.set.pages({next: result?.continuation}))
      wsSubscribe(tempAll.map(item => item.id))
    }

    dispatch($collection.set.loading(false))
  }

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
      limit: collectionsPerPage,
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
        storedBlockchain.code,
        null,
        sort,
        '',
        { id: address, limit: 1 }
      ))
      
      if (result && result.hasOwnProperty('collections')) {
        if (result.collections.length) {
          const [current] = result.collections
          current.blockchain = storedBlockchain.code
          current.currency = storedBlockchain.currency
          collection = template(current)
        } else {
          console.log('Collection was not found in current blockchain')
        }
      }
    }

    return collection ?? {}
  }

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

  return children
}

export default WrapperCollections