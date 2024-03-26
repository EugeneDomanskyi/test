import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'

import useWalletConnect from '@/myhooks/wallet-connect'

import $point from '@/store/point'

import App from '@/components/App'
import SwitchLanguage from '@/components/SwitchLanguage'

import styles from './styles.module.scss'
import moment from 'moment'

const Transactions = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const transactions = useSelector(({ $point }) => $point.transactions)

  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (wallet) {
      fetchTransactions()
    }
  }, [wallet])

  const fetchTransactions = async () => {
    const result = await $point.api.transactions(wallet, {})
    if (result && result?.data) {
      dispatch($point.set.transactions(result.data))
    }
    setLoading(false)
  }

  const handleDashboard = () => {
    router.push(`/points-dashboard`)
  }

  const handleFilter = (type) => () => {
    setFilter(type)
  }

  const getTransactions = () => {
    return transactions.filter(item => filter == 'credit' ? item.reason == 'credit' : true)
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex fullWidth row align="center" justify="space-between" sx={{ padding: '16px 0 0' }}>
            <App.Flex row sx={{ cursor: 'pointer' }} onClick={handleDashboard}>
              <App.Text weight={600}>&lt; Back</App.Text>
            </App.Flex>

            <App.Flex center gap={[20, 10]}>
              <Link href="/points-dashboard/faq">
                <App.Icon icon="question-circle" />
              </Link>

              <SwitchLanguage />
            </App.Flex>
          </App.Flex>

          <App.Flex direction={['row', 'column']} gap={16} align={['flex-end', 'flex-start']} justify="space-between">
            <App.Flex column width={[700, 'auto']} gap={16}>
              <App.Text size={24} weight={800}>{t('Points Transaction Ledger')}</App.Text>
              <App.Text color="#FFFFFF99">{t('Your trading valor and community spirit pay off. Hereʼs the record of all points youʼve amassed on your Tegro voyage. Every action, every trade, and every referral adds up to your growing treasure.')}</App.Text>
            </App.Flex>

            <App.Flex row gap={8}>
              <App.Frame padding="10px 32px" radius={50} gradient={filter == 'all' ? 'linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)' : 'transparent'} sx={{ cursor: 'pointer' }} onClick={handleFilter('all')}>
                <App.Text nowrap color={filter == 'all' ? '#fff' : '#9B99AE'} hoverColor="#fff" >{t('All Reasons')}</App.Text>
              </App.Frame>

              <App.Frame padding="10px 32px" radius={50} gradient={filter == 'credit' ? 'linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)' : 'transparent'} sx={{ cursor: 'pointer' }} onClick={handleFilter('credit')}>
                <App.Text nowrap color={filter == 'credit' ? '#fff' : '#9B99AE'} hoverColor="#fff" >{t('Credit')}</App.Text>
              </App.Frame>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16} height={500}>
            <App.Flex row fullWidth>
              <App.Flex justify="flex-start" flex={1}>
                <App.Text left weight={600} color="#7364FF">{t('Date')}</App.Text>
              </App.Flex>

              <App.Flex justify="center" flex={1}>
                <App.Text center weight={600} color="#7364FF">{t('Reason')}</App.Text>
              </App.Flex>

              <App.Flex justify="flex-end" flex={1} sx={{ paddingRight: 10 }}>
                <App.Text right weight={600} color="#7364FF">{t('Amount')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column fullWidth flex={1} className={styles.relative}>
              <App.Flex column fullWidth gap={16} className={styles.scroll}>
                <div className={styles.line} />

                {loading ? (
                  <App.LoaderBlock height={200} />
                ) : (
                  getTransactions().map(item => {
                    return (
                      <React.Fragment key={item.id}>
                        <App.Flex row align="center" fullWidth>
                          <App.Flex column justify="flex-start" flex={1}>
                            <App.Text left weight={600}>{moment(item.created_at).format('DD.MM.YY')}</App.Text>
                            <App.Text left color="#9B99AE">{t('at {{time}}', {time: moment(item.created_at).format('h:mm A')})}</App.Text>
                          </App.Flex>

                          <App.Flex justify="center" flex={1}>
                            <App.Text center weight={600}>{t(item.reason)}</App.Text>
                          </App.Flex>

                          <App.Flex justify="flex-end" flex={1} sx={{ paddingRight: 10 }}>
                            <App.Text right italic size={16} weight={700} color="#53F19C" family="Playfair Display">{item.type == 'earn' ? '+' : '-'} {t('{{amount}} point' + (item.amount > 1 ? 's' : ''), {amount: item.points})}</App.Text>
                          </App.Flex>
                        </App.Flex>

                        <div className={styles.line} />
                      </React.Fragment>
                    )}
                  )
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default Transactions