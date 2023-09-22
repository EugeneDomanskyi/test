import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListMyItemModal = ({ item, onParticipate }) => {
  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  return (
    <App.Flex column gap={8} sx={{padding: 16}}>
      <App.Flex row align="center" justify="space-between" gap={16}>
        <App.Text color="#B9B8C5">Campaign</App.Text>
        
        <App.Flex gap={8} align="center">
          {item.image ? (
            <img src={item.image} width={32} height={32} alt="" />
          ) : (
            <App.Flex className={styles.imagePlaceholder} width={32} height={32} />
          )}

          <App.Flex column>
            <App.Text>{item.title}</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex row align="center" justify="space-between" gap={16}>
        <App.Text color="#B9B8C5">Status</App.Text>
        
        <App.Flex center>
          <App.Flex row align="center" gap={4} className={cn(styles.timeBadge, styles[item.status])}>
            <App.Flex center className={styles.dot} />
            <App.Text height={1}>{item.status == 'Active' ? `${getTime()} left` : item.status}</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex row align="center" justify="space-between" gap={16} height={32}>
        <App.Text color="#B9B8C5">Rewards Won</App.Text>
        <App.Text>${item?.user?.totalEarned ?? 0}</App.Text>
      </App.Flex>

      <App.Flex row align="center" justify="space-between" gap={16} height={32}>
        <App.Text color="#B9B8C5">TKeys Spent</App.Text>
        
        <App.Flex row align="center" justify="flex-end" gap={4}>
          <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
          <App.Text center>{item?.user?.tKeysSpent ?? 0}</App.Text>
        </App.Flex>
      </App.Flex>

      {item.status == 'Active' ? (
        <>
          {item?.user?.isResolved ? (
            <App.Button primary large onClick={() => onParticipate(item)}>Play Again</App.Button>
          ) : (
            <App.Flex column gap={8} sx={{ paddingTop: 16 }}>
              <App.Text center color="#B9B8C5">You need to wait till your current mystery box has been opened</App.Text>
              <App.Button variant="gray" large disabled>Play Again</App.Button>
            </App.Flex>
          )}
        </>
      ) : null}
    </App.Flex>
  )
}

export default RaffleListMyItemModal