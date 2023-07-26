import { memo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import styles from './styles.module.scss'

import $exchange from '@/store/exchange'

import App from '@/components/App'

const Sales = ({onClickSale}) => {
  const sales = useSelector($exchange.get.recentSales(50))

  let previousPrice = 0

  const handleClick = sale => () => {
    onClickSale({quantity: sale.amount, price: sale.price.amount.decimal, side: sale.side})
  }

  return (
    <App.Flex flex={1} column className={styles.container}>
      <App.Flex column>
        <App.Flex align="center" className={styles.header}>
          <App.Text size={12} color="rgba(255,255,255,0.8)" weight={600}>TRADES</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex sx={{padding: '0 5px', height: 20}} justify="space-between" align="center">
        <App.Text size={10} color="#908F99" weight={600}>Price</App.Text>
        <App.Text size={10} color="#908F99" center weight={600}>Volume</App.Text>
        <App.Text size={10} color="#908F99" right weight={600}>Time</App.Text>
      </App.Flex>
      <App.Flex flex={1} column sx={{overflow: 'auto'}}>
        {
          sales.map((sale, index) => {
            const price = sale.price.amount.decimal
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
              <App.Flex key={sale.id} column>
                <App.Flex  justify="space-between" align="center" className={styles.sale} sx={{backgroundColor: color.row}} onClick={handleClick({...sale, side: color.side})}>
                  <App.Text flex={1} size={12} weight={500} color={color.price}>{ price }</App.Text>
                  <App.Text flex={1} size={12} weight={600} color="rgba(255,255,255,0.8)" center>{ sale.amount }</App.Text>
                  <App.Text flex={1} size={12} weight={600} color="rgba(255,255,255,0.8)" right>{ moment(sale.timestamp*1000).format('hh:mm:ss A') }</App.Text>
                </App.Flex>
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}

const isEqual = (prev, next) => {
  return prev.onClickSale === next.onClickSale
}

export default memo(Sales, isEqual)
