import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'
import Amplitude from '@/libs/amplitude.lib'

import $gem from '@/store/gem'
import $bot from '@/store/bot'
import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotAuctionsButton = ({ item, onClaim }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)
  const onboard = useSelector(({ $bot }) => $bot.onboard)

  const [loading, setLoading] = useState(false)

  const text = () => {
    switch (item.status) {
      case 'upcoming': return 'Bid Now'
      case 'ongoing': return 'Bid Now'
      case 'closed': return item.current && item.claimHash == '' ? `Pay ${item.currentPrice} ${item.token.currency}` : 'Auction Ended'
    }
  }

  const handeClick = async (e) => {
    if (item.status == 'ongoing' && !item.isBiddable) return

    if (loading) return

    setLoading(true)

    if (item.status == 'ongoing' && !item.current) {
      if (user?.points && user.points * 1 >= item.gemsPrice * 1) {
        const result = await $bot.api.bid({
          auction_id: item.id,
        })

        if (result && !result.error) {
          Amplitude.event(`Bid Placed`, {
            'Page': 'Auctions',
            'Source': 'Telegram',
          })

          const price = formatUnits((result.last_bid_price > 0 ? result.last_bid_price : result.start_price).toString(), result.auction_token.decimals)

          dispatch($bot.set.balance(user.points - item.gemsPrice))
          dispatch($alert.set.success({ title: t(`Bid Placed!`), text: `You placed a bid for ${price} ${item.token.currency}.` }))

          if (onboard == 'bid') {
            dispatch($bot.set.onboard('modal'))
          }
        } else {
          if (result?.error && result.error == 'auction_gems_criteria_failed') {
            dispatch($bot.set.megaModal(true))
          }
        }
      } else {
        Amplitude.event(`Bid Failed`, {
          'Page': 'Auctions',
          'Source': 'Telegram',
        })
        // TelegramBot.showPopup('Not enough gems', 'Please top up your gems to place a bid.')
        dispatch($bot.set.outbid(true))
      }
    }

    if (item.status == 'closed') {
      if (item.current) {
        Amplitude.event(`Initiated Prize Claim`, {
          'Page': 'Auctions',
          'Source': 'Telegram',
        })

        await onClaim(item)
      }
    }

    setLoading(false)
  }

  return (
    <button className={cn(styles.button, styles[item.status], {[styles.current]: item.current && item.isClaimable}, {[styles.dark]: loading}, {[styles.disabled]: !item.isBiddable || item.status == 'upcoming' || (item.status == 'closed' && !item.isClaimable) || (item.status == 'ongoing' && item.current)})} onClick={handeClick}>
      {loading ? (
        <App.Loader size={20} />
      ) : (
        <App.Text size={20} weight={600} height={1}>{t(text())}</App.Text>
      )}
    </button>
  )
}

export default BotAuctionsButton