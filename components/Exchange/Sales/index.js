import { memo, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'

import $orders from '@/store/orders'
import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const Sales = ({onClickSale, version, type}) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)

  const trades = useSelector($orders.get.recentTrades(type, 50))
  const blockchain = useSelector($app.get.blockchain)
  const current = useSelector(({$token, $collection}) => type == 'nfts' ? $collection.current : $token.current)
  const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(current.address)

  let previousPrice = 0

  useEffect(() => {
    if (type === 'tokens' && isAddress) {
      setLoading(true)
      $orders.api.get.tokens.trades({
        address: current.address,
        blockchain: blockchain.code,
        sortBy: 'createDateTime',
        statuses: '[3]',
        limit: 100,
      }).then(res => {
        dispatch($orders.set.trades({type: 'tokens', data: res}))
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [current.address])

  const handleClick = sale => () => {
    onClickSale({quantity: sale.amount, price: sale.priceFormatted, side: sale.side})
  }

  return version == 'mobile' && loading ? (
    <App.LoaderBlock flex={1} />
  ) : (
    <App.Flex flex={1} column className={cn(styles.container, {[styles[version]]: version})}>
      {version != 'mobile' ? (
        <App.Flex align="center" className={styles.header}>
          <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600} height={1}>TRADES</App.Text>
        </App.Flex>
      ) : null}

      <App.Flex column height={version != 'mobile' ? 'calc(100% - 32px)' : '100%'}>
        <App.Flex className={styles.rowHeader} justify="space-between" align="center">
          <App.Text flex={1} size={[10, 12]} color="#B9B8C5" weight={[600, 500]} height={1}>Price</App.Text>
          <App.Text flex={1} size={[10, 12]} color="#B9B8C5" center weight={[600, 500]} height={1}>Volume</App.Text>
          <App.Text flex={1} size={[10, 12]} color="#B9B8C5" right weight={[600, 500]} height={1}>Time</App.Text>
        </App.Flex>

        <App.Flex flex={1} column sx={{overflow: 'auto'}}>
          {
            trades.slice(0, 10).map(sale => {
              const price = sale.priceFormatted
              let color = {
                price: '#53F19C',
                row: '#06382f',
                side: 'buy',
              }
              if (price * 1 < previousPrice) {
                color = {
                  price: '#EB3169',
                  row: '#4d0e27',
                  side: 'sell',
                }
              }

              previousPrice = price * 1
              return (
                <App.Flex key={sale.id || sale.signature} column>
                  <App.Flex  justify="space-between" align="center" className={styles.sale} sx={{backgroundColor: color.row}} onClick={handleClick({...sale, side: color.side})}>
                    <App.Text flex={1} size={12} color={color.price} height={1}>{ price }</App.Text>
                    <App.Text flex={1} size={12} weight={600} center height={1}>{ sale.amount }</App.Text>
                    <App.Text flex={1} size={12} right height={1}>{ moment(sale.timestamp*1000).format('hh:mm:ss A') }</App.Text>
                  </App.Flex>
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
  return prev.onClickSale === next.onClickSale
}

export default memo(Sales, isEqual)
