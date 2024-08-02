import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'

import App from '@/components/App'
import GemsBar from '@/components/Gems/GemsBar'
import GemsHome from '@/components/Gems/GemsHome'
import GemsLiquidity from '@/components/Gems/GemsLiquidity'
import GemsRefer from '@/components/Gems/GemsRefer'
import GemsAuctionNotify from '@/components/Gems/GemsAuctionNotify'

import styles from './styles.module.scss'

const GemsDashboard = () => {
  const { t } = useTranslation()

  const isApp = useSelector(({ $app }) => $app.isApp)
  const blockchain = useSelector($app.get.blockchain)

  const [tab, setTab] = useState('auction')

  const tabs = [
    { title: t('Dashboard'), key: 'home' },
    { title: t('Auction'), key: 'auction' },
    { title: t('Liquidity mining'), key: 'liquidity' },
    { title: t('Refer & earn'), key: 'refer' },
  ]

  useEffect(() => {
    const currentTab = localStorage.getItem('gemsTab')
    if (!currentTab || currentTab == tab) {
      try {
        Amplitude.event(`Page Visited`, {
          'Page': 'Gems Dashboard: ' + tabs.find(t => t.key == tab)?.title,
          'Chain ID': blockchain?.id,
          'Source': isApp ? 'App' : 'Web',
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [tab])

  const handleTab = (value) => {
    setTab(value)
  }

  const getGemsComponent = () => {
    switch (tab) {
      case 'home': return <GemsHome />
      case 'auction': return <GemsAuctionNotify />
      case 'liquidity': return <GemsLiquidity />
      case 'refer': return <GemsRefer />
      default: return <GemsAuctionNotify />
    }
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Flex column fullWidth sx={[{ paddingTop: 72 }, { paddingTop: 60 }]}>
        <GemsBar tabs={tabs} tab={tab} onTab={handleTab} />
        
        {getGemsComponent()}
      </App.Flex>
    </App.Flex>
  )
}

export default GemsDashboard