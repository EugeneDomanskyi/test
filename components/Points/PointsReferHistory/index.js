import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import moment from 'moment'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsReferHistory = () => {
  const { t } = useTranslation()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referrals = useSelector(({ $point }) => $point.referrals)

  const getShort = (address) => {
    const n = isMobile ? 4 : 8
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Flex column>
        <App.Text size={20} weight={600} height={1}>{t('Referral History')}</App.Text>
        <App.Text size={12} color="#9b99ae">{t('Points will be added every 12 hours')}</App.Text>
      </App.Flex>

      <App.Flex column className={styles.table}>
        <App.Flex row className={styles.row}>
          <App.Flex flex={1} align="center" justify={['center', 'flex-start']} sx={{paddingLeft: 8}}>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Wallet')}</App.Text>
          </App.Flex>

          {!isMobile ? (
            <App.Flex flex={1} center>
              <App.Text center weight={600} height={1} color="#A6DC37">{t('Date Referred')}</App.Text>
            </App.Flex>
          ) : null}

          <App.Flex flex={1} align="center" justify={['center', 'flex-end']} sx={{paddingRight: 8}}>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Points Earned')}</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column>
          {referrals.length ? (
            referrals.map((item, index) => (
              <App.Flex key={index} row className={styles.row}>
                <App.Flex column gap={4} flex={1} justify="center" align={['center', 'flex-start']} sx={{paddingLeft: 8}}>
                  <App.Text center={!isMobile} weight={[600, 400]} height={1}>{getShort(item.wallet_address)}</App.Text>
                  {isMobile ? (
                    <App.Text size={12} weight={500} height={1} color="#9B99AE">{moment(item.created_at).format('DD-MM-YYYY')}</App.Text>
                  ) : null}
                </App.Flex>

                {!isMobile ? (
                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>{moment(item.created_at).format('DD-MM-YYYY')}</App.Text>
                  </App.Flex>
                ) : null}
                
                <App.Flex flex={1} align="center" justify={['center', 'flex-end']} sx={{paddingRight: 8}}>
                  <App.Text center weight={[600, 400]} height={1}>{item.points} Points</App.Text>
                </App.Flex>
              </App.Flex>
            ))
          ) : (
            <App.Flex center height={200}>
              <App.Text>{t('There is no data yet')}</App.Text>
            </App.Flex>
          )}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsReferHistory