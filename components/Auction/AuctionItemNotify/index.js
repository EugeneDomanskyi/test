import { useSelector } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'

import App from '@/components/App'
import AuctionBadge from '@/components/Auction/AuctionBadge'

import styles from './styles.module.scss'
import AuctionCountdown from '../AuctionCountdown'
import AuctionButton from '../AuctionButton'

const AuctionItemNotify = ({ item, onClear }) => {
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $gem }) => $gem.referral)

  return (
    <App.Flex direction={['row', 'column']} gap={[115, 0]} className={cn(styles.item, styles.upcoming)}>
      <App.Flex justify="center" className={styles.badgeBox}>
        <AuctionBadge v2 status={'upcoming'} win={false} />
      </App.Flex>

      <App.Flex justify="space-between" column gap={16} flex={1} className={styles.leftBox} order={[0, 1]}>
        <App.Flex column gap={8}>
          <App.Text size={[40, 24]} weight={800} color="#FFBB01" height={1} sx={{ textShadow: '0px 2.849px 17.4px rgba(182, 0, 0, 0.55)' }}>Buy 1 ETH for <s>$3000</s> $100<sup>*</sup></App.Text>
          <App.Text size={[18, 14]} weight={400}>Bid on the price of ETH using Gems. Every bid increases the price by 10 cents and resets the countdown. Last person to bid wins.</App.Text>
        </App.Flex>

        <App.Flex column align={['flex-start', 'center']} gap={8}>
          <App.Flex row gap={8} align="center">
            <App.Icon icon="timer" width={isMobile ? 20 : null} height={isMobile ? 20 : null} />
            <App.Text size={[24, 16]} weight={700} height={1}>Auction Starts In</App.Text>
          </App.Flex>

          <AuctionCountdown v2 time={moment().add(15, 'days').valueOf()} />
        </App.Flex>

        {!referral.is_telegram_present ? (
          <AuctionButton item={item} />
        ) : (
          <App.Flex column gap={16}>
            <App.Flex center className={styles.verified}>
              <App.Text size={14} weight={400} height={1.2} color="#53F19C">All Set! We’ll hit you up on Telegram when the auction begins.</App.Text>
            </App.Flex>

            <App.Text size={[18, 14]} weight={600}>Don’t have gems? Let your friends know about Tegro Auctions and <App.Text inline size={[18, 14]} weight={600} color="#A6DC37">win 50 Gems</App.Text>.</App.Text>

            <AuctionButton item={item} share />
          </App.Flex>
        )}
      </App.Flex>

      <App.Flex column flex={1} className={styles.rightBox} order={[1, 0]}>
        <img src="/images/auction-image.png" alt="" />

        <App.Flex center className={styles.rightBoxInner}>
          <img src="/images/auction-inner.png" alt="" />

          <App.Flex center className={styles.off}>
            <App.Text size={[18, 12]} weight={800} height={1}>95% OFF</App.Text>
          </App.Flex>

          <App.Flex center className={styles.value}>
            <App.Text size={[18, 12]} weight={800} height={1}>Value 3000 USDT</App.Text>
          </App.Flex>

          <App.Flex center className={styles.price}>
            <App.Text size={[40, 26]} weight={800} height={1} color="#FFBB01" sx={{ textShadow: '0px 2.849px 17.4px rgba(182, 0, 0, 0.55)' }}>1 ETH</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionItemNotify