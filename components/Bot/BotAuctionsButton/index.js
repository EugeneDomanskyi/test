import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import moment from 'moment'

import useInterval from '@/myhooks/useInterval'
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
  const [time, setTime] = useState(item.time)
  const [duration, setDuration] = useState({
    minutes: '00',
    seconds: '00',
    minutesNumber: 0,
    secondsNumber: 0,
    isEnd: false,
  })

  useEffect(() => {
    setTime(item.time)
  }, [item?.lastBidTimestamp])

  useEffect(() => {
    if (item?.id) {
      setDuration(getDuration())
    }
  }, [item?.id, time])

  const text = () => {
    switch (item.status) {
      case 'upcoming': return 'Notify Me'
      case 'ongoing': return 'Bid Now'
      case 'closed': return item.current && item.claimHash == '' ? 'Proceed to checkout' : 'Auction Ended'
    }
  }

  const getDuration = () => {
    const duration = moment.duration(time)
    const minutes = duration.minutes()
    const seconds = duration.seconds()
    return {
      minutes: minutes > 9 ? minutes : `0${minutes}`,
      seconds: seconds > 9 ? seconds : `0${seconds}`,
      minutesNumber: minutes,
      secondsNumber: seconds,
      isEnd: time <= 0,
    }
  }

  const tick = () => {
    setTime(time - 1000)
  }

  useInterval(tick, duration.isEnd ? null : 1000)

  const handeClick = async (e) => {
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
      if (item.current && item.claimHash == '' && item.isClaimable) {
        if (item.claimContract && item.claimContract != '') {
          // dispatch($gem.set.claim(true))
          // dispatch($gem.set.claimId(item.id))
        }
      }
    }
  }

  return (
    <button className={cn(styles.button, styles[item.status], {[styles.current]: item.current && item.isClaimable}, {[styles.disabled]: !item.isClaimable || (item.status == 'ongoing' && item.current)}, {[styles.highlight]: duration.minutesNumber == 0 && duration.secondsNumber <= 15 && duration.secondsNumber > 0 })} onClick={handeClick}>
      <App.Text size={20} weight={600} height={1}>{t(text())}</App.Text>
    </button>
  )
}

export default BotAuctionsButton