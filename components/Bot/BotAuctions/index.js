import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

import Socket from '@/libs/ws.lib'
import useInterval from '@/myhooks/useInterval'

import $auction from '@/store/auction'
import $bot from '@/store/bot'

import App from '@/components/App'
import BotAuctionsImage from '@/components/Bot/BotAuctionsImage'
import BotAuctionsButton from '@/components/Bot/BotAuctionsButton'

import styles from './styles.module.scss'

const BotAuctions = () => {
  const dispatch = useDispatch()
  const ongoingAuction = useSelector($auction.get.ongoingAuction)
  const loading = useSelector(({ $auction }) => $auction.loading)

  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState({
    minutes: '00',
    seconds: '00',
    minutesNumber: 0,
    secondsNumber: 0,
    isEnd: false,
  })

  useEffect(() => {
    if (ongoingAuction?.time) {
      setTime(ongoingAuction.time)
    }
  }, [ongoingAuction?.lastBidTimestamp])

  useEffect(() => {
    if (ongoingAuction?.id) {
      setDuration(getDuration())
    }
  }, [ongoingAuction?.id, time])

  useEffect(() => {
    Socket.on('auctions', 'auction', handleUpdatedAuction)
    //fetchAuctions()
  }, [])

  const fetchAuctions = async () => {
    const result = await $auction.api.allTelegram()
    if (result) {
      dispatch($auction.set.all(result))
    }
  }

  const handleUpdatedAuction = async (data) => {
    if (data.status === 1) {
      console.log('fetch after receive UPCOMING auction');
      fetchAuctions()
      return
    }

    const result = await $auction.api.getTelegram(data.id)
    
    console.log('handleUpdatedAuction WS data', data);
    console.log('handleUpdatedAuction getById result', result);
    
    if (result) {
      dispatch($auction.set.update(result))
    }
  }

  const getDuration = () => {
    const duration = moment.duration(time)
    const minutes = duration.minutes()
    const seconds = duration.seconds()

    return {
      minutes: minutes > 9 ? minutes : `0${minutes}`,
      seconds: seconds > 9 ? seconds : `0${seconds}`,
      minutesNumber: minutes,
      secondsNumber: seconds,
      isEnd: time <= 0,
    }
  }

  const tick = () => {
    if (time > 0) {
      setTime(time - 1000)
    }
  }

  useInterval(tick, duration.isEnd ? null : 1000)

  return loading ? (
    <App.LoaderBlock height={300} />
  ) : (
    <App.Flex column gap={8}>
      {
          ongoingAuction ? (
            <App.Flex column center fullHeight className={styles.container}>
              <App.Flex column gap={10} className={styles.item}>
                {ongoingAuction.updated ? (
                  <App.Flex className={styles.ripple}>
                    <App.Flex className={styles.circle} />
                  </App.Flex>
                ) : null}
    
                <App.Flex fullWidth justify="center">
                  <BotAuctionsImage item={ongoingAuction} />
                </App.Flex>
    
                <App.Flex column gap={12} className={styles.itemContent}>
                  <App.Text center nowrap size={14} weight={600} height={1}>{ongoingAuction.status == 'closed' && (!ongoingAuction.current || (ongoingAuction.current && ongoingAuction.claimHash != '')) ? `${ongoingAuction.name} auctioned at` : `Buy ${ongoingAuction.name} for`}</App.Text>
                  {ongoingAuction.status == 'closed' && (!ongoingAuction.current || (ongoingAuction.current && ongoingAuction.claimHash != '')) ? (
                    <App.Text center nowrap size={24} weight={600} height={1} color="#A6DC37">{ongoingAuction.discount}% OFF</App.Text>
                  ) : (
                    <>
                      <App.Text center nowrap size={24} weight={600} height={1}>
                        {ongoingAuction.currentPrice} {ongoingAuction.token.currency}
                        
                        <App.Text inline center nowrap size={20} weight={400} height={1} color="#A6DC37"> ({ongoingAuction.discount}% off)</App.Text>
                      </App.Text>
                      
                      <App.Text center nowrap size={14} weight={400} color="#9B99AE" height={1}>
                        Market price: <App.Text inline size={14} weight={400} color="#9B99AE" sx={{textDecoration: 'line-through'}}>{ongoingAuction.marketPrice} {ongoingAuction.token.currency}</App.Text>
                      </App.Text>
                    </>
                  )}
    
                  <BotAuctionsButton item={ongoingAuction} />
    
                  <App.Flex column gap={8} className={styles.area}>
                    <App.Flex row fullWidth align="center" justify="space-between">
                      <App.Text size={14} weight={600} height={1}>Current Bid</App.Text>
                      <App.Text size={24} weight={600} height={1}>{ongoingAuction.currentPrice} {ongoingAuction.token.currency}</App.Text>
                    </App.Flex>
    
                    <div className={styles.line} />
    
                    {ongoingAuction.lastBidTimestamp > 0 ? (
                      <App.Flex row fullWidth align="center" justify="space-between">
                        <App.Flex column gap={4}>
                          <App.Text size={14} weight={600} height={1}>Bid by</App.Text>
                          <App.Text size={14} weight={600} height={1}>{ ongoingAuction.wallet }</App.Text>
                        </App.Flex>
    
                        <App.Flex row center gap={4} className={styles.timer}>
                          {ongoingAuction.status === 'closed' ? (
                            <App.Text size={16} weight={400} height={1}>Closed</App.Text>
                          ) : (
                            <>
                              <App.Text size={16} weight={400} height={1}>Wins In</App.Text>
                              <App.Flex row justify="flex-end" className={styles.timerText}>
                                <App.Text size={16} weight={400} height={1} color="#FF1D61">{duration.minutes}:{duration.seconds}</App.Text>
                              </App.Flex>
                            </>
                          )}
                        </App.Flex>
                      </App.Flex>
                    ) : (
                      <App.Flex center>
                        <App.Text center size={14} weight={600}>Be the first to bid</App.Text>
                      </App.Flex>
                    )}
                  </App.Flex>
    
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
    </App.Flex>
  )
}

export default BotAuctions