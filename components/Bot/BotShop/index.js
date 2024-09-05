import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotShop = () => {
  const initTransaction = {
    amount: 0,
    currency: 'XTR',
    gems: 0,
  }

  const dispatch = useDispatch()

  const handlePay = (amount, gems) => async () => {
    const transaction = {
      amount,
      currency: 'XTR',
      gems,
    }

    const payload = {
      title: `${gems} gems`,
      description: `${gems} gems for bidding`,
      payload: `buy-${gems}-gems`,
      provider_token: '',
      currency: 'XTR',
      prices: [
        { label: 'Price', amount },
      ],
    }

    const result = await $bot.api.invoice(payload)
    if (result && result?.success) {
      TelegramBot.openInvoice(result.invoice, (status) => handleInvoice(status, transaction))
    }
  }

  const handleInvoice = async (status, transaction) => {
    if (status == 'paid') {
      TelegramBot.showPopup('Payment was successful', `You bought ${transaction.gems} gems`)
    } else {
      TelegramBot.showPopup('Payment failed', `But for testing you will receive your ${transaction.gems} gems`)
    }

    const result = await $bot.api.transaction(transaction)
    
    const transactionResponse = JSON.stringify(result)
    TelegramBot.showPopup('Transaction Details', transactionResponse)

    if (result && result.user) {
      dispatch($bot.set.user(result.user))
    }
  }

  return (
    <App.Flex column full center gap={12}>
      <App.Flex row gap={12}>
        <App.Flex className={styles.box} onClick={handlePay(100, 1000)}>
          <App.Flex column full align="center" justify="space-between" className={styles.inner}>
            <App.Text size={16} weight={700} height={1}>Pile Of Gems</App.Text>

            <App.Flex column center gap={4}>
              <Image src="/images/bot/shop-gems-1.png" width={100} height={100} alt="" />
              <App.Text center size={14} weight={700}>1.000 gems</App.Text>
            </App.Flex>

            <App.Text size={24} weight={900} height={1}>100</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex className={styles.box} onClick={handlePay(1000, 10000)}>
          <App.Flex column full align="center" justify="space-between" className={styles.inner}>
            <App.Text size={16} weight={700} height={1}>Barrel of Gems</App.Text>

            <App.Flex column center gap={4}>
              <Image src="/images/bot/shop-gems-2.png" width={100} height={100} alt="" />
              <App.Text center size={14} weight={700}>10.000 gems</App.Text>
            </App.Flex>

            <App.Text size={24} weight={900} height={1}>1000</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex className={styles.box} onClick={handlePay(10000, 100000)}>
        <App.Flex column full align="center" justify="space-between" className={styles.inner}>
          <App.Text size={16} weight={700} height={1}>Chest Full of Gems</App.Text>

          <App.Flex column center gap={4}>
            <Image src="/images/bot/shop-gems-3.png" width={100} height={100} alt="" />
            <App.Text center size={14} weight={700}>100.000 gems</App.Text>
          </App.Flex>

          <App.Text size={24} weight={900} height={1}>10000</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default BotShop