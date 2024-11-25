import { useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import cn from 'classnames'

import Socket from '@/libs/ws.lib'

import $alert from '@/store/alert'
import $orders from '@/store/orders'
import $app from '@/store/app'
import $portfolio from '@/store/portfolio'

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

const GRID_GAP = 8

const Exchange = ({  }) => {
  const router = useRouter()
  const [queryTokenId] = router.query.address || []

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const current = useSelector(({ $token }) => $token.current)
  const myOrdersDialogOpen = useSelector(({ $orders }) => $orders.myOrdersDialogOpen)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)

  const tradeForm = useRef(null)
  const mobileRef = useRef(null)

  useEffect(() => {
    if (socketConnected && blockchain?.id && current?.id) {
      Socket.subscribe(`${blockchain.id}/${current.id}`)

      return () => {
        Socket.unsubscribe(`${blockchain.id}/${current.id}`)
      }
    }
  }, [socketConnected, blockchain?.id, current?.id])

  const handleClickOrder = useCallback(async order => {
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
    <App.Flex gap={GRID_GAP} className={cn(styles.container, {[styles.appContainer]: isApp})}>
      {!isMobile ? (
        <>
          <Sidebar />

          <App.Flex column gap={GRID_GAP} className={styles.partRight}>
            <App.Flex row gap={GRID_GAP} className={styles.partRightTop}>
              <App.Flex column className={cn(styles.card, styles.partRightTopChart)}>
                <Info />
                <Chart />
              </App.Flex>

              <TradeForm ref={tradeForm} />
            </App.Flex>

            <App.Flex gap={GRID_GAP} className={styles.partRightBottom}>
              <App.Flex gap={GRID_GAP} className={styles.partRightBottomSales}>
                <OrderBook onClickOrder={handleClickOrder} />
                <Sales onClickSale={handleClickOrder} />
              </App.Flex>

              <Orders type="tokens" onClickOrder={handleClickOrder} />
            </App.Flex>
          </App.Flex>
        </>
      ) : (
        <>
          <Mobile ref={mobileRef} />

          <App.Dialog open={myOrdersDialogOpen} onClose={handleCloseOrdersDialog} hideHeader hideClose full>
            <App.Flex column full>
              <App.Flex row center fullWidth height={64} className={styles.ordersHeader}>
                <App.Text center size={16} weight={700}>Orders</App.Text>

                <App.Flex row center className={styles.ordersBack} onClick={handleCloseOrdersDialog}>
                  <App.Icon icon="chevron-left" height={21} width={21} />
                </App.Flex>
              </App.Flex>

              <App.Flex fullWidth flex={1} sx={{ position: 'relative' }}>
                <Orders global version="mobile" onClickOrder={handleClickOrderMobile} />
              </App.Flex>
            </App.Flex>
          </App.Dialog>
        </>
      )}
    </App.Flex>
  )
}

export default Exchange
