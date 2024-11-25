import cn from 'classnames'

import App from '@/components/App'
import BotAuctionsBadge from '@/components/Bot/BotAuctionsBadge'

import styles from './styles.module.scss'

const BotAuctionsImage = ({ item }) => {
  return (
    <App.Flex column align="center" className={cn(styles.container, {[styles.gray]: item.status == 'closed' && !item.current}, {[styles.mega]: item.isMega})}>
      <BotAuctionsBadge status={item.status} win={item.current && item.claimHash == ''} isMega={item.isMega} />

      <App.Flex className={cn(styles.itemImage, {[styles.gray]: item.status == 'closed' && (!item.current || item.current && item.claimHash != '')})} sx={{ backgroundImage: `url("/images/bot/image-placeholder${item.isMega ? '-mega' : ''}.png")` }}>
        {item.status == 'closed' && (!item.current || item.current && item.claimHash != '') ? (
          <App.Flex column center gap={8} className={styles.star}>
            <App.Text size={18} weight={700} height={1} color="#171717"><s>${item.marketPrice}</s></App.Text>
            <App.Text size={24} weight={800} height={1} color="#FF1D61">${item.currentPrice}</App.Text>
          </App.Flex>
        ) : (
          <App.Flex row fullWidth>
            <App.Flex column align="flex-end" justify="flex-end" className={styles.name}>
              <App.Flex center className={styles.text}>
                <App.Text size={12} weight={600} height={1}>{item.name}</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column justify="center" className={styles.discount}>
              <App.Flex column>
                <App.Text size={36} weight={800} color="#FFBB01" height={1}>{item.discount}%</App.Text>
                <App.Text size={36} weight={800} color="#FFBB01" height={1}>OFF</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        )}
      </App.Flex>
    </App.Flex>
  )
}

export default BotAuctionsImage