import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleListMyItemModal = ({ item, onParticipate }) => {
  const handleTransactionClick = (tx) => () => {
    window.open(`https://${process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 'mumbai.' : ''}polygonscan.com/tx/${tx}`, '_blank')
  }

  return (
    <App.Flex column gap={16} sx={{padding: 16}}>
      <App.Flex row align="center" justify="space-between" gap={16} height={24}>
        <App.Text color="#B9B8C5">Cases</App.Text>
        
        <App.Flex gap={8} align="center">
          {item?.campaign?.image ? (
            <img src={item.campaign.image} width={24} height={24} alt="" />
          ) : (
            <App.Flex className={styles.imagePlaceholder} width={24} height={24} />
          )}

          <App.Flex column>
            <App.Text>{item?.campaign?.title}</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      {item.resolvedTransaction ? (
        <App.Flex row align="center" justify="space-between" gap={16} height={24}>
          <App.Text color="#B9B8C5">Blockchain Hash</App.Text>
          <App.Text className={styles.link} onClick={handleTransactionClick(item.resolvedTransaction)}>{item.resolvedTransaction.slice(0, 20)}...</App.Text>
        </App.Flex>
      ) : null}

      <App.Flex row align="center" justify="space-between" gap={16} height={24}>
        <App.Text color="#B9B8C5">Rewards</App.Text>
        
        {item.status == 'Processing' ? (
          <App.Loader size={14} />
        ) : (
          <App.Flex row align="center" gap={4}>
            <Image src="/images/raffle/usdt.png" width={14} height={14} alt="" />
            <App.Text height={1}>{item.rewardAmount ?? 0} USDT</App.Text>
          </App.Flex>
        )}
      </App.Flex>

      <App.Flex row align="center" justify="space-between" gap={16} height={24}>
        <App.Text color="#B9B8C5">Status</App.Text>
        
        <App.Text color={item.status == 'Success' ? '#53F19C' : (item.status == 'Processing' ? '#FFD600' : '#FF1D61')}>{item.status}</App.Text>
      </App.Flex>

      <App.Flex row align="center" justify="space-between" gap={16} height={24}>
        <App.Text color="#B9B8C5">TKeys Burnt</App.Text>
        
        <App.Flex row align="center" justify="flex-end" gap={4}>
          <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
          <App.Text center>{item.tKeysCount ?? 0}</App.Text>
        </App.Flex>
      </App.Flex>

      {item.campaign.status == 'Active' ? (
        <App.Button primary large fullWidth onClick={() => onParticipate(item)}>Open More Cases</App.Button>
      ) : null}
    </App.Flex>
  )
}

export default RaffleListMyItemModal