import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const PointsLiquidityOrders = () => {
  const { t } = useTranslation()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [tab, setTab] = useState('open')

  const tabs = [
    { title: t('Open Orders'), key: 'open' },
    { title: t('Completed Orders'), key: 'completed' },
  ]

  const handleTab = (value) => {
    setTab(value)
  }

  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text size={20} weight={600} height={1}>{t('Your Stats')}</App.Text>

      <App.Flex column>
        <App.Tabs active={tab} options={tabs} variant="points" onChange={handleTab} />

        <App.Flex row>
          <App.Flex className={styles.gradient} />

          <App.Flex width={220} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Date')}</App.Text>
          </App.Flex>

          <App.Flex width={180} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Market')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Order Size')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Price')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} row gap={4} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Price Deviation')}</App.Text>
            <App.Icon icon="warning-circle" />
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Point Per Minute')}</App.Text>
          </App.Flex>

          <App.Flex flex={1} center>
            <App.Text center weight={600} height={1} color="#A6DC37">{t('Total Reward Earned')}</App.Text>
          </App.Flex>

          <App.Flex className={styles.gradient} />
        </App.Flex>

        <App.Flex column className={styles.table}>
          <App.Flex row className={styles.row}>
            <App.Flex width={220} center>
              <App.Text center weight={600} height={1}>01-04-2024 10:15:01 AM +UTC</App.Text>
            </App.Flex>

            <App.Flex width={180} column gap={4} center>
              <App.Flex row center gap={6}>
                <App.Flex center sx={{ position: 'relative' }}>
                  <Image src="https://storage.googleapis.com/token-assets/assets/mumbai/0x6464e14854d58feb60e130873329d77fcd2d8eb7.png" width={24} height={24} alt="" />
                  <App.Flex center sx={{ position: 'absolute', top: 0, left: -6, }}>
                    <Image src="/images/icon-mumbai.png" width={12} height={12} alt="" />
                  </App.Flex>
                </App.Flex>
                <App.Text center size={16} weight={600} height={1}>KRYPTONITE</App.Text>
              </App.Flex>

              <App.Text center size={10} weight={400} height={1} color="#FFFFFF99">Mid price - 3.58 USDT</App.Text>
            </App.Flex>

            <App.Flex flex={1} column center>
              <App.Text center size={16} weight={600} height={1}>512</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>4 USDT</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>5%</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>51</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>512</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row className={styles.row}>
            <App.Flex width={220} center>
              <App.Text center weight={600} height={1}>01-04-2024 10:15:01 AM +UTC</App.Text>
            </App.Flex>

            <App.Flex width={180} column gap={4} center>
              <App.Flex row center gap={6}>
                <App.Flex center sx={{ position: 'relative' }}>
                  <Image src="https://storage.googleapis.com/token-assets/assets/mumbai/0x6464e14854d58feb60e130873329d77fcd2d8eb7.png" width={24} height={24} alt="" />
                  <App.Flex center sx={{ position: 'absolute', top: 0, left: -6, }}>
                    <Image src="/images/icon-mumbai.png" width={12} height={12} alt="" />
                  </App.Flex>
                </App.Flex>
                <App.Text center size={16} weight={600} height={1}>KRYPTONITE</App.Text>
              </App.Flex>

              <App.Text center size={10} weight={400} height={1} color="#FFFFFF99">Mid price - 3.58 USDT</App.Text>
            </App.Flex>

            <App.Flex flex={1} column center>
              <App.Text center size={16} weight={600} height={1}>512</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>4 USDT</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>5%</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>51</App.Text>
            </App.Flex>

            <App.Flex flex={1} center>
              <App.Text center size={16} weight={600} height={1}>512</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default PointsLiquidityOrders