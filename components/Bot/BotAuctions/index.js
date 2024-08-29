import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Socket from '@/libs/ws.lib'

import $auction from '@/store/auction'

import App from '@/components/App'
import BotAuctionsImage from '@/components/Bot/BotAuctionsImage'
import BotAuctionsButton from '@/components/Bot/BotAuctionsButton'

import styles from './styles.module.scss'

const BotAuctions = () => {
  const dispatch = useDispatch()
  const ongoingAuction = useSelector($auction.get.ongoingAuction)

  useEffect(() => {
    Socket.on('auctions', 'auction', handleUpdatedAuction)
    fetchAuctions()

    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [])

  const fetchAuctions = async () => {
    const result = await $auction.api.all()
    if (result) {
      dispatch($auction.set.all(result))
    }
  }

  const handleUpdatedAuction = async (data) => {
    const result = await $auction.api.get(data.id)
    if (result) {
      dispatch($auction.set.update({...result, auction: result.auction_id}))
    }
  }

  const handleVisible = () => {
    if (!document.hidden) {
      fetchAuctions()
    }
  }

  return ongoingAuction ? (
    <App.Flex column align="center" fullHeight className={styles.container}>
      <App.Flex column gap={10} className={styles.item}>
        {ongoingAuction.updated ? (
          <App.Flex className={styles.ripple}>
            <App.Flex className={styles.circle} />
          </App.Flex>
        ) : null}

        <BotAuctionsImage item={ongoingAuction} />

        <App.Flex column gap={12} className={styles.itemContent}>
          <App.Text center nowrap size={14} weight={600} height={1}>{ongoingAuction.status == 'closed' && (!ongoingAuction.current || (ongoingAuction.current && ongoingAuction.claimHash != '')) ? `${ongoingAuction.name} auctioned at` : `Buy ${ongoingAuction.name} for`}</App.Text>
          {ongoingAuction.status == 'closed' && (!ongoingAuction.current || (ongoingAuction.current && ongoingAuction.claimHash != '')) ? (
            <App.Text center nowrap size={24} weight={600} height={1} color="#A6DC37">{ongoingAuction.discount}% OFF</App.Text>
          ) : (
            <App.Text center nowrap size={24} weight={600} height={1}>{ongoingAuction.currentPrice} {ongoingAuction.token.currency}</App.Text>
          )}

          <BotAuctionsButton item={ongoingAuction} />

          {/* {item.status == 'closed' && (!item.current || (item.current && item.claimHash != '')) ? (
            <App.Flex row center gap={8} height={22}>
              <App.Icon icon="users" />
              <App.Text size={14} weight={600} height={1}>{item.bidsCount} Bidder{item.bidsCount != 1 ? 's' : ''}</App.Text>
            </App.Flex>
          ) : (
            <App.Flex center gap={8} className={cn(styles.info, {[styles.win]: item.status == 'closed' && item.current})}>
              <App.Text size={14} weight={400} height={1} color={item.status == 'closed' && item.current ? '#53F19C' : "#737373"}>{t(firstText())}</App.Text>
              {secondText() != 'hide' ? (
                item.status == 'upcoming' ? (
                  <AuctionCountdown red time={item.startsIn} />
                ) : (
                  <App.Text weight={400} height={1}>{t(secondText())}</App.Text>
                )
              ) : null}
            </App.Flex>
          )}

          {nextLine()}
          
          {item.status != 'closed' || (item.status == 'closed' && item.current && item.claimHash == '') ? (
            <AuctionButton key={item.currentPrice} item={item} share={item.status == 'upcoming' && referral.is_telegram_present} short />
          ) : null}

          {!TelegramBot.isBot() && item.status == 'ongoing' || (item.status == 'closed' && (!item.current || item.current && item.claimHash != '')) ? (
            <App.Button primary2 large outlined onClick={handleClick}>View {item.status == 'closed' ? 'history' : 'more'}</App.Button>
          ) : null}

          {onClear && item.status == 'closed' && host != null && host != 'tegro.com' ? (
            <App.Button small onClick={handleClear}>Clear</App.Button>
          ) : null} */}
        </App.Flex>
      </App.Flex>
    </App.Flex>
  ) : (
    <App.Flex center height={300}>
      <App.Text>No ongoing auction</App.Text>
    </App.Flex>
  )
}

export default BotAuctions