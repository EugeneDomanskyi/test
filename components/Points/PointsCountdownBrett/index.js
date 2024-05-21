import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const PointsCountdownBrett = ({ endTime, alternate, hideSeconds }) => {
  const { t } = useTranslation()

  const duration = useCountdown(endTime, alternate)

  return (
    <App.Flex align="center" gap={2}>
      <App.Flex width={40} justify="flex-end">
        <App.Text uppercase weight={900} size={20} height={1} color="#A6DC37">{duration.days}{t('d')}</App.Text>
      </App.Flex>

      <App.Text weight={900} size={20} height={1} color="#A6DC37">:</App.Text>

      <App.Flex width={39} justify="flex-end">
        <App.Text uppercase weight={900} size={20} height={1} color="#A6DC37">{duration.hours}{t('h')}</App.Text>
      </App.Flex>

      <App.Text weight={900} size={20} height={1} color="#A6DC37">:</App.Text>

      <App.Flex width={42} justify="flex-end">
        <App.Text uppercase weight={900} size={20} height={1} color="#A6DC37">{duration.minutes}{t('m')}</App.Text>
      </App.Flex>

      {!hideSeconds ? (
        <>
          <App.Text weight={900} size={20} height={1} color="#A6DC37">:</App.Text>

          <App.Flex width={37} justify="flex-end">
            <App.Text uppercase weight={900} size={20} height={1} color="#A6DC37">{duration.seconds}{t('s')}</App.Text>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

export default PointsCountdownBrett
