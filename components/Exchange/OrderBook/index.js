import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import Socket from '@/libs/ws.lib'

import $orders from '@/store/orders'
import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const toLowerFixed = val => {
  const str = val.toString()
  return str.substring(0, str.indexOf('.') + 7)
}

const OrderBook = ({ version, onClickOrder }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  const current = useSelector(({ $token }) => $token.current)
  const blockchain = useSelector($app.get.blockchain)
  const orderBook = useSelector($orders.get.orderbook)

  const maxBuyVolume = orderBook.buy.reduce((acc, { quantity }) => acc + quantity * 1, 0)
  const maxSellVolume = orderBook.sell.reduce((acc, { quantity }) => acc + quantity * 1, 0)

  useEffect(() => {
    Socket.on('order_book_diff', 'order_book', async result => {
      dispatch($orders.set.orderbookUpdate(result))
    })
  }, [current?.id])

  useEffect(() => {
    if (current?.id && blockchain?.id) {
      if (current.blockchain == blockchain.code) {
        fetchOrderbook()
      }
    }
  }, [current?.id, blockchain?.id])

  const fetchOrderbook = async () => {
    const result = await $orders.api.orderbook({ market_id: current.marketId, chain_id: blockchain.id })
    if (result) {
      dispatch($orders.set.orderbook({data: result, token: current}))
    } else {
      dispatch($orders.set.orderbook({data: {Asks: [], Bids: []}, token: current}))
    }
    setLoading(false)
  }

  const handleClick = (order, volume) => () => {
    onClickOrder({ ...order, price: order.priceFormatted, quantity: toLowerFixed(volume) })
  }

  return version == 'mobile' && loading ? (
    <App.LoaderBlock flex={1} />
  ) : (
    <App.Flex column flex={[1, null]} className={cn(styles.card, { [styles[version]]: version })}>
      {version != 'mobile' ? (
        <App.Flex className={styles.header} align="center">
          <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600} height={1}>ORDER BOOK</App.Text>
        </App.Flex>
      ) : null}
      
      <App.Flex gap={2} height={version != 'mobile' ? 'calc(100% - 32px)' : '100%'}>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" className={styles.rowHeader}>
            <App.Text size={[10, 12]} color="#B9B8C5" weight={[600, 500]} height={1}>Volume</App.Text>
            <App.Text size={[10, 12]} color="#B9B8C5" weight={[600, 500]} height={1}>Buy Price</App.Text>
          </App.Flex>
          
          <App.Flex flex={1} column sx={{overflow: 'auto'}}>
            {orderBook.buy.map((order, i) => {
              const width = order.volume * 100 / maxBuyVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({...order, side: 'sell'}, order.volume)}>
                  <div className={cn(styles.fill, styles.buy)} style={{width}} />
                  <App.Text size={12} sx={{position: 'relative'}} height={1}>{ order.volume }</App.Text>
                  <App.Text size={12} sx={{position: 'relative'}} color="#53f19c" height={1}>{ order.priceFormatted }</App.Text>
                </App.Flex>
              )
            })}
          </App.Flex>
        </App.Flex>

        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" className={styles.rowHeader}>
            <App.Text size={[10, 12]} color="#B9B8C5" weight={[600, 500]} height={1}>Sell Price</App.Text>
            <App.Text size={[10, 12]} color="#B9B8C5" weight={[600, 500]} height={1}>Volume</App.Text>
          </App.Flex>

          <App.Flex flex={1} column sx={{overflow: 'auto'}}>
            {orderBook.sell.map((order, i) => {
              const width = order.volume * 100 / maxSellVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({...order, side: 'buy'}, order.volume)}>
                  <div className={cn(styles.fill, styles.sell)} style={{width}} />
                  <App.Text size={12} sx={{position: 'relative'}} color="#eb3169" height={1}>{ order.priceFormatted }</App.Text>
                  <App.Text size={12} sx={{position: 'relative'}} height={1}>{ order.volume }</App.Text>
                </App.Flex>
              )
            })}
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.onClickOrder === next.onClickOrder
    && prev.version === next.version
}

export default memo(OrderBook, isEqual)
