import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'
import $orders from '@/store/orders'

import App from '@/components/App'

import styles from './styles.module.scss'

const OrderDetails = ({order}) => {
  const { scanUrl } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchain)
  const isApp = useSelector(({ $app }) => $app.isApp)

  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState([])

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    const result = await $orders.api.details({ id: order.id })
    if (result && result.length) {
      setTrades(result)
    }

    setLoading(false)
  }

  return (
    <App.Flex column fullWidth gap={16} sx={{ paddingBottom: 16 }}>
      <App.Flex row align="center" justify="space-between" className={cn(styles.topRow, styles[order.side])}>
        <App.Text size={14} weight={700} height={1}>{ order.baseCurrency } / { order.quoteCurrency }</App.Text>
        <App.Text size={14} weight={600} height={1} color={order.side === 'buy' ? '#53F19C' : '#FF1D61'}>{ order.side.charAt(0).toUpperCase() + order.side.slice(1) }</App.Text>
      </App.Flex>

      <App.Flex column fullWidth gap={10} sx={{ padding: '0 24px' }}>
        <App.Text size={14} weight={600} height={1} color="#B9B8C5">Order Information</App.Text>

        <App.Flex column fullWidth gap={8}>
          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Type</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>Limit</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Chain</App.Text>
            <App.Flex row center gap={4}>
              <App.Text color="#B9B8C5" size={12} height={1}>{blockchain.name}</App.Text>
              <Image src={`/images/icon-${blockchain.code}.png`} width={12} height={12} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Placed On</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.time}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Filled / Amount</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.quantityFilled} {order.baseCurrency} / {order.quantity} {order.baseCurrency}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Average / Price</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.price} {order.quoteCurrency} / {order.price} {order.quoteCurrency}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" size={12} height={1}>Total</App.Text>
            <App.Text color="#B9B8C5" size={12} height={1}>{order.total} {order.quoteCurrency}</App.Text>
          </App.Flex>

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#5E5C6B" italic size={12} height={1}>Fee: {blockchain.info.fee} | Gas: 0 </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
      
      {loading ? (
        <App.LoaderBlock height={20} />
      ) : (
        trades.length ? (
          <>
            <App.Hr color="#2a283c" />

            <App.Flex column fullWidth>
              <App.Flex column fullWidth gap={10} sx={{ padding: '0 24px' }}>
                <App.Text size={14} weight={600} height={1} color="#B9B8C5">Trade Details</App.Text>

                <App.Flex row fullWidth gap={16}>
                  <App.Flex row width={100} align="center" sx={{ padding: '4px 0' }}>
                    <App.Text size={12} height={1} color="#5E5C6B">Date / Time</App.Text>
                  </App.Flex>

                  <App.Flex row width={100} align="center" sx={{ padding: '4px 0' }} flex={1}>
                    <App.Text size={12} height={1} color="#5E5C6B">Filled</App.Text>
                  </App.Flex>

                  <App.Flex row width={100} align="center" justify="flex-end" sx={{ padding: '4px 0' }} flex={1}>
                    <App.Text right size={12} height={1} color="#5E5C6B">Price</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>

              <App.Flex column fullWidth className={styles.scrollBox}>
                {trades.map((item) => (
                  <App.Flex key={item.id} row fullWidth gap={16} className={styles.row}>
                    <App.Flex row width={100} align="center">
                      <App.Text size={12} weight={600} height={1} color="#B9B8C5">{moment(item.time).format('DD MMM, HH:mm:ss')}</App.Text>
                    </App.Flex>

                    <App.Flex row width={100} align="center" flex={1}>
                      <App.Text size={12} weight={600} height={1} color="#B9B8C5">{item.amount} {order.baseCurrency}</App.Text>
                    </App.Flex>

                    <App.Flex row width={100} align="center" gap={10} justify="flex-end" flex={1}>
                      <App.Text size={12} weight={600} height={1} color="#B9B8C5">{item.price} {order.quoteCurrency}</App.Text>
                      {item.txHash && !isApp ? (
                        <a href={scanUrl(item.txHash, 'tx', blockchain)} target="_blank" rel="noreferrer" style={{ lineHeight: 0 }}>
                          <App.Icon icon="external-link" />
                        </a>
                      ) : null}
                    </App.Flex>
                  </App.Flex>
                ))}
              </App.Flex>
            </App.Flex>
          </>
        ) : null
      )}
    </App.Flex>
  )
}

export default OrderDetails
