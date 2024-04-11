import { useTranslation } from 'react-i18next'
import moment from 'moment'

import App from '@/components/App'
import PointsCountdown from '@/components/Points/PointsCountdown'

import styles from './styles.module.scss'

const PointsDropsBar = () => {
  const { t } = useTranslation()

  return (
    <App.Flex className={styles.border}>
      <App.Container maxWidth={1230}>
        <App.Flex row gap={24} align="flex-end" className={styles.container}>
          <App.Flex column gap={16} flex={65}>
            <App.Text size={20} weight={600} height={1}>{t('Today’s Metadata')}</App.Text>

            <App.Flex row gap={24} height={89}>
              <App.Flex column gap={8} className={styles.box}>
                <App.Text size={14} weight={400} height={1}>{t('Remaining time')}</App.Text>
                <PointsCountdown hideSeconds endTime={moment().add(2, 'day')} />
              </App.Flex>

              <App.Flex column gap={8} className={styles.box}>
                <App.Text size={14} weight={400} height={1}>{t('Total drop')}</App.Text>
                <App.Text size={32} weight={600} height={1}>500 <App.Text inline weight={600}>USDT</App.Text></App.Text>
              </App.Flex>

              <App.Flex column gap={8} flex={1} className={styles.box}>
                <App.Text size={14} weight={400} height={1}>{t('Participants')}</App.Text>
                <App.Text size={32} weight={600} height={1}>5,431</App.Text>
              </App.Flex>

              <App.Flex column gap={8} className={styles.box}>
                <App.Text size={14} weight={400} height={1}>{t('Total Points Earned')}</App.Text>
                <App.Text size={32} weight={600} height={1}>46,915</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={16} flex={35} className={styles.sliderContainer}>
            <App.Text size={20} weight={600} height={1}>{t('Upcoming Drops')}</App.Text>

            <App.Flex justify="center" className={styles.slider}>
              <App.Flex center className={styles.arrowLeft}>
                <App.Icon icon="chevron-slider-left" />
              </App.Flex>

              <App.Flex center className={styles.arrowRight}>
                <App.Icon icon="chevron-slider-right" />
              </App.Flex>

              <App.Flex gap={16} className={styles.sliderInner}>
                <App.Flex column center gap={8} className={styles.sliderItem}>
                  <App.Flex gap={16} center>
                    <App.Flex className={styles.badge}>
                      <App.Text size={12} weight={400} height={1} color="#A6DC37">Drop 2</App.Text>
                    </App.Flex>

                    <App.Flex className={styles.badge}>
                      <App.Text size={12} weight={400} height={1} color="#A6DC37">Tomorrow</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <App.Text size={24} weight={600} height={1}>1250 USDT</App.Text>
                </App.Flex>

                <App.Flex column center gap={8} className={styles.sliderItem}>
                  <App.Flex gap={16} center>
                    <App.Flex className={styles.badge}>
                      <App.Text size={12} weight={400} height={1} color="#A6DC37">Drop 3</App.Text>
                    </App.Flex>

                    <App.Flex className={styles.badge}>
                      <App.Text size={12} weight={400} height={1} color="#A6DC37">22.09.24</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <App.Text size={24} weight={600} height={1}>1250 USDT</App.Text>
                </App.Flex>

                <App.Flex column center gap={8} className={styles.sliderItem}>
                  <App.Flex gap={16} center>
                    <App.Flex className={styles.badge}>
                      <App.Text size={12} weight={400} height={1} color="#A6DC37">Drop 4</App.Text>
                    </App.Flex>

                    <App.Flex className={styles.badge}>
                      <App.Text size={12} weight={400} height={1} color="#A6DC37">22.09.24</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <App.Text size={24} weight={600} height={1}>1250 USDT</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PointsDropsBar