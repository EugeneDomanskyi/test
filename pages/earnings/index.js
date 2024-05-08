import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import App from '@/components/App'

import styles from './styles.module.scss'

const Earnings = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { wallet, connection } = useWagmiHelper()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!connection.loading) {
      if (connection.connected) {
        setLoading(false)
      } else {
        router.replace('/points-dashboard')
      }
    }
  }, [connection])

  const getShort = (address) => {
    const n = isMobile ? 4 : 8
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      {loading ? (
        <App.LoaderBlock height={300} />
      ) : (
        <App.Flex column fullWidth gap={32}>
          <App.Container maxWidth={1230}>
            <App.Flex direction={['row', 'column']} gap={16} justify="space-between">
              <App.Flex column gap={16} align={['flex-start', 'stretch']}>
                <App.Text size={[24, 20]} weight={600} height={1}>{t('My Earnings')}</App.Text>
                <App.Text weight={400} height={1.4} color="#FFFFFF99">{t('Earn points every minute that order lives on the orderbook based on the order size.')}</App.Text>
                <App.Button primary2>{t('Share Your Progress')} <App.Icon icon="arrow-45" /></App.Button>
              </App.Flex>

              <App.Flex row gap={24}>
                <App.Flex column width={[200, 'auto']} flex={[null, 1]} justify="center" align={['flex-start', 'center']} gap={[12, 8]} className={styles.box}>
                  <App.Text size={[14, 12]} weight={400} height={1}>{t('Total Earnings')}</App.Text>
                  <App.Text size={[48, 24]} weight={600} height={1}>500 <App.Text inline weight={600} height={1}>USDT</App.Text></App.Text>
                </App.Flex>

                <App.Flex column width={[200, 'auto']} flex={[null, 1]} justify="center" align={['flex-start', 'center']} gap={[12, 8]} className={styles.box}>
                  <App.Text size={[14, 12]} weight={400} height={1}>{t('Points earned')}</App.Text>
                  <App.Text size={[48, 24]} weight={600} height={1}>46,915</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Container>

          <div className={styles.line} />

          <App.Container maxWidth={1230}>
            <App.Flex column className={styles.table}>
              <App.Flex row className={styles.row}>
                {!isMobile ? (
                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1} color="#A6DC37">{t('Date')}</App.Text>
                  </App.Flex>
                ) : null}

                <App.Flex flex={1} center>
                  <App.Text center weight={600} height={1} color="#A6DC37">{t('Points Earned')}</App.Text>
                </App.Flex>

                <App.Flex flex={1} center>
                  <App.Text center weight={600} height={1} color="#A6DC37">{t('Share %')}</App.Text>
                </App.Flex>

                <App.Flex flex={1} center>
                  <App.Text center weight={600} height={1} color="#A6DC37">{t('Reward')}</App.Text>
                </App.Flex>

                <App.Flex width={[200, 'auto']} flex={[null, 1]} center>
                  <App.Text center weight={600} height={1} color="#A6DC37">{t(isMobile ? 'Trans. Details' : 'Transaction Details')}</App.Text>
                </App.Flex>

                {!isMobile ? (
                  <App.Flex width={200} center>
                    <App.Text center weight={600} height={1} color="#A6DC37">{t('Claim')}</App.Text>
                  </App.Flex>
                ) : null}
              </App.Flex>

              <App.Flex column>
                <App.Flex row className={styles.row}>
                  {!isMobile ? (
                    <App.Flex flex={1} center>
                      <App.Text center weight={600} height={1}>01-04-2024</App.Text>
                    </App.Flex>
                  ) : null}

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>512</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>5%</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>4 USDT</App.Text>
                  </App.Flex>

                  <App.Flex width={[200, 'auto']} flex={[null, 1]} center>
                    <App.Text center weight={600} height={1}>{getShort('0xa9aFbdAc88f12a704EE328B5D40ac44a47Bb3074')}</App.Text>
                  </App.Flex>
                  
                  {!isMobile ? (
                    <App.Flex width={200} center>
                      <App.Button secondary2 outlined sx={{ width: 160 }}>{t('Claim')} <App.Icon icon="arrow-45" /></App.Button>
                    </App.Flex>
                  ) : null}
                </App.Flex>

                <App.Flex row className={styles.row}>
                  {!isMobile ? (
                    <App.Flex flex={1} center>
                      <App.Text center weight={600} height={1}>01-04-2024</App.Text>
                    </App.Flex>
                  ) : null}

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>512</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>5%</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>4 USDT</App.Text>
                  </App.Flex>

                  <App.Flex width={[200, 'auto']} flex={[null, 1]} center>
                    <App.Text center weight={600} height={1}>{getShort('0xa9aFbdAc88f12a704EE328B5D40ac44a47Bb3074')}</App.Text>
                  </App.Flex>
                  
                  {!isMobile ? (
                    <App.Flex width={200} center>
                      <App.Button secondary2 outlined sx={{ width: 160 }}>{t('Claim')} <App.Icon icon="arrow-45" /></App.Button>
                    </App.Flex>
                  ) : null}
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Container>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default Earnings