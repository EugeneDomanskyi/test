import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import App from '@/components/App'
import AuctionClaim from '@/components/Auction/AuctionClaim'

import styles from './styles.module.scss'
import Image from 'next/image'

const Earnings = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { wallet, connection } = useWagmiHelper()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [loading, setLoading] = useState(true)
  const [claimDialog, setClaimDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState()

  useEffect(() => {
    if (!connection.loading) {
      if (connection.connected) {
        setLoading(false)
      } else {
        router.replace('/points-dashboard')
      }
    }
  }, [connection])

  const handleClaim = () => {
    setSelectedItem({
      id: 3,
      image: '/images/bid-image.png',
      logo: '/images/bid-collection.png',
      status: 'ongoing',
      current: false,
      wallet: wallet,
      marketPrice: 7000,
      currentPrice: 56.70,
      currency: 'USDT',
      name: 'Elemental #9045',
      time: 5 * 60 * 1000,
      startsIn: moment().add(5, 'days').valueOf(),
      updated: true,
    })
    setClaimDialog(true)
  }

  const handleClose = () => {
    setClaimDialog(false)
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      {loading ? (
        <App.LoaderBlock height={300} />
      ) : (
        <App.Flex column fullWidth gap={32}>
          <App.Container maxWidth={1230}>
            <App.Flex direction={['row', 'column']} gap={16} justify="space-between">
              <App.Flex column gap={8} align={['flex-start', 'stretch']}>
                <App.Text size={[24, 20]} weight={600} height={1}>{t('My Earnings')}</App.Text>
                <App.Text weight={400} height={1.4} color="#FFFFFF99">{t('Earn points every minute that order lives on the orderbook based on the order size.')}</App.Text>
              </App.Flex>

              <App.Button primary2 outlined>{t('Transaction History')}</App.Button>
            </App.Flex>
          </App.Container>

          <div className={styles.line} />

          <App.Container maxWidth={1230}>
            <App.Flex column className={styles.table}>
              <App.Flex row gap={24} className={styles.row}>
                <App.Flex width={50} center>
                </App.Flex>

                <App.Flex width={60} align="center">
                  <App.Text weight={600} height={1} color="#A6DC37">{t('Auction')}</App.Text>
                </App.Flex>

                <App.Flex flex={1} center>
                  <App.Text weight={600} height={1} color="#A6DC37">{t('Date')}</App.Text>
                </App.Flex>

                <App.Flex flex={1} center>
                  <App.Text center weight={600} height={1} color="#A6DC37">{t('Winning Price')}</App.Text>
                </App.Flex>

                <App.Flex flex={1} center>
                  <App.Text center weight={600} height={1} color="#A6DC37">{t('Expiry Time')}</App.Text>
                </App.Flex>

                <App.Flex width={174} center>
                  <App.Text center weight={600} height={1} color="#A6DC37">{t('Claim')}</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex column>
                <App.Flex row gap={24} className={styles.row}>
                  <App.Flex width={50} center>
                    <Image src="/images/bid-image-small.png" width={50} height={50} alt="" />
                  </App.Flex>

                  <App.Flex width={60} align="center">
                    <App.Text weight={600} height={1}>#7745</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>01-04-2024</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>56.70 USDT</App.Text>
                  </App.Flex>

                  <App.Flex flex={1} center>
                    <App.Text center weight={600} height={1}>1:00:18</App.Text>
                  </App.Flex>

                  <App.Flex width={174} center>
                    <App.Button primary2 fullWidth onClick={handleClaim}>{t('Claim')}</App.Button>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Dialog hideHeader open={claimDialog} onClose={handleClose}>
              <AuctionClaim item={selectedItem} onClose={handleClose} />
            </App.Dialog>
          </App.Container>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default Earnings