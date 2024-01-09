import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { useState, memo, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useDispatch } from 'react-redux'
import Socket from '@/libs/ws.lib'

import $app from '@/store/app'
import $orders from '@/store/orders'
import $alert from '@/store/alert'

import { trackEvent, getPageName } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import OrderDetails from '@/components/Exchange/OrderDetails'

const Orders = ({global, type, version, onClickOrder}) => {
  const router = useRouter()

  const { wallet, connect, getConnectorName, sign } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const current = useSelector(({ $token }) => $token.current)
  const orders = useSelector($orders.get.list)

  const [loading, setLoading] = useState(true)
  const [showCollectionOrders, setShowCollectionOrders] = useState(false)
  const [hideCancelledOrders, setHideCancelledOrders] = useState(true)
  const [ordersType, setOrderTypes] = useState('open')
  const [orderForCancel, setOrderForCancel] = useState()
  const [detailsOrder, setDetailsOrder] = useState()
  const [isDialogOpen, setIsDialogOpen] = useState({})

  useEffect(() => {
    if (wallet) {
      fetchOrders()
    } else {
      dispatch($orders.set.list([]))
    }

    Socket.on('order_placed', 'my_orders', (data) => {
      dispatch($orders.set.add(data))
    })
    
    Socket.on('order_submitted', 'my_orders', (data) => {
      dispatch($orders.set.update(data))
    })
  }, [wallet, current?.id])

  useEffect(() => {
    if (wallet && socketConnected) {
      Socket.subscribe(wallet)

      return () => {
        Socket.unsubscribe(wallet)
      }
    }
  }, [wallet, socketConnected])

  const fetchOrders = async () => {
    const result = await $orders.api.list({
      chain_id: blockchain.id,
      user_address: wallet,
    })

    if (result) {
      dispatch($orders.set.list(result ?? []))
    }

    setLoading(false)
  }

  const handlePressCancelConfirm = (order) => (e) => {
    e.stopPropagation()
    setOrderForCancel(order)
    handleDialogOpen('cancel')()
  }

  const handleCancelConfirm = (e) => {
    handlePressCancel(orderForCancel)(e)
    handleDialogClose('cancel')()
  }

  const handleCancelAllClick = () => {
    setOrderForCancel(null)
    handleDialogOpen('cancelAll')()
  }

  const handleCancelAllConfirm = async () => {
    handleDialogClose('cancelAll')()
    handleDialogOpen('approve')()

    const signature = await sign(wallet)
    if (signature) {
      const result = await $orders.api.cancelAll({ wallet, chain_id: blockchain.id, signature })
      if (result) {
        dispatch($orders.set.list(result.data))
        dispatch($alert.set.success({ title: 'All Orders Cancelled', text: 'All your live orders has been cancelled successfully!' }))
      }
    } else {
      dispatch($alert.set.error({ title: 'Order Not Cancelled' }))
    }

    handleDialogClose('approve')()
  }

  const handleDialogOpen = (key) => () => {
    setIsDialogOpen(state => ({
      ...state,
      [key]: true,
    }))
  }

  const handleDialogClose = (key) => () => {
    setIsDialogOpen(state => ({
      ...state,
      [key]: false,
    }))
  }

  const handlePressCancel = (order) => async (e) => {
    e.stopPropagation()
    handleDialogOpen('approve')()
    if (order.status === 'completed' || order.status === 'cancelled') {
      return
    }
    
    const eventPost = {
      'Base Currency': order.baseCurrency,
      'Quote Currency': order.quoteCurrency,
      'Side': order.side.toUpperCase(),
      'Quantity': order.quantity,
      'Price': order.itemPrice,
      'Total': order.price,
      'Network': blockchain.code.toUpperCase(),
    }
    trackEvent('Cancel Order Submit', eventPost)

    const signature = await sign(wallet)
    if (signature) {
      const result = await $orders.api.cancel({ id: order.orderId, chain_id: blockchain.id, signature })
      if (result) {
        trackEvent('Cancel Order Success', eventPost)
        dispatch($orders.set.update(result.data))
        dispatch($alert.set.success({ title: 'Order Cancelled', text: 'Your Order is successfully cancelled' }))
      } else {
        dispatch($alert.set.error({ title: 'Order Not Cancelled', text: result }))
      }
    } else {
      dispatch($alert.set.error({ title: 'Order Not Cancelled' }))
    }
    handleDialogClose('approve')()
  }

  const handlePressCopy = order => (e) => {
    e.stopPropagation()
    const [_, _seg1, seg2] = router.asPath.split('/')
    router.push(`/${[_seg1, seg2, order.contractAddress].join('/')}`, undefined, {scroll: false})
    onClickOrder({
      quantity: order.quantity,
      price: order.itemPrice,
      side: order.side,
    })
  }

  const handleClickDetails = order => e => {
    e.stopPropagation()
    const { cancel, ...rest } = order
    setDetailsOrder({...rest, itemPrice: order.itemPrice})
    handleDialogOpen('details')()
  }

  const handleChangeSwitch = (value) => {
    setShowCollectionOrders(value)
  }

  const handleChangeOrdersType = type => () => {
    trackEvent(`View ${type == 'open' ? 'Open' : 'Completed'} Order`, {
      'Base Currency': current?.symbol ?? 'Global',
      'Quote Currency': current?.quoteSymbol,
      'Network': blockchain.code.toUpperCase(),
    })

    setOrderTypes(type)
  }

  const handleHideCancelledOrders = value => {
    setHideCancelledOrders(value)
  }

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      trackEvent('Wallet Connect Clicked', {
        'Source': getPageName(),
      })

      const result = await connect()
      if (result) {
        const walletName = await getConnectorName()
        trackEvent('Wallet Connect Success', {
          'Source': getPageName(),
          'Type': walletName,
        })
      }
    }
  }

  const filterByAddress = (order) => {
    return !showCollectionOrders || (!global && order.contractAddress === current?.address)
  }

  const filteredByStatus = order => {
    return !hideCancelledOrders || (order.status !== 'cancelled')
  }

  return (
    <App.Flex column className={cn(styles.container, {[styles[version]]: version})}>
      <App.Flex className={styles.header}>
        <App.Flex flex={1} center className={cn(styles.tab, {[styles.active]: ordersType === 'open'})} onClick={handleChangeOrdersType('open')}>
          <App.Text size={[12, 14]} uppercase={[true, null]} color={ordersType === 'open' ? '#fff' : '#5E5C6B'} height={1}>Open Orders</App.Text>
        </App.Flex>
        <App.Flex flex={1} center className={cn(styles.tab, {[styles.active]: ordersType === 'closed'})} onClick={handleChangeOrdersType('closed')}>
          <App.Text size={[12, 14]} uppercase={[true, null]} color={ordersType === 'closed' ? '#fff' : '#5E5C6B'} height={1}>Completed Orders</App.Text>
        </App.Flex>

        <div className={styles.badge} style={{transform: `translateX(${ordersType === 'open' ? 0 : 100}%)`}} />
      </App.Flex>

      {!wallet && version == 'mobile' ? (
        <App.Flex column center full gap={16}>
          <App.Flex center width={120} height={120}>
            <Image src="/images/tegro-connect-wallet.png" width={120} height={120} alt="" />
          </App.Flex>

          <App.Flex width={280}>
            <App.Text center color="#706B84">Connect wallet now and start trading to unlock a world of awesomeness!</App.Text>
          </App.Flex>

          <App.Button primary large outlined onClick={handleConnectWallet}>Connect Wallet</App.Button>
        </App.Flex>
      ) : (
        <>
          <App.Flex align="center" justify="space-between" sx={{padding: 8}}>
            { ! global ? (
              <App.Flex row align="center" gap={8} flex={1}>
                <App.Switch
                  width={40}
                  height={20}
                  checked={showCollectionOrders}
                  onChange={handleChangeSwitch}
                />

                {version == 'mobile' ? (
                  <App.Text size={12} height={1}>{current?.symbol}/{current?.quoteSymbol}</App.Text>
                ) : (
                  <App.Text color="#B9B8C5" size={10} weight={600} height={1}>{current?.symbol} - {current?.quoteSymbol} Orders</App.Text>
                )}
              </App.Flex>
            ) : (
              <App.Flex />
            )}

            {ordersType === 'closed' ? (
              <App.Flex align="center" gap={8} flex={1}>
                <App.Switch
                  width={40}
                  height={20}
                  checked={hideCancelledOrders}
                  onChange={handleHideCancelledOrders}
                />

                <App.Text color="#B9B8C5" size={[10, 12]} weight={600} height={1}>{version != 'mobile' ? 'Hide All Cancelled Orders' : 'Hide Cancelled Orders'}</App.Text>
              </App.Flex>
            ) : (
              version == 'mobile' ? (
                <App.Text weight={600} color="#FFAF38" onClick={handleCancelAllClick}>CANCEL ALL</App.Text>
              ) : (
                <App.Button variant="muted" small onClick={handleCancelAllClick}>
                  Cancel All
                </App.Button>
              )
            )}
          </App.Flex>

          {version != 'mobile' ? (
            <>
              <App.Flex align="center" sx={{borderBottom: '1px solid #19162D'}}>
                <App.Flex column sx={{width: 90, padding: '4px 8px 10px'}} align="center">
                  <App.Text size={10} weight={600} color="#B9B8C5" center height={1}>Asset</App.Text>
                </App.Flex>
                <App.Flex column sx={{width: 60, padding: '4px 8px 10px'}} align="center">
                  <App.Text size={10} weight={600} color="#B9B8C5" center height={1}>Qty</App.Text>
                </App.Flex>
                <App.Flex column flex={1} sx={{padding: '4px 8px 10px'}} align="center">
                  <App.Text size={10} weight={600} color="#B9B8C5" center height={1}>Price ({current?.quoteSymbol})</App.Text>
                </App.Flex>
                <App.Flex column flex={1} sx={{padding: '4px 8px 10px'}} align="center">
                  <App.Text size={10} weight={600} color="#B9B8C5" center height={1}>Total ({current?.quoteSymbol})</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex column flex={1} sx={{overflow: 'auto'}}>
              {
                orders[ordersType].filter(order => filterByAddress(order) && filteredByStatus(order)).map((order) => {
                  return (
                    <App.Flex column key={order.id}>
                      <App.Flex column className={styles.orderContainer}>
                        <App.Flex align="center" className={cn(styles.order, {[styles.disabled]: order.status === 'completed' || order.status === 'cancelled'})}>
                          <div className={styles.side} style={{backgroundColor: order.side === 'buy' ? '#53F19C' : '#FF1D61'}} />
                          <App.Flex column align="center" justify="center" sx={{width: 90, padding: 8}}>
                            {order.image && type === 'nfts' ? (
                              <Image alt="" src={order.image} width={35} height={35} />
                            ) : (
                              order.quoteCurrency ? (
                                <App.Flex column gap={4}>
                                  <App.Text size={12} weight={600} center height={1}>{ order.baseCurrency }</App.Text>
                                  <div style={{width: '100%', minWidth: 20, height: 1, background: '#B9B8C5'}} />
                                  <App.Text color="#B9B8C5" size={8} weight={600} center height={1}>{ order.quoteCurrency }</App.Text>
                                </App.Flex>
                              ) : null
                            )}
                          </App.Flex>

                          <App.Flex column sx={{width: 60, padding: 8}} align="center" justify="center">
                            <App.Flex column gap={4}>
                              <App.Text size={12} weight={600} center height={1}>{ order.quantityFilled }</App.Text>
                              <div style={{width: '100%', minWidth: 20, height: 1, background: '#B9B8C5'}} />
                              <App.Text color="#B9B8C5" size={8} weight={600} center height={1}>{ order.quantity }</App.Text>
                            </App.Flex>
                          </App.Flex>

                          <App.Flex flex={1} column sx={{padding: 8}} align="center" justify="center">
                            <App.Text size={12} weight={600} center color="#B9B8C5" height={1}>{ order.itemPrice }</App.Text>
                          </App.Flex>

                          <App.Flex flex={1} column align="center" justify="center" sx={{padding: 8, position: 'relative', height: '100%', overflow: 'hidden'}}>
                            <App.Text size={12} weight={600}>{ order.price }</App.Text>
                          </App.Flex>
                        </App.Flex>

                        <App.Flex row align="center" justify="flex-end" gap={16} className={cn(styles.hoverContent)}>
                          <App.Text color="rgba(185, 184, 197, 1)" size={10} weight={500} sx={{marginRight: 12}} height={1}>{ order.time }</App.Text>
                          {order.status !== 'open' ? (
                            <App.Text color="#B9B8C5" size={10} weight={600} uppercase height={1}>
                              {(order.status === 'completed' || order.status === 'cancelled') ? order.status : 'Cancel order'}
                            </App.Text>
                          ) : null}
                          
                          <App.Flex className={styles.actionButton} align="center" justify="center" onClick={handlePressCopy(order)}>
                            <App.Icon icon="copy" width={12} height={12} color="#B9B8C5" />
                          </App.Flex>

                          {order.status !== 'open' ? (
                            <App.Flex className={styles.actionButton} align="center" justify="center" onClick={handleClickDetails(order)}>
                              <App.Icon icon="order-details" />
                            </App.Flex>
                          ) : null}

                          {order.status === 'open' ? (
                            <App.Flex className={styles.actionButton} align="center" justify="center" onClick={handlePressCancelConfirm(order)}>
                              <App.Icon icon="cross-circle" />
                            </App.Flex>
                          ) : null}
                        </App.Flex>

                        <App.Flex row className={cn(styles.filled, styles[Math.round(order.quantityFilled * 100 / order.quantity) < 100 ? 'notComplete' : 'complete'])} width={`${Math.round(order.quantityFilled * 100 / order.quantity)}%`} />
                      </App.Flex>
                    </App.Flex>
                  )
                })
              }
              </App.Flex>
            </>
          ) : (
            loading ? (
              <App.LoaderBlock flex={1} />
            ) : (
              <App.Flex column flex={1} fullWidth sx={{position: 'relative' }}>
                <App.Flex column sx={{position: 'absolute', inset: 0, overflow: 'auto'}}>
                  {orders[ordersType].filter(order => filterByAddress(order) && filteredByStatus(order)).length ? 
                    orders[ordersType].filter(order => filterByAddress(order) && filteredByStatus(order)).map((order) => {
                      const percent = Math.round(order.quantityFilled * 100 / order.quantity)
                      const perimeter =  2 * Math.PI * 19.5
                      const length = (1 + Math.max(0, Math.min(percent / 100, 1))) * perimeter

                      return (
                        <App.Flex key={order.id} row gap={32} fullWidth className={styles.orderContainer}>
                          <App.Flex column gap={8} align="center">
                            <App.Flex row center height={25}>
                              <App.Text size={12} weight={600} color={order.side == 'buy' ? '#53F19C' : '#C00C4D'}>{order.side.toUpperCase()}</App.Text>
                            </App.Flex>

                            <App.Flex row center flex={1}>
                              <div className={styles.progress}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" className={styles.progressStroke}>
                                  <circle cx="19.5" cy="19.5" r="18.5" stroke="#2D2A48" strokeWidth="2" />
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" className={styles.progressFill}>
                                  <circle cx="19.5" cy="19.5" r="18.5" stroke={order.side == 'buy' ? '#53F19C' : '#C00C4D'} strokeWidth="2" strokeDasharray={length} strokeDashoffset={perimeter} />
                                </svg>

                                <App.Flex row center className={styles.progressText}>
                                  <App.Text size={10} weight={600} color={order.side == 'buy' ? '#53F19C' : '#C00C4D'}>{percent}%</App.Text>
                                </App.Flex>
                              </div>
                            </App.Flex>
                          </App.Flex>

                          <App.Flex row justify="space-between" flex={1}>
                            <App.Flex column gap={8}>
                              <App.Flex row center gap={10} height={25} className={styles.currency} onClick={handleClickDetails(order)}>
                                <App.Text size={12} weight={700} height={1}>{order.baseCurrency} <App.Text inline size={10} weight={700} color="#5E5C6B" height={1}>/ {order.quoteCurrency}</App.Text></App.Text>
                                <App.Icon icon="chevron-right2" />
                              </App.Flex>

                              <App.Flex row align="center">
                                <App.Flex width={60}>
                                  <App.Text size={12} uppercase height={1} color="#5E5C6B">Amount:</App.Text>
                                </App.Flex>
                                <App.Text size={14} weight={600} height={1}>{ order.quantityFilled } <App.Text inline size={12} weight={600} height={1} color="#5E5C6B">/ { order.quantity }</App.Text></App.Text>
                              </App.Flex>

                              <App.Flex row align="center">
                                <App.Flex width={60}>
                                  <App.Text size={12} uppercase height={1} color="#5E5C6B">Price:</App.Text>
                                </App.Flex>
                                <App.Text size={14} weight={600} height={1}>{ order.itemPrice }</App.Text>
                              </App.Flex>

                              <App.Flex row align="center">
                                <App.Flex width={60}>
                                  <App.Text size={12} uppercase height={1} color="#5E5C6B">Total:</App.Text>
                                </App.Flex>
                                <App.Text size={14} weight={600} height={1} color="#5E5C6B">{ order.price }</App.Text>
                              </App.Flex>
                            </App.Flex>

                            <App.Flex column align="flex-end" justify="space-between">
                              <App.Flex row align="center" height={25}>
                                <App.Text right size={12} weight={600} color="#5E5C6B">{order.time}</App.Text>
                              </App.Flex>

                              {order.status === 'open' ? (
                                <App.Flex row center onClick={handlePressCancelConfirm(order)}>
                                  <App.Icon icon="trash" />
                                </App.Flex>
                              ) : (
                                <App.Text color="#B9B8C5" size={12} uppercase>
                                  { order.status }
                                </App.Text>
                              )}
                            </App.Flex>
                          </App.Flex>
                        </App.Flex>
                      )
                    }) : (
                      <App.Text center size={16}>There are no orders yet</App.Text>
                    )
                  }
                </App.Flex>
              </App.Flex>
            )
          )}
        </>
      )}

      <App.Dialog open={isDialogOpen?.cancel} width={420} onClose={handleDialogClose('cancel')} title="Cancel Order?">
        <App.Flex column>
          <App.Flex row sx={{padding: 24}}>
            <App.Text size={16} color="#B9B8C5">Are you sure you want to cancel the order you have placed?</App.Text>
          </App.Flex>

          <App.Flex row gap={16} sx={{padding: 16}}>
            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding outlined onClick={handleCancelConfirm}>Cancel</App.Button>
            </App.Flex>

            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding onClick={handleDialogClose('cancel')}>Don&apos;t Cancel</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Dialog>

      <App.Dialog open={isDialogOpen?.cancelAll} width={420} onClose={handleDialogClose('cancelAll')} title="Cancel All Orders?">
        <App.Flex column>
          <App.Flex row sx={{padding: 24}}>
            <App.Text size={16} color="#B9B8C5">Are you sure you want to cancel all orders you have placed?</App.Text>
          </App.Flex>

          <App.Flex row gap={16} sx={{padding: 16}}>
            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding outlined onClick={handleCancelAllConfirm}>Cancel All Orders</App.Button>
            </App.Flex>

            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding onClick={handleDialogClose('cancelAll')}>Don&apos;t Cancel</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Dialog>

      <App.Dialog open={isDialogOpen?.approve} width={420} onClose={handleDialogClose('approve')} title={orderForCancel ? 'Cancel Order?' : 'Cancel All Orders?'}>
        <App.Flex column center gap={6} sx={{ padding: '8px 24px 16px' }}>
          <App.Flex row center width={150} height={150}>
            <Image src="/images/order-cancel-loader.gif" width={150} height={150} alt="" />
          </App.Flex>

          <App.Text center size={16} weight={700} height={1}>Waiting for Approval</App.Text>
          <App.Text center size={10} height={1} color="#5E5C6B">Please Proceed in Your Wallet</App.Text>
        </App.Flex>
      </App.Dialog>

      <App.Dialog open={isDialogOpen?.details} width={420} onClose={handleDialogClose('details')} title="Order Details">
        <OrderDetails
          order={detailsOrder}
        />
      </App.Dialog>
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.onClickOrder === next.onClickOrder
    && prev.type === next.type
    && prev.global === next.global
    && prev.version === next.version
}

export default memo(Orders, isEqual)
