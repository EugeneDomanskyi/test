import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const TournamentCountdown = ({ endTime, small, alternate, hideSeconds, color = '#A6DC37' }) => {
  const { t } = useTranslation()

  const duration = useCountdown(endTime, alternate)

  return (
      <App.Flex align="center" gap={small ? 4 : 8}>
        <App.Flex align={'flex-end'}>
          <App.Flex width={small ? [34, 24] : 48}>
            <App.Text weight={600} size={small ? [28, 20] : 40} height={1}>{ duration.days }</App.Text>
          </App.Flex>
          <App.Text weight={700} family="Playfair Display" italic color={color} size={small ? 16 : 24} height={1.2}>{t('d')}</App.Text>
        </App.Flex>

        <App.Text weight={300} size={24} color="#9B99AE" height={1}>:</App.Text>

        <App.Flex align={'flex-end'}>
          <App.Flex width={small ? [34, 24] : 48}>
            <App.Text weight={600} size={small ? [28, 20] : 40} height={1}>{ duration.hours }</App.Text>
          </App.Flex>
          <App.Text weight={700} family="Playfair Display" italic color={color} size={small ? 16 : 24} height={1.2}>{t('h')}</App.Text>
        </App.Flex>

        <App.Text weight={300} size={24} color="#9B99AE" height={1}>:</App.Text>

        <App.Flex align={'flex-end'}>
          <App.Flex width={small ? [34, 24] : 48}>
            <App.Text weight={600} size={small ? [28, 20] : 40} height={1}>{ duration.minutes }</App.Text>
          </App.Flex>
          <App.Text weight={700} family="Playfair Display" italic color={color} size={small ? 16 : 24} height={1.2}>{t('m')}</App.Text>
        </App.Flex>

        {!hideSeconds ? (
          <>
            <App.Text weight={300} size={24} color="#9B99AE" height={1}>:</App.Text>

            <App.Flex align={'flex-end'}>
              <App.Flex width={small ? [34, 24] : 48}>
                <App.Text weight={600} size={small ? [28, 20] : 40} height={1}>{ duration.seconds }</App.Text>
              </App.Flex>
              <App.Text weight={700} family="Playfair Display" italic color={color} size={small ? 16 : 24} height={1.2}>{t('s')}</App.Text>
            </App.Flex>
          </>
        ) : null}
      </App.Flex>
  )
}

export default TournamentCountdown
