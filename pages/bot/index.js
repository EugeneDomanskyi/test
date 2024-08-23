import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Script from 'next/script'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const Bot  = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)

  const [isBot, setIsBot] = useState(null)
  const [loading, setLoading] = useState(false)

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

  return (
    <App.Flex column full className={styles.container}>
      <Script src="https://telegram.org/js/telegram-web-app.js" onReady={handleScriptLoaded} />
      
      {isBot !== null ? (
        isBot || !isBot ? (
          <App.Flex row align="center" gap={24}>
            <App.Flex row align="center" gap={8}>
              <App.Text size={24} weight={700}>Gems:</App.Text>
              <App.Text size={24} weight={700}>{Math.floor(user?.points ?? 0)}</App.Text>
            </App.Flex>

            <App.Button primary2 loading={loading} onClick={handlePay}>Buy 100 Gems</App.Button>
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