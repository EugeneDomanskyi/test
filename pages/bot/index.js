import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'

import TelegramBot from '@/libs/TelegramBot'
import Socket from '@/libs/ws.lib'

import $bot from '@/store/bot'
import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'

import styles from './styles.module.scss'

const Bot  = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)
  const auctions = useSelector(({ $gem }) => $gem.auctions)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)

  const [isBot, setIsBot] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isBot) {
      Socket.on('auctions', 'auction', handleUpdatedAuction)

      fetchAuctions()
      dispatch($gem.set.auctionsUpdateTimer())

      document.addEventListener('visibilitychange', handleVisible)
      return () => {
        document.removeEventListener('visibilitychange', handleVisible)
      }
    }
  }, [isBot])

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

  const handlePay = async () => {
    setLoading(true)

    const payload = {
      title: '100 gems',
      description: '100 gems for bidding',
      payload: 'buy-gems',
      provider_token: '',
      currency: 'XTR',
      prices: [
        { label: 'Price', amount: 1 },
      ],
    }

    const result = await $bot.api.invoice(payload)
    if (result && result?.success) {
      TelegramBot.openInvoice(result.invoice, handleInvoice)
    } else {
      setLoading(false)
    }
  }

  const handleInvoice = async (status) => {
    if (status == 'paid') {
      TelegramBot.showPopup('Payment was successful', 'You bought 100 gems')
    } else {
      TelegramBot.showPopup('Payment failed', 'But for testing you will receive your 100 gems')
    }

    const result = await $bot.api.transaction({
      amount: 1,
      currency: 'XTR',
      gems: 100,
    })

    if (result) {
      dispatch($bot.set.user(result))
    }

    setLoading(false)
  }

  const fetchAuctions = async () => {
    const result = await $gem.api.auctions()
    if (result) {
      dispatch($gem.set.auctions({data: result, wallet: null}))
    }
  }

  const handleUpdatedAuction = async (data) => {
    const result = await $gem.api.auction(data.id)
    if (result) {
      dispatch($gem.set.auctionUpdated({data: {auction: result.auction_id}, wallet: null}))
    }
  }

  const handleVisible = () => {
    if (!document.hidden) {
      fetchAuctions()
    }
  }

  const getSortedAuctions = () => {
    return [...auctions].sort((a, b) => {
      if (a.status == 'ongoing') return -1
      if (b.status == 'ongoing') return 1
      if (a.status == 'upcoming' && b.status == 'upcoming') {
        return new Date(a.startsIn) - new Date(b.startsIn)
      }
      if (a.status == 'upcoming') return -1
      if (b.status == 'upcoming') return 1
      if (a.status == 'closed' && b.status == 'closed') {
        return new Date(b.lastBidTimestamp) - new Date(a.lastBidTimestamp)
      }
      if (a.status == 'closed') return -1
      if (b.status == 'closed') return 1
      return 0
    })
  }

  return (
    <App.Flex column full className={styles.container}>
      <Script src="https://telegram.org/js/telegram-web-app.js" onReady={handleScriptLoaded} />
      
      {isBot !== null ? (
        isBot || !isBot ? (
          <App.Flex column gap={24}>
            <App.Flex row align="center" gap={24}>
              <App.Flex row align="center" gap={8}>
                <App.Text size={24} weight={700}>Gems:</App.Text>
                <App.Text size={24} weight={700}>{Math.floor(user?.points ?? 0)}</App.Text>
              </App.Flex>

              <App.Button primary2 loading={loading} disabled={loading} onClick={handlePay}>Buy 100 Gems</App.Button>
            </App.Flex>

            <App.Flex row wrap align="flex-start" gap={24}>
              {auctions.length ? (
                getSortedAuctions().map(item => <AuctionItem key={item.id + item.time} item={item} />)
              ) : null}
            </App.Flex>
          </App.Flex>
        ) : (
          <App.Flex center height={300}>
            <App.Text>Is not a bot</App.Text>
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

export default Bot