import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'
import GemsDropsBar from '@/components/Gems/GemsDropsBar'
import GemsHomeStats from '@/components/Gems/GemsHomeStats'
import GemsHomeLeaderboard from '@/components/Gems/GemsHomeLeaderboard'
import GemsSteps from '@/components/Gems/GemsSteps'

import styles from './styles.module.scss'

const GemsHome = () => {
  const { t } = useTranslation()
  const { connection, connect, wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const statsLoading = useSelector(({ $gem }) => $gem.statsLoading)

  useEffect(() => {
    if (wallet) {
      fetchStats()
    }
  }, [wallet])

  const fetchStats = async () => {
    const r = await $gem.api.transactions(wallet, {})
    const result = await $gem.api.stats(wallet, {})
    if (result && result?.data) {
      dispatch($gem.set.stats(result.data))
    }

    dispatch($gem.set.statsLoading(false))
  }

  const handleConnect = () => {
    connect()
  }

  return (
    <App.Flex column fullWidth flex={1}>
      {/* <GemsDropsBar /> */}

      <App.Flex flex={!connection.loading && !connection.connected ? 1 : null}>
        {connection.loading ? (
          <App.LoaderBlock height={300} />
        ) : (
          connection.connected ? (
            <App.Flex column fullWidth className={styles.background}>
              <App.Container maxWidth={1230}>
                <GemsHomeStats />
                <GemsHomeLeaderboard />
              </App.Container>
            </App.Flex>
          ) : (
            <App.Flex column fullWidth className={styles.tiger}>
              <App.Container maxWidth={1230} height="100%" sx={{paddingBottom: 64}}>
                <App.Flex full column justify={['center', 'flex-start']} gap={16}>
                  <App.Flex column align="flex-start" width={[486, 'auto']} gap={32} sx={[{ paddingBottom: 32 }, { paddingTop: 32 }]}>
                    <App.Text size={[80, 52]} weight={700} height={1}>{t('Kick-start your journey to')} <App.Text inline size={[80, 52]} weight={700} height={1} color="#A6DC37">{t('Pre-rich')}</App.Text>!</App.Text>
                    <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">{t('Collect GEMS on every action, order, and referral you make on Tegro. Get in early, start collecting, and keep your eyes peeled — because we’re just getting started.')}</App.Text>
                    <App.Button secondary2 onClick={handleConnect}>{t('Connect wallet')}</App.Button>
                  </App.Flex>
                  
                  <GemsSteps />
                </App.Flex>
              </App.Container>
            </App.Flex>
          )
        )}
      </App.Flex>
    </App.Flex>
  )
}

export default GemsHome