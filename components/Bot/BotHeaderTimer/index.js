import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import $auction from '@/store/auction'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotHeaderTimer = ({ timestamp }) => {
  const intervalRef = useRef(null)

  const dispatch = useDispatch()
  const ongoingAuction = useSelector($auction.get.ongoingAuction)
  const showUpcoming = useSelector(({ $auction }) => $auction.showUpcoming)

  const [timeLeft, setTimeLeft] = useState(moment(timestamp).diff(moment()))

  useEffect(() => {
    if (timestamp && ! moment(timestamp).isBefore(moment())) {
      intervalRef.current = setInterval(() => {
        const now = moment()
        const duration = moment(timestamp).diff(now)
        if (duration <= 10000 && !showUpcoming) {
          dispatch($auction.set.showUpcoming(true))
        }

        if (duration <= -1000) {
          dispatch($auction.set.showUpcoming(false))
          clearInterval(intervalRef.current)
          setTimeLeft(0)
          return
        }

        setTimeLeft(duration)
      }, 1000)

      // return () => clearInterval(intervalRef.current)
    }
  }, [timestamp])

  const formatTime = (milliseconds) => {
    const duration = moment.duration(milliseconds)
    const days = duration.days()
    const hours = duration.hours()
    const minutes = String(duration.minutes()).padStart(2, '0')
    const seconds = String(duration.seconds()).padStart(2, '0')
    return `${days ? days + 'd:' : ''} ${hours ? hours + 'h:' : ''}${minutes}m:${seconds}s`
  }
// console.log(timeLeft)
  return (
    <App.Flex row align="center" fullWidth gap={4} className={styles.timerContainer}>
      {ongoingAuction?.id && !ongoingAuction.isBiddable ? (
        <App.Text size={13} weight={400}>👀 on the prize. Auction ends at <b>{ongoingAuction.currentPrice} {ongoingAuction.token.currency}</b></App.Text>
      ) : (
        timeLeft > 0 ? (
          <>
            <App.Text size={13} weight={400}>Next Auction starts in</App.Text>
            <App.Text size={13} weight={600}>{formatTime(timeLeft)}</App.Text>
          </>
        ) : (
          <App.Text size={13} weight={400}>New Auctions Scheduled Every 10 Minutes!</App.Text>
        )
      )}
    </App.Flex>
  )
}

export default BotHeaderTimer