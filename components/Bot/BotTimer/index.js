import React, { useEffect, useState } from 'react'
import moment from 'moment'

const BotTimer = ({ claimTime }) => {
  const [timeLeft, setTimeLeft] = useState(moment(claimTime).diff(moment()))

  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment()
      const duration = moment(claimTime).diff(now)
      setTimeLeft(duration)
    }, 1000)

    return () => clearInterval(interval)
  }, [claimTime])

  const formatTime = (milliseconds) => {
    // const duration = moment.utc(milliseconds).format('HH:mm:ss');
    // console.log('formattedTime', formattedTime);
    
    
    const duration = moment.duration(milliseconds)
    const days = Math.floor(duration.asDays())
    const hours = String(duration.hours()).padStart(2, '0')
    const minutes = String(duration.minutes()).padStart(2, '0')
    const seconds = String(duration.seconds()).padStart(2, '0')
    return `${days}d ${hours}:${minutes}:${seconds}`
    // return duration
  }

  return formatTime(timeLeft)
}

export default BotTimer