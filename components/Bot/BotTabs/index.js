import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotTabs = () => {
  const dispatch = useDispatch()
  const tab = useSelector(({ $bot }) => $bot.tab)
  const tabHistory = useSelector(({ $bot }) => $bot.tabHistory)

  // useEffect(() => {
  //   if (tabHistory.length === 0) {
  //     TelegramBot.backButton(false, handleBack)
  //   } else {
  //     if (tabHistory.length === 1) {
  //       TelegramBot.backButton(true, handleBack)
  //     }
  //   }
  // }, [tabHistory])

  const handlePage = (newTab) => () => {
    dispatch($bot.set.tab(newTab))
  }

  const handleBack = () => {
    dispatch($bot.set.back())
  }

  return (
    <App.Flex row className={styles.container}>
      <App.Flex column align="center" flex={1} className={cn(styles.tab, {[styles.active]: tab == 'shop'})} onClick={handlePage('shop')}>
        <App.Flex fullWidth height={tab == 'shop' ? 72 : 56} column justify="center" align="center" sx={{ marginTop: tab == 'shop' ? -24 : -4 }}>
          <Image src="/images/bot/shop.png" width={tab == 'shop' ? 72 : 56} height={tab == 'shop' ? 56 : 48}  alt="" />
        </App.Flex>
        <App.Text size={13} weight={tab == 'shop' ? 700 : 400} color={tab == 'shop' ? '#FFBB01' : '#fff'}>Shop</App.Text>
      </App.Flex>

      <App.Flex column align="center" flex={1} className={cn(styles.tab, {[styles.active]: tab == 'auctions'})} onClick={handlePage('auctions')}>
        <App.Flex fullWidth height={tab == 'auctions' ? 72 : 56} column justify="flex-end" align="center" sx={{ marginTop: tab == 'auctions' ? -24 : -4 }}>
          <Image src="/images/bot/auctions.png" width={tab == 'auctions' ? 72 : 56} height={tab == 'auctions' ? 72 : 56}  alt="" />
        </App.Flex>
        <App.Text size={13} weight={tab == 'auctions' ? 700 : 400} color={tab == 'auctions' ? '#FFBB01' : '#fff'} height={1}>Auctions</App.Text>
      </App.Flex>

      <App.Flex column align="center" flex={1} className={cn(styles.tab, {[styles.active]: tab == 'earn'})} onClick={handlePage('earn')}>
        <App.Flex fullWidth height={tab == 'earn' ? 72 : 56} column justify="center" align="center" sx={{ marginTop: tab == 'earn' ? -24 : -4 }}>
          <Image src="/images/bot/earn.png" width={tab == 'earn' ? 72 : 56} height={tab == 'earn' ? 56 : 48}  alt="" />
        </App.Flex>
        <App.Text size={13} weight={tab == 'earn' ? 700 : 400} color={tab == 'earn' ? '#FFBB01' : '#fff'}>Earn</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default BotTabs