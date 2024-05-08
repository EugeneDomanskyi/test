import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $alert from '@/store/alert'
import $point from '@/store/point'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsTransactions = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const transactions = useSelector(({ $point }) => $point.transactions)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wallet) {
      fetchTransactions()
    }
  }, [wallet])

  const fetchTransactions = async () => {
    const result = await $point.api.transactions(wallet, {})
    if (result?.data) {
      dispatch($point.set.transactions(result.data))
    }
    setLoading(false)
  }

  return (
    <App.Flex fullWidth column className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex fullWidth column gap={16}>
            <App.Text size={[24, 20]} weight={600} height={1}>{t('Track your points journey')}</App.Text>
            <App.Text size={12} color="#9b99ae">{t('Review all your accumulated points from actions, trades, and referrals on the Tegro — every step adds up!')}</App.Text>
          </App.Flex>

          <App.Flex column className={styles.table}>
            <App.Flex row className={styles.row}>
              <App.Flex width={[140, 100]} align="center">
                <App.Text left weight={600} height={1} color="#A6DC37">{t('Date')}</App.Text>
              </App.Flex>

              <App.Flex flex={1} align="center">
                <App.Text weight={600} height={1} color="#A6DC37">{t(`Points source`)}</App.Text>
              </App.Flex>

              <App.Flex flex={1} align="center" justify="flex-end">
                <App.Text right weight={600} height={1} color="#A6DC37">{t(`Points earned`)}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column>
              {loading ? (
                <App.LoaderBlock height={300} />
              ) : (
                transactions.length > 0 ? (
                  transactions.map((item, index) => {
                    const [topic, ...rest] = item.reason.split('_')
                    const reason = topic + ': ' + rest.join(' ')
                    return (
                      <App.Flex key={index} row className={styles.row}>
                        <App.Flex width={[140, 100]} align="center">
                          <App.Text size={[16, 14]} weight={[600, 400]}>{moment(item.created_at).format('DD-MM-YYYY')}<br />{moment(item.created_at).format('hh:mm:ss A')}</App.Text>
                        </App.Flex>

                        <App.Flex flex={1} align="center">
                          <App.Text capitalize size={[16, 14]} weight={[600, 400]} height={1}>{reason}</App.Text>
                        </App.Flex>

                        <App.Flex flex={1} align="center" justify="flex-end">
                          <App.Text right size={[16, 14]} weight={[600, 400]} height={1} color={item.points > 0 ? (item.type == 'earn' ? '#53F19C' : '#FF1D61') : '#fff'}>{item.points > 0 ? (item.type == 'earn' ? '+' : '-') : ''} {item.points} {t('Points')}</App.Text>
                        </App.Flex>
                      </App.Flex>
                    )
                  })
                ) : (
                  <App.Flex center height={200}>
                    <App.Text>{t('There is no data yet')}</App.Text>
                  </App.Flex>
                )
              )}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsTransactions