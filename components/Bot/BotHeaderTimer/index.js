import styles from './styles.module.scss'

import { useEffect, useState, useRef } from 'react'
import moment from 'moment'

import App from '@/components/App'

const BotHeaderTimer = ({ timestamp }) => {
  const intervalRef = useRef(null)

  const [timeLeft, setTimeLeft] = useState(moment(timestamp).diff(moment()))

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = moment()
      const duration = moment(timestamp).diff(now)
      if (duration < 0) {
        clearInterval(intervalRef.current)
        setTimeLeft(0)
        return
      }
      setTimeLeft(duration)
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [timestamp])

  const formatTime = (milliseconds) => {
    const duration = moment.duration(milliseconds)
    const days = duration.days()
    const hours = duration.hours()
    const minutes = String(duration.minutes()).padStart(2, '0')
    const seconds = String(duration.seconds()).padStart(2, '0')
    return `${days ? days + 'd:' : ''} ${hours ? hours + 'h:' : ''}${minutes}m:${seconds}s`
  }

  return (
    <App.Flex row align="center" fullWidth gap={4} className={styles.timerContainer}>
      {timeLeft > 0 ? (
        <>
          <App.Text size={13} weight={400}>Next Auction starts in</App.Text>
          <App.Text size={13} weight={600}>{formatTime(timeLeft)}</App.Text>
        </>
      ) : (
        <App.Text size={13} weight={400}>New Auctions Scheduled Every 10 Minutes!</App.Text>
      )}
    </App.Flex>
  )
}

export default BotHeaderTimer