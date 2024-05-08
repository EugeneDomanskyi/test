import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $point from '@/store/point'

import App from '@/components/App'
import PointsDropsBar from '@/components/Points/PointsDropsBar'
import PointsHomeStats from '@/components/Points/PointsHomeStats'
import PointsHomeLeaderboard from '@/components/Points/PointsHomeLeaderboard'

import styles from './styles.module.scss'

const PointsHome = () => {
  const { t } = useTranslation()
  const { connection, connect, wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const statsLoading = useSelector(({ $point }) => $point.statsLoading)

  useEffect(() => {
    if (wallet) {
      fetchStats()
    }
  }, [wallet])

  const fetchStats = async () => {
    const r = await $point.api.transactions(wallet, {})
    const result = await $point.api.stats(wallet, {})
    if (result && result?.data) {
      dispatch($point.set.stats(result.data))
    }

    dispatch($point.set.statsLoading(false))
  }

  const handleConnect = () => {
    connect()
  }

  return (
    <App.Flex column fullWidth flex={1}>
      {/* <PointsDropsBar /> */}

      <App.Flex flex={!connection.loading && !connection.connected ? 1 : null}>
        {connection.loading ? (
          <App.LoaderBlock height={300} />
        ) : (
          connection.connected ? (
            <App.Flex column fullWidth className={styles.background}>
              <App.Container maxWidth={1230}>
                <PointsHomeStats />
                <PointsHomeLeaderboard />
              </App.Container>
            </App.Flex>
          ) : (
            <App.Flex column fullWidth className={styles.tiger}>
              <App.Container maxWidth={1230} height="100%">
                <App.Flex full column justify={['center', 'flex-start']}>
                  <App.Flex column align="flex-start" width={[486, 'auto']} gap={32} sx={[{ paddingBottom: 64 }, { paddingTop: 32 }]}>
                    <App.Text size={[80, 52]} weight={700} height={1}>{t('Kick-start your journey to')} <App.Text inline size={[80, 52]} weight={700} height={1} color="#A6DC37">{t('Pre-rich')}</App.Text>!</App.Text>
                    <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">{t('Collect POINTS on every action, order, and referral you make on Tegro. Get in early, start collecting, and keep your eyes peeled — because we’re just getting started.')}</App.Text>
                    <App.Button secondary2 onClick={handleConnect}>{t('Connect wallet')}</App.Button>
                  </App.Flex>
                </App.Flex>
              </App.Container>
            </App.Flex>
          )
        )}
      </App.Flex>
    </App.Flex>
  )
}

export default PointsHome