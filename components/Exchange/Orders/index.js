import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { useState, memo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import cn from 'classnames'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import $app from '@/store/app'
import $orders from '@/store/orders'
import $modal from '@/store/modal'

import App from '@/components/App'
import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import useInterval from '@/myhooks/useInterval'

const Orders = ({current, global, type, version, onOrderCancelled, onClickOrder}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const orders = useSelector($orders.get[type])
  const blockchain = useSelector($app.get.blockchain)
  const { wallet, changeNetwork } = useWalletConnect()

  const [loading, setLoading] = useState(true)
  const [showCollectionOrders, setShowCollectionOrders] = useState(false)
  const [hideCancelledOrders, setHideCancelledOrders] = useState(true)
  const [cancellingOrders, setCancellingOrders] = useState([])
  const [ordersType, setOrderTypes] = useState('open')
  const [openId, setOpenId] = useState()
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [orderForCancel, setOrderForCancel] = useState()

  useEffect(() => {
    if (wallet) {
      getOrders()
    } else {
      dispatch($orders.set[type]([]))
    }
  }, [wallet, type, blockchain.code])

  const handlePressCancelConfirm = (order) => (e) => {
    e.stopPropagation()
    setOrderForCancel(order)
    setIsConfirmDialogOpen(true)
  }

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false)
  }

  const handleCancelConfirm = (e) => {
    handlePressCancel(orderForCancel)(e)
    handleCloseConfirmDialog()
  }

  const handlePressCancel = (order) => async (e) => {
    e.stopPropagation()
    if (order.status === 'completed' || order.status === 'cancelled') {
      return
    }
    const network = await changeNetwork(blockchain.code)
    if (!network) {
      return
    }
    
    const eventPost = {
      'Base Currency': order.baseCurrency,
      'Quote Currency': order.quoteCurrency,
      'Side': order.side,
      'Quantity': order.quantity,
      'Price': order.itemPrice,
      'Total': order.price,
      'Network': blockchain.name,
      'Wallet connect Status': wallet ? 'Connected' : 'Not connected',
      'Wallet Address': wallet || null,
      'Order Type': 'Limit order',
    }
    trackEvent('Cancel Order Submit', eventPost)
    setCancellingOrders(state => [...state, order.id])
    order.cancel().then(() => {
      trackEvent('Cancel Order Success', eventPost)
    }).finally(() => {
      setCancellingOrders(state => state.filter(id => id !== order.id))
      onOrderCancelled()
    })
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
    dispatch($modal.set.show({
      show: true,
      modal: 'Exchange/OrderDetails',
      props: {
        order: {...rest, itemPrice: order.itemPrice},
      }
    }))
  }

  const handleChangeSwitch = (value) => {
    setShowCollectionOrders(value)
  }

  const handleClick = (id) => () => {
    setOpenId(id)
  }

  const handleClose = () => {
    setOpenId(null)
  }

  const handleChangeOrdersType = type => () => {
    setOrderTypes(type)
    setLoading(true)
  }

  const handleHideCancelledOrders = value => {
    setHideCancelledOrders(value)
  }

  const getOrders = async () => {
    const res = await $orders.api.get[type]({
      blockchain: blockchain.code,
      maker: wallet,
      includeCriteriaMetadata: true,
      address: wallet,
      sortBy: type === 'nfts' ? 'createdAt' : 'createDateTime',
      statuses: '[1,2,3]',
    })
    if (res) {
      dispatch($orders.set[type](res))
      setLoading(false)
    }
  }

  const filterByAddress = (order) => {
    return !showCollectionOrders || (!global && order.contractAddress === current?.address)
  }

  const filteredByStatus = order => {
    return type !== 'tokens' || !hideCancelledOrders || (order.status !== 'cancelled')
  }

  useInterval(getOrders, wallet ? 15000 : null)

  return (
    <App.Flex column className={cn(styles.container, {[styles[version]]: version})}>
      {
        type === 'tokens'
          ? <App.Flex height={[26, 32]} sx={{position: 'relative', marginBottom: 8}}>
              <App.Flex flex={1} justify="center" align="center" sx={{cursor: 'pointer'}} onClick={handleChangeOrdersType('open')}>
                <App.Text size={[12, 14]} uppercase={[true, null]} color={ordersType === 'open' ? '#fff' : 'rgba(185, 184, 197, 0.8)'}>Open Orders</App.Text>
              </App.Flex>
              <App.Flex flex={1} justify="center" align="center" sx={{cursor: 'pointer'}} onClick={handleChangeOrdersType('closed')}>
                <App.Text size={[12, 14]} uppercase={[true, null]} color={ordersType === 'closed' ? '#fff' : 'rgba(185, 184, 197, 0.8)'}>Completed Orders</App.Text>
              </App.Flex>
              <div className={styles.badge} style={{transform: `translateX(${ordersType === 'open' ? 0 : 100}%)`}} />
            </App.Flex>
          : version != 'mobile' ? (
            <App.Flex column>
              <App.Flex className={styles.header} align="center">
                <App.Text size={[12, 14]} uppercase={[true, null]} color="rgba(255,255,255,0.8)" weight={600}>My Orders</App.Text>
              </App.Flex>
            </App.Flex>
          ) : null
      }
      <App.Flex height={40} align="center" justify="space-between" sx={global ? {padding: '0 8px'} : null}>
        { ! global ? (
          <App.Flex align="center" gap={8} flex={1}>
            <App.Switch
              width={40}
              height={20}
              checked={showCollectionOrders}
              onChange={handleChangeSwitch} />
            {
              type === 'nfts'
                ? <Image alt="" src={current?.image} width={20} height={20} />
                : <App.Flex>
                    <App.Text color="#B9B8C5" size={[10, 12]} weight={600}>{current?.symbol} / USDT</App.Text>
                  </App.Flex>
            }
          </App.Flex>
        ) : null}

        {
          type === 'tokens' && ordersType === 'closed'
            ? <App.Flex align="center" gap={8} flex={1}>
                <App.Switch
                  width={40}
                  height={20}
                  checked={hideCancelledOrders}
                  onChange={handleHideCancelledOrders} />
                <App.Text color="#B9B8C5" size={[10, 12]} weight={600}>{version != 'mobile' ? 'Hide All Cancelled Orders' : 'Hide Cancelled Orders'}</App.Text>
              </App.Flex>
            : null
        }
      </App.Flex>

      {version != 'mobile' ? (
        <>
          <App.Flex align="center" sx={{height: 20, borderBottom: '1px solid rgba(94, 92, 107, 0.3)'}}>
            <App.Flex column sx={{width: 60}} align="center">
              <App.Text size={10} weight={600} color="#B9B8C5" center>Asset</App.Text>
            </App.Flex>
            <App.Flex column sx={{width: 60}} align="center">
              <App.Text size={10} weight={600} color="#B9B8C5" center>Qty</App.Text>
            </App.Flex>
            <App.Flex column flex={1} align="center">
              <App.Text size={10} weight={600} color="#B9B8C5" center>Price</App.Text>
            </App.Flex>
            <App.Flex column flex={1} align="center">
              <App.Text size={10} weight={600} color="#B9B8C5">Total</App.Text>
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
                      <App.Flex column align="center" justify="center" sx={{width: 60}}>
                        {
                          order.image && type === 'nfts'
                            ? <Image alt="" src={order.image} width={35} height={35} />
                            : order.quoteCurrency
                              ? <App.Flex column>
                                  <App.Text size={10} weight={600} center>{ order.quoteCurrency }</App.Text>
                                  <div style={{width: '100%', height: 1, background: '#5E5C6B'}} />
                                  <App.Text color="#5E5C6B" size={9} weight={600} center>{ order.baseCurrency }</App.Text>
                                </App.Flex>
                              : null
                        }
                      </App.Flex>
                      <App.Flex column sx={{width: 60}} align="center" justify="center">
                        <App.Text size={12} weight={600} center>{ order.quantityFilled }</App.Text>
                        <App.Text size={10} weight={600} center color="rgba(94, 92, 107, 1)">{ order.quantity }</App.Text>
                      </App.Flex>
                      <App.Flex flex={1} column align="center" justify="center">
                        <App.Text size={12} weight={600} center color="rgba(185, 184, 197, 0.8)">{ order.itemPrice } { order.baseCurrency }</App.Text>
                      </App.Flex>
                      <App.Flex flex={1} column align="center" justify="center" sx={{position: 'relative', height: '100%', overflow: 'hidden'}}>
                        <App.Text size={12} weight={600}>{ order.price } { order.baseCurrency }</App.Text>
                        
                        {/* <App.Flex className={styles.cancelButton} sx={{backgroundColor: order.status === 'completed' ? '#063834' : 'rgb(77, 14, 39)'}} onClick={handlePressCancel(order)}>
                          <App.Text size={12} color={order.status === 'completed' ? 'rgb(83, 241, 156)' : 'rgb(235, 49, 105)'} className={styles.statusText}>
                            {
                              (order.status === 'completed' || order.status === 'cancelled') ? order.status : 'Cancel order'
                            }
                          </App.Text>
                        </App.Flex> */}
                      </App.Flex>
                    </App.Flex>
                    <App.Flex align="center" justify="flex-end" className={cn(styles.hoverContent)}>
                      <App.Text color="rgba(185, 184, 197, 1)" size={10} weight={500} sx={{marginRight: 12}}>{ order.time }</App.Text>
                      {
                        order.status !== 'open'
                          ? <App.Text color="#B9B8C5" size={10} weight={600} uppercase>
                              { (order.status === 'completed' || order.status === 'cancelled') ? order.status : 'Cancel order' }
                            </App.Text>
                          : null
                      }
                      
                      <App.Flex className={styles.actionButton} align="center" justify="center" sx={{width: 50}} onClick={handlePressCopy(order)}>
                        <App.Icon icon="copy" width={12} height={12} color="#B9B8C5" />
                      </App.Flex>
                      {
                        order.status !== 'open'
                          ? <App.Flex className={styles.actionButton} align="center" justify="center" sx={{width: 50}} onClick={handleClickDetails(order)}>
                              <App.Icon icon="order-details" />
                            </App.Flex>
                          : null
                      }
                      {/* {
                        order.status === 'open'
                          ? <App.Flex className={styles.actionButton} align="center" justify="center" sx={{width: 50}} onClick={handlePressEdit(order)}>
                              <App.Icon icon="pencil" />
                            </App.Flex>
                          : null
                      } */}
                      {
                        order.status === 'open'
                          ? <App.Flex className={styles.actionButton} align="center" justify="center" sx={{width: 50}} onClick={handlePressCancel(order)}>
                              <App.Icon icon="cross-circle" />
                            </App.Flex>
                          : null
                      }
                    </App.Flex>
                    {
                      cancellingOrders.includes(order.id)
                        ? <App.Flex sx={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}} align="center" justify="center">
                            <App.Loader />
                          </App.Flex>
                        : null
                    }
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
          <App.Flex column flex={1} fullWidth sx={{overflow: 'auto'}}>
            {orders[ordersType].filter(order => filterByAddress(order) && filteredByStatus(order)).map((order, index) => {
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
                          <App.Text size={12} weight={600} color={order.side == 'buy' ? '#53F19C' : '#C00C4D'}>{percent}%</App.Text>
                        </App.Flex>
                      </div>
                    </App.Flex>
                  </App.Flex>

                  <App.Flex row justify="space-between" flex={1}>
                    <App.Flex column gap={8}>
                      <App.Flex row center gap={10} height={25} className={styles.currency} onClick={handlePressCopy(order)}>
                        <App.Text size={12} weight={700} height={1}>{order.quoteCurrency} <App.Text inline size={10} weight={700} color="#5E5C6B" height={1}>/ {order.baseCurrency}</App.Text></App.Text>
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
                        <App.Text size={14} weight={600} height={1}>${ order.itemPrice }</App.Text>
                      </App.Flex>

                      <App.Flex row align="center">
                        <App.Flex width={60}>
                          <App.Text size={12} uppercase height={1} color="#5E5C6B">Total:</App.Text>
                        </App.Flex>
                        <App.Text size={14} weight={600} height={1} color="#5E5C6B">${ order.price }</App.Text>
                      </App.Flex>
                    </App.Flex>

                    <App.Flex column align="flex-end" justify="space-between">
                      <App.Flex row align="center" height={25}>
                        <App.Text right size={12} weight={600} color="#5E5C6B">{order.time}</App.Text>
                      </App.Flex>

                      {order.status === 'open' ? (
                        cancellingOrders.includes(order.id) ? (
                          <App.Flex center>
                            <App.Loader size={20} />
                          </App.Flex>
                        ) : (
                          <App.Flex row center onClick={handlePressCancelConfirm(order)}>
                            <App.Icon icon="trash" />
                          </App.Flex>
                        )
                      ) : (
                        <App.Text color="#B9B8C5" size={12} uppercase>
                          { order.status }
                        </App.Text>
                      )}
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              )
            })}
          </App.Flex>
        )
      )}

      <App.Dialog open={isConfirmDialogOpen} onClose={handleCloseConfirmDialog} title="Cancel Order?">
        <App.Flex column>
          <App.Flex row sx={{padding: 24}}>
            <App.Text size={16} color="#B9B8C5">Are you sure you want to cancel the order you have placed?</App.Text>
          </App.Flex>

          <App.Flex row gap={16} sx={{padding: 16}}>
            <App.Flex flex={1}>
              <App.Button xl fullWidth primary outlined onClick={handleCancelConfirm}>Cancel</App.Button>
            </App.Flex>

            <App.Flex flex={1}>
              <App.Button xl fullWidth primary onClick={handleCloseConfirmDialog}>Don&apos;t Cancel</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Dialog>
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.onClickOrder === next.onClickOrder
    && prev.onOrderCancelled === next.onOrderCancelled
    && prev.current?.address === next.current?.address
    && prev.type === next.type
    && prev.global === next.global
    && prev.version === next.version
}

export default memo(Orders, isEqual)
