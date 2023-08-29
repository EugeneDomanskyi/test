import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { useState, memo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import $app from '@/store/app'
import $orders from '@/store/orders'

import App from '@/components/App'
import { trackEvent } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

const Orders = ({current, type, onOrderCancelled, onClickOrder}) => {
  const router = useRouter()
  const orders = useSelector($orders.get[type])
  const blockchain = useSelector($app.get.blockchain)
  const { wallet, connect, changeNetwork } = useWalletConnect()
  
  const [showCollectionOrders, setShowCollectionOrders] = useState(false)
  const [cancellingOrders, setCancellingOrders] = useState([])

  const handlePressCancel = (order) => async (e) => {
    e.stopPropagation()
    const address = await connect()
    if (!address) {
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
    setCancellingOrders(state => {
      return [...state, order.id]
    })
    order.cancel().then(() => {
      trackEvent('Cancel Order Success', eventPost)
      onOrderCancelled()
      setCancellingOrders(state => {
        return state.filter(id => id !== order.id)
      })
    }).catch(error => {
      console.log('order cancel error', error)
      setCancellingOrders(state => {
        return state.filter(id => id !== order.id)
      })
    })
  }

  const handleChangeSwitch = (value) => {
    setShowCollectionOrders(value)
  }

  const handleClick = order => () => {
    router.push(`${order.contractAddress}`, undefined, {scroll: false})
    onClickOrder({
      quantity: order.quantity,
      price: order.itemPrice,
      side: order.side,
    })
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex column>
        <App.Flex className={styles.header} align="center">
          <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600}>MY ORDERS</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex sx={{height: 40, padding: '0 8px'}} align="center" justify="space-between">
        <App.Flex align="center" gap={8}>
          <App.Switch
            width={40}
            height={20}
            checked={showCollectionOrders}
            onChange={handleChangeSwitch} />
          {
            current?.image
              ? <Image alt="" src={current?.image} width={20} height={20} />
              : null
          }
          <App.Text>Orders</App.Text>
        </App.Flex>
      </App.Flex>
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
          orders.filter(order => !showCollectionOrders || (order.contractAddress === current.address)).map((order) => {
            return (
              <App.Flex key={order.id} column sx={{position: 'relative'}}>
                <App.Flex align="center" className={styles.order} onClick={handleClick(order)}>
                  <div className={styles.side} style={{backgroundColor: order.side === 'buy' ? '#53F19C' : '#FF1D61'}} />
                  <App.Flex column align="center" justify="center" sx={{width: 60}}>
                    {
                      order.image
                        ? <Image alt="" src={order.image} width={35} height={35} />
                        : order.quoteCurrency
                          ? <App.Text size={12} weight={600}>{ order.quoteCurrency }</App.Text>
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
                    <App.Flex className={styles.cancelButton} onClick={handlePressCancel(order)}>
                      <App.Text size={12} color="rgb(235, 49, 105)">Cancel order</App.Text>
                    </App.Flex>
                  </App.Flex>
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
          })
        }
      </App.Flex>
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.onClickOrder === next.onClickOrder
    && prev.onOrderCancelled === next.onOrderCancelled
    && JSON.stringify(prev.current) === JSON.stringify(next.current)
    && prev.type === next.type
}

export default memo(Orders, isEqual)
