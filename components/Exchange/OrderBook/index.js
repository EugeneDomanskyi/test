import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'

import $app from '@/store/app'
import $orders from '@/store/orders'

import App from '@/components/App'

import styles from './styles.module.scss'

const toLowerFixed = val => {
  const str = val.toString()
  return str.substring(0, str.indexOf('.') + 7)
}

const OrderBook = ({ type, version, onClickOrder }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  const orderBook = useSelector($orders.get.orderBook(type))
  const blockchain = useSelector($app.get.blockchain)
  const current = useSelector(({ $token, $collection }) => type == 'nfts' ? $collection.current : $token.current)

  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(current.address)

  const maxBuyVolume = orderBook.buy.reduce((acc, { quantity }) => acc + quantity * 1, 0)
  const maxSellVolume = orderBook.sell.reduce((acc, { quantity }) => acc + quantity * 1, 0)

  useEffect(() => {
    if (isAddress) {
      setLoading(true)
      $orders.api.get[type].orderBook({
        collection: current.address,
        address: current.address,
        blockchain: blockchain.code,
        sortBy: type === 'nfts' ? 'createdAt' : 'createDateTime',
        ...(type === 'nfts' ? {} : { statuses: '[1]' })
      }).then(res => {
        dispatch($orders.set.orderBook({ type: type, data: res, tokenAddress: current.address }))
        setLoading(false)
      })
    }
  }, [current.address])

  const handleClick = (order, volume) => () => {
    onClickOrder({ ...order, price: order.priceFormatted, quantity: toLowerFixed(volume) })
  }

  return version == 'mobile' && loading ? (
    <App.LoaderBlock flex={1} />
  ) : (
    <App.Flex column flex={[1, null]} className={cn(styles.card, { [styles[version]]: version })}>
      {version != 'mobile' ? (
        <App.Flex className={styles.header} align="center">
          <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600}>ORDER BOOK</App.Text>
        </App.Flex>
      ) : null}
      <App.Flex gap={3}>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" className={styles.rowHeader}>
            <App.Text size={[10, 12]} color="#908F99" weight={[600, 500]}>Volume</App.Text>
            <App.Text size={[10, 12]} color="#908F99" weight={[600, 500]}>Buy Price ({type === 'nfts' ? blockchain.wrapped.shortName : 'USDT'})</App.Text>
          </App.Flex>
          {
            orderBook.buy.map((order, i) => {
              const width = order.volume * 100 / maxBuyVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({ ...order, side: 'sell' }, order.volume)}>
                  <div className={cn(styles.fill, styles.buy)} style={{ width }} />
                  <App.Text size={12} color="#53f19c" weight={600} sx={{ position: 'relative' }}>{order.volume}</App.Text>
                  <App.Text size={12} sx={{ position: 'relative' }} weight={600} color="rgba(255,255,255,0.8)">{order.priceFormatted}</App.Text>
                </App.Flex>
              )
            })
          }
        </App.Flex>
        <App.Flex column flex={1}>
          <App.Flex justify="space-between" align="center" className={styles.rowHeader}>
            <App.Text size={[10, 12]} color="#908F99" weight={[600, 500]}>Sell Price ({type === 'nfts' ? blockchain.wrapped.shortName : 'USDT'})</App.Text>
            <App.Text size={[10, 12]} color="#908F99" weight={[600, 500]}>Volume</App.Text>
          </App.Flex>
          {
            orderBook.sell.map((order, i) => {
              const width = order.volume * 100 / maxSellVolume
              return (
                <App.Flex key={i} justify="space-between" align="center" className={styles.row} onClick={handleClick({ ...order, side: 'buy' }, order.volume)}>
                  <div className={cn(styles.fill, styles.sell)} style={{ width }} />
                  <App.Text size={12} sx={{ position: 'relative' }} weight={600} color="rgba(255,255,255,0.8)">{order.priceFormatted}</App.Text>
                  <App.Text size={12} color="#eb3169" weight={600} sx={{ position: 'relative' }}>{order.volume}</App.Text>
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
  return prev.onClickOrder === next.onClickOrder && prev.type === next.type
}

export default memo(OrderBook, isEqual)
