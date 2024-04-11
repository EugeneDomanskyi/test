import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import PointsBar from '@/components/Points/PointsBar'
import PointsHome from '@/components/Points/PointsHome'

import styles from './styles.module.scss'

const PointsDashboard = () => {
  const { t } = useTranslation()
  const { wallet, connection, connect } = useWalletConnect()

  const [tab, setTab] = useState('home')

  useEffect(() => {
    const currentTab = localStorage.getItem('pointsTab')
    if (currentTab && wallet) {
      setTab(currentTab)
    }
  }, [wallet])

  const handleConnect = () => {
    connect()
  }

  const getPointsComponent = () => {
    switch (tab) {
      case 'home': return <PointsHome />
    }
  }

  return (
    <App.Flex column full className={styles.container}>
      <App.Flex column full sx={[{ backgriund: 'red', paddingTop: 72 }, { paddingTop: 60 }]}>
        <PointsBar />
        
        {getPointsComponent()}

        {/* <App.Flex column full>
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
              <App.Flex column flex={1} width={[614, '100%']} gap={40} align="flex-start" justify={['center', 'flex-start']}>
                <App.Flex column gap={8}>
                  <App.Text size={[80, 52]} weight={800} height={1.2}>{t('Start your points')} <App.Text inline italic size={[80, 52]} weight={700} family="Playfair Display" height={1.2} color="#7364FF">{t('Quest')}</App.Text></App.Text>
                  <App.Text szie={[12, 14]} color="#9B99AE">{t('Join forces with fellow traders on a quest for glory and exclusive rewards. Connect your wallet to unleash the power of points and start your legendary journey.')}</App.Text>
                </App.Flex>

                <App.ButtonGradient onClick={handleConnect}>{t('Connect Wallet')}</App.ButtonGradient>
              </App.Flex>
            )
          )}
        </App.Flex> */}
      </App.Flex>
    </App.Flex>
  )
}

export default PointsDashboard