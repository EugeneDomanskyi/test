import { useTranslation } from 'react-i18next'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsHomeStats = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Your Daily Stats')}</App.Text>

      <App.Flex row gap={24}>
        <App.Flex row flex={1} className={styles.points}>
          <App.Flex flex={1} column gap={10} align="center" className={styles.box}>
            <App.Text center size={16} weight={600} height={1}>{t('Toptal Points')}</App.Text>
            <App.Text center size={48} weight={600} height={1}>6,253</App.Text>
          </App.Flex>

          <App.Flex column center gap={8} flex={1} className={styles.statsBox}>
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Text center weight={400} height={1} color="#A6DC37">{t('Liquidity Mining')}</App.Text>
            <App.Text center size={32} weight={600} height={1}>253</App.Text>
          </App.Flex>

          <App.Flex column center gap={8} flex={1} className={styles.statsBox}>
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Text center weight={400} height={1} color="#A6DC37">{t('Refer & Earn')}</App.Text>
            <App.Text center size={32} weight={600} height={1}>53</App.Text>
          </App.Flex>

          <App.Flex column center gap={8} flex={1} className={styles.statsBox}>
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Text center weight={400} height={1} color="#A6DC37">{t('Contributor')}</App.Text>
            <App.Text center size={32} weight={600} height={1}>625</App.Text>
          </App.Flex>

          <App.Flex column center gap={8} flex={1} className={styles.statsBox}>
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Icon icon="arrow-long" />
            <App.Text center weight={400} height={1} color="#A6DC37">{t('Third Party Quest')}</App.Text>
            <App.Text center size={32} weight={600} height={1}>625</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex width={180} column gap={8} align="center" className={styles.box}>
          <App.Text center weight={600} height={1}>{t('Your Points Share')}</App.Text>
          <App.Text center size={32} weight={600} height={1}>10%</App.Text>
          <App.Text center size={12} weight={400} height={1}>{t('Your Points ÷ Total Points')}</App.Text>
        </App.Flex>

        <App.Flex width={180} column align="center" justify="space-between" className={styles.box}>
          <App.Text center weight={600} height={1}>{t('Live Earnings')}</App.Text>
          <App.Text center size={32} weight={600} height={1}>2,363 <App.Text center inline size={16} weight={600} height={1}>USDT</App.Text></App.Text>
          <App.Text center size={12} weight={400} height={1}>{t('Yours Share × Total Drop')}</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsHomeStats