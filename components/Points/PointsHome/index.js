import { useTranslation } from 'react-i18next'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import PointsDropsBar from '@/components/Points/PointsDropsBar'
import PointsHomeStats from '@/components/Points/PointsHomeStats'
import PointsHomeLeaderboard from '@/components/Points/PointsHomeLeaderboard'

import styles from './styles.module.scss'

const PointsHome = () => {
  const { t } = useTranslation()
  const { connection, connect } = useWalletConnect()

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
            <App.Flex column full className={styles.tiger}>
              <App.Container maxWidth={1230} height="100%">
                <App.Flex full column justify={['center', 'flex-start']}>
                  <App.Flex column align="flex-start" width={[486, 'auto']} gap={32} sx={[{ paddingBottom: 64 }, { paddingTop: 32 }]}>
                    <App.Text size={[80, 52]} weight={700} height={1}>{t('Start your points')} <App.Text inline size={[80, 52]} weight={700} height={1} color="#A6DC37">{t('Quest')}</App.Text></App.Text>
                    <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">{t('Join forces with fellow traders on a quest for glory and exclusive rewards. Connect your wallet to unleash the power of points and start your legendary journey.')}</App.Text>
                    <App.Button secondary2 onClick={handleConnect}>{t('Connect Wallet')}</App.Button>
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