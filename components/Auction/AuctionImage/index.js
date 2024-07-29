import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'
import AuctionBadge from '@/components/Auction/AuctionBadge'

import styles from './styles.module.scss'

const AuctionImage = ({ item, large }) => {
  const { t } = useTranslation()

  return (
    <App.Flex column align="center" justify="space-between" className={cn(styles.itemImage, {[styles.large]: large}, {[styles.gray]: item.status == 'closed' && !item.current})} sx={{ backgroundImage: `url("${item.image}")` }}>
      <AuctionBadge status={item.status} win={item.current} />

      <App.Flex fullWidth row align="flex-end" justify="space-between" sx={{ padding: 8 }}>
        {item.logo ? (
          <Image src={item.logo} width={64} height={64} alt="" />
        ) : (
          <App.Flex />
        )}

        <App.Flex center className={styles.marketPrice}>
          <App.Text size={12} height={1}>{t('Market Price: ${{price}}', { price: item.marketPrice })}</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionImage