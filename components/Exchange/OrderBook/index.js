import styles from './styles.module.scss'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'
import numeral from 'numeral'

import $app from '@/store/app'
import $orders from '@/store/orders'

import App from '@/components/App'

const OrderBook = ({type, onClickOrder}) => {
  const orderBook = useSelector($orders.get.orderBook(type))
  const blockchain = useSelector($app.get.blockchain)

  let prevBuyVolumeValue = 0
  let prevSellVolumeValue = 0

  const maxBuyVolume = orderBook.buy.reduce((acc, {quantity}) => acc + quantity*1, 0)
  const maxSellVolume = orderBook.sell.reduce((acc, {quantity}) => acc + quantity*1, 0)

  const handleClick = (order) => () => {
    onClickOrder(order)
  }
  
  return (
    <App.Flex column flex={[1, null]} className={styles.card}>
      <App.Flex className={styles.header} align="center">
        <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600}>ORDER BOOK</App.Text>
      </App.Flex>
      <App.Flex gap={3}>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" sx={{padding: '0 8px', height: 20}}>
            <App.Text size={10} color="#908F99" weight={600}>Buy Price ({type === 'nfts' ? blockchain.wrapped.shortName : 'USDT'})</App.Text>
            <App.Text size={10} color="#908F99" weight={600}>Volume</App.Text>
          </App.Flex>
          {
            orderBook.buy.map((order, i) => {
              prevBuyVolumeValue += order.quantity * 1
              const width = prevBuyVolumeValue * 100 / maxBuyVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({...order, quantity: prevBuyVolumeValue, side: 'sell'})}>
                  <div className={cn(styles.fill, styles.buy)} style={{width}} />
                  <App.Text size={12} sx={{position: 'relative'}} weight={600} color="#53f19c">{ order.price }</App.Text>
                  <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600} sx={{position: 'relative'}}>{ numeral(prevBuyVolumeValue).format('0.[0000]') }</App.Text>
                </App.Flex>
              )
            })
          }
        </App.Flex>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" sx={{padding: '0 8px', height: 20}}>
            <App.Text size={10} color="#908F99" weight={600}>Volume</App.Text>
            <App.Text size={10} color="#908F99" weight={600}>Sell Price ({type === 'nfts' ? blockchain.wrapped.shortName : 'USDT'})</App.Text>
          </App.Flex>
          {
            orderBook.sell.map((order, i) => {
              prevSellVolumeValue += order.quantity * 1
              const width = prevSellVolumeValue * 100 / maxSellVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({...order, quantity: prevSellVolumeValue, side: 'buy'})}>
                  <div className={cn(styles.fill, styles.sell)} style={{width}} />
                  <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600} sx={{position: 'relative'}}>{ numeral(prevSellVolumeValue).format('0.[0000]') }</App.Text>
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

const isEqual = (prev, next) => {
  return prev.onClickOrder === next.onClickOrder &&
  prev.type === next.type
}

export default memo(OrderBook, isEqual)
