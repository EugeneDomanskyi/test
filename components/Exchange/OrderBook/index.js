import styles from './styles.module.scss'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import $exchange from '@/store/exchange'
import $app from '@/store/app'
import Stream from '@/libs/stream.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

const OrderBook = ({collectionId}) => {
  const dispatch = useDispatch()

  const orderBook = useSelector(({$exchange}) => {
    return {
      buy: $exchange.orderBook.buy.slice(0, 10),
      sell: $exchange.orderBook.sell.slice(0, 10),
    }
  })
  const socketConnected = useSelector(({$app}) => $app.socketConnected)
  const blockchain = useSelector($app.get.blockchain)

  let prevBuyVolumeValue = 0
  let prevSellVolumeValue = 0

  const maxBuyVolume = orderBook.buy.reduce((acc, {quantity}) => acc + quantity*1, 0)
  const maxSellVolume = orderBook.sell.reduce((acc, {quantity}) => acc + quantity*1, 0)

  useEffect(() => {
    if (collectionId && blockchain.code) {
      $exchange.api.get.orderBook({
        collection: collectionId,
        blockchain: blockchain.code,
        // displayCurrency: usdt[blockchain.code],
      }).then(res => {
        if (res) {
          dispatch($exchange.set.orderBook(res))
          
        }
      })
    }
  }, [collectionId, blockchain.code])

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
          <App.Flex justify="space-between" align="center" sx={{padding: '0 5px', height: 30}}>
            <App.Text size={12}>Buy Price</App.Text>
            <App.Text size={12}>Volume</App.Text>
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
          <App.Flex justify="space-between" align="center" sx={{padding: '0 5px', height: 30}}>
            <App.Text size={12}>Volume</App.Text>
            <App.Text size={12}>Sell Price</App.Text>
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
