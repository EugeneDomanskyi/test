import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'
import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotAuctionsButton = ({ item, onClaim }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)

  const text = () => {
    switch (item.status) {
      case 'upcoming': return 'Bid Now'
      case 'ongoing': return 'Bid Now'
      case 'closed': return item.current && item.claimHash == '' ? 'Proceed to checkout' : 'Auction Ended'
    }
  }

  const handeClick = async (e) => {
    if (item.status == 'ongoing' && !item.isBiddable) return

    if (item.status == 'ongoing' && !item.current) {
      if (user?.points && user.points * 1 >= item.gemsPrice * 1) {
        const result = await $bot.api.bid({
          auction_id: item.id,
        })

        if (result && !result.error) {
          dispatch($bot.set.balance(user.points - item.gemsPrice))
          dispatch($alert.set.success({ title: t(`Bid Placed!`), text: `You placed a bid for ${item.nextPrice} ${item.token.currency}.` }))
        }
      } else {
        TelegramBot.showPopup('Not enough gems', 'Please top up your gems to place a bid.')
      }
    }

    if (item.status == 'closed') {
      if (item.current) {
        onClaim(item)
      }
    }
  }

  return (
    <button className={cn(styles.button, styles[item.status], {[styles.current]: item.current && item.isClaimable}, {[styles.disabled]: !item.isBiddable || item.status == 'upcoming' || (item.status == 'closed' && !item.isClaimable) || (item.status == 'ongoing' && item.current)})} onClick={handeClick}>
      <App.Text size={20} weight={600} height={1}>{t(text())}</App.Text>
    </button>
  )
}

export default BotAuctionsButton