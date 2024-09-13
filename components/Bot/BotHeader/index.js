import { useSelector } from 'react-redux'
import moment from 'moment'

import App from '@/components/App'
import BotWallet from '@/components/Bot/BotWallet'
import BotBalance from '@/components/Bot/BotBalance'
import BotHeaderTimer from '@/components/Bot/BotHeaderTimer'

import $auction from '@/store/auction'

import styles from './styles.module.scss'

const BotHeader = () => {
  const now = moment(); 
  const upcomingAuction = useSelector($auction.get.upcomingAuction)

  return (
    <App.Flex column align="center" gap={8} className={styles.container}>
      <App.Flex fullWidth row align="center" justify="space-between" gap={8} className={styles.container}>
        <BotWallet />
        <BotBalance />
      </App.Flex>

      {
        upcomingAuction?.startsIn && ! moment(upcomingAuction?.startsIn).isBefore(now)
          ? <BotHeaderTimer timestamp={upcomingAuction?.startsIn} />
          : null
      }
    </App.Flex>
  )
}

export default BotHeader