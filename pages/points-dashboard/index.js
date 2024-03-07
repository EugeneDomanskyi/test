import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import SwitchLanguage from '@/components/SwitchLanguage'
import PointsEarn from '@/components/Points/PointsEarn'
import PointsRedeem from '@/components/Points/PointsRedeem'

import styles from './styles.module.scss'

const PointsDashboard = () => {
  const { t } = useTranslation()
  const { connection, connect } = useWalletConnect()

  const [section, setSection] = useState('earn')

  const handleSection = (value) => () => {
    setSection(value)
  }

  const handleConnect = () => {
    connect()
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Flex column fullWidth className={!connection.loading && !connection.connected ? styles.tiger : null}>
        <App.Container maxWidth={1230} sx={[{ paddingTop: 90 }, { paddingTop: 60 }]}>
          <App.Flex fullWidth row align="center" justify="space-between" sx={{ padding: '16px 0' }}>
            <App.Flex center gap={[32, 16]}>
              <App.Flex center gap={4} sx={{ cursor: 'pointer' }} onClick={handleSection('earn')}>
                <App.Icon icon="earn" color={section == 'earn' ? '#A6DC37' : '#fff'} />
                <App.Text weight={700} color={section == 'earn' ? '#A6DC37' : '#fff'}>{t('Earn')}</App.Text>
              </App.Flex>

              <div className={styles.hr} />

              <App.Flex center gap={4} sx={{ cursor: 'pointer' }} onClick={handleSection('redeem')}>
                <App.Icon icon="redeem" color={section == 'redeem' ? '#A6DC37' : '#fff'} />
                <App.Text weight={700} color={section == 'redeem' ? '#A6DC37' : '#fff'}>{t('Redeem')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex center gap={[20, 10]}>
              <Link href="/points-dashboard/faq">
                <App.Icon icon="question-circle" />
              </Link>

              <SwitchLanguage />
            </App.Flex>
          </App.Flex>

          {connection.loading ? (
            <App.LoaderBlock height={300} />
          ) : (
            connection.connected ? (
              section == 'earn' ? (
                <PointsEarn />
              ) : (
                <PointsRedeem />
              )
            ) : (
              <App.Flex column width={[614, '100%']} gap={40} align="flex-start" sx={[{ paddingTop: 186, paddingBottom: 236 }, { paddingTop: 40, paddingBottom: 300 }]}>
                <App.Flex column gap={8}>
                  <App.Text size={[80, 52]} weight={800} height={1.2}>{t('Start your points')} <App.Text inline italic size={[80, 52]} weight={700} family="Playfair Display" height={1.2} color="#7364FF">{t('Quest')}</App.Text></App.Text>
                  <App.Text szie={[12, 14]} color="#9B99AE">{t('Dive into the Tegro ecosystem! Complete quests and earn points. Aim for the top to unlock exclusive rewards with the POINTS you accumulate!')}</App.Text>
                </App.Flex>

                <App.ButtonGradient onClick={handleConnect}>{t('Connect Wallet')}</App.ButtonGradient>
              </App.Flex>
            )
          )}
        </App.Container>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsDashboard