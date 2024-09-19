import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'

import $gem from '@/store/gem'
import $bot from '@/store/bot'
import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotAuctionsButton = ({ item }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const claim = useSelector(({ $gem }) => $gem.claim)
  const claimId = useSelector(({ $gem }) => $gem.claimId)
  const user = useSelector(({ $bot }) => $bot.user)

  const [loading, setLoading] = useState(false)
  const [forceDisable, setForceDisable] = useState(false)

  const text = () => {
    switch (item.status) {
      case 'upcoming': return 'Bid Now'
      case 'ongoing': return 'Bid Now'
      case 'closed': return item.current && item.claimHash == '' ? 'Proceed to checkout' : 'Auction Ended'
    }
  }

  const handeClick = async (e) => {
    if (forceDisable || (forceDisable && item.current)) return
    
    setForceDisable(true)

    if (navigator.vibrate) {
      navigator.vibrate(500);
    }
    
    if (window.navigator.vibrate) {
      window.navigator.vibrate(500);
    }

    if (item.status == 'ongoing' && !item.current) {
      if (user?.points && user.points * 1 >= item.gemsPrice * 1) {
        const result = await $bot.api.bid({
          auction_id: item.id,
        })

        if (result && !result.error) {
          dispatch($bot.set.balance(user.points - item.gemsPrice))
          // dispatch($alert.set.success({ title: t(`Bid Placed!`), text: `You placed a bid for ${item.nextPrice} ${item.token.currency}.` }))
          dispatch($alert.set.success({ title: t(`Bid Placed!`), text: `You placed a bid for ${item.currentPrice} ${item.token.currency}.` }))
        }
      } else {
        TelegramBot.showPopup('Not enough gems', 'Please top up your gems to place a bid.')
      }
    }

    if (item.status == 'closed') {
      if (item.current && item.claimHash == '' && item.isClaimable) {
        TelegramBot.openLink(`https://${TelegramBot.host()}/bot/claim?id=${item.id}`)
        // dispatch($bot.set.tab('my-earnings'))
        // if (item.claimContract && item.claimContract != '') {
        //   dispatch($gem.set.claim(true))
        //   dispatch($gem.set.claimId(item.id))
        // }
      }
    }

    setForceDisable(false)
  }

  return (
    <button className={cn(styles.button, styles[item.status], {[styles.current]: item.current && item.isClaimable}, {[styles.disabled]: item.status == 'upcoming' || (item.status == 'closed' && !item.isClaimable) || (item.status == 'ongoing' && item.current)})} onClick={handeClick}>
      <App.Text size={20} weight={600} height={1}>{t(text())}</App.Text>
    </button>
  )
}

export default BotAuctionsButton