import { useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import cn from 'classnames'
import Socket from '@/libs/ws.lib'

import { trackEvent, getPageName } from '@/libs/analytics.lib'

import $alert from '@/store/alert'
import $orders from '@/store/orders'
import $app from '@/store/app'

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

const Exchange = () => {
  const router = useRouter()
  const [queryTokenId] = router.query.address || []

  const dispatch = useDispatch()
  const myOrdersDialogOpen = useSelector(({ $orders }) => $orders.myOrdersDialogOpen)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const socketConnected = useSelector(({$app}) => $app.socketConnected)
  const currentBlockchain = useSelector($app.get.blockchain)
  const currentToken = useSelector(({$token}) => $token.current)

  const tradeForm = useRef(null)
  const mobileRef = useRef(null)

  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(queryTokenId)

  useEffect(() => {
    trackEvent('Page Visited', {
      'Page Name': getPageName(),
    })
    Socket.init().then(() => {
      dispatch($app.set.socketConnected(true))
    })
    return () => {
      dispatch($app.set.socketConnected(false))
    }
  }, [])

  useEffect(() => {
    if (socketConnected && currentBlockchain.id && isAddress && currentToken?.address) {
      Socket.subscribe(`${currentBlockchain.id}/${currentToken.address}`)
    }
    return () => {
      if (socketConnected) {
        Socket.unsubscribe(`${currentBlockchain.id}/${currentToken.address}`)
      }
    }
  }, [socketConnected, currentBlockchain.id, isAddress, currentToken?.address])

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
    <App.Flex gap={GRID_GAP} className={styles.container}>
      {!isMobile ? (
        <>
          <Sidebar
            type="tokens"
          />

          <App.Flex column gap={GRID_GAP} className={styles.partRight}>
            <App.Flex row gap={GRID_GAP} className={styles.partRightTop}>
              <App.Flex column className={cn(styles.card, styles.partRightTopChart)}>
                <Info type="tokens" />
                <Chart type="tokens" />
              </App.Flex>

              <TradeForm
                ref={tradeForm}
                type="tokens"
              />
            </App.Flex>

            <App.Flex gap={GRID_GAP} className={styles.partRightBottom}>
              <App.Flex gap={GRID_GAP} className={styles.partRightBottomSales}>
                <OrderBook
                  type="tokens"
                  onClickOrder={handleClickOrder}
                />

                <Sales
                  type="tokens"
                  onClickSale={handleClickOrder}
                />
              </App.Flex>

              <Orders
                type="tokens"
                onClickOrder={handleClickOrder}
              />
            </App.Flex>
          </App.Flex>
        </>
      ) : (
        <>
          {!queryTokenId || queryTokenId == '0x' ? (
            <Sidebar
              version="mobile"
              type="tokens"
            />
          ) : (
            <Mobile
              ref={mobileRef}
              type="tokens"
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
                <Orders global version="mobile" type="tokens" onClickOrder={handleClickOrderMobile} />
              </App.Flex>
            </App.Flex>
          </App.Dialog>
        </>
      )}
    </App.Flex>
  )
}

export default Exchange