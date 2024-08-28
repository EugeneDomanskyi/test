import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotBalance = () => {
  const router = useRouter()

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

  const handleShop = () => {
    router.push('/bot/shop')
  }

  const formatBalance = (n) => {
    const value = Math.floor(n ?? 0)
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B'
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    } else {
      return value.toString()
    }
  }

  return (
    <App.Flex row align="center" gap={8} className={styles.container}>
      <App.Flex onClick={handleShop}>
        <App.Icon icon="plus-in-square" />
      </App.Flex>

      <App.Flex row align="center" gap={8}>
        <App.Text size={16} weight={700} height={1}>{formatBalance(user?.points)}</App.Text>
        <Image src="/images/bot/gem.png" width={24} height={20} alt="" />
      </App.Flex>
    </App.Flex>
  )
}

export default BotBalance