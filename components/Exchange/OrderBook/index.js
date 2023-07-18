import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import $exchange from '@/store/exchange'
import Stream from '@/libs/stream.lib'

import App from '@/components/App'

const OrderBook = ({collectionId}) => {
  const dispatch = useDispatch()

  const orderBook = useSelector(({$exchange}) => {
    return {
      buy: $exchange.orderBook.buy.slice(0, 10),
      sell: $exchange.orderBook.sell.slice(0, 10),
    }
  })
  const { blockchain, socketConnected } = useSelector(({$app}) => ({blockchain: $app.blockchain, socketConnected: $app.socketConnected}))

  let prevBuyVolumeValue = 0
  let prevSellVolumeValue = 0

  const maxBuyVolume = orderBook.buy.reduce((acc, {quantity}) => acc + quantity*1, 0)
  const maxSellVolume = orderBook.sell.reduce((acc, {quantity}) => acc + quantity*1, 0)

  // console.log(orderBook)

  useEffect(() => {
    Stream.on('bid', (event, data) => {
      // console.log(data.quantityRemaining)
      console.log(event, ' -> ', data.price.amount.native, data.quantityRemaining, orderBook.buy.find(o => o.price === data.price.amount.native))
      
    })
    Stream.on('ask', (event, data) => {
      // console.log(event, ' -> ', data.price.amount.native, data.quantityRemaining, orderBook.sell.find(o => o.price === data.price.amount.native))
      // console.log('ask -> ', data)
    })
  }, [])

  useEffect(() => {
    if (collectionId) {
      $exchange.api.get.orderBook({
        collection: collectionId,
        blockchain: blockchain,
      }).then(res => {
        if (res) {
          dispatch($exchange.set.orderBook(res))
          
        }
      })
    }
  }, [collectionId, blockchain])

  useEffect(() => {
    if (collectionId && socketConnected) {
      // Stream.subscribe('bid.*', [collectionId])
      // Stream.subscribe('ask.*', [collectionId])
    }
  }, [collectionId, socketConnected])

  return (
    <App.Flex column flex={1} className={styles.card}>
      <App.Flex center className={styles.header}>
        <App.Text>ORDER BOOK</App.Text>
      </App.Flex>
      <App.Flex gap={8}>
        <App.Flex column flex={1}>
        <App.Flex justify="space-between" sx={{padding: '0 5px'}}>
          <App.Text>Buy Price</App.Text>
          <App.Text>Volume</App.Text>
        </App.Flex>
          {
            orderBook.buy.map((order, i) => {
              prevBuyVolumeValue += order.quantity * 1
              const width = prevBuyVolumeValue * 100 / maxBuyVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row}>
                  <div className={cn(styles.fill, styles.buy)} style={{width}} />
                  <App.Text size={12} sx={{position: 'relative'}} color="#53f19c">{ order.price }</App.Text>
                  <App.Text size={12} sx={{position: 'relative'}}>{ order.quantity }</App.Text>
                </App.Flex>
              )
            })
          }
        </App.Flex>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" sx={{padding: '0 5px'}}>
            <App.Text>Volume</App.Text>
            <App.Text>Sell Price</App.Text>
          </App.Flex>
          {
            orderBook.sell.map((order, i) => {
              prevSellVolumeValue += order.quantity * 1
              const width = prevSellVolumeValue * 100 / maxSellVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row}>
                  <div className={cn(styles.fill, styles.sell)} style={{width}} />
                  <App.Text size={12} sx={{position: 'relative'}}>{ order.quantity }</App.Text>
                  <App.Text size={12} sx={{position: 'relative'}} color="#eb3169">{ order.price }</App.Text>
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
