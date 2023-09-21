import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListBrowseItem = ({ item }) => {
  const { propValue } = usePropsHelper()

  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  return (
    <App.Flex column gap={32} className={cn(styles.box, styles[item.status])}>
      <div className={styles.circle} />

      <App.Flex row align="center" justify="space-between">
        <App.Flex row center gap={4} className={cn(styles.timeBadge, styles[item.status])}>
          <App.Flex center className={styles.dot} />
          <App.Text size={[12, 10]} height={1}>{item.status == 'Active' ? `${getTime()} left` : item.status}</App.Text>
        </App.Flex>

        {item.status != 'Closed' ? (
          <App.Flex row center gap={4} className={styles.tkeyBadge}>
            <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
            <App.Text size={[12, 10]} height={1}>{item.tKeyRequired} TKeys</App.Text>
          </App.Flex>
        ) : null}
      </App.Flex>

      <App.Flex row align="center" gap={[16, 8]}>
        <App.Flex center sx={{ minWidth: propValue([65, 32], true) }}>
          <Image src={item.image} width={propValue([65, 32], true)} height={propValue([65, 32], true)} alt="" />
        </App.Flex>

        <App.Flex flex={1}>
          <App.Text size={[20, 14]} weight={700} lines={2}>{item.title}</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column justify="flex-end" gap={8} height={[74, 'auto']}>
        <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles.hiddenOnMobile, styles[item.status])} fullWidth>
          <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
          <App.Text size={12} height={1}>{item.totalTransferred}/{item.rewardAmount} reward distributed</App.Text>
        </App.Flex>

        {item.status == 'Active' ? (
          <App.Button primary>Participate</App.Button>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListBrowseItem