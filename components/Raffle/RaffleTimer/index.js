import { useEffect, useState } from 'react'
import cn from 'classnames'
import moment from 'moment'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleTimer = ({item}) => {
  const calculateRemainingTime = (timestamp) => {
    const now = moment()
    const end = moment(timestamp * 1000)
    const duration = moment.duration(end.diff(now))
    return duration
  }

  const [timer, setTimer] = useState(calculateRemainingTime(item.status === 'Active' ? item.endTimestamp : item.startTimestamp))

  useEffect(() => {
    if (item.status == 'Active') {
      const timerInterval = setInterval(() => {
        const remainingTime = calculateRemainingTime(item.endTimestamp)
        const formatted = moment.utc(remainingTime.asMilliseconds()).format('DD[D]:HH[H]:mm[M]')
        setTimer(formatted)
  
        if (remainingTime.asMilliseconds() <= 0) {
          clearInterval(timerInterval)
        }
      }, 1000)
  
      return () => {
        clearInterval(timerInterval)
      }
    }
    if (item.status == 'Upcoming') {
      const timerInterval = setInterval(() => {
        const remainingTime = calculateRemainingTime(item.startTimestamp)
        const formatted = moment.utc(remainingTime.asMilliseconds()).format('DD[D]:HH[H]:mm[M]')
        setTimer(formatted)
  
        if (remainingTime.asMilliseconds() <= 0) {
          clearInterval(timerInterval)
        }
      }, 1000)
  
      return () => {
        clearInterval(timerInterval)
      }
    }
  }, [item.endTimestamp, item.startTimestamp, timer])

  const getClosedTime = () => {    
    const date = moment(item.endTimestamp * 1000).format('Do MMMM YYYY')
    return `Ended on ${date}`
  }

  return (
    <App.Flex row center gap={4} className={cn(styles.timeBadge, styles[item.status])}>
      <App.Flex center className={styles.dot} />
      <App.Text size={[12, 10]} height={1}>{item.status == 'Closed' ? getClosedTime() : ( item.status === 'Active' ? 'Ends in ' : 'Starts in ') + timer}</App.Text>
    </App.Flex>
  )
}

export default RaffleTimer