import styles from './styles.module.scss'
import App from '@/components/App'

const OrderDetails = ({order, onClose}) => {
  return (
    <App.Flex column className={styles.container}>
      <App.Flex className={styles.header} align="center" justify="space-between">
        <App.Text weight={700} size={14} capitalize>
          Order Details
        </App.Text>
        <App.Flex align="center" justify="center" sx={{cursor: 'pointer'}} onClick={onClose}>
          <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
        </App.Flex>
      </App.Flex>
      <App.Flex column className={styles.content} gap={12}>
        <App.Flex align="center" justify="space-between" className={styles.row} sx={{backgroundColor: order.side === 'buy' ? '#06382F' : '#4D0E27', height: 44}}>
          <App.Text size={12} weight={700}>{ order.baseCurrency } / { order.quoteCurrency }</App.Text>
          <App.Text size={12} weight={700} color={order.side === 'buy' ? '#53F19C' : '#FF1D61'} capitalize>{ order.side }</App.Text>
        </App.Flex>
        <App.Flex align="center" justify="space-between" className={styles.row}>
          <App.Text color="#5E5C6B" size={12} weight={600}>Type</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600}>Limit (Maker)</App.Text>
        </App.Flex>
        <App.Flex align="center" justify="space-between" className={styles.row}>
          <App.Text color="#5E5C6B" size={12} weight={600}>Placed On</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600}>{ order.time }</App.Text>
        </App.Flex>
        <App.Flex align="center" justify="space-between" className={styles.row}>
          <App.Text color="#5E5C6B" size={12} weight={600}>Filled / Qty</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600}>{ order.quantityFilled } { order.quoteCurrency } / { order.quantity } { order.quoteCurrency }</App.Text>
        </App.Flex>
        <App.Flex align="center" justify="space-between" className={styles.row}>
          <App.Text color="#5E5C6B" size={12} weight={600}>At Price</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600}>{ order.itemPrice } { order.baseCurrency }</App.Text>
        </App.Flex>
        <App.Flex align="center" justify="space-between" className={styles.row}>
          <App.Text color="#5E5C6B" size={12} weight={600}>Total</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600}>{ order.price } { order.baseCurrency }</App.Text>
        </App.Flex>
        <App.Flex align="center" justify="space-between" className={styles.row}>
          <App.Text color="#5E5C6B" size={12} weight={600}>Fee</App.Text>
          <App.Text color="#B9B8C5" size={12} weight={600}>0 { order.baseCurrency }</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default OrderDetails
