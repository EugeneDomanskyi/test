import { useTranslation } from 'react-i18next'
import { QuestWidget } from '@bandit-network/quest-widget'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsContributor = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex fullWidth column gap={16}>
            <App.Text size={24} weight={600} height={1}>{t('Join the Tegro Tribe!')}</App.Text>
            <App.Text size={16} weight={400} height={1} color="#FFFFFF99">{t('Be more than a trader; become a Tegro insider. Complete these simple steps, join our vibrant community, and boost your points balance along the way.')}</App.Text>
          </App.Flex>

          <App.Flex className="widget">
            <QuestWidget
              isOpen={true}
              dialog={false}
              collectionId={165394}
              mode="quest_only"
              showLeaderBoard={false}
              showParticipants={false}
            />
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsContributor