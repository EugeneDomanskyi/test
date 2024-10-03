import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
  const earnings_page = useSelector(({ $auction }) => $auction.earnings_page)
  const earnings_limit = useSelector(({ $auction }) => $auction.earnings_limit)

  useEffect(() => {
    fetchEarnings()
  }, [])

  const handleTab = (uri) => () => {
    dispatch($bot.set.tab(uri))
  }

  const fetchEarnings = async (page) => {
    // const result = await $auction.api.earnings_v2({ page: page ?? earnings_page, limit: earnings_limit })
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

      {/* <App.Flex fullWidth row align="center" gap={8}>
        <App.Flex flex={1}>
          <App.Button variant="bot-default" small fullWidth onClick={handleTab('history')}><App.Icon icon="clock-bot" /> History</App.Button>
        </App.Flex>
      </App.Flex> */}

      <BotHeaderTimer timestamp={upcomingAuction?.startsIn} />
    </App.Flex>
  )
}

export default BotHeader