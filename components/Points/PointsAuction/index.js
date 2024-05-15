import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $point from '@/store/point'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'

const PointsAuction = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const stats = useSelector(({ $point }) => $point.stats)

  const items = [
    {
      id: 1,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'ongoing',
      current: null,
      wallet: null,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 5 * 60 * 1000,
      startsIn: moment().add(5, 'days').valueOf(),
    }, {
      id: 2,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'closed',
      current: true,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 5 * 60 * 1000,
      startsIn: moment().add(5, 'days').valueOf(),
    }, {
      id: 3,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'ongoing',
      current: false,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 5 * 60 * 1000,
      startsIn: moment().add(5, 'days').valueOf(),
      updated: true,
    }, {
      id: 4,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'ongoing',
      current: false,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 1 * 14 * 1000,
      startsIn: moment().add(5, 'days').valueOf(),
    }, {
      id: 5,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'ongoing',
      current: true,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 1 * 4 * 1000,
      startsIn: moment().add(5, 'days').valueOf(),
    }, {
      id: 6,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'ongoing',
      current: true,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 1 * 14 * 1000,
      startsIn: moment().add(5, 'days').valueOf(),
    }, {
      id: 7,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'upcoming',
      current: true,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 5 * 60 * 1000,
      startsIn: moment().add(4, 'days').valueOf(),
    }, {
      id: 8,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'closed',
      current: false,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 5 * 60 * 1000,
      startsIn: moment().add(4, 'days').valueOf(),
    }
  ]

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
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
      <App.Flex column fullWidth flex={1} gap={32}>
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
          {items.length ? (
            items.map(item => <AuctionItem key={item.id} item={item} />)
          ) : null}
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default PointsAuction