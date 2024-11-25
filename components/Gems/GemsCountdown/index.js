import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const GemsCountdown = ({ endTime, alternate, hideSeconds }) => {
  const { t } = useTranslation()

  const duration = useCountdown(endTime, alternate)

  return (
    <App.Flex align="center" gap={[8, 3]}>
      <App.Flex align={'flex-end'}>
        <App.Flex width={[42, 32]}>
          <App.Text weight={600} size={[32, 24]} height={1}>{ duration.days }</App.Text>
        </App.Flex>
        <App.Text weight={700} size={[16, 12]} height={1.2}>{t('d')}</App.Text>
      </App.Flex>

      <App.Text weight={300} size={[24, 16]} height={1}>:</App.Text>

      <App.Flex align={'flex-end'}>
        <App.Flex width={[42, 32]}>
          <App.Text weight={600} size={[32, 24]} height={1}>{ duration.hours }</App.Text>
        </App.Flex>
        <App.Text weight={600} size={[16, 12]} height={1.2}>{t('h')}</App.Text>
      </App.Flex>

      <App.Text weight={300} size={[24, 16]} height={1}>:</App.Text>

      <App.Flex align={'flex-end'}>
        <App.Flex width={[42, 32]}>
          <App.Text weight={600} size={[32, 24]} height={1}>{ duration.minutes }</App.Text>
        </App.Flex>
        <App.Text weight={600} size={[16, 12]} height={1.2}>{t('m')}</App.Text>
      </App.Flex>

      {!hideSeconds ? (
        <>
          <App.Text weight={300} size={[24, 16]} height={1}>:</App.Text>

          <App.Flex align={'flex-end'}>
            <App.Flex width={[42, 32]}>
              <App.Text weight={600} size={[32, 24]} height={1}>{ duration.seconds }</App.Text>
            </App.Flex>
            <App.Text weight={600} size={[16, 12]} height={1.2}>{t('s')}</App.Text>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

export default GemsCountdown
