import cn from 'classnames'

import App from '@/components/App'
import BotAuctionsBadge from '@/components/Bot/BotAuctionsBadge'

import styles from './styles.module.scss'

const BotAuctionsImage = ({ item }) => {
  return (
    <App.Flex column align="center" justify="space-between" className={cn(styles.itemImage, {[styles.gray]: item.status == 'closed' && (!item.current || item.current && item.claimHash != '')})} sx={{ backgroundImage: `url("${item.image}")` }}>
      <BotAuctionsBadge status={item.status} win={item.current && item.claimHash == ''} />

      {item.status == 'closed' && (!item.current || item.current && item.claimHash != '') ? (
        <App.Flex column center gap={8} className={styles.star}>
          <App.Text size={18} weight={700} height={1} color="#171717"><s>${item.marketPrice}</s></App.Text>
          <App.Text size={24} weight={800} height={1} color="#FF1D61">${item.currentPrice}</App.Text>
        </App.Flex>
      ) : (
        <App.Flex center className={styles.marketPrice}>
          <App.Text size={14} height={1}>Market Price: ${item.marketPrice}</App.Text>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default BotAuctionsImage