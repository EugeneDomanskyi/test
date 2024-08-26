import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'

import Socket from '@/libs/ws.lib'
import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'
import BotBalance from '@/components/Bot/BotBalance'
import BotWallet from '@/components/Bot/BotWallet'

import styles from './styles.module.scss'

const BotWrapper = ({ children }) => {
  const dispatch = useDispatch()
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)

  const [isBot, setIsBot] = useState(null)

  useEffect(() => {
    if (socketConnected) {
      Socket.subscribe('auctions')

      return () => {
        Socket.unsubscribe('auctions')
      }
    }
  }, [socketConnected])

  const handleScriptLoaded = async () => {
    if (TelegramBot.getInitData()) {
      const botResult = TelegramBot.init()

      const result = await $bot.api.user()
      if (result) {
        dispatch($bot.set.user(result))
      }

      setIsBot(botResult)
      return
    }
    
    setIsBot(false)
  }

  return (
    <App.Flex column full className={styles.container}>
      <Script src="https://telegram.org/js/telegram-web-app.js" onReady={handleScriptLoaded} />
      {isBot !== null ? (
        isBot || !isBot ? (
          <App.Flex column gap={24}>
            <BotBalance />
            <BotWallet />
            {children}
          </App.Flex>
        ) : (
          <App.Flex center height={300}>
            <App.Text>It is not a bot</App.Text>
          </App.Flex>
        )
      ) : (
        <App.Flex center height={300}>
          <App.Text>Loading...</App.Text>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default BotWrapper