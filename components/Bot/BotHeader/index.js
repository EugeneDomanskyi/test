import { useSelector } from 'react-redux'

import App from '@/components/App'
import BotWallet from '@/components/Bot/BotWallet'
import BotBalance from '@/components/Bot/BotBalance'
import BotHeaderTimer from '@/components/Bot/BotHeaderTimer'

import $auction from '@/store/auction'

import styles from './styles.module.scss'

const BotHeader = () => {
  const upcomingAuction = useSelector($auction.get.upcomingAuction)

  return (
    <App.Flex column align="center" gap={8} className={styles.container}>
      <App.Flex fullWidth row align="center" justify="space-between" gap={8} className={styles.container}>
        <BotWallet />
        <BotBalance />
      </App.Flex>

      {
        upcomingAuction?.startsIn
          ? <BotHeaderTimer timestamp={upcomingAuction?.startsIn} />
          : null
      }
    </App.Flex>
  )
}

export default BotHeader