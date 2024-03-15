import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QuestWidget } from '@bandit-network/quest-widget'

import App from '@/components/App'

const PointsContributor = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column fullWidth gap={40}>
      <App.Flex fullWidth column gap={12}>
        <App.Text size={24} weight={700}>{t('Join the Tegro Tribe!')}</App.Text>
        <App.Text color="#9B99AE">{t('Be more than a trader; become a Tegro insider. Complete these simple steps, join our vibrant community, and boost your points balance along the way.')}</App.Text>
      </App.Flex>

      <App.Flex className="widget">
        <QuestWidget
          isOpen={true}
          dialog={false}
          collectionId={1}
          mode="quest_only"
          showLeaderBoard={false}
          showParticipants={false}
        />
      </App.Flex>
    </App.Flex>
  )
}

export default PointsContributor