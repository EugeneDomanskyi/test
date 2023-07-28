import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRef, useState, memo } from 'react'
import Image from 'next/image'
import numeral from 'numeral'
import { useRouter } from 'next/router'

import useTrade from '@/myhooks/trade'
import $app from '@/store/app'
import $exchange from '@/store/exchange'

import App from '@/components/App'

const Orders = ({onOrderCancelled, onClickOrder}) => {
  const router = useRouter()
  const orders = useSelector($exchange.get.orders)
  const current = useSelector(({$collection}) => $collection.current)

  const { cancelOrder, errorHandler } = useTrade()
  
  const [showCollectionOrders, setShowCollectionOrders] = useState(false)
  const loadingRef = useRef(false)

  const handlePressCancel = (order) => () => {
    loadingRef.current = true
    cancelOrder(order.id, handleCancelProgress, errorHandler)
  }

  const handleCancelAll = () => {
    onOrderCancelled()
  }

  const handleCancelProgress = (steps) => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete && loadingRef.current) {
      toast.success('Order cancelled successfully')
      loadingRef.current = false
      onOrderCancelled()
    }
  }

  const handleChangeSwitch = (value) => {
    setShowCollectionOrders(value)
  }

  const handleClick = order => () => {
    router.push(`${order.contract}`, undefined, {scroll: false})
    const totalQuantity = order.quantityFilled + order.quantityRemaining
    onClickOrder({
      quantity: totalQuantity,
      price: order.price.amount.decimal / totalQuantity,
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
        {/* <App.Flex className={styles.cancelAllButton} align="center" justify="center" onClick={handleCancelAll}>
          <App.Text color="#B9B8C5" size={10} weight={600}>Cancell All</App.Text>
        </App.Flex> */}
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
          orders.filter(order => !showCollectionOrders || (order.contract === current.address)).map((order) => {
            const totalQuantity = order.quantityRemaining +  order.quantityFilled
            return (
              <App.Flex key={order.id} column>
                <App.Flex align="center" className={styles.order} onClick={handleClick(order)}>
                  <div className={styles.side} style={{backgroundColor: order.side === 'buy' ? '#53F19C' : '#FF1D61'}} />
                  <App.Flex column align="center" justify="center" sx={{width: 60}}>
                    {
                      order.criteria.data.token?.image
                        ? <Image alt="" src={order.criteria.data.token.image} width={35} height={35} />
                        : order.criteria.data.collection?.image
                          ? <Image alt="" src={order.criteria.data.collection.image} width={35} height={35} />
                          : null
                    }
                  </App.Flex>
                  <App.Flex column sx={{width: 60}} align="center" justify="center">
                    <App.Text size={12} weight={600} center>{ order.quantityFilled }</App.Text>
                    <App.Text size={10} weight={600} center color="rgba(94, 92, 107, 1)">{ totalQuantity }</App.Text>
                  </App.Flex>
                  <App.Flex flex={1} column align="center" justify="center">
                    <App.Text size={12} weight={600} center color="rgba(185, 184, 197, 0.8)">{ numeral(order.price.amount.decimal / totalQuantity).format('0.[0000]') } { order.price.currency.symbol }</App.Text>
                  </App.Flex>
                  <App.Flex flex={1} column align="center" justify="center" sx={{position: 'relative', height: '100%', overflow: 'hidden'}}>
                    <App.Text size={12} weight={600}>{ order.price.amount.decimal } { order.price.currency.symbol }</App.Text>
                    <App.Flex className={styles.cancelButton} onClick={handlePressCancel(order)}>
                      <App.Text size={12} color="rgb(235, 49, 105)">Cancel order</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.onClickOrder === next.onClickOrder && prev.onOrderCancelled === next.onOrderCancelled
}

export default memo(Orders, isEqual)
