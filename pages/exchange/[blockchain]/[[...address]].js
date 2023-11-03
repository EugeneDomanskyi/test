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
import $orders from '@/store/orders'

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
  const myOrdersDialogOpen = useSelector(({ $orders }) => $orders.myOrdersDialogOpen)

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
  const mobileRef = useRef(null)

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

  const handlePage = useCallback((value, append = false) => {
    dispatch($token.set.pages({current: value ?? 1, append}))
  }, [])

  const handleCloseOrdersDialog = () => {
    dispatch($orders.set.myOrdersDialogOpen(false))
  }

  const handleClickOrderMobile = (order) => {
    setTimeout(() => {
      mobileRef.current.handleClickOrder(order)
      handleCloseOrdersDialog()
    }, 300)
  }

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
            type="tokens"
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
        <>
          {!queryTokenId || queryTokenId == '0x' ? (
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
              version="mobile"
              type="tokens"
              onSort={handleSort}
              onSearch={handleSearch}
              onPage={handlePage}
            />
          ) : (
            <Mobile
              ref={mobileRef}
              item={current}
              type="tokens"
              onOrdersUpdate={handleOrdersUpdated}
            />
          )}

          <App.Dialog open={myOrdersDialogOpen} onClose={handleCloseOrdersDialog} hideHeader hideClose full>
            <App.Flex column full>
              <App.Flex row center fullWidth height={64} className={styles.ordersHeader}>
                <App.Text center size={16} weight={700}>Orders</App.Text>

                <App.Flex row center className={styles.ordersBack} onClick={handleCloseOrdersDialog}>
                  <App.Icon icon="chevron-left" height={21} width={21} />
                </App.Flex>
              </App.Flex>

              <App.Flex fullWidth flex={1} sx={{ position: 'relative' }}>
                <Orders global version="mobile" type="tokens" onOrderCancelled={handleOrdersUpdated} onClickOrder={handleClickOrderMobile} />
              </App.Flex>
            </App.Flex>
          </App.Dialog>
        </>
      )}
    </App.Flex>
  )
}

export default Exchange