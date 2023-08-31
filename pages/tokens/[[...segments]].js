import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import useOrders from '@/myhooks/useOrders'

import $exchange from '@/store/exchange'
import $orders from '@/store/orders'
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
  const [queryBlockchainCode, queryTokenId] = router.query.segments || []

  const { isMobile } = usePropsHelper()
  const { wallet } = useWalletConnect()
  const { updateOrders } = useOrders({tokenAddress: queryTokenId, type: 'tokens'})
  
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const exchangeLoading = useSelector(({$exchange}) => $exchange.loading)
  const activeInterval = useSelector(({$exchange}) => $exchange.interval)

  const tokens = useSelector(({$token}) => $token.all)
  const searched = useSelector(({$token}) => $token.searched)
  const current = useSelector(({$token}) => $token.current)
  const tokenLoading = useSelector(({$token}) => $token.loading)
  const sort = useSelector(({$token}) => $token.sort)
  const search = useSelector(({$token}) => $token.search)
  const searching = useSelector(({$token}) => $token.searching)
  const searchEmpty = useSelector(({$token}) => $token.searchEmpty)
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
    if (queryTokenId && queryBlockchainCode) {
      dispatch($exchange.set.loading(true))
      $exchange.api.get.tokenChartData(queryTokenId, queryBlockchainCode, activeInterval.seconds).then(res => {
        dispatch($exchange.set.chartData({type: 'tokens', data: res?.data ?? []}))
        dispatch($exchange.set.loading(false))
      })
    }
  }, [activeInterval, queryTokenId, queryBlockchainCode])

  useEffect(() => {
    if (queryTokenId && queryBlockchainCode) {
      getExchangeData(queryTokenId, queryBlockchainCode)
    }
  }, [queryTokenId, queryBlockchainCode])

  useEffect(() => {
    if (queryTokenId && queryBlockchainCode) {
      updateOrders()
    }
  }, [queryBlockchainCode, wallet, queryTokenId])

  const getExchangeData = (tokenId, blockchain) => {
    $orders.api.get.tokens.trades({
      address: tokenId,
      blockchain: blockchain,
      sortBy: '',
      statuses: '[3]',
      limit: 50,
    }).then(res => {
      dispatch($orders.set.trades({type: 'tokens', data: res}))
    })
  }

  const handleOrdersUpdated = useCallback(() => {
    if (wallet) {
      updateOrders()
    }
  }, [wallet, queryTokenId, queryBlockchainCode])

  const handleMobileTabChange = (tab) => {
    setMobileTabTrade(false)
    setMobileTab(tab)
  }

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, price: order.price, side: order.side})
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
            searchEmpty={searchEmpty}
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
                <Chart type="tokens" />

                <App.Flex gap={GRID_GAP}>
                  <OrderBook
                    type="tokens"
                    onClickOrder={handleClickOrder} />
                  <Sales
                    type="tokens"
                    onClickSale={handleClickOrder} />
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
              searchEmpty={searchEmpty}
              pages={pages}
              loading={tokenLoading}
              onSort={handleSort}
              onSearch={handleSearch}
              onPage={handlePage}
            />
          ) : null}

          {mobileTab == 'charts' ? (
            <Chart type="tokens" />
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
                searchEmpty={searchEmpty}
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
                  <Sales
                    type="tokens"
                    onClickSale={handleClickOrder} />
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