import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useRef } from 'react'

import useTrade from '@/myhooks/trade'

import App from '@/components/App'

const Orders = () => {
  const orders = useSelector(({$exchange}) => {
    return [...$exchange.orders].filter(order => order.status !== 'cancelled').sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  const { cancelOrder, errorHandler } = useTrade()

  const loadingRef = useRef(false)

  const handlePressCancel = (order) => () => {
    console.log(order)
    loadingRef.current = true
    cancelOrder(order.id, handleCancelProgress, errorHandler)
  }

  const handleCancelProgress = (steps) => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete && loadingRef.current) {
      toast.success('Order cancelled successfully')
      loadingRef.current = false
    }
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex column>
        <App.Flex center className={styles.header}>
          <App.Text>MY ORDERS</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex sx={{height: 30}} align="center">
        <App.Flex column sx={{width: 60}} align="center">
          <App.Text size={12} center>Asset</App.Text>
        </App.Flex>
        <App.Flex column sx={{width: 60}} align="center">
          <App.Text size={12} center>Qty</App.Text>
        </App.Flex>
        <App.Flex column sx={{width: 60}} align="center">
          <App.Text size={12} center sx={{width: 60}}>Price</App.Text>
        </App.Flex>
        <App.Flex column flex={1} align="center">
          <App.Text size={12}>Total</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex column flex={1} sx={{overflow: 'auto'}}>
        {
          orders.map((order) => {
            const totalQuantity = order.quantityRemaining +  order.quantityFilled
            return (
              <App.Flex key={order.id} column>
                <App.Flex align="center" className={styles.order}>
                  <div className={styles.side} style={{backgroundColor: order.side === 'buy' ? 'rgb(13, 198, 109)' : 'rgb(206, 22, 93)'}} />
                  <App.Flex column sx={{width: 60}}>
                    <App.Text></App.Text>
                    <App.Text></App.Text>
                  </App.Flex>
                  <App.Flex sx={{width: 60}} align="center" justify="center">
                    <App.Text size={12} center>{ order.quantityFilled }</App.Text>
                    <App.Text size={12}>&nbsp;/&nbsp;</App.Text>
                    <App.Text size={12} center color="rgba(255,255,255,0.6)">{ totalQuantity }</App.Text>
                  </App.Flex>
                  <App.Flex sx={{width: 60}} column align="center" justify="center">
                    <App.Text size={12} center>{ order.price.amount.decimal }</App.Text>
                  </App.Flex>
                  <App.Flex flex={1} column align="center" justify="center">
                    <App.Text size={12}>{ totalQuantity * order.price.amount.decimal }</App.Text>
                  </App.Flex>
                  <App.Button variant="danger" className={styles.cancelButton} onClick={handlePressCancel(order)}>
                    <App.Text size={12} color="rgb(235, 49, 105)">Cancel order</App.Text>
                  </App.Button>
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
