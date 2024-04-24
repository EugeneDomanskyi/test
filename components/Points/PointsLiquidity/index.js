import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useWalletConnect from '@/myhooks/wallet-connect'

import $point from '@/store/point'

import App from '@/components/App'
import PointsLiquidityOrders from '@/components/Points/PointsLiquidityOrders'

import styles from './styles.module.scss'

const PointsLiquidity = () => {
  const { t } = useTranslation()
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const liquidity = useSelector(({ $point }) => $point.liquidity)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wallet) {
      fetchLiquidity()
    }
  }, [wallet])

  const fetchLiquidity = async () => {
    const result = await $point.api.liquidity(wallet, {})
    if (result && result?.data) {
      dispatch($point.set.liquidity(result.data))
    }

    setLoading(false)
  }

  return (
    <App.Flex column fullWidth gap={32} className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex className={styles.banner}>
            <App.Text weight={600} color="#A6DC37">{t('Want a bot 24x7 mines liquidity! Check this out')}</App.Text>
          </App.Flex>

          <App.Flex direction={['row', 'column']} align="center" row gap={24}>
            <App.Flex column align="flex-start" flex={1} gap={12}>
              <App.Text size={20} weight={600} height={1}>{t('Liquidity Mining')}</App.Text>
              <App.Text size={14} weight={400} color="#FFFFFF99">{t('Earn points every minute that order lives on the orderbook based on the order size.')}</App.Text>
              <App.Button primary2>{t('Increase Liquidity')} <App.Icon icon="arrow-45" /></App.Button>
            </App.Flex>

            <App.Flex row gap={24} wrap={isMobile}>
              <App.Flex column center width={[220, 'calc(50% - 12px)']} height={[80, 62]} gap={8} className={styles.box}>
                <App.Text size={[14, 12]} weight={400}>{t('Total Open Orders')}</App.Text>
                {loading ? (
                  <App.Loader size={[32, 24]} />
                ) : (
                  <App.Text size={[32, 24]} weight={600} height={1}>{liquidity.total_open_orders}</App.Text>
                )}
              </App.Flex>

              <App.Flex column center width={[220, 'calc(50% - 12px)']} height={[80, 62]} gap={8} className={styles.box}>
                <App.Text size={[14, 12]} weight={400}>{t('Total liquidity provided')}</App.Text>
                {loading ? (
                  <App.Loader size={[32, 24]} />
                ) : (
                  <App.Text size={[32, 24]} weight={600} height={1}>{liquidity.total_liquidity} <App.Text inline size={14} weight={600} height={1}>USDT</App.Text></App.Text>
                )}
              </App.Flex>

              <App.Flex column center width={[220, '100%']} height={[80, 62]} gap={8} className={styles.box}>
                <App.Text size={[14, 12]} weight={400}>{t('Points earned today')}</App.Text>
                {loading ? (
                  <App.Loader size={[32, 24]} />
                ) : (
                  <App.Text size={[32, 24]} weight={600} height={1}>{liquidity.points_earned_today}</App.Text>
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>

      <div className={styles.line} />

      <App.Container maxWidth={1230}>
        <PointsLiquidityOrders loading={loading} />
      </App.Container>
    </App.Flex>
  )
}

export default PointsLiquidity