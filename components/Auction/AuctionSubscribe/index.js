import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionSuybscribe = () => {
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const showTelegramSubscription = useSelector(({ $gem }) => $gem.showTelegramSubscription)
  const referral = useSelector(({ $gem }) => $gem.referral)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (showTelegramSubscription) {
      const notShowTelegramSubscription = localStorage.getItem('notShowTelegramSubscription')
      if (!notShowTelegramSubscription) {
        setIsOpen(true)
      }
    }
  }, [showTelegramSubscription])

  const handleClose = () => {
    setIsOpen(false)
    dispatch($gem.set.showTelegramSubscription(false))
    localStorage.setItem('notShowTelegramSubscription', 1)
  }

  const handleSubscribe = () => {
    if (wallet && referral.id) {
      Amplitude.event(`Notifications Initiated`, {
        'Page': 'Auction',
      })

      let host = 'd'
      if (window.location.hostname == 'testnet.tegro.com') {
        host = 't'
      }

      if (window.location.hostname == 'tegro.com' || window.location.hostname == 'nft20-git-production-toraverse.vercel.app') {
        host = 'p'
      }

      window.open(`${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}?start=${wallet}_${referral.id}_${host}`, '_blank')
      handleClose()
    }
  }

  return (
    <App.Flex row gap={8} className={cn(styles.container, {[styles.open]: isOpen})}>
      <App.Flex center className={styles.bellCircle}>
        <App.Icon icon="bell" />
      </App.Flex>

      <App.Flex flex={1} column align="flex-start" gap={8}>
        <App.Flex row fullWidth gap={8} align="center" justify="space-between">
          <App.Text size={16} weight={600} height={1}>Get notified if you get outbid</App.Text>
          <App.Flex center onClick={handleClose} className={styles.close}>
            <App.Icon icon="cross" color="#fff" />
          </App.Flex>
        </App.Flex>

        <App.Text size={14} weight={400} height={1.4} color="#FFFFFF99">Connect your Telegram  to enable notifications. You get notified every time someone outbids you.</App.Text>

        <App.Button telegram small onClick={handleSubscribe}><App.Icon icon="telegram2" width={16} height={16} /> Connect Telegram</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionSuybscribe