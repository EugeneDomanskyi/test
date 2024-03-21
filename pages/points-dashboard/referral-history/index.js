import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import $point from '@/store/point'

import App from '@/components/App'
import SwitchLanguage from '@/components/SwitchLanguage'

import styles from './styles.module.scss'

const ReferralHistory = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const history = useSelector(({ $point }) => $point.history)

  useEffect(() => {
    if (wallet) {
      fetchHistory()
    }
  }, [wallet])

  const fetchHistory = async () => {
    const result = await $point.api.history(wallet, {})
    if (result && result?.data) {
      dispatch($point.set.history(result.data))
    }
  }

  const handleDashboard = () => {
    router.push(`/points-dashboard`)
  }

  const getShort = (address) => {
    const n = isMobile ? 4 : 8
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
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
              <App.Text size={24} weight={800}>{t('Referral History')}</App.Text>
              <App.Text color="#FFFFFF99">{t('Every action your referrals take not only furthers their journey but also enhances yours. Witness your impact and rewards grow with each trade and milestone they achieve.')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16} height={500}>
            <App.Flex row fullWidth>
              <App.Flex justify="flex-start" flex={1}>
                <App.Text left weight={600} color="#7364FF">{t('Referred Wallet')}</App.Text>
              </App.Flex>

              <App.Flex justify="center" flex={1}>
                <App.Text center weight={600} color="#7364FF">{t('Activity Status')}</App.Text>
              </App.Flex>

              <App.Flex justify="flex-end" flex={1} sx={{ paddingRight: 10 }}>
                <App.Text right weight={600} color="#7364FF">{t('Reward')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column fullWidth flex={1} className={styles.relative}>
              <App.Flex column fullWidth gap={16} className={styles.scroll}>
                <div className={styles.line} />

                {history.map(item => {
                  return (
                    <React.Fragment key={item.id}>
                      <App.Flex row align="center" fullWidth>
                        <App.Flex column justify="flex-start" flex={1}>
                          <App.Text left weight={600}>{getShort(item.referral_user.wallet_address)}</App.Text>
                          <App.Text left color="#9B99AE">{moment(item.created_at).format('DD.MM.YY')}</App.Text>
                        </App.Flex>

                        <App.Flex justify="center" flex={1}>
                          <App.Flex center className={cn(styles.status, styles.trade)}>
                            <App.Text center uppercase size={12} weight={700}>{t(item.reason)}</App.Text>
                          </App.Flex>
                        </App.Flex>

                        <App.Flex justify="flex-end" flex={1} sx={{ paddingRight: 10 }}>
                          <App.Text right italic size={16} weight={700} family="Playfair Display">{t('{{amount}} points', {amount: item.points})}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <div className={styles.line} />
                    </React.Fragment>
                  )}
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default ReferralHistory