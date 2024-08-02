import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import App from '@/components/App'
import AuctionBadge from '@/components/Auction/AuctionBadge'
import AuctionCountdown from '@/components/Auction/AuctionCountdown'
import AuctionButton from '@/components/Auction/AuctionButton'

import styles from './styles.module.scss'

const AuctionItemNotify = () => {
  const { wallet, connection } = useWagmiHelper()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $gem }) => $gem.referral)

  const [showSteps, setShowSteps] = useState(false)
  const [startsAt, setStartsAt] = useState(0)

  const item = {
    id: 1,
    status: 'upcoming',
    wallet,
    current: false,
  }

  useEffect(() => {
    setStartsAt(1723069800000)
  }, [])

  useEffect(() => {
    if (!connection.loading && !connection.connected) {
      setShowSteps(true)
    }
  }, [connection])

  return (
    <App.Flex direction={['row', 'column']} gap={[16, 0]} className={cn(styles.item, styles.upcoming)}>
      <App.Flex justify="center" className={styles.badgeBox}>
        <AuctionBadge v2 status={'upcoming'} win={false} />
      </App.Flex>

      <App.Flex justify="space-between" column gap={16} flex={1} className={styles.leftBox} order={[0, 1]}>
        <App.Flex column gap={8}>
          <App.Text size={[58, 24]} weight={800} color="#FFBB01" height={1} sx={{ textShadow: '0px 2.849px 17.4px rgba(182, 0, 0, 0.55)' }}>Get 0.2 ETH for <s>$680</s> $99<sup>*</sup></App.Text>
        </App.Flex>

        <App.Flex column align="flex-start" gap={8}>
          <App.Flex row gap={8} align="center">
            <App.Icon icon="timer" width={isMobile ? 20 : null} height={isMobile ? 20 : null} />
            <App.Text size={[24, 16]} weight={700} height={1}>Auction Starts In</App.Text>
          </App.Flex>

          {startsAt > 0 ? (
            <AuctionCountdown v2 time={startsAt} />
          ) : (
            <App.Flex height={40} />
          )}
        </App.Flex>

        {!referral.is_telegram_present ? (
          <App.Flex column gap={[32, 16]}>
            <App.Flex column gap={[16, 8]}>
              {showSteps ? (
                <App.Text size={[20, 13]} weight={600} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">Step {!wallet ? '1' : '2'}/2</App.Text>
              ) : null}

              {showSteps ? (
                <App.Text size={[20, 13]} weight={400} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">{!wallet ? 'Connect your wallet to get updates on Telegram!' : 'Connect your Telegram to know when the auction is live!'}</App.Text>
              ) : (
                <App.Text size={[20, 13]} weight={400} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">Connect your wallet to get updates on Telegram!</App.Text>
              )}
              <AuctionButton item={item} telegram={wallet && showSteps} />
            </App.Flex>

            <App.Flex>
              <App.Text size={[28, 16]} weight={700} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">Bidding limited to first 100 sign ups!</App.Text>
              <App.Text size={[28, 16]} weight={700} height={1}>🔥</App.Text>
            </App.Flex>
          </App.Flex>
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
        <Image src="/images/auction-image.png" width={550} height={420} alt="" />

        <App.Flex center className={styles.rightBoxInner}>
          <Image src="/images/auction-inner.png" width={250} height={268} alt="" />

          <App.Flex center className={styles.off}>
            <App.Text size={[18, 12]} weight={800} height={1}>85% OFF</App.Text>
          </App.Flex>

          <App.Flex center className={styles.value}>
            <App.Text size={[18, 12]} weight={800} height={1}>Value 680 USDT</App.Text>
          </App.Flex>

          <App.Flex center className={styles.price}>
            <App.Text size={[40, 26]} weight={800} height={1} color="#FFBB01" sx={{ textShadow: '0px 2.849px 17.4px rgba(182, 0, 0, 0.55)' }}>0.2 ETH</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionItemNotify