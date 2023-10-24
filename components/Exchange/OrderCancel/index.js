import styles from './styles.module.scss'
import App from '@/components/App'

import { trackEvent } from '@/libs/analytics.lib'

const OrderCancel = ({order, blockchain, wallet, onClose}) => {
  // console.log(props)
  const handleClickCancel = () => {
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
    order.cancel().then(() => {
      trackEvent('Cancel Order Success', eventPost)
      onClose()
    }).finally(() => {
      // setCancellingOrders(state => state.filter(id => id !== order.id))
      // onOrderCancelled()
    })
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex className={styles.header} align="center" justify="space-between">
        <App.Text weight={700} size={14} capitalize>
          Cancel Order?
        </App.Text>
        <App.Flex align="center" justify="center" sx={{cursor: 'pointer'}} onClick={onClose}>
          <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
        </App.Flex>
      </App.Flex>
      <App.Flex column align="center" className={styles.content} gap={12}>
        <App.Text color="#B9B8C5" size={12} weight={600}>Are you sure you want to cancel this order?</App.Text>
        <App.Flex className={styles.button} align="center" justify="center" onClick={handleClickCancel}>
          <App.Text size={12} weight={700}>
            Cancel
          </App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default OrderCancel
