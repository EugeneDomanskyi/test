import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRef } from 'react'
import Image from 'next/image'
import numeral from 'numeral'

import useTrade from '@/myhooks/trade'
import $app from '@/store/app'

import App from '@/components/App'

const Orders = ({onOrderCancelled}) => {
  const orders = useSelector(({$exchange}) => {
    return [...$exchange.orders].filter(order => order.status !== 'cancelled').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  const blockchain = useSelector($app.get.blockchain)

  const { cancelOrder, errorHandler } = useTrade()

  const loadingRef = useRef(false)

  const handlePressCancel = (order) => () => {
    loadingRef.current = true
    cancelOrder(order.id, handleCancelProgress, errorHandler)
  }

  const handleCancelProgress = (steps) => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete && loadingRef.current) {
      toast.success('Order cancelled successfully')
      loadingRef.current = false
      onOrderCancelled()
    }
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex column>
        <App.Flex className={styles.header} align="center">
          <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600}>MY ORDERS</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex sx={{height: 20}} align="center" sx={{borderBottom: '1px solid rgba(94, 92, 107, 0.3)'}}>
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
          orders.map((order) => {
            const totalQuantity = order.quantityRemaining +  order.quantityFilled
            return (
              <App.Flex key={order.id} column>
                <App.Flex align="center" className={styles.order}>
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
                    <App.Text size={12} weight={600} center color="rgba(185, 184, 197, 0.8)">{ numeral(order.price.amount.decimal / totalQuantity).format('0.[0000]') } { blockchain.currency }</App.Text>
                  </App.Flex>
                  <App.Flex flex={1} column align="center" justify="center" sx={{position: 'relative', height: '100%', overflow: 'hidden'}}>
                    <App.Text size={12} weight={600}>{ order.price.amount.decimal } { blockchain.currency }</App.Text>
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

export default Orders
