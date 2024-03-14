import { useTranslation } from 'react-i18next'

import App from '@/components/App'

import styles from './styles.module.scss'
import Image from 'next/image'

const PointsQuests = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column fullWidth gap={40}>
      <App.Flex fullWidth column gap={12}>
        <App.Text size={24} weight={700}>{t('Venture Through Partner Portals')}</App.Text>
        <App.Text color="#9B99AE">{t('Engage with Tegro quests on platforms like Galxe, TaskOn, and more. Complete tasks, show your prowess, and rack up points across the Tegrosphere.')}</App.Text>
      </App.Flex>

      <App.Flex row wrap gap={30}>
        <App.Flex column gap={16} className={styles.questBox}>
          <Image src="/images/points/points-galxe-logo.png" width={44} height={44} alt="" />

          <App.Flex row align="center" gap={12}>
            <App.Text size={24} weight={700}>Campaign <App.Text inline italic size={24} weight={700} family="Playfair Display">Name</App.Text></App.Text>

            <App.Frame padding={0} radius={32} width={32} height={32} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
              <App.Flex full center>
                <App.Icon icon="arrow-45" width={16} height={16} />
              </App.Flex>
            </App.Frame>
          </App.Flex>

          <div className={styles.line} />

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#FFFFFF99">{t('Rewards')}</App.Text>

            <App.Flex row align="center" gap={8}>
              <App.Text size={24} weight={700}>1250</App.Text>
              <App.Text italic size={16} weight={700} family="Playfair Display">{t('Points')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.questBox}>
          <Image src="/images/points/points-galxe-logo.png" width={44} height={44} alt="" />

          <App.Flex row align="center" gap={12}>
            <App.Text size={24} weight={700}>Campaign <App.Text inline italic size={24} weight={700} family="Playfair Display">Name</App.Text></App.Text>

            <App.Frame padding={0} radius={32} width={32} height={32} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
              <App.Flex full center>
                <App.Icon icon="arrow-45" width={16} height={16} />
              </App.Flex>
            </App.Frame>
          </App.Flex>

          <div className={styles.line} />

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#FFFFFF99">{t('Rewards')}</App.Text>

            <App.Flex row align="center" gap={8}>
              <App.Text size={24} weight={700}>1250</App.Text>
              <App.Text italic size={16} weight={700} family="Playfair Display">{t('Points')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.questBox}>
          <Image src="/images/points/points-galxe-logo.png" width={44} height={44} alt="" />

          <App.Flex row align="center" gap={12}>
            <App.Text size={24} weight={700}>Campaign <App.Text inline italic size={24} weight={700} family="Playfair Display">Name</App.Text></App.Text>

            <App.Frame padding={0} radius={32} width={32} height={32} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
              <App.Flex full center>
                <App.Icon icon="arrow-45" width={16} height={16} />
              </App.Flex>
            </App.Frame>
          </App.Flex>

          <div className={styles.line} />

          <App.Flex row align="center" justify="space-between">
            <App.Text color="#FFFFFF99">{t('Rewards')}</App.Text>

            <App.Flex row align="center" gap={8}>
              <App.Text size={24} weight={700}>1250</App.Text>
              <App.Text italic size={16} weight={700} family="Playfair Display">{t('Points')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsQuests