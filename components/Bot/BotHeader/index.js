import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import $bot from '@/store/bot'
import $auction from '@/store/auction'

import App from '@/components/App'
import BotWallet from '@/components/Bot/BotWallet'
import BotBalance from '@/components/Bot/BotBalance'
import BotHeaderTimer from '@/components/Bot/BotHeaderTimer'

import styles from './styles.module.scss'

const BotHeader = () => {
  const dispatch = useDispatch()
  const upcomingAuction = useSelector($auction.get.upcomingAuction)
  const earningToBeClaimedCount = useSelector($auction.get.earningToBeClaimedCount)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const handleTab = (uri) => () => {
    dispatch($bot.set.tab(uri))
  }

  const fetchEarnings = async () => {
    const result = await $auction.api.earnings()
    if (result && !result?.error) {
      dispatch($auction.set.earnings(result))
    }
  }

  return (
    <App.Flex column align="center" gap={8} className={styles.container}>
      <App.Flex fullWidth row align="center" justify="space-between" gap={8}>
        <BotWallet />
        <BotBalance />
      </App.Flex>

      <App.Flex fullWidth row align="center" gap={8}>
        {/* <App.Flex flex={1}>
          <App.Button variant="bot-default" small fullWidth onClick={handleTab('history')}><App.Icon icon="clock-bot" /> History</App.Button>
        </App.Flex> */}

        <App.Flex flex={1}>
          <App.Button variant="bot-default" small fullWidth onClick={handleTab('my-earnings')}>
            <App.Icon icon="earn-bot" /> My Earnings
            {earningToBeClaimedCount > 0 ? (
              <App.Flex center className={styles.dot}>
                <App.Text size={12} weight={700} height={1}>{earningToBeClaimedCount}</App.Text>
              </App.Flex>
            ) : null}
          </App.Button>
        </App.Flex>
      </App.Flex>

      <BotHeaderTimer timestamp={upcomingAuction?.startsIn} />
    </App.Flex>
  )
}

export default BotHeader