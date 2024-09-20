import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'

import Socket from '@/libs/ws.lib'
import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'
import $auction from '@/store/auction'

import App from '@/components/App'
import BotHeader from '@/components/Bot/BotHeader'
import BotTabs from '@/components/Bot/BotTabs'

import styles from './styles.module.scss'

const BotWrapper = ({ children }) => {
  const dispatch = useDispatch()
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const debug = useSelector(({ $auction }) => $auction.debug)

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
        fetchAuctions()
        fetchEarnings()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
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
    if (result && !result.error) {
      dispatch($bot.set.user(result))
    }
  }

  const fetchAuctions = async () => {
    const result = await $auction.api.allTelegram()
    if (result && !result.error) {
      dispatch($auction.set.all(result))
    }
  }

  const fetchEarnings = async () => {
    const result = await $auction.api.earnings()
    if (result && !result?.error) {
      dispatch($auction.set.earnings(result))
    }
  }

  return (
    <App.Flex column full className={styles.container}>
      {
        debug && debug.length > 0 && (
          <App.Flex center height={50} sx={{position: 'fixed', zIndex: 1111, top: 0, left: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.3)'}}>
            <App.Text>Debug mode</App.Text>
            <App.Flex column gap={8}>
              {
                debug.map((item, index) => (
                  <App.Text key={index}>{item}</App.Text>
                ))
              }
            </App.Flex>
          </App.Flex>
        )
      }
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