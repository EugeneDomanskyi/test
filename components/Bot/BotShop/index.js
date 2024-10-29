import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'
import Amplitude from '@/libs/amplitude.lib'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const shopItems = [
  {
    title: 'Pile Of Gems',
    gems: 10000,
    price: typeof window != 'undefined' ? (TelegramBot.host() == 'tegro.com' ? 50 : 1) : 50,
    image: '/images/bot/shop-gems-1.png',
  },
  {
    title: 'Barrel of Gems',
    gems: 50000,
    price: 250,
    image: '/images/bot/shop-gems-2.png',
  },
  {
    title: 'Chest Full of Gems',
    gems: 100000,
    price: 500,
    image: '/images/bot/shop-gems-3.png',
  },
]

const BotShop = () => {
  const dispatch = useDispatch()

  const [playAnimationId, setPlayAnimationId] = useState(null)

  const handlePay = (amount, gems) => async () => {
    setPlayAnimationId(amount)

    Amplitude.event(`Buy Gems`, {
      'Page': 'Shop',
      'Source': 'Telegram',
      'Amount': gems,
    })

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
    <App.Flex column fullWidth center gap={32} className={styles.container}>
      <App.Flex column fullWidth gap={16}>
        <App.Flex center className={styles.title}>
          <Image src="/images/bot/shop-title-1.png" width={213} height={43} alt="" />

          <App.Flex center className={styles.text}>
            <App.Text size={16} weight={700} height={1} color="#FFBB01">Offers</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column fullWidth gap={4} className={styles.offer}>
          <App.Flex row align="center" justify="space-between" className={styles.header}>
            <App.Flex row align="center" width="45%">
              <App.Text size={16} weight={700} color="#FFBB01" sx={{ textShadow: '0px 1.484px 9.063px rgba(182, 0, 0, 0.55), 0px 1px 3px rgba(0, 0, 0, 0.25)' }}>First Purchase Discount</App.Text>
            </App.Flex>

            <App.Flex row align="center" justify="flex-end" width="45%">
              <App.Text right size={28} weight={800} color="#FFBB01" sx={{ textShadow: '0px 1.484px 9.063px rgba(182, 0, 0, 0.55), 0px 1px 3px rgba(0, 0, 0, 0.25)' }}>50% OFF</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row justify="space-between">
            <App.Flex column align="center" width="40%" gap={4}>
              <Image src="/images/bot/shop-image-1.png" width={76} height={76} alt="" />

              <App.Text center size={13} weight={900} height={1}>10,000 gems</App.Text>
            </App.Flex>

            <App.Flex column justify="center" align="flex-start" width="40%" gap={8}>
              <App.Text size={17} weight={700} height={1}>Pile of Gems</App.Text>
              <App.Flex row align="center">
                <App.Flex row align="center" gap={4}>
                  <App.Text lineThrough size={20} weight={700} height={1}>50</App.Text>
                  <App.Text size={20} weight={800} height={1}>25</App.Text>
                </App.Flex>

                <Image src="/images/bot/star.png" width={23} height={22} alt="" />
              </App.Flex>

              <App.Button variant="bot" small>Buy Now</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      {/* <App.Flex row gap={12} justify="center" sx={{flexWrap: 'wrap'}}>
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
      </App.Flex> */}
    </App.Flex>
  )
}

export default BotShop