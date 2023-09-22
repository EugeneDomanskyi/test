import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListMyItemModal = ({ item, onParticipate, onShare }) => {
  const getTime = () => {
    const end = item.endTimestamp * 1000
    const current = moment().valueOf()
    const duration = moment.duration(end - current, 'milliseconds')
    return duration.humanize()
  }

  return (
    <App.Flex column gap={16} sx={{padding: 16}}>
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

      {!item?.user?.isResolved ? (
        <App.Flex column className={styles.alert}>
          <App.Text>You need to wait till your current mystery container has been opened</App.Text>
        </App.Flex>
      ) : null}

      {item.status == 'Active' ? (
        <App.Flex row gap={16} align="center" fullWidth>
          <App.Button primary large outlined onClick={() => onShare(item)} flex={4}>
            Share on
            <App.Icon icon="x" />
          </App.Button>

          <App.Flex flex={6}>
            {item?.user?.isResolved ? (
              <App.Button primary large fullWidth onClick={() => onParticipate(item)}>Play Again</App.Button>
            ) : (
              <App.Button variant="gray" large fullWidth disabled>Play Again</App.Button>
            )}
          </App.Flex>
        </App.Flex>
      ) : null}
    </App.Flex>
  )
}

export default RaffleListMyItemModal