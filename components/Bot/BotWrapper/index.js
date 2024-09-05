import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'
import { useRouter } from 'next/router';

import Socket from '@/libs/ws.lib'
import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'
import BotHeader from '@/components/Bot/BotHeader'
import BotTabs from '@/components/Bot/BotTabs'

import styles from './styles.module.scss'

const BotWrapper = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)

  const [isBot, setIsBot] = useState(null)
  const [test, setTest] = useState('')
  const [test2, setTest2] = useState('')

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
        setTest('Window is now visible');
        handleScriptLoaded()
        // Perform any actions you need when the window becomes visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const { returning } = router.query;

    if (returning === 'true') {
      console.log('User has returned from the external website');
      setTest('Hello from external link!')
      handleScriptLoaded()
    } else {
      setTest2(returning)
    }
  }, [router.query])

  const handleScriptLoaded = async () => {
    if (TelegramBot.getInitData()) {
      const botResult = TelegramBot.init()
      
      setIsBot(botResult)

      const result = await $bot.api.user({referral_code: ''})
      if (result) {
        dispatch($bot.set.user(result))
      }

      return
    }
    
    setIsBot(false)
  }

  return (
    <App.Flex column full className={styles.container}>
      <Script src="https://telegram.org/js/telegram-web-app.js" onReady={handleScriptLoaded} />
      {isBot !== null ? (
        isBot || !isBot ? (
          <App.Flex column full>
            <BotHeader />

            {
              test && (
                <>
                  <App.Flex center>
                    <App.Text>test1: {test}</App.Text>
                  </App.Flex>
                  <App.Flex center>
                    <App.Text>test2: {test2}</App.Text>
                  </App.Flex>
                </>
              )
            }

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