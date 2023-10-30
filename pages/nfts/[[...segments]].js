import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'

import $app from '@/store/app'
import $collection from '@/store/collection'
import $orders from '@/store/orders'
import { trackEvent } from '@/libs/analytics.lib'
import { usePropsHelper } from '@/myhooks/props-helper'
import useWalletConnect from '@/myhooks/wallet-connect'

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

const Nfts = () => {
  const router = useRouter()
  const [_, collectionId] = router.query?.segments || []

  const { isMobile } = usePropsHelper()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const socketConnected = useSelector(({$app}) => $app.socketConnected)
  const blockchain = useSelector($app.get.blockchain)
  const exchangeLoading = useSelector(({$exchange}) => $exchange.loading)

  const collections = useSelector(({$collection}) => $collection.all)
  const searched = useSelector(({$collection}) => $collection.searched)
  const current = useSelector(({$collection}) => $collection.current)
  const collectionLoading = useSelector(({$collection}) => $collection.loading)
  const sort = useSelector(({$collection}) => $collection.sort)
  const search = useSelector(({$collection}) => $collection.search)
  const searching = useSelector(({$collection}) => $collection.searching)
  const searchEmpty = useSelector(({$collection}) => $collection.searchEmpty)
  const pages = useSelector($collection.get.pages)

  const [mobileTab, setMobileTab] = useState('markets')
  const [mobileTabTrade, setMobileTabTrade] = useState(false)

  const tradeForm = useRef(null)

  const handleOrdersUpdated = useCallback(() => {
    if (wallet) {
      $orders.api.get.nfts({
        blockchain: blockchain.code,
        maker: wallet,
        includeCriteriaMetadata: true,
      }).then(res => {
        if (res) {
          dispatch($orders.set.nfts(res))
        }
      })
    }

    $orders.api.get.nfts.orderBook({
      collection: collectionId,
      blockchain: blockchain.code,
    }).then(res => {
      if (res) {
        dispatch($orders.set.orderBook({type: 'nfts', data: res}))
      }
    })
  }, [wallet, collectionId, blockchain.code])

  const handleMobileTabChange = useCallback((tab) => {
    setMobileTabTrade(false)
    setMobileTab(tab)
  }, [])

  const handleClickOrder = useCallback(order => {
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
    dispatch($collection.set.sort(value))
  }, [])

  const handleSearch = useCallback((value) => {
    dispatch($collection.set.search(value))
  }, [])

  const handlePage = useCallback((value) => {
    dispatch($collection.set.pages({current: value ?? 1}))
  }, [])

  return (
    <App.Flex gap={GRID_GAP} className={styles.container}>
      {!isMobile ? (
        <>
          <Sidebar
            items={collections}
            searched={searched}
            current={current}
            sort={sort}
            search={search}
            searching={searching}
            searchEmpty={searchEmpty}
            pages={pages}
            loading={collectionLoading}
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
                <Chart type="nfts" />

                <App.Flex gap={GRID_GAP}>
                  <OrderBook
                    type="nfts"
                    onClickOrder={handleClickOrder} />
                  <Sales
                    type="nfts"
                    onClickSale={handleClickOrder} />
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={GRID_GAP}>
                <App.Flex>
                  <TradeForm
                    ref={tradeForm}
                    type="nfts"
                    current={current} />
                </App.Flex>

                <Orders
                  current={current}
                  type="nfts"
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
              items={collections}
              searched={searched}
              current={current}
              sort={sort}
              search={search}
              searching={searching}
              searchEmpty={searchEmpty}
              pages={pages}
              loading={collectionLoading}
              onSort={handleSort}
              onSearch={handleSearch}
              onPage={handlePage}
            />
          ) : null}

          {mobileTab == 'charts' ? (
            <Chart type="nfts" />
          ) : null}

          {mobileTab == 'trades' ? (
            <App.Flex column gap={GRID_GAP} width="100%">
              <SidebarMobile
                items={collections}
                searched={searched}
                current={current}
                sort={sort}
                search={search}
                searching={searching}
                searchEmpty={searchEmpty}
                pages={pages}
                loading={collectionLoading}
                onSort={handleSort}
                onSearch={handleSearch}
                onPage={handlePage}
              />

              <App.Flex column flex={1} sx={{ position: 'relative' }}>
                <App.Flex column gap={GRID_GAP} className={styles.tradesContent}>
                  <OrderBook
                    type="nfts"
                    onClickOrder={handleClickOrder} />
                  <Sales
                    type="nfts"
                    onClickSale={handleClickOrder} />
                </App.Flex>
              </App.Flex>
            </App.Flex>
          ) : null}

          {mobileTab == 'orders' ? (
            <Orders
              current={current}
              type="nfts"
              onOrderCancelled={handleOrdersUpdated}
              onClickOrder={handleClickOrder} />
          ) : null}

          {mobileTab == 'buy_sell' ? (
            <TradeForm
              ref={tradeForm}
              type="nfts"
              current={current} />
          ) : null}

          <MobileTabsBar
            isConnected={Boolean(wallet)}
            active={mobileTab}
            actvieTrade={mobileTabTrade}
            onTabChange={handleMobileTabChange}
          />
        </>
      )}

      {/* {exchangeLoading ? (
        <App.LoaderBlock size={100} color="#7204FF" fixed height="100%" />
      ) : null} */}
    </App.Flex>
  )
}

export default Nfts
