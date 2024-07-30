import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Amplitude from '@/libs/amplitude.lib'
import useWagmiHelper from '@/myhooks/useWagmiHelper'
import Socket from '@/libs/ws.lib'

import $app from '@/store/app'

import App from '@/components/App'
import GemsBar from '@/components/Gems/GemsBar'
import GemsHome from '@/components/Gems/GemsHome'
import GemsLiquidity from '@/components/Gems/GemsLiquidity'
import GemsRefer from '@/components/Gems/GemsRefer'
import GemsContributor from '@/components/Gems/GemsContributor'
import GemsTransactions from '@/components/Gems/GemsTransactions'
import GemsQuests from '@/components/Gems/GemsQuests'
import GemsAuction from '@/components/Gems/GemsAuction'

import styles from './styles.module.scss'

const GemsDashboard = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const blockchain = useSelector($app.get.blockchain)

  const [tab, setTab] = useState('auction')

  const tabs = [
    { title: t('Dashboard'), key: 'home' },
    { title: t('Auction'), key: 'auction' },
    { title: t('Liquidity mining'), key: 'liquidity' },
    { title: t('Refer & earn'), key: 'refer' },
    // { title: t('Contributor tasks'), key: 'contributor' },
    // { title: t('Side quests'), key: 'quests' },
    // { title: t('Gems history'), key: 'transactions' },
  ]

  useEffect(() => {
    Socket.init(() => {}, handleCloseConnection).then(() => {
      dispatch($app.set.socketConnected(true))
    })

    checkHash()

    return () => {
      dispatch($app.set.socketConnected(false))
    }
  }, [])

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

  useEffect(() => {
    const currentTab = localStorage.getItem('gemsTab')
    setTab(currentTab ?? 'auction')
  }, [])

  const checkHash = () => {
    const hash = window.location.hash
    if (hash != '') {
      const tab = tabs.find(t => hash.includes(t.key))
      if (tab) {
        handleTab(tab.key)
        window.location.hash = ''
      }
    }
  }

  const handleTab = (value) => {
    localStorage.setItem('gemsTab', value)
    setTab(value)
  }

  const handleCloseConnection = (e) => {
    Socket.init(() => {}, handleCloseConnection)
  }

  const getGemsComponent = () => {
    switch (tab) {
      case 'home': return <GemsHome />
      case 'auction': return <GemsAuction />
      case 'liquidity': return <GemsLiquidity />
      case 'refer': return <GemsRefer />
      // case 'contributor': return <GemsContributor />
      case 'quests': return <GemsQuests />
      // case 'transactions': return <GemsTransactions />
      default: return <GemsAuction />
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