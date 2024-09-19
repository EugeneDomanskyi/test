import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'
import AuctionBadge from '@/components/Auction/AuctionBadge'

import styles from './styles.module.scss'

const AuctionImage = ({ item, large }) => {
  const { t } = useTranslation()

  return (
    <App.Flex column align="center" justify="space-between" className={cn(styles.itemImage, {[styles.large]: large}, {[styles.gray]: item.status == 'closed' && (!item.current || item.current && item.claimHash != '')})} sx={{ backgroundImage: `url("${item.image}")` }}>
      <AuctionBadge status={item.status} win={item.current && item.claimHash == ''} />

      {/* <App.Flex center className={styles.discountPrice}>
        <App.Text size={12} height={1}>{t('{{discount}}% OFF', { discount: item.discount })}</App.Text>
      </App.Flex> */}

      {item.status == 'closed' && (!item.current || item.current && item.claimHash != '') ? (
        <App.Flex column center gap={8} className={styles.star}>
          <App.Text size={18} weight={700} height={1} color="#171717"><s>${item.marketPrice}</s></App.Text>
          <App.Text size={24} weight={800} height={1} color="#FF1D61">${item.currentPrice}</App.Text>
        </App.Flex>
      ) : (
        <App.Flex center className={styles.marketPrice}>
          <App.Text size={12} height={1}>{t('Market Price: ${{price}}', { price: item.marketPrice })}</App.Text>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default AuctionImage