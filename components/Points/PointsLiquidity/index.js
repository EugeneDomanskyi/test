import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import PointsLiquidityOrders from '@/components/Points/PointsLiquidityOrders'

import styles from './styles.module.scss'

const PointsLiquidity = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column fullWidth gap={32} className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex className={styles.banner}>
            <App.Text weight={600} color="#A6DC37">{t('Want a bot 24x7 mines liquidity! Check this out')}</App.Text>
          </App.Flex>

          <App.Flex align="center" row gap={24}>
            <App.Flex column align="flex-start" flex={1} gap={12}>
              <App.Text size={20} weight={600} height={1}>{t('Liquidity Mining')}</App.Text>
              <App.Text size={14} weight={400} color="#FFFFFF99">{t('Earn points every minute that order lives on the orderbook based on the order size.')}</App.Text>
              <App.Button primary2>{t('Increase Liquidity')} <App.Icon icon="arrow-45" /></App.Button>
            </App.Flex>

            <App.Flex column center width={180} height={80} gap={8} className={styles.box}>
              <App.Text size={14} weight={400}>{t('Total Open Orders')}</App.Text>
              <App.Text size={32} weight={600} height={1}>5,431</App.Text>
            </App.Flex>

            <App.Flex column center width={180} height={80} gap={8} className={styles.box}>
              <App.Text size={14} weight={400}>{t('Total liquidity provided')}</App.Text>
              <App.Text size={32} weight={600} height={1}>500 <App.Text inline size={14} weight={600} height={1}>USDT</App.Text></App.Text>
            </App.Flex>

            <App.Flex column center width={180} height={80} gap={8} className={styles.box}>
              <App.Text size={14} weight={400}>{t('Points earned today')}</App.Text>
              <App.Text size={32} weight={600} height={1}>46,915</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>

      <div className={styles.line} />

      <App.Container maxWidth={1230}>
        <PointsLiquidityOrders />
      </App.Container>
    </App.Flex>
  )
}

export default PointsLiquidity