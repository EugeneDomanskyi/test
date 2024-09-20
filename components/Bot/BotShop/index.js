import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const shopItems = [
  {
    title: 'Pile Of Gems',
    gems: 1000,
    price: typeof window != 'undefined' ? (TelegramBot.host() == 'tegro.com' ? 500 : 1) : 500,
    image: '/images/bot/shop-gems-1.png',
  },
  {
    title: 'Barrel of Gems',
    gems: 10000,
    price: 5000,
    image: '/images/bot/shop-gems-2.png',
  },
  {
    title: 'Chest Full of Gems',
    gems: 100000,
    price: 50000,
    image: '/images/bot/shop-gems-3.png',
  },
]

const BotShop = () => {
  const dispatch = useDispatch()

  const [playAnimationId, setPlayAnimationId] = useState(null)

  const handlePay = (amount, gems) => async () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // Vibrate for 50 milliseconds
    }

    setPlayAnimationId(amount)

    const payload = {
      title: `${gems} gems`,
      description: `${gems} gems for bidding`,
      payload: gems.toString(),
      provider_token: '',
      currency: 'XTR',
      prices: [
        { label: 'Price', amount },
      ],
    }

    const result = await $bot.api.invoice(payload)
    if (!result?.error) {
      TelegramBot.openInvoice(result, handleInvoice)
    }
  }

  const handleInvoice = async (status) => {
    if (status == 'paid' || status == 'pending') {
      fetchUser()
    }
  }

  const fetchUser = async () => {
    const result = await $bot.api.user({referral_code: ''})
    if (result && !result.error) {
      dispatch($bot.set.user(result))
    }
  }

  return (
    <App.Flex column fullWidth center gap={12}>
      <App.Flex row gap={12} justify="center" sx={{flexWrap: 'wrap'}}>
        {
          shopItems.map((item, index) => {
            return (
              <App.Flex key={index} className={cn(styles.box, {[styles.scaleAnimation]: item.price === playAnimationId})} onClick={handlePay(item.price, item.gems)}>
                <App.Flex column full align="center" justify="space-between" className={styles.inner}>
                  <App.Text size={16} weight={700} height={1}>{item.title}</App.Text>

                  <App.Flex column center gap={4}>
                    <Image src={item.image} width={100} height={100} alt="" />
                    <App.Text center size={14} weight={700}>{item.gems.toLocaleString()} gems</App.Text>
                  </App.Flex>

                  <App.Flex row align="flex-start" gap={4}>
                    <App.Text size={24} weight={900} height={1}>{item.price.toLocaleString()}</App.Text>
                    <img src="/images/tg-star.png" alt="" />
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            )
          })
        }
        {/* <App.Flex className={cn(styles.box, {[styles.scaleAnimation]: playAnimation})} onClick={handlePay(5000, 10000)}>
          <App.Flex column full align="center" justify="space-between" className={styles.inner}>
            <App.Text size={16} weight={700} height={1}>Barrel of Gems</App.Text>

            <App.Flex column center gap={4}>
              <Image src="/images/bot/shop-gems-2.png" width={100} height={100} alt="" />
              <App.Text center size={14} weight={700}>10.000 gems</App.Text>
            </App.Flex>

            <App.Text size={24} weight={900} height={1}>5000</App.Text>
          </App.Flex>
        </App.Flex> */}
      </App.Flex>

      {/* <App.Flex className={cn(styles.box, {[styles.scaleAnimation]: playAnimation})} onClick={handlePay(50000, 100000)}>
        <App.Flex column full align="center" justify="space-between" className={styles.inner}>
          <App.Text size={16} weight={700} height={1}>Chest Full of Gems</App.Text>

          <App.Flex column center gap={4}>
            <Image src="/images/bot/shop-gems-3.png" width={100} height={100} alt="" />
            <App.Text center size={14} weight={700}>100.000 gems</App.Text>
          </App.Flex>

          <App.Text size={24} weight={900} height={1}>50000</App.Text>
        </App.Flex>
      </App.Flex> */}
    </App.Flex>
  )
}

export default BotShop