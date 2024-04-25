import { useRef, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import cn from 'classnames'

import Socket from '@/libs/ws.lib'
import Amplitude from '@/libs/amplitude.lib'
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
import FaucetConnect from '@/components/Faucet/FaucetConnect'
import FaucetOnce from '@/components/Faucet/FaucetOnce'
import DevModal from '@/components/DevModal'

import styles from './styles.module.scss'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const GRID_GAP = 8

const Exchange = () => {
  const router = useRouter()
  const [queryTokenId] = router.query.address || []

  const { wallet, connection } = useWalletConnect()
  const { isApp, appLog, appConnect } = useApp()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const devMode = useSelector(({ $app }) => $app.devMode)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const current = useSelector(({ $token }) => $token.current)
  const myOrdersDialogOpen = useSelector(({ $orders }) => $orders.myOrdersDialogOpen)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)

  const [devModalVisible, setDevModalVisible] = useState(false)
  const [isFaucetConnectVisible, setIsFaucetConnectVisible] = useState(false)
  const [isFaucetOnceVisible, setIsFaucetOnceVisible] = useState(false)
  const [appConnectionLoading, setAppConnectionLoading] = useState(true)

  const tradeForm = useRef(null)
  const mobileRef = useRef(null)

  useEffect(() => {
    Amplitude.event('Page Visited', {
      'Page Name': Amplitude.page(),
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
      if (connection.loading) {
        setAppConnectionLoading(true)
      } else {
        appLog(connection)
        appConnect(() => setAppConnectionLoading(false))
      }
    }
  }, [isApp, connection])

  useEffect(() => {
    if (socketConnected && blockchain?.id && current?.id) {
      Socket.subscribe(`${blockchain.id}/${current.id}`)

      return () => {
        Socket.unsubscribe(`${blockchain.id}/${current.id}`)
      }
    }
  }, [socketConnected, blockchain?.id, current?.id])

  // useEffect(() => {
  //   if (!connection?.loading && !isApp) {
  //     faucetCheck()
  //   }
  // }, [connection])

  // useEffect(() => {
  //   if (!connection?.loading && wallet) {
  //     faucetWalletCheck()
  //   }
  // }, [connection, wallet])

  const faucetCheck = () => {
    if (!connection.connected) {
      const fauceConnect = localStorage.getItem('faucet-connect')
      if (!fauceConnect || !JSON.parse(fauceConnect)) {
        localStorage.setItem('faucet-connect', JSON.stringify(true))
        setIsFaucetConnectVisible(true)
      }
    }
  }

  const faucetWalletCheck = () => {
    let fauceWallets = localStorage.getItem('faucet-wallets')
    if (fauceWallets) {
      fauceWallets = JSON.parse(fauceWallets)
    } else {
      fauceWallets = []
    }

    if (!fauceWallets.includes(wallet.toLowerCase())) {
      fauceWallets.push(wallet.toLowerCase())
      localStorage.setItem('faucet-wallets', JSON.stringify(fauceWallets))
      if (! isApp) {
        setIsFaucetOnceVisible(true)
      }
    }
  }

  const handleAction = useCallback(({action, data}) => {
    if ( !isApp) {
      switch (action) {
        case 'order_placed':
          dispatch($alert.set.success({ title: 'Order placed successfully', text: `Your ${data.side} order for ${data.quantity} ${data.baseCurrency} has been placed successfully.` }))
          break
        case 'order_submitted':
          dispatch($alert.set.success({ title: 'Order submitted successfully' }))
          break
        case 'chain_event_OrderFilled':
          dispatch($alert.set.success({ title: 'Order filled on-chain', text: `Your ${data.side} order for ${data.quantity} ${data.baseCurrency} has been executed ${data.quantity == data.quantityFilled ? 'fully' : 'partially'}.` }))
          break
        case 'chain_event_OrderCancelled':
          dispatch($alert.set.success({ title: 'Order cancelled on-chain' }))
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

  const handleDevModal = () => {
    setDevModalVisible(state => !state)
  }

  const handleFaucetConnectClose = () => {
    setIsFaucetConnectVisible(false)
  }

  const handleFaucetOnceClose = () => {
    setIsFaucetOnceVisible(false)
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

          {devMode ? (
            <>
              <App.Flex className={styles.devModeButton}>
                <App.Button primary onClick={handleDevModal}>Dev</App.Button>
              </App.Flex>

              <App.Dialog open={devModalVisible} onClose={handleDevModal} title="Developer Mode Settings">
                <DevModal />
              </App.Dialog>
            </>
          ) : null}
        </>
      )}

      {isApp ? (
        appConnectionLoading ? (
          <App.Flex column center gap={8} className={styles.appLoader}>
            <App.Loader />
            <App.Text>Connecting...</App.Text>
          </App.Flex>
        ) : (
          ! connection.connected ? (
            // <App.Flex column center gap={8} className={styles.appLoader}>
            //   <App.Icon icon="alert-error" />
            //   <App.Text>Connection failed</App.Text>
            //   <App.Text>Swipe down to reconnect</App.Text>
            // </App.Flex>
            <App.Flex column center gap={8} className={styles.appLoader}>
              <App.Loader />
              <App.Text>Reconnecting...</App.Text>
            </App.Flex>
          ) : null
        )
      ) : null}

      <App.Dialog width={620} open={isFaucetConnectVisible} hideHeader onClose={handleFaucetConnectClose}>
        <FaucetConnect onComplete={handleFaucetConnectClose} />
      </App.Dialog>

      <App.Dialog width={620} open={isFaucetOnceVisible} hideHeader onClose={handleFaucetOnceClose}>
        <FaucetOnce onClose={handleFaucetOnceClose} />
      </App.Dialog>
    </App.Flex>
  )
}

export default Exchange