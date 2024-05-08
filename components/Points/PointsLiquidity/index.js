import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $point from '@/store/point'

import App from '@/components/App'
import PointsLiquidityOrders from '@/components/Points/PointsLiquidityOrders'

import styles from './styles.module.scss'

const PointsLiquidity = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()
  const router = useRouter()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const liquidity = useSelector(({ $point }) => $point.liquidity)

  const [loading, setLoading] = useState(true)

  const quoteCurrency = process.env.NEXT_PUBLIC_APP_ENV == 'production' ? 'USDC' : 'USDT'

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

  const handleExchange = () => {
    router.push('/exchange')
  }

  return (
    <App.Flex column fullWidth gap={32} className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          {/* <App.Flex row className={styles.banner} align="center" justify="space-between">
            <App.Text weight={600}>{t('Launch your 24x7 mining bot in 3 clicks')}</App.Text>
            {!isMobile ? (
              <>
                <App.Flex row center gap={16}>
                  <App.Flex row center gap={8}>
                    <App.Flex center className={styles.circle}>
                      <App.Text size={12} height={1} color="#052E16">1</App.Text>
                    </App.Flex>
                    <App.Text weight={400} height={1}>{t('Connect Wallet')}</App.Text>
                  </App.Flex>

                  <App.Text weight={600} height={1} color="#A6DC37">- - - - - -</App.Text>

                  <App.Flex row center gap={8}>
                    <App.Flex center className={styles.circle}>
                      <App.Text size={12} height={1} color="#052E16">2</App.Text>
                    </App.Flex>
                    <App.Text weight={400} height={1}>{t('Launch Bot')}</App.Text>
                  </App.Flex>

                  <App.Text weight={600} height={1} color="#A6DC37">- - - - - -</App.Text>

                  <App.Flex row center gap={8}>
                    <App.Flex center className={styles.circle}>
                      <App.Text size={12} height={1} color="#052E16">3</App.Text>
                    </App.Flex>
                    <App.Text weight={400} height={1}>{t('Earn USDT')}</App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Button secondary2 xs>{t('Launch Bot')} <App.Icon icon="arrow-45" color="#052E16" /></App.Button>
              </>
            ) : null}
          </App.Flex> */}

          <App.Flex direction={['row', 'column']} align="center" row gap={24}>
            <App.Flex column align="flex-start" flex={1} gap={12}>
              <App.Text size={20} weight={600} height={1}>{t('Liquidity Mining')}</App.Text>
              <App.Text size={14} weight={400} color="#FFFFFF99">{t('Earn points every minute that order lives on the orderbook based on the order size.')}</App.Text>
              <App.Button primary2 onClick={handleExchange}>{t('Create Orders')} <App.Icon icon="arrow-45" /></App.Button>
            </App.Flex>

            <App.Flex row gap={24} wrap={isMobile}>
              <App.Flex column center width={[200, 'calc(50% - 12px)']} height={[80, 62]} gap={8} className={styles.box}>
                <App.Text size={[14, 12]} weight={400}>{t('Active Orders')}</App.Text>
                {loading ? (
                  <App.Loader size={[32, 24]} />
                ) : (
                  <App.Text size={[32, 24]} weight={600} height={1}>{liquidity.total_open_orders}</App.Text>
                )}
              </App.Flex>

              <App.Flex column center width={[200, 'calc(50% - 12px)']} height={[80, 62]} gap={8} className={styles.box}>
                <App.Text size={[14, 12]} weight={400}>{t('Active Liquidity')}</App.Text>
                {loading ? (
                  <App.Loader size={[32, 24]} />
                ) : (
                  <App.Text size={[32, 24]} weight={600} height={1}>{liquidity.total_open_amount} <App.Text inline size={14} weight={600} height={1}>{quoteCurrency}</App.Text></App.Text>
                )}
              </App.Flex>

              <App.Flex column center width={[200, 'calc(50% - 12px)']} height={[80, 62]} gap={8} className={styles.box}>
                <App.Text size={[14, 12]} weight={400}>{t('Total Liquidity')}</App.Text>
                {loading ? (
                  <App.Loader size={[32, 24]} />
                ) : (
                  <App.Text size={[32, 24]} weight={600} height={1}>{liquidity.total_liquidity} <App.Text inline size={14} weight={600} height={1}>{quoteCurrency}</App.Text></App.Text>
                )}
              </App.Flex>

              <App.Flex column center width={[200, '100%']} height={[80, 62]} gap={8} className={styles.box}>
                <App.Text size={[14, 12]} weight={400}>{t('Points Earned')}</App.Text>
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