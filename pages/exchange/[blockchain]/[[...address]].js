import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import useOrders from '@/myhooks/useOrders'

import $app from '@/store/app'
import $token from '@/store/token'

import App from '@/components/App'
import Sidebar from '@/components/Exchange/Sidebar'
import Mobile from '@/components/Exchange/Mobile'
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

const Exchange = () => {
  const router = useRouter()
  const [queryTokenId] = router.query.address || []
  const queryBlockchainCode = router.query.blockchain

  const { isMobile } = usePropsHelper()
  const { wallet } = useWalletConnect()
  const { updateOrders } = useOrders({tokenAddress: queryTokenId, type: 'tokens'})
  
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)

  const {
    tokens,
    searched,
    current,
    tokenLoading,
    sort,
    search,
    searching,
    searchEmpty
  } = useSelector($token.get.data)

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

  const handleOrdersUpdated = useCallback(() => {
    updateOrders()
  }, [wallet, queryTokenId, queryBlockchainCode])

  const handleClickOrder = useCallback(async order => {
    if (tradeForm.current) {
      tradeForm.current.setForm({formType: 'market', amount: order.quantity, price: order.price, side: order.side})
    } else {
      setMobileTab('buy_sell')
      setTimeout(() => {
        tradeForm.current.setForm({formType: 'market', amount: order.quantity, price: order.price, side: order.side})
      }, 300)
    }
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

  // const pollingOrders = () => {
  //   updateOrders()
  // }

  // useInterval(pollingOrders, 15000)

  /* {
    (tab => {
      switch (tab) {
        case 'markets':
          return (
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
              onPage={handlePage} />
          )
        case 'charts':
          return (
            <Chart type="tokens" />
          )
        case 'trades':
          return (
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
          )
        case 'orders':
          return (
            <Orders
              current={current}
              type="tokens"
              onOrderCancelled={handleOrdersUpdated}
              onClickOrder={handleClickOrder} />
          )
        case 'buy_sell':
          return (
            <TradeForm
              ref={tradeForm}
              type="tokens"
              current={current} />
          )
      }
    })(mobileTab)
  } */

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
            <CollectionInfo
              current={current}
              location={router.asPath} />

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
        !queryTokenId || queryTokenId == '0x' ? (
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
        ) : (
          <Mobile
            item={current}
            onOrdersUpdate={handleOrdersUpdated}
          />
        )
      )}
    </App.Flex>
  )
}

export default Exchange