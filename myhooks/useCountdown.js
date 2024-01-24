import { useState } from 'react'
import moment from 'moment'

import useInterval from './useInterval'

const getDuration = (startTime, endTime) => {
  const diff = moment(endTime).diff(startTime)
  const duration = moment.duration(diff)
  const days = Math.floor(duration.asDays())
  const hours = duration.hours()
  const minutes = duration.minutes()
  const seconds = duration.seconds()
  return {
    days: days > 9 ? days : `0${days}`,
    hours: hours > 9 ? hours : `0${hours}`,
    minutes: minutes > 9 ? minutes : `0${minutes}`,
    seconds: seconds > 9 ? seconds : `0${seconds}`,
    isEnd: diff < 0,
  }
}

const useCountdown = (endTime) => {
  const [time, setTime] = useState(moment())

  const tick = () => {
    setTime(moment())
  }

  const duration = getDuration(time, endTime)

  useInterval(tick, duration.isEnd ? null : 1000)

  return duration
}

export default useCountdown
