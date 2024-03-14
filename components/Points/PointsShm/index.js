import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsShm = () => {
  const { t } = useTranslation()

  return (
    <App.Flex column fullWidth gap={40}>
      <App.Flex row wrap gap={30}>
        <App.Flex column gap={16} className={styles.shmBox}>
          <App.Flex className={cn(styles.shmImage, styles.gold)}>
            <App.Flex center className={styles.shmSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={38} sx={{ padding: '0 16px'}}>
            <App.Flex column gap={8}>
              <App.Text size={32} weight={700} color="#574E74"><App.Text inline italic size={32} weight={700} color="#574E74" family="Playfair Display">{t('Gold')}</App.Text> {t('Lootbox')}</App.Text>

              <App.Flex height={60}>
                <App.Text color="#9B99AE">{t('The pinnacle of your points pursuit. Packed with premium rewards, this loot box is your ticket to the most exclusive assets in the Tegro realm.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row align="center" gap={12}>
              <App.Flex center gap={24} row className={styles.chest}>
                <App.Icon icon="chest" />
                <App.Text color="#9B99AE" height={1}>1</App.Text>
              </App.Flex>

              <App.Flex center row flex={1} className={styles.buy}>
                <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.shmBox}>
          <App.Flex className={cn(styles.shmImage, styles.silver)}>
            <App.Flex center className={styles.shmSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={38} sx={{ padding: '0 16px'}}>
            <App.Flex column gap={8}>
              <App.Text size={32} weight={700} color="#574E74"><App.Text inline italic size={32} weight={700} color="#574E74" family="Playfair Display">{t('Silver')}</App.Text> {t('Lootbox')}</App.Text>

              <App.Flex height={60}>
                <App.Text color="#9B99AE">{t('Silver-tier treasures beckon. A balanced blend of utility and uniqueness to augment your digital collection.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row align="center" gap={12}>
              <App.Flex center gap={24} row className={styles.chest}>
                <App.Icon icon="chest" />
                <App.Text color="#9B99AE" height={1}>1</App.Text>
              </App.Flex>

              <App.Flex center row flex={1} className={styles.buy}>
                <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={16} className={styles.shmBox}>
          <App.Flex className={cn(styles.shmImage, styles.bronze)}>
            <App.Flex center className={styles.shmSoon}>
              <App.Text italic size={20} weight={700} family="Playfair Display" color="#9B99AE">{t('Soon')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={38} sx={{ padding: '0 16px'}}>
            <App.Flex column gap={8}>
              <App.Text size={32} weight={700} color="#574E74"><App.Text inline italic size={32} weight={700} color="#574E74" family="Playfair Display">{t('Bronze')}</App.Text> {t('Lootbox')}</App.Text>

              <App.Flex height={60}>
                <App.Text color="#9B99AE">{t('Begin your bounty hunt with Bronze. A solid start to stoke your enthusiasm for whatʼs to come.')}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex row align="center" gap={12}>
              <App.Flex center gap={24} row className={styles.chest}>
                <App.Icon icon="chest" />
                <App.Text color="#9B99AE" height={1}>1</App.Text>
              </App.Flex>

              <App.Flex center row flex={1} className={styles.buy}>
                <App.Text size={16} weight={600} color="#9B99AE">{t('Buy')}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsShm