import { useEffect, useState, useRef } from 'react'
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

  const [isSSR, setIsSSR] = useState(true)
  const [mobileTab, setMobileTab] = useState('markets')
  const [mobileTabTrade, setMobileTabTrade] = useState(false)

  const tradeForm = useRef(null)

  useEffect(() => {
    trackEvent('Dex Exchange Clicked', {
      'Network': blockchain.code.toUpperCase(),
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })

    setIsSSR(false)
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
    if (collectionId) {
      $exchange.api.get.sales({
        blockchain: blockchain.code,
        collection: collectionId,
        includeDeleted: false,
        includeTokenMetadata: false,
        sortDirection: 'desc',
        limit: 1000,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.sales(res))
        }
      })
    }
  }, [collectionId])

  useEffect(() => {
    if (blockchain.code && collectionId && wallet) {
      $exchange.api.get.orders({
        blockchain: blockchain.code,
        // collection: collectionId,
        maker: wallet,
        includeCriteriaMetadata: true,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.orders(res))
        }
      })
    }
  }, [blockchain.code, collectionId, wallet])
  
  useEffect(() => {
    if (socketConnected && collectionId) {
      Stream.subscribe('sale.*', [collectionId])
    }
    return () => {
      Stream.unsubscribe('sale.*')
      Stream.unsubscribe('bid.*')
      Stream.unsubscribe('ask.*')
    }
  }, [socketConnected, collectionId])

  useEffect(() => {
    if (wallet && socketConnected && collectionId) {
      Stream.subscribe('bid.*', [collectionId], {maker: wallet})
      Stream.subscribe('ask.*', [collectionId], {maker: wallet})
    }
    
  }, [socketConnected, collectionId, wallet])

  useEffect(() => {
    if (!isLoading) {
      const addressInCollections = collections.find(c => c.address === collectionId)
      const addressInSearched = searched.find(c => c.address === collectionId)
      if (!collectionId || (!addressInCollections && !addressInSearched)) {
        const [first] = collections
        router.replace(`${first.address}`, undefined, { scroll: false })
      }
    }
  }, [isLoading, blockchain.code, collectionId])

  const handleOrdersUpdated = () => {
    $exchange.api.get.orders({
      blockchain: blockchain.code,
      // collection: collectionId,
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

  const handleClickOrder = (order) => {
    tradeForm.current.setForm({price: order.price, amount: order.quantity, side: order.side})
  }

  return ! isSSR ? (
    <App.Flex gap={GRID_GAP} className={styles.container}>
      {!isMobile ? (
        <>
          <CollectionList collectionId={collectionId} />

          <App.Flex column flex={1} gap={GRID_GAP}>
            <CollectionInfo collectionId={collectionId} />

            <App.Flex gap={GRID_GAP}>
              <App.Flex flex={1} column gap={GRID_GAP}>
                <Chart />

                <App.Flex gap={GRID_GAP}>
                  <OrderBook collectionId={collectionId} onClickOrder={handleClickOrder} />
                  <Sales onClickSale={handleClickOrder} />
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={GRID_GAP}>
                <App.Flex>
                  <TradeForm ref={tradeForm} collectionId={collectionId} onOrderCreated={handleOrdersUpdated} />
                </App.Flex>

                <Orders collectionId={collectionId} onOrderCancelled={handleOrdersUpdated} onClickOrder={handleClickOrder} />
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </>
      ) : (
        <>
          {mobileTab == 'markets' ? (
            <CollectionList collectionId={collectionId} />
          ) : null}

          <MobileTabsBar
            active={mobileTab}
            actvieTrade={mobileTabTrade}
            onTabChange={handleMobileTabChange}
          />
        </>
      )}
    </App.Flex>
  ) : null
}

export default Exchange
