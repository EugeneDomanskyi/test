import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import $exchange from '@/store/exchange'

import App from '@/components/App'

const OrderBook = ({collection}) => {
  const dispatch = useDispatch()

  const orderBook = useSelector(({$exchange}) => $exchange.orderBook)

  let prevBuyVolumeValue = 0
  let prevSellVolumeValue = 0

  const maxBuyVolume = orderBook.buy.reduce((acc, {quantity}) => acc + quantity*1, 0)
  const maxSellVolume = orderBook.sell.reduce((acc, {quantity}) => acc + quantity*1, 0)

  useEffect(() => {
    if (collection) {
      $exchange.api.get.orderBook({collection: collection}).then(res => {
        if (res) {
          dispatch($exchange.set.orderBook(res))
        }
      })
    }
  }, [collection])

  return (
    <App.Flex column flex={1} className={styles.card}>
      <App.Flex center className={styles.header}>
        <App.Text>ORDER BOOK</App.Text>
      </App.Flex>
      <App.Flex gap={8}>
        <App.Flex column flex={1}>
        <App.Flex justify="space-between">
          <App.Text>Buy Price</App.Text>
          <App.Text>Volume</App.Text>
        </App.Flex>
          {
            orderBook.buy.map((order, i) => {
              prevBuyVolumeValue += order.quantity * 1
              const width = prevBuyVolumeValue * 100 / maxBuyVolume
              return (
                <App.Flex key={i} justify="space-between" className={styles.row}>
                  <div className={cn(styles.fill, styles.buy)} style={{width}} />
                  <App.Text sx={{position: 'relative'}} color="#53f19c">{ order.price }</App.Text>
                  <App.Text sx={{position: 'relative'}}>{ order.quantity }</App.Text>
                </App.Flex>
              )
            })
          }
        </App.Flex>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between">
            <App.Text>Volume</App.Text>
            <App.Text>Buy Price</App.Text>
          </App.Flex>
          {
            orderBook.sell.map((order, i) => {
              prevSellVolumeValue += order.quantity * 1
              const width = prevSellVolumeValue * 100 / maxSellVolume
              return (
                <App.Flex key={i} justify="space-between" className={styles.row}>
                  <div className={cn(styles.fill, styles.sell)} style={{width}} />
                  <App.Text sx={{position: 'relative'}}>{ order.quantity }</App.Text>
                  <App.Text sx={{position: 'relative'}} color="#eb3169">{ order.price }</App.Text>
                </App.Flex>
              )
            })
          }
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default OrderBook
