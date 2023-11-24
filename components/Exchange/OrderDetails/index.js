import { useSelector } from 'react-redux'
import cn from 'classnames'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'
import Image from 'next/image'

const OrderDetails = ({order}) => {
  const blockchain = useSelector($app.get.blockchain)

  return (
    <App.Flex column fullWidth gap={16} sx={{ paddingBottom: 16 }}>
      <App.Flex row align="center" justify="space-between" className={cn(styles.topRow, styles[order.side])}>
        <App.Text size={14} weight={700} height={1}>{ order.baseCurrency } / { order.quoteCurrency }</App.Text>
        <App.Text size={14} weight={600} height={1} color={order.side === 'buy' ? '#53F19C' : '#FF1D61'}>{ order.side.charAt(0).toUpperCase() + order.side.slice(1) }</App.Text>
      </App.Flex>

      <App.Flex column fullWidth gap={10} sx={{ padding: '0 24px' }}>
        <App.Text size={14} weight={600} height={1} color="#B9B8C5">Order Information</App.Text>

        <App.Flex column fullWidth gap={8}>
          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Type</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>Limit{!blockchain?.useBackend ? ' (Maker)' : ''}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Chain</App.Text>
            <App.Flex row center gap={4}>
              <App.Text color="#B9B8C5" size={12} height={1}>{blockchain.name}</App.Text>
              <Image src={`/images/icon-${blockchain.code}.png`} width={12} height={12} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Placed On</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.time}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Filled / Amount</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.quantityFilled} {order.quoteCurrency} / {order.quantity} {order.quoteCurrency}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Average / Price</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.itemPrice} {order.baseCurrency} / {order.itemPrice} {order.baseCurrency}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Total</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.price} {order.baseCurrency}</App.Text>
          </App.Flex>

          {blockchain?.useBackend ? (
            <App.Flex row align="center" justify="space-between">
              <App.Text color="#5E5C6B" italic size={12} height={1}>Fee: 0 | Gas: 0 </App.Text>
            </App.Flex>
          ) : null}
        </App.Flex>
      </App.Flex>
      
      {blockchain?.useBackend ? (
        <>
          <App.Hr color="#2a283c" />

          <App.Flex column fullWidth gap={10} sx={{ padding: '0 24px' }}>
            <App.Text size={14} weight={600} height={1} color="#B9B8C5">Trade Details</App.Text>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

export default OrderDetails
