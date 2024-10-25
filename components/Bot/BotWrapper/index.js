import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'

import Socket from '@/libs/ws.lib'
import TelegramBot from '@/libs/TelegramBot'
import Amplitude from '@/libs/amplitude.lib'

import $bot from '@/store/bot'
import $auction from '@/store/auction'

import App from '@/components/App'
import BotHeader from '@/components/Bot/BotHeader'
import BotTabs from '@/components/Bot/BotTabs'
import BotLoading from '@/components/Bot/BotLoading'
import BotOnboarding from '@/components/Bot/BotOnboarding'
import BotOnboardingModal from '@/components/Bot/BotOnboardingModal'
import BotOutbidModal from '@/components/Bot/BotOutbidModal'

import styles from './styles.module.scss'

const BotWrapper = ({ children }) => {
  const dispatch = useDispatch()
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const earnings_page = useSelector(({ $auction }) => $auction.earnings_page)
  const user = useSelector(({ $bot }) => $bot.user)

  const [loading, setLoading] = useState(true)
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
        fetchMegaAuction()
        fetchAuctions()
        fetchEarnings()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (user?.is_claimed_first_bid === false) {
      dispatch($bot.set.onboard('bid'))
    }
  }, [user?.is_claimed_first_bid])

  useEffect(() => {
    if (isBot) {
      Amplitude.identify(TelegramBot.getId().toString(), 'tgID')
    }
  }, [isBot])

  const handleScriptLoaded = async () => {
    if (TelegramBot.getInitData()) {
      const botResult = TelegramBot.init()
      setIsBot(botResult)
      fetchUser(true)
    } else {
      setIsBot(false)
    }

    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const fetchUser = async (checkOfBalance = false) => {
    const result = await $bot.api.user({referral_code: TelegramBot.getReferralCode()})
    if (result && !result.error) {
      dispatch($bot.set.user(result))

      if (checkOfBalance && result?.is_claimed_onboarding === true && result?.points == 0) {
        dispatch($bot.set.outbid(true))
      }
    }
  }

  const fetchMegaAuction = async () => {
    const result = await $auction.api.mega_auction_v2()
    if (result && !result.error) {
      dispatch($auction.set.mega_auction_v2(result))
    }
  }

  const fetchAuctions = async () => {
    const result = await $auction.api.allTelegram()
    if (result && !result.error) {
      dispatch($auction.set.all(result))
    }
  }

  const fetchEarnings = async (page) => {
    const result = await $auction.api.earnings_v2({ page: page ?? earnings_page.current, limit: earnings_page.limit })
    // const result = await $auction.api.earnings()
    if (result && !result?.error) {
      // dispatch($auction.set.earnings(result))
      dispatch($auction.set.earnings_v2(result.data.won_auctions))
      dispatch($auction.set.earnings_unclaimed_v2(result.data.uncalimed_won_auctions))
      dispatch($auction.set.earnings_page_v2({
        current: result.current_page,
        limit: earnings_page.limit,
        total: result.total_pages,
      }))
    }
  }

  return (
    <App.Flex column full className={styles.container}>
      <Script src="https://telegram.org/js/telegram-web-app.js" onReady={handleScriptLoaded} />
      {isBot !== null && (isBot || !isBot) ? (
        <App.Flex column full>
          <BotHeader />

          <App.Flex fullWidth flex={1} className={styles.content}>
            <App.Flex column className={styles.scroll}>
              {children}
            </App.Flex>
          </App.Flex>

          <BotTabs />

          {user?.is_claimed_onboarding === false ? (
            <BotOnboarding />
          ) : null}

          <BotOnboardingModal />
          <BotOutbidModal />
        </App.Flex>
      ) : (
        <App.Flex center height={300} sx={{overflow: 'auto'}}>
          <App.Text>It is not a bot</App.Text>
        </App.Flex>
      )}

      <BotLoading open={loading} />
    </App.Flex>
  )
}

export default BotWrapper