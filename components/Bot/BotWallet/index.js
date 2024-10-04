import { useDispatch, useSelector } from 'react-redux'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'
import $auction from '@/store/auction'
import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotWallet = () => {
  const dispatch = useDispatch()
  const earningToBeClaimedCount = useSelector($auction.get.earningToBeClaimedCount)

  const handleMyEarnings = () => {
    dispatch($bot.set.tab('my-earnings'))
  }

  const handleHistory = () => {
    dispatch($bot.set.tab('history'))
  }

  const handleCopyInitData = () => {
    navigator.clipboard.writeText(JSON.stringify(TelegramBot.getInitData(), null, 2))
    dispatch($alert.set.success({ title: 'initalData copied to clipboard'}))
  }

  return (
    <App.Flex column align="center" gap={8}>
      <App.Flex row align="center" gap={8}>
        <App.Button variant="bot-default" small onClick={handleMyEarnings}>
          <App.Icon icon="earn-bot" /> My Earnings
          {earningToBeClaimedCount > 0 ? (
            <App.Flex center className={styles.dot}>
              <App.Text size={12} weight={700} height={1}>{earningToBeClaimedCount}</App.Text>
            </App.Flex>
          ) : null}
        </App.Button>

        {/* <App.Button variant="bot-default" small onClick={handleHistory}>History</App.Button> */}

        {TelegramBot.host() != 'tegro.com' ? (
          <App.Button variant="bot-default" small onClick={handleCopyInitData}>Copy initData</App.Button>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default BotWallet