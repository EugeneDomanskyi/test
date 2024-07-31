import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import AuctionItemNotify from '@/components/Auction/AuctionItemNotify'

import styles from './styles.module.scss'

const GemsAuctionNotify = () => {
  const { t } = useTranslation()
  const referral = useSelector(({ $gem }) => $gem.referral)

  return (
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
      <App.Flex column fullWidth flex={1} gap={16}>
        <App.Flex direction={['row', 'column']} align={['center', 'stretch']} justify="space-between" gap={[0, 16]}>
          <App.Flex row align="center" order={[0, 1]} gap={24}>
            <App.Flex row center gap={16} className={styles.frame} flex={[null, 1]}>
              <App.Text size={[28, 14]} weight={600} height={1}>{t('Gems')} {referral.points ?? 0}</App.Text>
              <App.Tooltip variant="v2" text={'Earn gems for Connecting your wallet, trading and completing quests on Tegro. Learn More'} placement="bottom">
                <App.Icon icon="info2" />
              </App.Tooltip>
            </App.Flex>

            <App.Flex row center gap={16} className={styles.frame} flex={[null, 1]}>
              <App.Text size={[24, 14]} weight={600} height={1}>{t('100 Gems = 1 Bid')}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <AuctionItemNotify />
      </App.Flex>
    </App.Container>
  )
}

export default GemsAuctionNotify