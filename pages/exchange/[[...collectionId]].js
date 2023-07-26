import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import $collection from '@/store/collection'
import Stream from '@/libs/stream.lib'
import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import CollectionList from '@/components/Exchange/CollectionList'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import TradeForm from '@/components/Exchange/TradeForm'
import CollectionInfo from '@/components/Exchange/CollectionInfo'
import Orders from '@/components/Exchange/Orders'
import MobileTabsBar from '@/components/Exchange/MobileTabsBar'

import styles from './styles.module.scss'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const GRID_GAP = 6

const Exchange = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [collectionId] = router.query.collectionId || []

  const { isMobile } = usePropsHelper()
  const { wallet } = useWalletConnect()
  const socketConnected = useSelector(({$app}) => $app.socketConnected)
  const blockchain = useSelector($app.get.blockchain)
  const { collections, searched, isLoading } = useSelector($collection.get.all)
  const { current } = useSelector(({$collection}) => $collection)
  const loadingCollectionData = useSelector(({$exchange}) => $exchange.loadingCollectionData)

  const [mobileTab, setMobileTab] = useState('markets')
  const [mobileTabTrade, setMobileTabTrade] = useState(false)

  const tradeForm = useRef(null)

  useEffect(() => {
    trackEvent('Dex Exchange Clicked', {
      'Network': blockchain.code.toUpperCase(),
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })
  }, [])

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
    if (collectionId && blockchain.code) {
      initCollection(collectionId, blockchain.code)
    }
  }, [collectionId, blockchain.code])

  useEffect(() => {
    if (blockchain.code && wallet) {
      $exchange.api.get.orders({
        blockchain: blockchain.code,
        maker: wallet,
        includeCriteriaMetadata: true,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.orders(res))
        }
      })
    }
  }, [blockchain.code, wallet])
  
  useEffect(() => {
    if (socketConnected && collectionId) {
      Stream.subscribe('sale.*', [collectionId])
    }

    return () => {
      Stream.unsubscribe('sale.*')
    }
  }, [socketConnected, collectionId])

  useEffect(() => {
    if (socketConnected && collectionId && wallet) {
      Stream.subscribe('bid.*', [collectionId], {maker: wallet})
      Stream.subscribe('ask.*', [collectionId], {maker: wallet})
    }
    
    return () => {
      Stream.unsubscribe('bid.*')
      Stream.unsubscribe('ask.*')
    }
  }, [socketConnected, collectionId, wallet])

  useEffect(() => {
    if (!isLoading) {
      if (!collectionId) {
        const [first] = collections
        router.replace(`${first.address}`, undefined, { scroll: false })
        dispatch($collection.set.current(first))
      } else {
        let find = collections.find(item => item.address == collectionId)
        if ( ! find) {
          find = searched.find(item => item.address == collectionId)
        }

        if (find) {
          dispatch($collection.set.current(find))
        }
      }
    }
  }, [isLoading, blockchain.code, collectionId])

  const initCollection = (collectionId, blockchain) => {
    console.log('initCollection')
    dispatch($exchange.set.loadingCollectionData(true))
    Promise.all([
      $exchange.api.get.sales({
        collection: collectionId,
        blockchain: blockchain,
        includeDeleted: false,
        includeTokenMetadata: false,
        sortDirection: 'desc',
        limit: 1000,
      }),
      $exchange.api.get.orderBook({
        collection: collectionId,
        blockchain: blockchain,
      })
    ]).then(([sales, orderBook]) => {
      if (sales) {
        dispatch($exchange.set.sales(sales))
      }
      if (orderBook) {
        dispatch($exchange.set.orderBook(orderBook))
      }
      dispatch($exchange.set.loadingCollectionData(false))
    })
  }

  const handleOrdersUpdated = () => {
    $exchange.api.get.orders({
      blockchain: blockchain.code,
      maker: wallet,
      includeCriteriaMetadata: true,
    }).then(res => {
      if (res) {
        dispatch($exchange.set.orders(res))
      }
    })

    $exchange.api.get.orderBook({
      collection: collectionId,
      blockchain: blockchain.code,
    }).then(res => {
      if (res) {
        dispatch($exchange.set.orderBook(res))
      }
    })
  }

  const handleMobileTabChange = (tab) => {
    if (tab === 'buy_sell') {
      setMobileTabTrade(!mobileTabTrade)
      return
    }

    setMobileTabTrade(false)
    setMobileTab(tab)
  }

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({price: order.price, amount: order.quantity, side: order.side})
  }, [])

  return (
    <App.Flex gap={GRID_GAP} className={styles.container}>
      {!isMobile ? (
        <>
          <CollectionList current={current} />

          <App.Flex column flex={1} gap={GRID_GAP}>
            <CollectionInfo current={current} />

            <App.Flex gap={GRID_GAP}>
              <App.Flex flex={1} column gap={GRID_GAP}>
                <Chart />

                <App.Flex gap={GRID_GAP}>
                  <OrderBook onClickOrder={handleClickOrder} />
                  <Sales onClickSale={handleClickOrder} />
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={GRID_GAP}>
                <App.Flex>
                  <TradeForm ref={tradeForm} current={current} onOrderCreated={handleOrdersUpdated} />
                </App.Flex>

                <Orders current={current} onOrderCancelled={handleOrdersUpdated} onClickOrder={handleClickOrder} />
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </>
      ) : (
        <>
          {mobileTab == 'markets' ? (
            <CollectionList current={current} />
          ) : null}

          <MobileTabsBar
            active={mobileTab}
            actvieTrade={mobileTabTrade}
            onTabChange={handleMobileTabChange}
          />
        </>
      )}
      {
        loadingCollectionData
          ? <App.Flex sx={{position: 'fixed', width: '100%', height: '100%'}} align="center" justify="center">
              <App.Loader size={100} color="#7204FF" />
            </App.Flex>
          : null
      }
    </App.Flex>
  )
}

export default Exchange
