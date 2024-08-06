import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import useCountdown from '@/myhooks/useCountdown'

const AuctionCountdown = ({ v2, time, hideSeconds }) => {
  const { t } = useTranslation()

  const duration = useCountdown(time)

  return (
    <App.Flex align="center" gap={2}>
      <App.Flex width={v2 ? [52, 37] : 30} justify={'flex-end'}>
        <App.Text size={v2 ? [40, 28] : 14} weight={v2 ? 700 : 400} height={1} color={v2 ? '#FF1D61' : '#fff'}>{duration.days * 1}{t('D')}</App.Text>
      </App.Flex>

      <App.Text size={v2 ? [40, 28] : 14} weight={v2 ? 700 : 400} height={1} color={v2 ? '#FF1D61' : '#fff'}>:</App.Text>

      <App.Flex width={v2 ? [78, 54] : 30} justify={'flex-end'}>
        <App.Text size={v2 ? [40, 28] : 14} weight={v2 ? 700 : 400} height={1} color={v2 ? '#FF1D61' : '#fff'}>{duration.hours}{t('H')}</App.Text>
      </App.Flex>

      <App.Text size={v2 ? [40, 28] : 14} weight={v2 ? 700 : 400} height={1} color={v2 ? '#FF1D61' : '#fff'}>:</App.Text>

      <App.Flex width={v2 ? [84, 59] : 30} justify={'flex-end'}>
        <App.Text size={v2 ? [40, 28] : 14} weight={v2 ? 700 : 400} height={1} color={v2 ? '#FF1D61' : '#fff'}>{duration.minutes}{t('M')}</App.Text>
      </App.Flex>

      {!hideSeconds ? (
        <>
          <App.Text size={v2 ? [40, 28] : 14} weight={v2 ? 700 : 400} height={1} color={v2 ? '#FF1D61' : '#fff'}>:</App.Text>

          <App.Flex width={v2 ? [74, 52] : 30} justify={'flex-end'}>
            <App.Text size={v2 ? [40, 28] : 14} weight={v2 ? 700 : 400} height={1} color={v2 ? '#FF1D61' : '#fff'}>{duration.seconds}{t('S')}</App.Text>
          </App.Flex>
        </>
      ) : null}
    </App.Flex>
  )
}

export default AuctionCountdown
