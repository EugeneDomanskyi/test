import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'
import { useEffect } from 'react'

const GemsCountdownBrett = ({ endTime, alternate, hideSeconds, onFinish }) => {
  const { t } = useTranslation()

  const duration = useCountdown(endTime, alternate)
  
  useEffect(() => {
    if (duration.isEnd && onFinish) {
      onFinish()
    }
  }, [duration.isEnd])

  return (
    <App.Flex align="center" gap={4}>
      <App.Flex width={[47, 36]} justify="flex-end" align="baseline">
        <App.Text uppercase weight={700} size={[28, 20]} height={1}>{duration.days}</App.Text>
        <App.Text weight={600} size={16} height={1} color="#A6DC37">{t('d')}</App.Text>
      </App.Flex>

      <App.Text weight={700} size={16} height={1}>:</App.Text>

      <App.Flex width={[45, 35]} justify="flex-end" align="baseline">
        <App.Text uppercase weight={700} size={[28, 20]} height={1}>{duration.hours}</App.Text>
        <App.Text weight={600} size={16} height={1} color="#A6DC37">{t('h')}</App.Text>
      </App.Flex>

      <App.Text weight={700} size={16} height={1}>:</App.Text>

      <App.Flex width={[49, 39]} justify="flex-end" align="baseline">
        <App.Text uppercase weight={700} size={[28, 20]} height={1}>{duration.minutes}</App.Text>
        <App.Text weight={600} size={16} height={1} color="#A6DC37">{t('m')}</App.Text>
      </App.Flex>

      {!hideSeconds ? (
        <>
          <App.Text weight={700} size={16} height={1}>:</App.Text>

          <App.Flex width={[43, 33]} justify="flex-end" align="baseline">
            <App.Text uppercase weight={700} size={[28, 20]} height={1}>{duration.seconds}</App.Text>
            <App.Text weight={600} size={16} height={1} color="#A6DC37">{t('s')}</App.Text>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

export default GemsCountdownBrett
