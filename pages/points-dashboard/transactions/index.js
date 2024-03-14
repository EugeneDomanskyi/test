import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'

import App from '@/components/App'
import SwitchLanguage from '@/components/SwitchLanguage'

import styles from './styles.module.scss'

const Transactions = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const [filter, setFilter] = useState('all')

  const handleDashboard = () => {
    router.push(`/points-dashboard`)
  }

  const handleFilter = (type) => () => {
    setFilter(type)
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

                <App.Flex row align="center" fullWidth>
                  <App.Flex column justify="flex-start" flex={1}>
                    <App.Text left weight={600}>08.11.23</App.Text>
                    <App.Text left color="#9B99AE">{t('at {{time}}', {time: '11:09 AM'})}</App.Text>
                  </App.Flex>

                  <App.Flex justify="center" flex={1}>
                    <App.Text center weight={600}>{t('Tournaments: Bonus')}</App.Text>
                  </App.Flex>

                  <App.Flex justify="flex-end" flex={1} sx={{ paddingRight: 10 }}>
                    <App.Text right italic size={16} weight={700} color="#53F19C" family="Playfair Display">{t('+ {{amount}} points', {amount: 50})}</App.Text>
                  </App.Flex>
                </App.Flex>

                <div className={styles.line} />

                <App.Flex row align="center" fullWidth>
                  <App.Flex column justify="flex-start" flex={1}>
                    <App.Text left weight={600}>08.11.23</App.Text>
                    <App.Text left color="#9B99AE">{t('at {{time}}', {time: '11:09 AM'})}</App.Text>
                  </App.Flex>

                  <App.Flex justify="center" flex={1}>
                    <App.Text center weight={600}>{t('Tournaments: Bonus')}</App.Text>
                  </App.Flex>

                  <App.Flex justify="flex-end" flex={1} sx={{ paddingRight: 10 }}>
                    <App.Text right italic size={16} weight={700} color="#53F19C" family="Playfair Display">{t('+ {{amount}} points', {amount: 50})}</App.Text>
                  </App.Flex>
                </App.Flex>

                <div className={styles.line} />

                <App.Flex row align="center" fullWidth>
                  <App.Flex column justify="flex-start" flex={1}>
                    <App.Text left weight={600}>08.11.23</App.Text>
                    <App.Text left color="#9B99AE">{t('at {{time}}', {time: '11:09 AM'})}</App.Text>
                  </App.Flex>

                  <App.Flex justify="center" flex={1}>
                    <App.Text center weight={600}>{t('Tournaments: Bonus')}</App.Text>
                  </App.Flex>

                  <App.Flex justify="flex-end" flex={1} sx={{ paddingRight: 10 }}>
                    <App.Text right italic size={16} weight={700} color="#53F19C" family="Playfair Display">{t('+ {{amount}} points', {amount: 50})}</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default Transactions