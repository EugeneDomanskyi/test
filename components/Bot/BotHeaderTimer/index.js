import styles from './styles.module.scss'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import $auction from '@/store/auction'

import App from '@/components/App'

const BotHeaderTimer = () => {
  const dispatch = useDispatch()
  const upcomingAuction = useSelector($auction.get.upcomingAuction)

  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (upcomingAuction?.startsIn) {
      setTimeLeft(upcomingAuction.startsIn);
    }
  }, [upcomingAuction]);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  const formatTime = (milliseconds) => {
    const now = moment()

    if (moment(timeLeft).isBefore(now)) {
      setTimeLeft(0)
      // fetchAuctions()
    }
    
    const targetTime = moment(milliseconds)
    const duration = moment.duration(targetTime.diff(now))

    const days = duration.days()
    const hours = duration.hours()
    const minutes = String(duration.minutes()).padStart(2, '0')
    const seconds = String(duration.seconds()).padStart(2, '0')
    
    return `${days ? days + 'd:' : ''} ${hours ? hours + 'h:' : ''} ${minutes}m:${seconds}s`
  }

  const fetchAuctions = async () => {
    const result = await $auction.api.allTelegram()
    if (result) {
      dispatch($auction.set.all(result))
    }
  }

  return (
    timeLeft > 0 &&
    <App.Flex row align="center" gap={4} className={styles.timerContainer}>
      <App.Text>Next Auction starts in</App.Text>
      <App.Text weight={700}>{formatTime(timeLeft)}</App.Text>
    </App.Flex>
  )
}

export default BotHeaderTimer