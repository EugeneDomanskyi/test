import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import PointsTournaments from '@/components/Points/PointsTournaments'
import PointsRefer from '@/components/Points/PointsRefer'

import styles from './styles.module.scss'

const PointsEarn = () => {
  const { t } = useTranslation()

  const [tab, setTab] = useState('tournaments')

  const tabs = [
    { value: 'tournaments', label: t('Trading Tournaments') },
    { value: 'refer', label: t('Refer & Earn') },
    { value: 'contributor', label: t('Become a contributor') },
    { value: 'quests', label: t('Third Party Quests') },
  ]

  const handleTab = (value) => () => {
    setTab(value)
  }

  const getTabContent = () => {
    switch (tab) {
      case 'tournaments': return <PointsTournaments />
      case 'refer': return <PointsRefer />
      case 'contributor': return <PointsContributor />
      case 'quests': return <PointsQuests />
      default: null
    }
  }

  return (
    <App.Flex fullWidth column gap={30} sx={[{ paddingTop: 24, paddingBottom: 24 }, { paddingTop: 16, paddingBottom: 16 }]}>
      <App.Flex column gap={16} width={[700, '100%']}>
        <App.Text size={24} weight={800}>{t('Earn')} <App.Text inline italic size={24} weight={700} family="Playfair Display" color="#A6DC37">{t('Points')}</App.Text></App.Text>
        <App.Text size={[12, 14]} color="#9B99AE">{t('Sit posuere a viverra morbi urna mauris enim quis sagittis. Arcu pellentesque habitant volutpat amet. Non id sed euismod tempus tincidunt sagittis. Nunc urna tellus pretium et tincidunt sit dolor quam. Volutpat urna nec sit congue quis non proin vivamus viverra.')}</App.Text>
      </App.Flex>

      <App.Flex row gap={20} align="center" className={styles.tabs}>
        {tabs.map(item => {
          const isCurrent = item.value == tab
          return (
            <App.Frame padding="10px 32px" radius={50} gradient={isCurrent ? 'linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)' : 'transparent'} sx={{ cursor: 'pointer' }} onClick={handleTab(item.value)}>
              <App.Text nowrap color={isCurrent ? '#fff' : '#9B99AE'} hoverColor="#fff" >{item.label}</App.Text>
            </App.Frame>
          )
        })}
      </App.Flex>

      <div className={styles.line} />

      <App.Flex fullWidth>
        {getTabContent()}
      </App.Flex>
    </App.Flex>
  )
}

export default PointsEarn