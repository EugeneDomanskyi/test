import { useSelector } from 'react-redux'
import moment from 'moment'
import styles from './styles.module.scss'

import App from '@/components/App'

const Sales = () => {
  const sales = useSelector(({$exchange}) => $exchange.sales)

  let previousPrice = 0

  return (
    <App.Flex flex={1} column className={styles.container}>
      <App.Flex column>
        <App.Flex center className={styles.header}>
          <App.Text>TRADE HISTORY</App.Text>
        </App.Flex>
      </App.Flex>
      <App.Flex sx={{padding: '0 5px'}}>
        <App.Text flex={1}>Price</App.Text>
        <App.Text flex={1} center>Volume</App.Text>
        <App.Text flex={1} right>Time</App.Text>
      </App.Flex>
      {
        sales.map((sale) => {
          const price = sale.price.amount.decimal
          let color = {
            price: '#53F19C',
            row: '#06382f'
          }
          if (price * 1 < previousPrice) {
            color = {
              price: '#EB3169',
              row: '#4d0e27'
            }
          }

          previousPrice = price * 1
          return (
            <App.Flex key={sale.id} justify="space-between" align="center" sx={{backgroundColor: color.row, padding: '3px 5px'}}>
              <App.Text flex={1} size={12} color={color.price}>{ price }</App.Text>
              <App.Text flex={1} size={12} center>{ sale.amount }</App.Text>
              <App.Text flex={1} size={12} right>{ moment(sale.timestamp*1000).format('hh:mm:ss A') }</App.Text>
            </App.Flex>
          )
        })
      }
    </App.Flex>
  )
}

export default Sales
