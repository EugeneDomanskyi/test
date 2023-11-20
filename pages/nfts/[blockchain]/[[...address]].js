import { useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import cn from 'classnames'

import $app from '@/store/app'
import $orders from '@/store/orders'

import { usePropsHelper } from '@/myhooks/props-helper'
import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import Sidebar from '@/components/Exchange/Sidebar'
import Mobile from '@/components/Exchange/Mobile'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import TradeForm from '@/components/Exchange/TradeForm'
import Info from '@/components/Exchange/Info'
import Orders from '@/components/Exchange/Orders'

import styles from './styles.module.scss'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const GRID_GAP = 6

const Nfts = () => {
  const router = useRouter()
  const [queryCollectionId] = router.query.address || []

  const { isMobile } = usePropsHelper()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)

  const myOrdersDialogOpen = useSelector(({ $orders }) => $orders.myOrdersDialogOpen)

  const tradeForm = useRef(null)
  const mobileRef = useRef(null)

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
      collection: queryCollectionId,
      blockchain: blockchain.code,
    }).then(res => {
      if (res) {
        dispatch($orders.set.orderBook({type: 'nfts', data: res}))
      }
    })
  }, [wallet, queryCollectionId, blockchain.code])

  const handleClickOrder = useCallback(order => {
    if (tradeForm.current) {
      tradeForm.current.setForm({formType: 'market', amount: order.quantity, price: order.price, side: order.side})
    } else {
      setTimeout(() => {
        tradeForm.current.setForm({formType: 'market', amount: order.quantity, price: order.price, side: order.side})
      }, 300)
    }
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
            type="nfts"
          />

          <App.Flex column gap={GRID_GAP} className={styles.partRight}>
            <App.Flex row gap={GRID_GAP} className={styles.partRightTop}>
              <App.Flex column className={cn(styles.card, styles.partRightTopChart)}>
                <Info type="nfts" />
                <Chart type="nfts" />
              </App.Flex>

              <TradeForm
                ref={tradeForm}
                type="nfts"
              />
            </App.Flex>

            <App.Flex gap={GRID_GAP} className={styles.partRightBottom}>
              <App.Flex gap={GRID_GAP} className={styles.partRightBottomSales}>
                <OrderBook
                  type="nfts"
                  onClickOrder={handleClickOrder}
                />

                <Sales
                  type="nfts"
                  onClickSale={handleClickOrder}
                />
              </App.Flex>

              <Orders
                type="nfts"
                onOrderCancelled={handleOrdersUpdated}
                onClickOrder={handleClickOrder}
              />
            </App.Flex>
          </App.Flex>
        </>
      ) : (
        <>
          {!queryCollectionId || queryCollectionId == '0x' ? (
            <Sidebar
              version="mobile"
              type="nfts"
            />
          ) : (
            <Mobile
              ref={mobileRef}
              type="nfts"
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
                <Orders global version="mobile" type="nfts" onOrderCancelled={handleOrdersUpdated} onClickOrder={handleClickOrderMobile} />
              </App.Flex>
            </App.Flex>
          </App.Dialog>
        </>
      )}
    </App.Flex>
  )
}

export default Nfts
