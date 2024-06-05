import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const AuctionCountdown = ({ time, hideSeconds }) => {
  const { t } = useTranslation()

  const duration = useCountdown(time)

  return (
    <App.Flex align="center" gap={2}>
      <App.Flex width={30} justify={'flex-end'}>
        <App.Text weight={400} height={1}>{duration.days}{t('D')}</App.Text>
      </App.Flex>

      <App.Text weight={400} height={1}>:</App.Text>

      <App.Flex width={30} justify={'flex-end'}>
        <App.Text weight={400} height={1}>{duration.hours}{t('H')}</App.Text>
      </App.Flex>

      <App.Text weight={400} height={1}>:</App.Text>

      <App.Flex width={30} justify={'flex-end'}>
        <App.Text weight={400} height={1}>{duration.minutes}{t('M')}</App.Text>
      </App.Flex>

      {!hideSeconds ? (
        <>
          <App.Text weight={400} height={1}>:</App.Text>

          <App.Flex width={30} justify={'flex-end'}>
            <App.Text weight={400} height={1}>{duration.seconds}{t('S')}</App.Text>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

export default AuctionCountdown
