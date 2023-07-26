import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import $exchange from '@/store/exchange'
import $app from '@/store/app'

import App from '@/components/App'

const OrderBook = ({current, onClickOrder}) => {
  const dispatch = useDispatch()

  const orderBook = useSelector($exchange.get.orderBook)
  const blockchain = useSelector($app.get.blockchain)

  let prevBuyVolumeValue = 0
  let prevSellVolumeValue = 0

  const maxBuyVolume = orderBook.buy.reduce((acc, {quantity}) => acc + quantity*1, 0)
  const maxSellVolume = orderBook.sell.reduce((acc, {quantity}) => acc + quantity*1, 0)

  useEffect(() => {
    if (current?.address && blockchain.code) {
      $exchange.api.get.orderBook({
        collection: current.address,
        blockchain: blockchain.code,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.orderBook(res))
        }
      })
    }
  }, [current, blockchain.code])

  const handleClick = (order) => () => {
    onClickOrder(order)
  }

  return (
    <App.Flex column flex={1} className={styles.card}>
      <App.Flex className={styles.header} align="center">
        <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600}>ORDER BOOK</App.Text>
      </App.Flex>
      <App.Flex gap={3}>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" sx={{padding: '0 8px', height: 20}}>
            <App.Text size={10} color="#908F99" weight={600}>Buy Price</App.Text>
            <App.Text size={10} color="#908F99" weight={600}>Volume</App.Text>
          </App.Flex>
          {
            orderBook.buy.map((order, i) => {
              prevBuyVolumeValue += order.quantity * 1
              const width = prevBuyVolumeValue * 100 / maxBuyVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({...order, side: 'sell'})}>
                  <div className={cn(styles.fill, styles.buy)} style={{width}} />
                  <App.Text size={12} sx={{position: 'relative'}} weight={600} color="#53f19c">{ order.price }</App.Text>
                  <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600} sx={{position: 'relative'}}>{ order.quantity }</App.Text>
                </App.Flex>
              )
            })
          }
        </App.Flex>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" sx={{padding: '0 8px', height: 20}}>
            <App.Text size={10} color="#908F99" weight={600}>Volume</App.Text>
            <App.Text size={10} color="#908F99" weight={600}>Sell Price</App.Text>
          </App.Flex>
          {
            orderBook.sell.map((order, i) => {
              prevSellVolumeValue += order.quantity * 1
              const width = prevSellVolumeValue * 100 / maxSellVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({...order, side: 'buy'})}>
                  <div className={cn(styles.fill, styles.sell)} style={{width}} />
                  <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600} sx={{position: 'relative'}}>{ order.quantity }</App.Text>
                  <App.Text size={12} sx={{position: 'relative'}} weight={600} color="#eb3169">{ order.price }</App.Text>
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
