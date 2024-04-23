import { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useWalletConnect from '@/myhooks/wallet-connect'

import $point from '@/store/point'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsHomeStats = () => {
  const { t } = useTranslation()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const stats = useSelector(({ $point }) => $point.stats)

  const [loading, setLoading] = useState(true)

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

    setLoading(false)
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Your Stats')}</App.Text>

      {loading ? (
        <App.LoaderBlock height={110} />
      ) : (
        <App.Flex direction={['row', 'column']} gap={24}>
          <App.Flex direction={['row', 'column']} flex={1} className={styles.points}>
            <App.Flex width={[160, 'auto']} column gap={10} align="center" className={styles.box}>
              <App.Text center size={[16, 12]} weight={[600, 400]} height={1}>{t('Toptal Points')}</App.Text>
              <App.Text center size={[48, 20]} weight={600} height={1}>{stats.total_points}</App.Text>
            </App.Flex>

            <App.Flex row wrap={isMobile} flex={[1, null]}>
              <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Liquidity Mining')}</App.Text>
                <App.Text center size={[32, 24]} weight={600} height={1}>{stats.liquidity_mining}</App.Text>
              </App.Flex>

              <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Refer & Earn')}</App.Text>
                <App.Text center size={[32, 24]} weight={600} height={1}>{stats.refer}</App.Text>
              </App.Flex>

              <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Contributor')}</App.Text>
                <App.Text center size={[32, 24]} weight={600} height={1}>{stats.contributor}</App.Text>
              </App.Flex>

              <App.Flex column align={['center', 'flex-start']} justify="center" gap={8} flex={[1, null]} className={styles.statsBox}>
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Icon icon={`arrow-long${isMobile ? '-rotate' : ''}`} />
                <App.Text center size={[14, 12]} weight={400} height={1} color="#A6DC37">{t('Third Party Quest')}</App.Text>
                <App.Text center size={[32, 24]} weight={600} height={1}>{stats.quest}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex width={384} row gap={24}>
            {/* <App.Flex width={[180, 'auto']} flex={[null, 1]} column gap={8} align="center" className={styles.box}>
              <App.Text center size={[14, 12]} weight={600} height={1}>{t('Your Points Share')}</App.Text>
              <App.Text center size={[32, 24]} weight={600} height={1}>{stats.points_percentage}%</App.Text>
              <App.Text center size={12} weight={400} height={1}>{t('Your Points ÷ Total Points')}</App.Text>
            </App.Flex>

            <App.Flex width={[180, 'auto']} flex={[null, 1]} column align="center" justify="space-between" className={styles.box}>
              <App.Text center size={[14, 12]} weight={600} height={1}>{t('Live Earnings')}</App.Text>
              <App.Text center size={[32, 24]} weight={600} height={1}>{stats.points_pool} <App.Text center inline size={[16, 12]} weight={600} height={1}>USDT</App.Text></App.Text>
              <App.Text center size={12} weight={400} height={1}>{t('Yours Share × Total Drop')}</App.Text>
            </App.Flex> */}
          </App.Flex>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default PointsHomeStats