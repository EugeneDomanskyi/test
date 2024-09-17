import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import App from '@/components/App'
import BotWallet from '@/components/Bot/BotWallet'
import BotBalance from '@/components/Bot/BotBalance'
import BotHeaderTimer from '@/components/Bot/BotHeaderTimer'

import $auction from '@/store/auction'

import styles from './styles.module.scss'

const BotHeader = () => {
  const now = moment()

  const dispatch = useDispatch()
  const upcomingAuction = useSelector($auction.get.upcomingAuction)

  const handleTab = (uri) => () => {
    dispatch($bot.set.tab(uri))
  }

  return (
    <App.Flex column align="center" gap={8} className={styles.container}>
      <App.Flex fullWidth row align="center" justify="space-between" gap={8}>
        <BotWallet />
        <BotBalance />
      </App.Flex>

      <App.Flex fullWidth row align="center" gap={8}>
        <App.Flex flex={1}>
          <App.Button variant="bot-default" small fullWidth onClick={handleTab('history')}><App.Icon icon="clock-bot" /> History</App.Button>
        </App.Flex>

        <App.Flex flex={1}>
          <App.Button variant="bot-default" small fullWidth onClick={handleTab('my-earnings')}><App.Icon icon="earn-bot" /> My Earnings</App.Button>
        </App.Flex>
      </App.Flex>

      {upcomingAuction?.startsIn && ! moment(upcomingAuction?.startsIn).isBefore(now) ? (
        <BotHeaderTimer timestamp={upcomingAuction?.startsIn} />
      ) : null}
    </App.Flex>
  )
}

export default BotHeader