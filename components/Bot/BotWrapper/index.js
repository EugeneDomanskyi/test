import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'

import Socket from '@/libs/ws.lib'
import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'
import BotHeader from '@/components/Bot/BotHeader'
import BotTabs from '@/components/Bot/BotTabs'

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchUser()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    };
  }, [])

  const handleScriptLoaded = async () => {
    if (TelegramBot.getInitData()) {
      const botResult = TelegramBot.init()
      setIsBot(botResult)
      fetchUser()
      return
    }
    
    setIsBot(false)
  }

  const fetchUser = async () => {
    const result = await $bot.api.user({referral_code: ''})
    if (result && result.user) {
      dispatch($bot.set.user(result.user))
    }
  }

  return (
    <App.Flex column full className={styles.container}>
      <Script src="https://telegram.org/js/telegram-web-app.js" onReady={handleScriptLoaded} />
      {isBot !== null ? (
        isBot || !isBot ? (
          <App.Flex column full>
            <BotHeader />

            <App.Flex fullWidth flex={1} className={styles.content}>
              <App.Flex column className={styles.scroll}>
                {children}
              </App.Flex>
            </App.Flex>

            <BotTabs />
          </App.Flex>
        ) : (
          <App.Flex center height={300} sx={{overflow: 'auto'}}>
            <App.Text>It is not a bot</App.Text>
          </App.Flex>
        )
      ) : (
        <App.LoaderBlock height={300} />
      )}
    </App.Flex>
  )
}

export default BotWrapper