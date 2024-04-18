import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsHomeLeaderboard = () => {
  const { t } = useTranslation()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [tab, setTab] = useState('daily')

  const tabs = [
    { title: t(`Daily${isMobile ? '' : ' leaderboard'}`), key: 'daily' },
    { title: t(`Cumulative${isMobile ? '' : ' leaderboard'}`), key: 'cumulative' },
  ]

  const handleTab = (value) => {
    setTab(value)
  }

  const getColor = (position, reward) => {
    switch (position) {
      case 1: return '#E3A951'
      case 2: return '#D3D3D3'
      case 3: return '#DC7225'
      default: return reward ? '#7364FF' : '#9281C5'
    }
  }

  const getShort = (address) => {
    const n = isMobile ? 4 : 8
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Leaderboard')}</App.Text>

      <App.Flex column>
        <App.Tabs active={tab} options={tabs} variant="points" onChange={handleTab} />

        <App.Flex row>
          <App.Flex className={styles.gradient} />

          <App.Flex width={[92, 44]} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('№')}</App.Text>
          </App.Flex>

          <App.Flex width={[200, 80]} align="center">
            <App.Text weight={600} height={1} color="#A6DC37">{t(`Wallet${isMobile ? '' : ' Address'}`)}</App.Text>
          </App.Flex>

          <App.Flex width={['auto', 56]} flex={[1, null]} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t(`Points${isMobile ? '' : ' Earned'}`)}</App.Text>
          </App.Flex>

          <App.Flex width={['auto', 64]} flex={[1, null]} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Share %')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Reward')}</App.Text>
          </App.Flex>

          <App.Flex className={styles.gradient} />
        </App.Flex>

        <App.Flex column className={styles.table}>
          <App.Flex row className={styles.row}>
            <App.Flex width={[92, 44]} center>
              <svg width={isMobile ? 24 : 44} height={isMobile ? 24 : 44} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path stroke={getColor(1, 200)} d="M20.3335 1.32781C21.1453 0.147992 22.8876 0.147992 23.6995 1.32781C24.6494 2.70814 26.5364 3.06089 27.9207 2.11689C29.104 1.31002 30.7286 1.93942 31.0595 3.33285C31.4465 4.9631 33.0787 5.97369 34.7106 5.59352C36.1054 5.26858 37.393 6.44237 37.1981 7.86121C36.9701 9.52121 38.127 11.0532 39.786 11.2882C41.204 11.489 41.9807 13.0487 41.2864 14.3013C40.4742 15.7669 40.9995 17.6133 42.4616 18.4317C43.7113 19.1313 43.8721 20.8662 42.7722 21.7834C41.4854 22.8566 41.3083 24.7681 42.376 26.0594C43.2886 27.1632 42.8118 28.839 41.4548 29.297C39.8672 29.8328 39.0115 31.5513 39.5406 33.1411C39.9929 34.5 38.9429 35.8904 37.5121 35.8273C35.8382 35.7534 34.4195 37.0467 34.3386 38.7203C34.2694 40.1508 32.7881 41.0681 31.4767 40.4923C29.9425 39.8188 28.1524 40.5123 27.4724 42.0436C26.8911 43.3525 25.1785 43.6727 24.1636 42.6621C22.9763 41.4799 21.0566 41.4799 19.8693 42.6621C18.8545 43.6727 17.1418 43.3525 16.5606 42.0436C15.8805 40.5123 14.0905 39.8188 12.5562 40.4923C11.2449 41.0681 9.76353 40.1508 9.69436 38.7203C9.61343 37.0467 8.19476 35.7534 6.52081 35.8273C5.09004 35.8904 4.04006 34.5 4.49231 33.1411C5.02143 31.5513 4.16575 29.8328 2.57816 29.297C1.22121 28.839 0.744403 27.1632 1.657 26.0594C2.72471 24.7681 2.54758 22.8566 1.26077 21.7834C0.160898 20.8662 0.321658 19.1313 1.57135 18.4317C3.03344 17.6133 3.55879 15.7669 2.74655 14.3013C2.0523 13.0487 2.82892 11.489 4.24693 11.2882C5.90594 11.0532 7.06282 9.5212 6.83484 7.86121C6.63998 6.44237 7.92757 5.26858 9.32238 5.59352C10.9543 5.97369 12.5864 4.9631 12.9735 3.33285C13.3043 1.93942 14.929 1.31002 16.1122 2.11689C17.4966 3.06089 19.3836 2.70814 20.3335 1.32781Z" />
              </svg>
              <App.Text color={getColor(1, 200)} size={[16, 14]} weight={600} sx={{position: 'absolute'}}>1</App.Text>
            </App.Flex>

            <App.Flex width={[200, 80]} align="center">
              <App.Text size={[16, 14]} weight={[600, 400]} height={1}>{getShort('0xa9aFbdAc88f12a704EE328B5D40ac44a47Bb3074')}</App.Text>
            </App.Flex>

            <App.Flex width={['auto', 56]} flex={[1, null]} center>
              <App.Text center size={[16, 14]} weight={[600, 400]} height={1}>512</App.Text>
            </App.Flex>

            <App.Flex width={['auto', 64]} flex={[1, null]} center>
              <App.Text center size={[16, 14]} weight={[600, 400]} height={1}>51%</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={[16, 14]} weight={[600, 400]} height={1}>500 USDT</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row className={styles.row}>
            <App.Flex width={[92, 44]} center>
              <svg width={isMobile ? 24 : 44} height={isMobile ? 24 : 44} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path stroke={getColor(1, 200)} d="M20.3335 1.32781C21.1453 0.147992 22.8876 0.147992 23.6995 1.32781C24.6494 2.70814 26.5364 3.06089 27.9207 2.11689C29.104 1.31002 30.7286 1.93942 31.0595 3.33285C31.4465 4.9631 33.0787 5.97369 34.7106 5.59352C36.1054 5.26858 37.393 6.44237 37.1981 7.86121C36.9701 9.52121 38.127 11.0532 39.786 11.2882C41.204 11.489 41.9807 13.0487 41.2864 14.3013C40.4742 15.7669 40.9995 17.6133 42.4616 18.4317C43.7113 19.1313 43.8721 20.8662 42.7722 21.7834C41.4854 22.8566 41.3083 24.7681 42.376 26.0594C43.2886 27.1632 42.8118 28.839 41.4548 29.297C39.8672 29.8328 39.0115 31.5513 39.5406 33.1411C39.9929 34.5 38.9429 35.8904 37.5121 35.8273C35.8382 35.7534 34.4195 37.0467 34.3386 38.7203C34.2694 40.1508 32.7881 41.0681 31.4767 40.4923C29.9425 39.8188 28.1524 40.5123 27.4724 42.0436C26.8911 43.3525 25.1785 43.6727 24.1636 42.6621C22.9763 41.4799 21.0566 41.4799 19.8693 42.6621C18.8545 43.6727 17.1418 43.3525 16.5606 42.0436C15.8805 40.5123 14.0905 39.8188 12.5562 40.4923C11.2449 41.0681 9.76353 40.1508 9.69436 38.7203C9.61343 37.0467 8.19476 35.7534 6.52081 35.8273C5.09004 35.8904 4.04006 34.5 4.49231 33.1411C5.02143 31.5513 4.16575 29.8328 2.57816 29.297C1.22121 28.839 0.744403 27.1632 1.657 26.0594C2.72471 24.7681 2.54758 22.8566 1.26077 21.7834C0.160898 20.8662 0.321658 19.1313 1.57135 18.4317C3.03344 17.6133 3.55879 15.7669 2.74655 14.3013C2.0523 13.0487 2.82892 11.489 4.24693 11.2882C5.90594 11.0532 7.06282 9.5212 6.83484 7.86121C6.63998 6.44237 7.92757 5.26858 9.32238 5.59352C10.9543 5.97369 12.5864 4.9631 12.9735 3.33285C13.3043 1.93942 14.929 1.31002 16.1122 2.11689C17.4966 3.06089 19.3836 2.70814 20.3335 1.32781Z" />
              </svg>
              <App.Text color={getColor(1, 200)} size={[16, 14]} weight={600} sx={{position: 'absolute'}}>1</App.Text>
            </App.Flex>

            <App.Flex width={[200, 80]} align="center">
              <App.Text size={[16, 14]} weight={[600, 400]} height={1}>{getShort('0xa9aFbdAc88f12a704EE328B5D40ac44a47Bb3074')}</App.Text>
            </App.Flex>

            <App.Flex width={['auto', 56]} flex={[1, null]} center>
              <App.Text center size={[16, 14]} weight={[600, 400]} height={1}>512</App.Text>
            </App.Flex>

            <App.Flex width={['auto', 64]} flex={[1, null]} center>
              <App.Text center size={[16, 14]} weight={[600, 400]} height={1}>51%</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={[16, 14]} weight={[600, 400]} height={1}>500 USDT</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsHomeLeaderboard