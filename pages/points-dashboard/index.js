import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Amplitude from '@/libs/amplitude.lib'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $app from '@/store/app'

import App from '@/components/App'
import PointsBar from '@/components/Points/PointsBar'
import PointsHome from '@/components/Points/PointsHome'
import PointsLiquidity from '@/components/Points/PointsLiquidity'
import PointsRefer from '@/components/Points/PointsRefer'
import PointsContributor from '@/components/Points/PointsContributor'
import PointsTransactions from '@/components/Points/PointsTransactions'
import PointsQuests from '@/components/Points/PointsQuests'
import PointsAuction from '@/components/Points/PointsAuction'

import styles from './styles.module.scss'

const PointsDashboard = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const blockchain = useSelector($app.get.blockchain)

  const [tab, setTab] = useState('home')

  const tabs = [
    { title: t('Dashboard'), key: 'home' },
    // { title: t('Auction'), key: 'auction' },
    { title: t('Liquidity mining'), key: 'liquidity' },
    { title: t('Refer & earn'), key: 'refer' },
    // { title: t('Contributor tasks'), key: 'contributor' },
    { title: t('Side quests'), key: 'quests' },
    // { title: t('Points history'), key: 'transactions' },
  ]

  useEffect(() => {
    const currentTab = localStorage.getItem('pointsTab')
    if (!currentTab || currentTab == tab) {
      try {
        Amplitude.event(`Page Visited`, {
          'Page': 'Points Dashboard: ' + tabs.find(t => t.key == tab)?.title,
          'Chain ID': blockchain?.id,
          'Source': isApp ? 'App' : 'Web',
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [tab])

  useEffect(() => {
    const currentTab = localStorage.getItem('pointsTab')
    if (currentTab && wallet) {
      setTab(currentTab)
    }

    if (!wallet) {
      setTab('home')
    }
  }, [wallet])

  const handleTab = (value) => {
    localStorage.setItem('pointsTab', value)
    setTab(value)
  }

  const getPointsComponent = () => {
    switch (tab) {
      case 'home': return <PointsHome />
      // case 'auction': return <PointsAuction />
      case 'liquidity': return <PointsLiquidity />
      case 'refer': return <PointsRefer />
      // case 'contributor': return <PointsContributor />
      case 'quests': return <PointsQuests />
      // case 'transactions': return <PointsTransactions />
      default: return <PointsHome />
    }
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Flex column fullWidth sx={[{ paddingTop: 72 }, { paddingTop: 60 }]}>
        <PointsBar tabs={tabs} tab={tab} onTab={handleTab} />
        
        {getPointsComponent()}
      </App.Flex>
    </App.Flex>
  )
}

export default PointsDashboard