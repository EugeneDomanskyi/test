import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'

import Socket from '@/libs/ws.lib'
import useInterval from '@/myhooks/useInterval'

import $auction from '@/store/auction'
import $bot from '@/store/bot'

import App from '@/components/App'
import BotAuctionsImage from '@/components/Bot/BotAuctionsImage'
import BotAuctionsButton from '@/components/Bot/BotAuctionsButton'

import styles from './styles.module.scss'
import AuctionCountdown from '@/components/Auction/AuctionCountdown'

const BotAuctions = ({ onClaim }) => {
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
    fetchAuctions()
  }, [])

  const fetchAuctions = async () => {
    const result = await $auction.api.allTelegram()
    if (result && !result.error) {
      dispatch($auction.set.all(result))
    }

    dispatch($auction.set.loading(false))
  }

  const handleUpdatedAuction = async (data) => {
    if (data.status === 1) {
      fetchAuctions()
      return
    }

    const result = await $auction.api.getTelegram(data.id)
    if (result && !result.error) {
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

  const handleClaimOver = () => {
    dispatch($auction.set.auctionNotClaim(ongoingAuction))
  }

  const handleAuctionHistory = (auction) => () => {
    dispatch($auction.set.current(auction))
    dispatch($auction.set.auctionHistory([]))
    dispatch($bot.set.tab('auction-history'))
  }

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
    
                <App.Flex column gap={12} className={styles.itemContent} align={ongoingAuction.status == 'closed' && ongoingAuction.current ? 'flex-start' : null}>
                  {ongoingAuction.status == 'closed' && ongoingAuction.current ? (
                    <App.Flex column fullWidth gap={16}>
                      <App.Flex column center fullWidth gap={12}>
                        <App.Text center nowrap size={14} weight={600} height={1}>You bought {ongoingAuction.name} for</App.Text>

                        <App.Text center nowrap size={24} weight={600} height={1}>
                          {ongoingAuction.currentPrice} {ongoingAuction.token.currency} only
                          &nbsp;
                          <App.Text nowrap inline size={20} weight={400} height={1} color="#A6DC37">({ongoingAuction.discount}% off)</App.Text>
                        </App.Text>

                        <App.Flex center gap={8} className={cn(styles.info, styles.win)}>
                          <App.Text size={14} weight={400} height={1} color="#53F19C">You won the auction!</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <App.Flex row fullWidth center gap={8} height={20}>
                        {ongoingAuction.isClaimable ? (
                          <App.Flex row center>
                            <App.Text size={14} weight={600} height={1} color="#737373">Pay by</App.Text>
                            <AuctionCountdown red time={ongoingAuction.claimTime} onZero={handleClaimOver} />
                          </App.Flex>
                        ) : (
                          <App.Text center size={14} weight={600} height={1}>Claim your winnings in 72 hours!</App.Text>
                        )}

                        <App.Tooltip variant="v2" click text={'You have to claim your winnings within 72 hours. If not, it gets deposited back to the reward pool.'} placement="top-end">
                          <App.Icon icon="info2" width={20} height={20} />
                        </App.Tooltip>
                      </App.Flex>

                      <App.Flex column gap={4} className={styles.instructions}>
                        <App.Text size={12} weight={400} color="#FFFFFFCC">&bull; Pay {ongoingAuction.currentPrice} {ongoingAuction.token.currency} to receive 10 USDC back to your wallet.</App.Text>
                        <App.Text size={12} weight={400} color="#FFFFFFCC">&bull; Keep atleast $0.1 worth of ETH (base) in your wallet to cover gas fees.</App.Text>
                      </App.Flex>
                    </App.Flex>
                  ) : (
                    <>
                      <App.Text center={ongoingAuction.status == 'closed' && ongoingAuction.current ? false : true} nowrap size={14} weight={600} height={1}>{ongoingAuction.status == 'closed' && (!ongoingAuction.current || (ongoingAuction.current && ongoingAuction.claimHash != '')) ? `${ongoingAuction.name} auctioned at` : `Buy ${ongoingAuction.name} for`}</App.Text>

                      {ongoingAuction.status != 'closed' ? (
                        <>
                          <App.Text center nowrap size={24} weight={600} height={1}>
                            {ongoingAuction.currentPrice} {ongoingAuction.token.currency}
                            
                            <App.Text inline center nowrap size={20} weight={400} height={1} color="#A6DC37"> ({ongoingAuction.discount}% off)</App.Text>
                          </App.Text>
                          
                          <App.Text center nowrap size={14} weight={400} color="#9B99AE" height={1}>
                            Market price: <App.Text inline size={14} weight={400} color="#9B99AE" sx={{textDecoration: 'line-through'}}>{ongoingAuction.marketPrice} {ongoingAuction.token.currency}</App.Text>
                          </App.Text>
                        </>
                      ) : (
                        <App.Flex column gap={8}>
                          <App.Text center nowrap size={24} weight={700} height={1} color="#A6DC37">{ongoingAuction.discount}% OFF</App.Text>

                          <App.Flex row center gap={8} height={22}>
                            <App.Icon icon="users" />
                            <App.Text size={14} weight={600} height={1}>{ongoingAuction.bidsCount} Bidder{ongoingAuction.bidsCount != 1 ? 's' : ''}</App.Text>
                          </App.Flex>

                          <App.Flex row center gap={8} height={20}>
                            <App.Icon icon="cup2" />
                            <App.Text size={14} weight={600} color="#FFBB01" height={1}>Winning bid: {ongoingAuction.wallet}</App.Text>
                          </App.Flex>
                        </App.Flex>
                      )}
                    </>
                  )}

                  {(ongoingAuction.status != 'closed' || ongoingAuction.status == 'closed' && ongoingAuction.current) ? (
                    <BotAuctionsButton item={ongoingAuction} onClaim={onClaim} />
                  ) : (
                    <App.Button variant="bot" large fullWidth outlined onClick={handleAuctionHistory(ongoingAuction)}>View history</App.Button>
                  )}
                  
                  {ongoingAuction.status != 'closed' ? (
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
                  ) : null}
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