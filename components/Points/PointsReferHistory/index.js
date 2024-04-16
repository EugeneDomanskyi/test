import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsReferHistory = () => {
  const { t } = useTranslation()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const getShort = (address) => {
    const n = isMobile ? 4 : 8
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Referral History')}</App.Text>
      <App.Text weight={400} height={1}>{t('Every action your referrals take not only furthers their journey but also enhances yours. Witness your impact and rewards grow with each trade and milestone they achieve.')}</App.Text>

      <App.Flex column className={styles.table}>
        <App.Flex row className={styles.row}>
          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Wallet')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Date Referred')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Status')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Points Earned Today')}</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column>
          <App.Flex row className={styles.row}>
            <App.Flex flex={1} center>
              <App.Text center weight={600} height={1}>{getShort('0xa9aFbdAc88f12a704EE328B5D40ac44a47Bb3074')}</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center weight={600} height={1}>01-04-2024</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Flex className={cn(styles.badge, styles.trade)}>
                <App.Text center uppercase size={12} weight={700} height={1}>TRADED</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center weight={600} height={1}>50 Points</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row className={styles.row}>
            <App.Flex flex={1} center>
              <App.Text center weight={600} height={1}>{getShort('0xa9aFbdAc88f12a704EE328B5D40ac44a47Bb3074')}</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center weight={600} height={1}>01-04-2024</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Flex className={cn(styles.badge, styles.trade)}>
                <App.Text center uppercase size={12} weight={700} height={1}>TRADED</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center weight={600} height={1}>50 Points</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsReferHistory