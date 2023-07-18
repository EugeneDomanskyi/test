import styles from './styles.module.scss'
import { useSelector } from 'react-redux'

import App from '@/components/App'

const Orders = () => {
  const orders = useSelector(({$exchange}) => [...$exchange.orders].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  console.log(orders)

  return (
    <App.Flex flex={1} column className={styles.container}>
      <App.Flex center className={styles.header}>
        <App.Text>MY ORDERS</App.Text>
      </App.Flex>
      <App.Flex sx={{}}>
        <App.Flex column sx={{width: 60}} align="center">
          <App.Text center>Asset</App.Text>
        </App.Flex>
        <App.Flex column sx={{width: 60}} align="center">
          <App.Text center>Qty</App.Text>
        </App.Flex>
        <App.Flex column sx={{width: 60}} align="center">
          <App.Text center sx={{width: 60}}>Price</App.Text>
        </App.Flex>
        <App.Flex column flex={1} align="center">
          <App.Text>Total</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex column>
        {
          orders.map((order) => {
            const totalQuantity = order.quantityRemaining +  order.quantityFilled
            return (
              <App.Flex key={order.id} className={styles.order}>
                <div className={styles.side} style={{backgroundColor: order.side === 'buy' ? 'rgb(13, 198, 109)' : 'rgb(206, 22, 93)'}} />
                <App.Flex column sx={{width: 60}}>
                  <App.Text></App.Text>
                  <App.Text></App.Text>
                </App.Flex>
                <App.Flex column sx={{width: 60}} align="center" justify="center">
                  <App.Text size={12} center>{ order.quantityFilled }</App.Text>
                  <App.Text size={12} center color="rgba(255,255,255,0.6)">{ totalQuantity }</App.Text>
                </App.Flex>
                <App.Flex sx={{width: 60}} column align="center" justify="center">
                  <App.Text size={12} center>{ order.price.amount.decimal }</App.Text>
                </App.Flex>
                <App.Flex flex={1} column align="center" justify="center">
                  <App.Text size={12}>{ totalQuantity * order.price.amount.decimal }</App.Text>
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
