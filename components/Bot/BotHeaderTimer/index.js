import styles from './styles.module.scss'

import { useEffect, useState, useRef } from 'react'
import moment from 'moment'

import App from '@/components/App'

const BotHeaderTimer = ({timestamp}) => {
  const intervalRef = useRef(null)

  const [timeLeft, setTimeLeft] = useState(moment(timestamp).diff(moment()))

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const now = moment()
      const duration = moment(timestamp).diff(now)
      console.log('timeLeft', timeLeft);
      console.log('timestamp', timestamp);
      console.log('duration', duration);
      
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
    // timeLeft > 0 &&
    <App.Flex row align="center" gap={4} className={styles.timerContainer}>
      <App.Text>Next Auction starts in</App.Text>
      <App.Text weight={700}>{formatTime(timeLeft)}</App.Text>
    </App.Flex>
  )
}

export default BotHeaderTimer