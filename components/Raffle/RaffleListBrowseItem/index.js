import { useSelector } from 'react-redux'
import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useEffect, useState } from 'react'

const RaffleListBrowseItem = ({ item, onParticipate, onShare }) => {
  const { propValue } = usePropsHelper()

  const tokenIds = useSelector(({ $raffle }) => $raffle.tokenIds)

  const [keysLoading, setKeysLoading] = useState(true)

  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  useEffect(() => {
    if (tokenIds.length) {
      setKeysLoading(false)
    }
  }, [tokenIds])

  return (
    <App.Flex column gap={32} className={cn(styles.box, styles[item.status], {[styles.disabled]: keysLoading})}>
      <div className={styles.circle} />

      <App.Flex row align="center" justify="space-between">
        <App.Flex row center gap={4} className={cn(styles.timeBadge, styles[item.status])}>
          <App.Flex center className={styles.dot} />
          <App.Text size={[12, 10]} height={1}>{item.status == 'Active' ? `${getTime()} left` : item.status}</App.Text>
        </App.Flex>

        {item.status == 'Active' ? (
          <App.Flex row center gap={4} className={styles.tkeyBadge}>
            <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
            <App.Text size={[12, 10]} height={1}>{item.tKeyRequired} TKeys</App.Text>
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
        <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles[item.status])} fullWidth>
          <Image src="/images/raffle/usdt.png" width={16} height={16} alt="" />
          {item.status == 'Upcoming' ? (
            <App.Text size={12} height={1}>{item.rewardAmount} USDT available</App.Text>
          ) : (
            <App.Text size={12} height={1}>{item.totalTransferred}/{item.rewardAmount} USDT distributed</App.Text>
          )}
        </App.Flex>

        {item.status == 'Active' ? (
          <App.Button primary disabled={keysLoading} onClick={() => onParticipate(item)}>View Case</App.Button>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListBrowseItem