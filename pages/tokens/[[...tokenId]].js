import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import useOrders from '@/myhooks/useOrders'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import $token from '@/store/token'

import App from '@/components/App'
import Sidebar from '@/components/Exchange/Sidebar'
import SidebarMobile from '@/components/Exchange/Sidebar/SidebarMobile'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import TradeForm from '@/components/Exchange/TradeForm'
import CollectionInfo from '@/components/Exchange/Info'
import Orders from '@/components/Exchange/Orders'
import MobileTabsBar from '@/components/Exchange/MobileTabsBar'

import styles from './styles.module.scss'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const GRID_GAP = 6

const Tokens = () => {
  const router = useRouter()
  const [queryTokenId] = router.query.tokenId || []
  
  const { isMobile } = usePropsHelper()
  const { wallet } = useWalletConnect()
  const { updateOrders } = useOrders({tokenAddress: tokenId, type: 'tokens'})
  // const socketConnected = useSelector(({$app}) => $app.socketConnected)
  
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const exchangeLoading = useSelector(({$exchange}) => $exchange.loading)

  const tokens = useSelector(({$token}) => $token.all)
  const searched = useSelector(({$token}) => $token.searched)
  const current = useSelector(({$token}) => $token.current)
  const tokenLoading = useSelector(({$token}) => $token.loading)
  const sort = useSelector(({$token}) => $token.sort)
  const search = useSelector(({$token}) => $token.search)
  const searching = useSelector(({$token}) => $token.searching)
  const pages = useSelector($token.get.pages)

  const [mobileTab, setMobileTab] = useState('markets')
  const [mobileTabTrade, setMobileTabTrade] = useState(false)

  const tradeForm = useRef(null)

  useEffect(() => {
    trackEvent('Tokens Clicked', {
      'Network': blockchain.code.toUpperCase(),
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
    })
  }, [])

  useEffect(() => {
    if (queryTokenId && blockchain.code) {
      getExchangeData(queryTokenId, blockchain.code)
    }
  }, [queryTokenId, blockchain.code])

  useEffect(() => {
    if (wallet) {
      updateOrders()
    }
  }, [blockchain.code, wallet])

  const getExchangeData = (tokenId, blockchain) => {
    //dispatch($exchange.set.loading(true))
    /* Promise.all([
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
      dispatch($exchange.set.loading(false))
    }) */
  }

  /* useEffect(() => {
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
  }, [blockchain.code, wallet]) */

  const handleOrdersUpdated = useCallback(() => {
    if (wallet) {
      updateOrders()
    }
  }, [wallet, queryTokenId, blockchain.code])

  const handleMobileTabChange = (tab) => {
    setMobileTabTrade(false)
    setMobileTab(tab)
  }

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, side: order.side})
  }, [])

  const handleSort = useCallback((value) => {
    dispatch($token.set.sort(value))
  }, [])

  const handleSearch = useCallback((value) => {
    dispatch($token.set.search(value))
  }, [])

  const handlePage = useCallback((value) => {
    dispatch($token.set.pages({current: value ?? 1}))
  }, [])

  return (
    <App.Flex gap={GRID_GAP} className={styles.container}>
      {!isMobile ? (
        <>
          <Sidebar
            items={tokens}
            searched={searched}
            current={current}
            sort={sort}
            search={search}
            searching={searching}
            pages={pages}
            loading={tokenLoading}
            onSort={handleSort}
            onSearch={handleSearch}
            onPage={handlePage}
          />

          <App.Flex column flex={1} gap={GRID_GAP}>
            <CollectionInfo current={current} />

            <App.Flex gap={GRID_GAP}>
              <App.Flex flex={1} column gap={GRID_GAP}>
                <Chart />

                <App.Flex gap={GRID_GAP}>
                  <OrderBook
                    type="tokens"
                    onClickOrder={handleClickOrder} />
                  <Sales onClickSale={handleClickOrder} />
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={GRID_GAP}>
                <App.Flex>
                  <TradeForm
                    ref={tradeForm}
                    type="tokens"
                    current={current} />
                </App.Flex>

                <Orders
                  current={current}
                  type="tokens"
                  onOrderCancelled={handleOrdersUpdated}
                  onClickOrder={handleClickOrder} />
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </>
      ) : (
        <>
          {mobileTab == 'markets' ? (
            <Sidebar
              items={tokens}
              searched={searched}
              current={current}
              sort={sort}
              search={search}
              searching={searching}
              pages={pages}
              loading={tokenLoading}
              onSort={handleSort}
              onSearch={handleSearch}
              onPage={handlePage}
            />
          ) : null}

          {mobileTab == 'charts' ? (
            <Chart />
          ) : null}

          {mobileTab == 'trades' ? (
            <App.Flex column gap={GRID_GAP} width="100%">
              <SidebarMobile
                items={tokens}
                searched={searched}
                current={current}
                sort={sort}
                search={search}
                searching={searching}
                pages={pages}
                loading={tokenLoading}
                onSort={handleSort}
                onSearch={handleSearch}
                onPage={handlePage}
              />

              <App.Flex column flex={1} sx={{ position: 'relative' }}>
                <App.Flex column gap={GRID_GAP} className={styles.tradesContent}>
                  <OrderBook
                    type="tokens"
                    onClickOrder={handleClickOrder} />
                  <Sales onClickSale={handleClickOrder} />
                </App.Flex>
              </App.Flex>
            </App.Flex>
          ) : null}

          {mobileTab == 'orders' ? (
            <Orders
              current={current}
              type="tokens"
              onOrderCancelled={handleOrdersUpdated}
              onClickOrder={handleClickOrder} />
          ) : null}

          {mobileTab == 'buy_sell' ? (
            <TradeForm
              ref={tradeForm}
              type="tokens"
              current={current} />
          ) : null}

          <MobileTabsBar
            active={mobileTab}
            actvieTrade={mobileTabTrade}
            onTabChange={handleMobileTabChange}
          />
        </>
      )}

      {exchangeLoading ? (
        <App.LoaderBlock size={100} color="#7204FF" fixed height="100%" />
      ) : null}
    </App.Flex>
  )
}

export default Tokens