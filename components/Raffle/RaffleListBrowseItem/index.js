import Image from 'next/image'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

import styles from './styles.module.scss'

const RaffleListBrowseItem = ({ item, onParticipate }) => {
  const { propValue } = usePropsHelper()

  // if (item.id*1 === 18) {
  //   item = {...item, status: 'Upcoming'}
  // }
  // console.log('item', item)
  // if (item.id*1 === 17) {
  //   item = {...item, status: 'Active'}
  // }
  // console.log('item', item)

  return (
    <App.Flex column gap={[32, 16]} className={cn(styles.box, styles[item.status])}>
      <div className={styles.circle} />

      <App.Flex row align="center" justify="space-between">
        <Raffle.Timer item={item} />

        {item.status !== 'Closed' ? (
          <App.Flex row center gap={4} className={styles.tkeyBadge}>
            <App.Text size={[12, 10]} height={1}>#{item.id}</App.Text>
          </App.Flex>
        ) : null}
      </App.Flex>

      <App.Flex align="center" gap={[16, 8]} className={styles.caseTitle}>
        <App.Flex center sx={{ minWidth: propValue([64, 34], true) }}>
          <Image src={item.image} width={propValue([64, 44], true)} height={propValue([64, 44], true)} alt="" />
        </App.Flex>

        <App.Flex flex={1}>
          <App.Text size={[20, 14]} weight={[700, 500]} lines={2} height={1}>{item.title}</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column justify="flex-end" gap={8} height={[74, 'auto']}>
        <App.Flex row justify="space-between" gap={4} fullWidth>
          <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles[item.status])}>
            <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
            <App.Text size={[12, 10]} height={1}>{item.tKeyRequired} <span className={styles.desktopVisible}>Req</span></App.Text>
          </App.Flex>
          <App.Flex row center gap={4} className={cn(styles.tkeyBadge, styles[item.status])}>
            <Image src="/images/raffle/usdt.png" width={16} height={16} alt="" />
            {item.status == 'Upcoming' ? (
              <App.Text size={[12, 10]} height={1}>{item.rewardAmount} USDT available</App.Text>
            ) : (
              <App.Text size={[12, 10]} height={1}>{item.totalTransferred}/{item.rewardAmount} <span className={styles.desktopVisible}>USDT distributed</span> <span className={styles.mobileVisible}>dist.</span></App.Text>
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