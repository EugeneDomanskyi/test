import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $point from '@/store/point'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'

import styles from './styles.module.scss'

const PointsAuction = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const stats = useSelector(({ $point }) => $point.stats)

  const item = {
    id: 1,
  }

  useEffect(() => {
    if (wallet) {
      fetchStats()
    }
  }, [wallet])

  const fetchStats = async () => {
    const result = await $point.api.stats(wallet, {})
    if (result && result?.data) {
      dispatch($point.set.stats(result.data))
    }
  }

  return (
    <App.Container maxWidth={1230}>
      <App.Flex column fullWidth flex={1}>
        <App.Flex row align="center" justify="space-between">
          <App.Flex row align="center">
            <App.Flex row center width={280} height={56} gap={16}>
              <App.Text size={16} weight={600}>{t('Points Balance')}</App.Text>
              <App.Text size={28} weight={600}>{stats.total_points}</App.Text>
            </App.Flex>

            <App.Flex row center width={280} height={56} gap={16}>
              <App.Text size={24} weight={600}>{t('1 Point = 1 Bid')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Button primary2 outlined>{t('Transaction History')}</App.Button>
        </App.Flex>

        <App.Flex row wrap gap={24}>
          <AuctionItem item={item} />
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default PointsAuction