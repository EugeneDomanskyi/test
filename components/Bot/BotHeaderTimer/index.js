import styles from './styles.module.scss'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import $auction from '@/store/auction'

import App from '@/components/App'

const BotHeaderTimer = () => {
  const upcomingAuction = useSelector($auction.get.upcomingAuction)

  const [timeLeft, setTimeLeft] = useState(upcomingAuction?.startsIn || 0)

  useEffect(() => {
    if (upcomingAuction?.startsIn) {
      const interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1000)
      }, 1000)
  
      return () => clearInterval(interval)
    }
  }, [upcomingAuction])

  const formatTime = (milliseconds) => {
    const duration = moment.duration(milliseconds)
    const days = duration.days()
    const hours = duration.hours()
    const minutes = String(duration.minutes()).padStart(2, '0')
    const seconds = String(duration.seconds()).padStart(2, '0')
    return `${days > 0 ? `${days}d:` : ''}${hours > 0 ? `${hours}h:` : ''}${minutes}m:${seconds}s`
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