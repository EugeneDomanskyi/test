import styles from './styles.module.scss'
import { useState, useEffect } from 'react'
import App from '@/components/App'

import Order from '@/libs/structs/Order'

const FillOrder = ({data, onClose}) => {

  useEffect(() => {
    
  }, [])

  const fetchOrders = async () => {
    const res = await Order.TOKEN.getOpenWithPriceLimitation({
      chainId: data.blockchain.id,
      makerAsset: data.makerAsset,
      takerAsset: data.takerAsset,
      amount: data.amount,
      price: data.price,
      side: data.side,
    })
  }
  console.log(data)
  return (
    <App.Flex column className={styles.container}>
      <App.Flex className={styles.header} align="center" justify="space-between">
        <App.Text weight={700} size={14}>{`Buy Water with USDT`}</App.Text>
        <App.Flex align="center" justify="center" onClick={onClose}>
          <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
        </App.Flex>
      </App.Flex>
      <App.Flex className={styles.content}>
        <App.Flex className={styles.steps}>
          <App.Flex flex={1} column align="center" justify="flex-end">
            <App.Text color="#5E5C6B" size={10} weight={500}>Confirm</App.Text>
            <App.Flex sx={{width: '100%'}}>
              <App.Flex className={styles.line} flex={1} />
            </App.Flex>
          </App.Flex>
          <App.Flex flex={1} column align="center" justify="flex-end">
            <App.Text color="#5E5C6B" size={10} weight={500}>Approve</App.Text>
            <App.Flex sx={{width: '100%'}}>
              <App.Flex className={styles.line} flex={1} />
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default FillOrder
