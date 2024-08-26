import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

const BotBalance = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)

  const [loading, setLoading] = useState(false)

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
    <App.Flex row align="center" gap={24}>
      <App.Flex row align="center" gap={8}>
        <App.Text size={24} weight={700}>Gems:</App.Text>
        <App.Text size={24} weight={700}>{Math.floor(user?.points ?? 0)}</App.Text>
      </App.Flex>

      <App.Button primary2 loading={loading} disabled={loading} onClick={handlePay}>Buy 100 Gems</App.Button>
    </App.Flex>
  )
}

export default BotBalance