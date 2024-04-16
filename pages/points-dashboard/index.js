import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import PointsBar from '@/components/Points/PointsBar'
import PointsHome from '@/components/Points/PointsHome'
import PointsLiquidity from '@/components/Points/PointsLiquidity'
import PointsRefer from '@/components/Points/PointsRefer'
import PointsContributor from '@/components/Points/PointsContributor'
import PointsQuests from '@/components/Points/PointsQuests'

import styles from './styles.module.scss'

const PointsDashboard = () => {
  const { t } = useTranslation()
  const { wallet } = useWalletConnect()

  const [tab, setTab] = useState('home')

  const tabs = [
    { title: t('Dashboard'), key: 'home' },
    { title: t('Liquidity Mining'), key: 'liquidity' },
    { title: t('Refer & Earn'), key: 'refer' },
    { title: t('Become a Contributor'), key: 'contributor' },
    { title: t('Third Party Quests'), key: 'quests' },
  ]

  useEffect(() => {
    const currentTab = localStorage.getItem('pointsTab')
    if (currentTab && wallet) {
      setTab(currentTab)
    }
  }, [wallet])

  const handleTab = (value) => {
    localStorage.setItem('pointsTab', value)
    setTab(value)
  }

  const getPointsComponent = () => {
    switch (tab) {
      case 'home': return <PointsHome />
      case 'liquidity': return <PointsLiquidity />
      case 'refer': return <PointsRefer />
      case 'contributor': return <PointsContributor />
      case 'quests': return <PointsQuests />
      default: return <PointsHome />
    }
  }

  return (
    <App.Flex column full className={styles.container}>
      <App.Flex column full sx={[{ paddingTop: 72 }, { paddingTop: 60 }]}>
        <PointsBar tabs={tabs} tab={tab} onTab={handleTab} />
        
        {getPointsComponent()}
      </App.Flex>
    </App.Flex>
  )
}

export default PointsDashboard