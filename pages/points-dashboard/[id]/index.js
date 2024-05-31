import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import cn from 'classnames'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $point from '@/store/point'

import App from '@/components/App'

import styles from './styles.module.scss'
import AuctionImage from '@/components/Auction/AuctionImage'
import AuctionButton from '@/components/Auction/AuctionButton'

const PointsAuctionInfo = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query

  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const stats = useSelector(({ $point }) => $point.stats)

  const [item, setItem] = useState(null)

  useEffect(() => {
    if (id && wallet) {
      fetchInfo()
    }
  }, [id, wallet])

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

  const fetchInfo = () => {
    setItem({
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
    })
  }

  const handleBack = () => {
    router.push(`/points-dashboard`)
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
        <App.Flex column gap={32}>
          <App.Flex fullWidth row align="center">
            <App.Flex row sx={{ cursor: 'pointer' }} onClick={handleBack}>
              <App.Text weight={600}>&lt; Back</App.Text>
            </App.Flex>
          </App.Flex>

          {item && item.status != 'upcoming' ? (
            <App.Flex fullWidth column gap={16}>
              {item.status == 'closed' ? (
                <App.Flex align="center" height={56}>
                  <App.Text size={24} weight={600} height={1}>{t('History')}</App.Text>
                </App.Flex>
              ) : (
                <App.Flex center height={56} gap={16} className={styles.points}>
                  <App.Text size={16} weight={600} height={1}>{t('Points Balance')}</App.Text>
                  <App.Text size={28} weight={600} height={1}>{stats.total_points}</App.Text>
                </App.Flex>
              )}

              <App.Flex row gap={24}>
                <App.Flex column gap={16} width={384}>
                  <AuctionImage item={item} large />

                  <App.Text nowrap size={20} weight={600} height={1}>{item.name}</App.Text>

                  {item.description ? (
                    <App.Text size={14} weight={400} color="#9B99AE">{item.description}</App.Text>
                  ) : null}

                  <App.Text size={24} weight={600} color={item.status == 'closed' && item.current ? '#53F19C' : '#fff'}>{item.currentPrice} {item.currency}</App.Text>

                  {item.status == 'closed' && item.current ? (
                    <App.Flex fullWidth center height={30} className={styles.badge}>
                      <App.Text size={16} weight={400} height={1} color="#53F19C">{t('You won the auction!')}</App.Text>
                    </App.Flex>
                  ) : null}

                  {item.status != 'closed' || (item.status == 'closed' && item.current) ? (
                    <AuctionButton item={item} />
                  ) : null}

                  <App.Flex fullWidth center>
                    <App.Text size={14} weight={400} color="#FFFFFF99">ID: {item.id}</App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex column gap={24} flex={1}>
                  <App.Flex column gap={24} className={styles.box}>
                    <App.Flex row align="center" justify="space-between">
                      <App.Text size={14} weight={600} color="#FFFFFF99" height={1}>{t(item.status == 'closed' ? 'Winning Bid' : 'Current Bid')}</App.Text>
                      <App.Text size={32} weight={600} height={1} color={item.status == 'closed' && item.current ? '#53F19C' : '#fff'}>{item.currentPrice} {item.currency}</App.Text>
                    </App.Flex>

                    <div className={styles.line} />

                    <App.Flex row align="center" justify="space-between">
                      <App.Flex row align="center" gap={12}>
                        <App.Flex center className={styles.circle}></App.Flex>

                        {item.wallet ? (
                          <App.Flex column gap={8}>
                            <App.Text size={14} weight={600} height={1} color="#FFFFFF99">{t('Bid by')}</App.Text>
                            <App.Text size={16} weight={600} height={1}>{item.wallet}</App.Text>
                          </App.Flex>
                        ) : (
                          <App.Text size={14} weight={600} height={1} color="#FFFFFF99">{t('Be the first to bid')}</App.Text>
                        )}
                      </App.Flex>
                      
                      {item.status != 'closed' ? (
                        <AuctionButton item={item} small />
                      ) : null}
                    </App.Flex>
                  </App.Flex>

                  <App.Flex column className={styles.table}>
                    <App.Flex row gap={24} className={styles.row}>
                      <App.Flex width={100} align="center">
                        <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Bid')}</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} align="center">
                        <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('User')}</App.Text>
                      </App.Flex>

                      <App.Flex width={100} align="center" justify="flex-end">
                        <App.Text right size={14} weight={600} height={1} color="#A6DC37">{t('Time')}</App.Text>
                      </App.Flex>
                    </App.Flex>

                    <App.Flex row gap={24} className={styles.row}>
                      <App.Flex width={100} align="center">
                        <App.Text size={14} weight={600} height={1}>34 USDT</App.Text>
                      </App.Flex>

                      <App.Flex flex={1} align="center">
                        <App.Text size={14} weight={600} height={1}>213sfdseae32ef923213sfdseae32ef923</App.Text>
                      </App.Flex>

                      <App.Flex width={100} align="center" justify="flex-end">
                        <App.Text right size={14} weight={600} height={1}>01-04-2024</App.Text>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          ) : null}
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsAuctionInfo