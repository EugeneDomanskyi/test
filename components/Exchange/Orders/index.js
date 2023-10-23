import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { useState, memo, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useDispatch } from 'react-redux'

import $app from '@/store/app'
import $orders from '@/store/orders'
import $modal from '@/store/modal'

import App from '@/components/App'
import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import useInterval from '@/myhooks/useInterval'

const Orders = ({current, type, version, onOrderCancelled, onClickOrder}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const orders = useSelector($orders.get[type])
  const blockchain = useSelector($app.get.blockchain)
  const { wallet, changeNetwork } = useWalletConnect()

  const [showCollectionOrders, setShowCollectionOrders] = useState(false)
  const [hideCancelledOrders, setHideCancelledOrders] = useState(true)
  const [cancellingOrders, setCancellingOrders] = useState([])
  const [ordersType, setOrderTypes] = useState('open')
  const [openId, setOpenId] = useState()

  useEffect(() => {
    if (wallet) {
      getOrders()
    } else {
      dispatch($orders.set[type]([]))
    }
  }, [wallet, type, blockchain.code])

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
    router.push(`${[seg2, order.contractAddress].join('/')}`, undefined, {scroll: false})
    onClickOrder({
      quantity: order.quantity,
      price: order.itemPrice,
      side: order.side,
    })
  }

  const handleClickDetails = order => e => {
    e.stopPropagation()
    // console.log(order)
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

  const handleChangeOrdersType = type => () => {
    setOrderTypes(type)
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
    }
  }

  const filterByAddress = (order) => {
    return !showCollectionOrders || (order.contractAddress === current.address)
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
      <App.Flex sx={{height: 40, padding: '0 8px'}} align="center" justify="space-between">
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
                  <App.Text color="#B9B8C5" size={[10, 12]} weight={600}>{current.symbol} - USDT</App.Text>
                </App.Flex>
          }
          
          <App.Text color="#B9B8C5" size={[10, 12]} weight={600}>Orders</App.Text>
        </App.Flex>
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
        <>
          <App.Flex row align="center" height={32} fullWidth>
            <App.Flex width={20} align="center">
            </App.Flex>

            <App.Flex flex={1} align="center">
              <App.Text size={12} weight={500} color="#B9B8C5">Asset</App.Text>
            </App.Flex>

            <App.Flex flex={1} align="center">
              <App.Text size={12} weight={500} color="#B9B8C5">Price</App.Text>
            </App.Flex>

            <App.Flex flex={1} align="center">
              <App.Text size={12} weight={500} color="#B9B8C5">Qty</App.Text>
            </App.Flex>

            <App.Flex flex={1} align="center">
              <App.Text size={12} weight={600} color="#B9B8C5">Filled</App.Text>
            </App.Flex>
            
            <App.Flex flex={1} align="center">
              <App.Text size={12} weight={600} color="#B9B8C5">Total</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column flex={1} gap={16} fullWidth sx={{overflow: 'auto'}}>
            {orders[ordersType].filter(order => filterByAddress(order) && filteredByStatus(order)).map((order) => {
              return (
                <App.Flex key={order.id} column fullWidth className={styles.orderContainer}>
                  <App.Flex row align="center" fullWidth className={cn(styles.order, {[styles.disabled]: order.status === 'completed' || order.status === 'cancelled'})} onClick={handleClick(order.id)}>
                    <App.Flex width={20} fullHeight>
                      <div className={styles.side} style={{backgroundColor: order.side === 'buy' ? '#53F19C' : '#FF1D61'}} />
                    </App.Flex>

                    <App.Flex flex={1} align="center">
                      {order.image && type === 'nfts' ? (
                        <Image alt="" src={order.image} width={35} height={35} />
                      ) : (
                        order.quoteCurrency ? (
                          <App.Flex column>
                            <App.Text size={12}>{ order.quoteCurrency }</App.Text>
                            <App.Text size={10} color="#5E5C6B">{ order.baseCurrency }</App.Text>
                          </App.Flex>
                        ) : null
                      )}
                    </App.Flex>

                    <App.Flex flex={1} align="center">
                      <App.Flex column>
                        <App.Text size={12}>{ order.itemPrice }</App.Text>
                        <App.Text size={10} color="#5E5C6B">{ order.baseCurrency }</App.Text>
                      </App.Flex>
                    </App.Flex>

                    <App.Flex flex={1} align="center">
                      <App.Flex column>
                        <App.Text size={12}>{ order.quantity }</App.Text>
                        <App.Text size={10} color="#5E5C6B">{ order.quoteCurrency }</App.Text>
                      </App.Flex>
                    </App.Flex>

                    <App.Flex flex={1} align="center">
                      <App.Flex column>
                        <App.Text size={12}>{ order.quantityFilled }</App.Text>
                        <App.Text size={10} color="#5E5C6B">{ Math.round(order.quantityFilled * 100 / order.quantity) }%</App.Text>
                      </App.Flex>
                    </App.Flex>

                    <App.Flex flex={1} align="center">
                      <App.Flex column>
                        <App.Text size={12}>{ order.price }</App.Text>
                        <App.Text size={10} color="#5E5C6B">{ order.baseCurrency }</App.Text>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>

                  <App.Flex align="center" justify="flex-end" className={cn(styles.hoverContent, {[styles.open]: openId == order.id})}>
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
              )
            })}
          </App.Flex>
        </>
      )}
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.onClickOrder === next.onClickOrder
    && prev.onOrderCancelled === next.onOrderCancelled
    && prev.current.address === next.current.address
    && prev.type === next.type
}

export default memo(Orders, isEqual)
