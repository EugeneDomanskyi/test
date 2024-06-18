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
import $portfolio from '@/store/portfolio'

import WagmiHelper from '@/libs/WagmiHelper'
import Amplitude from '@/libs/amplitude.lib'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import App from '@/components/App'
import OrderDetails from '@/components/Exchange/OrderDetails'

const Orders = ({global, type, version, onClickOrder}) => {
  const router = useRouter()

  const { wallet, connect } = useWagmiHelper()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const current = useSelector(({ $token }) => $token.current)
  const orders = useSelector($orders.get.list)
  const loading = useSelector(({ $orders }) => $orders.loading)

  const [showCollectionOrders, setShowCollectionOrders] = useState(false)
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

    if (version != 'mobile') {
      // Socket.on('order_placed', 'my_orders', (data) => {
      //   dispatch($orders.set.add(data))
      // })

      Socket.on('order_submitted', 'my_orders', (data) => {
        dispatch($orders.set.update(data))
      })
    }
  }, [wallet, current?.id])

  useEffect(() => {
    if (wallet && socketConnected && version != 'mobile') {
      Socket.subscribe(wallet)

      return () => {
        Socket.unsubscribe(wallet)
      }
    }
  }, [wallet, socketConnected, version])

  const fetchOrders = async () => {
    const result = await $orders.api.list({
      chain_id: blockchain.id,
      user_address: wallet,
      page: 1,
      page_size: 50,
    })
    if (result) {
      dispatch($orders.set.list(result ?? []))
    }

    dispatch($orders.set.loading(false))
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

    const typedData = await $orders.api.cancelTypedData({
      order_ids: orders.open.map(item => item.orderId),
      user_address: wallet,
    })

    if (typedData?.error || ! typedData) {
      dispatch($alert.set.error({title: 'Orders not cancelled', text: `Please try again to cancel your ${orders.open.length} open order(s).`}))
      return
    }

    const signature = await WagmiHelper.signTypedData(typedData.data.sign_data).catch(error => {
      dispatch($alert.set.error({title: 'Orders not cancelled', text: `Please try again to cancel your ${orders.open.length} open order(s).`}))
      return
    })

    if (!signature) {
      dispatch($alert.set.error({title: 'Orders not cancelled', text: `Please try again to cancel your ${orders.open.length} open order(s).`}))
      return
    }

    const result = await $orders.api.cancel({
      ...typedData.data.cancel_order,
      signature,
    })

    if (result?.data) {
      Amplitude.event('Bulk Cancel Order')
      const updatedOrders = orders.open.reduce((acc, o) => ({
        ...acc,
        [o.orderId]: 'cancelled',
      }), {})
      dispatch($orders.set.updateOrderStatus(updatedOrders))
      dispatch($alert.set.success({ title: 'Orders cancelled', text: `You have cancelled ${orders.open.length} order(s) successfully.` }))

      dispatch($portfolio.set.update(true))
    }

    // const signature = await WagmiHelper.signMessage()
    // if (signature) {
    //   const result = await $orders.api.cancelAll({ wallet_address: wallet, chain_id: blockchain.id, signature })
    //   if (result?.data) {
    //     Amplitude.event('Bulk Cancel Order')
    //     const updatedOrders = orders.open.reduce((acc, o) => ({
    //       ...acc,
    //       [o.orderId]: 'cancelled',
    //     }), {})
    //     dispatch($orders.set.updateOrderStatus(updatedOrders))
    //     dispatch($alert.set.success({ title: 'Orders cancelled', text: `You have cancelled ${orders.open.length} order(s) successfully.` }))

    //     dispatch($portfolio.set.update(true))
    //   }
    // } else {
    //   dispatch($alert.set.error({ title: 'Orders not cancelled', text: `Please try again to cancel your ${orders.open.length} open order(s).` }))
    // }

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
    if (order.status === 'completed' || order.status === 'cancelled' || order.status === 'partial') {
      return
    }

    const eventPost = {
      'Base Currency': order.baseCurrency,
      'Quote Currency': order.quoteCurrency,
      'Side': order.side.toUpperCase(),
      'Quantity': order.quantity - order.quantityFilled,
      'Price': order.price,
      'Total': order.price * order.quantity,
      'Filled Percent': `${Math.round(order.quantityFilled * 100 / order.quantity)}%`,
      'Chain ID': blockchain?.id,
      'Market ID': current?.address,
    }
    Amplitude.event('Cancel Order Submit', eventPost)

    const typedData = await $orders.api.cancelTypedData({
      order_ids: [order.orderId],
      user_address: wallet,
    })

    if (typedData?.error || ! typedData) {
      dispatch($alert.set.error({title: 'Order not cancelled', text: `Please try again to cancel your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency}.`}))
      return
    }

    const signature = await WagmiHelper.signTypedData(typedData.data.sign_data).catch(error => {
      dispatch($alert.set.error({title: 'Order not cancelled', text: `Please try again to cancel your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency}.`}))
      return
    })

    if (!signature) {
      dispatch($alert.set.error({title: 'Order not cancelled', text: `Please try again to cancel your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency}.`}))
      return
    }

    const result = await $orders.api.cancel({
      ...typedData.data.cancel_order,
      signature,
    })

    if (result) {
      dispatch($orders.set.updateOrderStatus({[order.orderId]: 'cancelled'}))
      dispatch($alert.set.success({ title: 'Order cancelled', text: `Your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency} has been cancelled successfully.` }))

      dispatch($portfolio.set.update(true))
    } else {
      dispatch($alert.set.error({ title: 'Order not cancelled', text: `Please try again to cancel your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency}.` }))
    }

    // const signature = await WagmiHelper.signMessage()
    // if (signature) {
    //   const result = await $orders.api.cancel({ id: order.orderId, chain_id: blockchain.id, signature })
    //   if (result) {
    //     dispatch($orders.set.updateOrderStatus({[order.orderId]: 'cancelled'}))
    //     dispatch($alert.set.success({ title: 'Order cancelled', text: `Your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency} has been cancelled successfully.` }))

    //     dispatch($portfolio.set.update(true))
    //   } else {
    //     dispatch($alert.set.error({ title: 'Order not cancelled', text: `Please try again to cancel your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency}.` }))
    //   }
    // } else {
    //   dispatch($alert.set.error({ title: 'Order not cancelled', text: `Please try again to cancel your order for ${order.quantity - order.quantityFilled} ${order.baseCurrency}.` }))
    // }
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
    setOrderTypes(type)
  }

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      Amplitude.event('Wallet Connect Clicked', {
        'Page': Amplitude.page(),
        'Chain ID': blockchain?.id,
        'Market ID': current?.address,
      })

      await connect()
    }
  }

  const filterByAddress = (order) => {
    return !showCollectionOrders || (!global && order.contractAddress === current?.address)
  }

  return (
    <App.Flex column className={cn(styles.container, {[styles[version]]: version})}>
      <App.Flex className={styles.header}>
        <App.Flex flex={1} center className={cn(styles.tab, {[styles.active]: ordersType === 'open'})} onClick={handleChangeOrdersType('open')}>
          <App.Text size={[12, 14]} uppercase={[true, null]} color={ordersType === 'open' ? '#fff' : '#5E5C6B'} height={1}>Open Orders</App.Text>
        </App.Flex>
        <App.Flex flex={1} center className={cn(styles.tab, {[styles.active]: ordersType === 'closed'})} onClick={handleChangeOrdersType('closed')}>
          <App.Text size={[12, 14]} uppercase={[true, null]} color={ordersType === 'closed' ? '#fff' : '#5E5C6B'} height={1}>Order History</App.Text>
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

            {ordersType !== 'closed' && orders[ordersType].length > 0 ? (
              version == 'mobile' ? (
                <App.Text weight={600} color="#FFAF38" onClick={handleCancelAllClick}>CANCEL ALL</App.Text>
              ) : (
                <App.Button variant="muted" small onClick={handleCancelAllClick}>
                  Cancel All
                </App.Button>
              )
            ) : null}
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
                orders[ordersType].filter(order => filterByAddress(order)).map((order) => {
                  return (
                    <App.Flex column key={order.id}>
                      <App.Flex column className={styles.orderContainer}>
                        <App.Flex align="center" className={cn(styles.order, {[styles.disabled]: order.status === 'closed' || order.status === 'cancelled'})}>
                          <div className={styles.side} style={{backgroundColor: order.side === 'buy' ? '#53F19C' : '#FF1D61'}} />
                          <App.Flex sx={{width: 90, paddingRight: 8}}>
                            <App.Flex justify={'center'} align={'center'} sx={{width: 30}} className={cn(styles.iconGlass, {[styles.active]: order.status_data.is_pending})}>
                              <App.Icon width={20} height={20} color="#fff" icon={"hourglass"} />
                            </App.Flex>
                            <App.Flex column align="center" justify="center" >
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
                          </App.Flex>


                          <App.Flex column sx={{width: 60, padding: 8}} align="center" justify="center">
                            <App.Flex column gap={4}>
                              <App.Text size={12} weight={600} center height={1}>{ order.quantityFilled }</App.Text>
                              <div style={{width: '100%', minWidth: 20, height: 1, background: '#B9B8C5'}} />
                              <App.Text color="#B9B8C5" size={8} weight={600} center height={1}>{ order.quantity }</App.Text>
                            </App.Flex>
                          </App.Flex>

                          <App.Flex flex={1} column sx={{padding: 8}} align="center" justify="center">
                            <App.Text size={12} weight={600} center color="#B9B8C5" height={1}>{ order.price }</App.Text>
                          </App.Flex>

                          <App.Flex flex={1} column align="center" justify="center" sx={{padding: 8, position: 'relative', height: '100%', overflow: 'hidden'}}>
                            <App.Text size={12} weight={600}>{ order.total }</App.Text>
                          </App.Flex>
                        </App.Flex>

                        <App.Flex row align="center" justify="flex-end" gap={16} className={cn(styles.hoverContent)}>
                          <App.Text color="rgba(185, 184, 197, 1)" size={10} weight={500} sx={{marginRight: 12}} height={1}>{ order.time }</App.Text>
                          {order.status !== 'open' ? (
                            <App.Text color="#B9B8C5" size={10} weight={600} uppercase height={1}>
                              {order.status}
                            </App.Text>
                          ) : null}

                          <App.Flex className={styles.actionButton} align="center" justify="center" onClick={handlePressCopy(order)}>
                            <App.Icon icon="copy" width={12} height={12} color="#B9B8C5" />
                          </App.Flex>

                          {order.status !== 'open' && !order.status_data.is_pending ? (
                            <App.Flex className={styles.actionButton} align="center" justify="center" onClick={handleClickDetails(order)}>
                              <App.Icon icon="order-details" />
                            </App.Flex>
                          ) : null}

                          {order.status === 'open' && !order.status_data.is_pending ? (
                            <App.Flex className={styles.actionButton} align="center" justify="center" onClick={handlePressCancelConfirm(order)}>
                              <App.Icon icon="cross-circle" />
                            </App.Flex>
                          ) : null}
                        </App.Flex>
                        {/* <App.Flex row className={cn(styles.filled, styles.pending)} width={`${Math.round(order.quantityFilled * 100 / order.quantity)}%`} /> */}
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
                  {orders[ordersType].filter(order => filterByAddress(order)).length ?
                    orders[ordersType].filter(order => filterByAddress(order)).map((order) => {
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
                                <App.Text size={14} weight={600} height={1}>{ order.price }</App.Text>
                              </App.Flex>

                              <App.Flex row align="center">
                                <App.Flex width={60}>
                                  <App.Text size={12} uppercase height={1} color="#5E5C6B">Total:</App.Text>
                                </App.Flex>
                                <App.Text size={14} weight={600} height={1} color="#5E5C6B">{ order.total }</App.Text>
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
              <App.Button xl fullWidth primary noPadding onClick={handleCancelConfirm}>Cancel</App.Button>
            </App.Flex>

            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding outlined onClick={handleDialogClose('cancel')}>Don&apos;t Cancel</App.Button>
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
              <App.Button xl fullWidth primary noPadding onClick={handleCancelAllConfirm}>Cancel All Orders</App.Button>
            </App.Flex>

            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding outlined onClick={handleDialogClose('cancelAll')}>Don&apos;t Cancel</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Dialog>

      <App.Dialog open={isDialogOpen?.approve} width={420} onClose={handleDialogClose('approve')} title={orderForCancel ? 'Cancel Order?' : 'Cancel All Orders?'}>
        <App.Flex column center gap={6} sx={{ padding: '8px 24px 16px' }}>
          <App.Flex row center width={150} height={150}>
            <Image src="/images/order-cancel-loader.gif" width={150} height={150} alt="" />
          </App.Flex>

          <App.Text center size={16} weight={700} height={1}>Waiting for {isApp ? 'Blockchain Confirmation' : 'Approval'}</App.Text>
          <App.Text center size={10} height={1} color="#5E5C6B">{isApp ? 'It will take a few seconds' : 'Please Proceed in Your Wallet'}</App.Text>
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
