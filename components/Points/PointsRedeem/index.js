import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import PointsShm from '@/components/Points/PointsShm'
import PointsTgr from '@/components/Points/PointsTgr'
import PointsConsumables from '@/components/Points/PointsConsumables'

import styles from './styles.module.scss'

const PointsRedeem = () => {
  const { t } = useTranslation()

  const [tab, setTab] = useState('shm')

  const tabs = [
    { value: 'shm', label: t('SHM Lootboxes') },
    { value: 'tgr', label: t('TGR Lootboxes') },
    { value: 'consumables', label: t('Consumables') },
  ]

  useEffect(() => {
    const currentTab = localStorage.getItem('redeemTab')
    if (currentTab) {
      setTab(currentTab)
    }
  }, [])

  const handleTab = (value) => () => {
    setTab(value)
    localStorage.setItem('redeemTab', value)
  }

  const getTabContent = () => {
    switch (tab) {
      case 'shm': return <PointsShm />
      case 'tgr': return <PointsTgr />
      case 'consumables': return <PointsConsumables />
      default: null
    }
  }

  return (
    <App.Flex fullWidth column gap={30} sx={[{ paddingTop: 24, paddingBottom: 24 }, { paddingTop: 16, paddingBottom: 16 }]}>
      <App.Flex column gap={16}>
        <App.Text size={24} weight={800}>{t('Coming')} <App.Text inline italic size={24} weight={700} family="Playfair Display" color="#7364FF">{t('Soon')}</App.Text></App.Text>
        <App.Text color="#FFFFFF99">{t('Your diligence in the Tegro realms is about to be richly rewarded. Here, the points youʼve valiantly amassed will unlock the vaults to coveted treasures. From the adrenaline rush of opening loot boxes to the pride of possessing exclusive NFTs, the spoils are nearly within your grasp')}</App.Text>
      </App.Flex>

      <App.Flex row gap={20} align="center" className={styles.tabs}>
        {tabs.map(item => {
          const isCurrent = item.value == tab
          return (
            <App.Frame key={item.value} padding="10px 32px" radius={50} gradient={isCurrent ? 'linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)' : 'transparent'} sx={{ cursor: 'pointer' }} onClick={handleTab(item.value)}>
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

export default PointsRedeem