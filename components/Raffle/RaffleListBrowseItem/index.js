import { useEffect, useState } from 'react'
import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListBrowseItem = ({ item, onParticipate }) => {
  const { propValue } = usePropsHelper()

  // if (item.id*1 === 17) {
  //   item = {...item, status: 'Upcoming'}
  // }
  // console.log('item', item)

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
        const formatted = moment.utc(remainingTime.asMilliseconds()).format('DD[D]:HH[H]:mm[M]:ss[S]')
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
        const formatted = moment.utc(remainingTime.asMilliseconds()).format('DD[D]:HH[H]:mm[M]:ss[S]')
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
    <App.Flex column gap={32} className={cn(styles.box, styles[item.status])}>
      <div className={styles.circle} />

      <App.Flex row align="center" justify="space-between">
        <App.Flex row center gap={4} className={cn(styles.timeBadge, styles[item.status])}>
          <App.Flex center className={styles.dot} />
          <App.Text size={[12, 10]} height={1}>{item.status == 'Closed' ? getClosedTime() : ( item.status === 'Active' ? 'Ends in ' : 'Starts in ') + timer}</App.Text>
          {/* <App.Text size={[12, 10]} height={1}>{item.status == 'Active' ? `${getTime()} left` : item.status}</App.Text> */}
        </App.Flex>

        {item.status !== 'Closed' ? (
          <App.Flex row center gap={4} className={styles.tkeyBadge}>
            <App.Text size={[12, 10]} height={1}>#{item.id}</App.Text>
          </App.Flex>
        ) : null}
      </App.Flex>

      <App.Flex row align="center" gap={[16, 8]}>
        <App.Flex center sx={{ minWidth: propValue([64, 34], true) }}>
          <Image src={item.image} width={propValue([64, 34], true)} height={propValue([64, 34], true)} alt="" />
        </App.Flex>

        <App.Flex flex={1}>
          <App.Text size={[20, 14]} weight={[700, 500]} lines={2} height={1}>{item.title}</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column justify="flex-end" gap={8} height={[74, 'auto']}>
        <App.Flex row justify="space-between" gap={4} fullWidth>
          <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles[item.status])}>
            <Image src="/images/raffle/tkey-small.png" width={16} height={16} alt="" />
            <App.Text size={12} height={1}>{item.tKeyRequired} Req</App.Text>
          </App.Flex>
          <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles[item.status])}>
            <Image src="/images/raffle/usdt.png" width={16} height={16} alt="" />
            {item.status == 'Upcoming' ? (
              <App.Text size={12} height={1}>{item.rewardAmount} USDT available</App.Text>
            ) : (
              <App.Text size={12} height={1}>{item.totalTransferred}/{item.rewardAmount} USDT distributed</App.Text>
            )}
          </App.Flex>
        </App.Flex>

        {item.status == 'Active' ? (
          <App.Button primary onClick={() => onParticipate(item)}>View Case</App.Button>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListBrowseItem