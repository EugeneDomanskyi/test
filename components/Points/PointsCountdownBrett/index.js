import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const PointsCountdownBrett = ({ endTime, alternate, hideSeconds }) => {
  const { t } = useTranslation()

  const duration = useCountdown(endTime, alternate)

  return (
    <App.Flex align="center" gap={2}>
      <App.Flex width={32} justify="flex-end">
        <App.Text uppercase weight={700} size={16} height={1} color="#A6DC37">{duration.days}{t('d')}</App.Text>
      </App.Flex>

      <App.Text weight={700} size={16} height={1} color="#A6DC37">:</App.Text>

      <App.Flex width={32} justify="flex-end">
        <App.Text uppercase weight={700} size={16} height={1} color="#A6DC37">{duration.hours}{t('h')}</App.Text>
      </App.Flex>

      <App.Text weight={700} size={16} height={1} color="#A6DC37">:</App.Text>

      <App.Flex width={34} justify="flex-end">
        <App.Text uppercase weight={700} size={16} height={1} color="#A6DC37">{duration.minutes}{t('m')}</App.Text>
      </App.Flex>

      {!hideSeconds ? (
        <>
          <App.Text weight={700} size={16} height={1} color="#A6DC37">:</App.Text>

          <App.Flex width={30} justify="flex-end">
            <App.Text uppercase weight={700} size={16} height={1} color="#A6DC37">{duration.seconds}{t('s')}</App.Text>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

export default PointsCountdownBrett
