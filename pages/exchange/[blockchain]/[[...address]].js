import { useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { connect } from '@wagmi/core'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
import dynamic from 'next/dynamic'
import cn from 'classnames'

import { CHAINS } from '@/config'
import Socket from '@/libs/ws.lib'
import { trackEvent, getPageName } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import useApp from '@/myhooks/useApp'

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

  const { wallet, disconnect } = useWalletConnect()
  const { isApp, appData, appPost, appLog } = useApp()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const current = useSelector(({ $token }) => $token.current)
  const myOrdersDialogOpen = useSelector(({ $orders }) => $orders.myOrdersDialogOpen)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)

  const tradeForm = useRef(null)
  const mobileRef = useRef(null)

  useEffect(() => {
    trackEvent('Page Visited', {
      'Page Name': getPageName(),
    })

    Socket.init(handleAction, handleCloseConnection).then(() => {
      dispatch($app.set.socketConnected(true))
    })

    return () => {
      dispatch($app.set.socketConnected(false))
    }
  }, [])

  useEffect(() => {
    if (isApp) {
      connectTegroWallet()
    }
  }, [isApp])

  useEffect(() => {
    if (appData?.walletAddress && appData?.walletAddress != wallet) {
      connectTegroWallet()
    }
  }, [appData?.walletAddress])

  useEffect(() => {
    if (socketConnected && blockchain?.id && current?.id) {
      Socket.subscribe(`${blockchain.id}/${current.id}`)

      return () => {
        Socket.unsubscribe(`${blockchain.id}/${current.id}`)
      }
    }
  }, [socketConnected, blockchain?.id, current?.id])

  const connectTegroWallet = async () => {
    if (wallet) {
      disconnect()
    }

    const customConnector = new WalletConnectConnector({
      chains: CHAINS,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        showQrModal: false,
      },
    })

    customConnector.on('message', ({type, data}) => {
      if (type == 'display_uri') {
        appPost({ wcUri: data})
      }

      appLog(type)
    })

    customConnector.on('chainChanged', (event) => {
      appLog({chainChanged: event})
    })

    customConnector.on('accountsChanged', (event) => {
      appLog({accountsChanged: event})
    })

    customConnector.on('connect', (event) => {
      appLog({connect: event})
    })

    customConnector.on('session_event', (event) => {
      appLog({session_event: event})
    })

    customConnector.on('disconnect', (event) => {
      appLog({disconnect: event})
    })
    
    const result = await connect({
      connector: customConnector,
      chainId: blockchain.id,
    })

    appLog('Wallet', result.account)
  }

  const handleAction = useCallback(({action, data}) => {
    if ( !isApp) {
      switch (action) {
        case 'order_placed':
          dispatch($alert.set.success({ title: 'Order placed successfully', text: 'Your Order has been placed successfully!' }))
          break
        case 'order_submitted':
          dispatch($alert.set.success({ title: 'Order submitted successfully' }))
          break
        case 'chain_event_OrderFilled':
          dispatch($alert.set.success({ title: 'Order filled on chain' }))
          break
        case 'chain_event_OrderCancelled':
          dispatch($alert.set.success({ title: 'Order cancelled on chain' }))
          break
      }
    }
  }, [])

  const handleCloseConnection = (e) => {
    Socket.init(handleAction, handleCloseConnection)
  }

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
          {!queryTokenId || queryTokenId == '0x' ? (
            <Sidebar version="mobile" />
          ) : (
            <Mobile ref={mobileRef} />
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