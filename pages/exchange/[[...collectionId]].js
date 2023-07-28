import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import Stream from '@/libs/stream.lib'
import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import CollectionList from '@/components/Exchange/CollectionList'
import CollectionListMobile from '@/components/Exchange/CollectionList/CollectionListMobile'
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

  const initCollection = (collectionId, blockchain) => {
    dispatch($exchange.set.loadingCollectionData(true))
    Promise.all([
      $exchange.api.get.sales({
        collection: collectionId,
        blockchain: blockchain,
        includeDeleted: false,
        includeTokenMetadata: false,
        sortDirection: 'desc',
        limit: 800,
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

  const handleOrdersUpdated = useCallback(() => {
    if (wallet) {
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

    $exchange.api.get.orderBook({
      collection: collectionId,
      blockchain: blockchain.code,
    }).then(res => {
      if (res) {
        dispatch($exchange.set.orderBook(res))
      }
    })
  }, [wallet, collectionId, blockchain.code])

  const handleMobileTabChange = (tab) => {
    if (tab === 'buy_sell') {
      setMobileTabTrade(!mobileTabTrade)
      return
    }

    setMobileTabTrade(false)
    setMobileTab(tab)
  }

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, side: order.side})
  }, [])

  return (
    <App.Flex gap={GRID_GAP} className={styles.container}>
      {!isMobile ? (
        <>
          <CollectionList />

          <App.Flex column flex={1} gap={GRID_GAP}>
            <CollectionInfo />

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
                  <TradeForm ref={tradeForm} />
                </App.Flex>

                <Orders onOrderCancelled={handleOrdersUpdated} onClickOrder={handleClickOrder} />
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </>
      ) : (
        <>
          {mobileTab == 'markets' ? (
            <CollectionList />
          ) : null}

          {mobileTab == 'trades' ? (
            <App.Flex column gap={GRID_GAP} width="100%">
              <CollectionListMobile />

              <App.Flex column flex={1} sx={{ position: 'relative' }}>
                <App.Flex column gap={GRID_GAP} className={styles.tradesContent}>
                  <OrderBook onClickOrder={handleClickOrder} />
                  <Sales onClickSale={handleClickOrder} />
                </App.Flex>
              </App.Flex>
            </App.Flex>
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
          ? <App.LoaderBlock size={100} color="#7204FF" fixed height="100%" />
          : null
      }
    </App.Flex>
  )
}

export default Exchange
