import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsHomeLeaderboard = () => {
  const { t } = useTranslation()

  const [tab, setTab] = useState('daily')

  const tabs = [
    { title: t('Daily leaderboard'), key: 'daily' },
    { title: t('Cumulative leaderboard'), key: 'cumulative' },
  ]

  const handleTab = (value) => {
    setTab(value)
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Leaderboard')}</App.Text>

      <App.Flex column>
        <App.Tabs active={tab} options={tabs} variant="points" onChange={handleTab} />

        <App.Flex row>
          <App.Flex className={styles.gradient} />

          <App.Flex width={92} center>
            <App.Text weight={600} height={1} color="#A6DC37">{t('№')}</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsHomeLeaderboard