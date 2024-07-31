import { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import moment from 'moment'

import useInterval from '@/myhooks/useInterval'
import WagmiHelper from '@/libs/WagmiHelper'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'
import $alert from '@/store/alert'

import App from '@/components/App'
import AuctionItemSimple from '@/components/Auction/AuctionItemSimple'

import styles from './styles.module.scss'

const AuctionButton = ({ item, small, share, short, telegram }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { wallet, connect } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const jwt = useSelector(({ $gem }) => $gem.jwt)
  const referral = useSelector(({ $gem }) => $gem.referral)

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
    if (share) {
      return `Tweet Now ${isMobile || short ? '' : '(Get 50 Gems)'}`
    }

    if (telegram) {
      return `Connect Telegram`
    }

    switch (item.status) {
      case 'upcoming': return 'Notify Me'
      case 'ongoing': return item.wallet ? 'Place Bid' : 'Bid Now'
      case 'closed': return item.current ? (item.claimHash == '' ? 'Proceed to checkout' : 'View History') : 'View History'
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

  const getJwt = async (currentWallet) => {
    let currentJwt = jwt
    if (!currentJwt) {
      const signature = await WagmiHelper.signMessage(currentWallet)
      if (signature) {
        currentJwt = await $gem.api.login({ wallet_address: currentWallet, signature })
        if (currentJwt && !currentJwt?.error) {
          localStorage.setItem('bidding-token', JSON.stringify({ jwtToken: currentJwt, jwtWallet: currentWallet }))
        }
      }
    }

    return currentJwt
  }

  const getUserInfo = async () => {
    if (wallet && referral?.id) {
      return { wallet, id: referral.id, points: referral.points, isTelegram: referral.is_telegram_present }
    }

    let connectedWallet = wallet
    if ( ! connectedWallet) {
      connectedWallet = await connect()
    }

    let isTelegram = referral?.is_telegram_present
    let points = referral?.points
    let userId = referral?.id
    if (connectedWallet && !userId) {
      const result = await $gem.api.referral(connectedWallet)
      if (result) {
        userId = result.id
        isTelegram = result.is_telegram_present
        points = result.points
      }
    }

    return { wallet: connectedWallet, id: userId, points, isTelegram }
  }

  const handeClick = async (e) => {
    e.stopPropagation()
    const user = await getUserInfo()
    if (!user?.wallet || !user?.id) {
      return
    }

    if (share) {
      handleShare()
      $gem.api.addGems(user.wallet, { reason: 'twitter_share' })
      return
    }

    if (item.status == 'upcoming') {
      if ( ! user.isTelegram) {
        let host = 'd'
        if (window.location.hostname == 'testnet.tegro.com') {
          host = 't'
        }

        if (window.location.hostname == 'tegro.com') {
          host = 'p'
        }

        window.open(`${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}?start=${user.wallet}_${user.id}_${host}`, '_blank')
      }
    }

    if (item.status == 'ongoing') {
      const currentJwt = await getJwt(user.wallet)
      if (currentJwt) {
        if (user.points * 1 >= item.gemsPrice * 1) {
          const result = await $gem.api.bid({
            auction_id: item.id,
            jwt_token: currentJwt,
          })

          if (result && !result.error) {
            dispatch($gem.set.totalGems(user.points - item.gemsPrice))
            dispatch($alert.set.success({ title: t(`Bid Placed!`), text: t(`You placed a bid for ${item.nextPrice} ${item.token.currency}.`) }))
          }
        } else {
          dispatch($gem.set.auctionWarning(true))
        }
      }
    }

    if (item.status == 'closed') {
      if (item.current && item.claimHash == '') {
        if (item.claimContract && item.claimContract != '') {
          dispatch($gem.set.claim(true))
          dispatch($gem.set.claimId(item.id))
        }
      } else {
        router.push(`/gems-dashboard/${item.id}`)
      }
    }
  }

  const handleShare = () => {
    const link = `${window.location.origin}/gems-dashboard#auction`
    const tweetText = encodeURIComponent(`
👀 1 ETH for just $100? Absolutely! ✨

Grab it on Tegro auctions! 🐯

Bid with Gems & bag cryptos at insane prices! ⚡️

Time to stop buying the dip and start placing bids! ✅

Don't fade, join the fun today: ${link}
`)
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(tweetUrl, '_blank')
  }

  return (
    <>
      {item.status == 'ongoing' && item.current ? (
        <div className={cn(styles.badge, {[styles.small]: small}, {[styles.highlight]: duration.minutesNumber == 0 && duration.secondsNumber <= 5 })}>
          <App.Text size={small ? 16 : 20} weight={600} height={1} color={duration.minutesNumber == 0 && duration.secondsNumber <= 5 ? '#098C47' : '#FFFFFF99'}>{t('Winning In')}</App.Text>
          {item.wallet ? (
            <App.Text size={small ? 16 : 20} weight={600} height={1} color={duration.minutesNumber == 0 && duration.secondsNumber <= 5 ? '#098C47' : '#FFFFFF99'}>{duration.minutes}:{duration.seconds}</App.Text>
          ) : null}
        </div>
      ) : (
        <button className={cn(styles.button, {[styles.small]: small}, {[styles.share]: share}, styles[item.status], {[styles.telegram]: telegram}, styles[item.status], {[styles.empty]: !item.wallet}, {[styles.current]: item.current}, {[styles.highlight]: duration.minutesNumber == 0 && duration.secondsNumber <= 15 })} onClick={handeClick}>
          {share ? (
            <App.Icon icon="x2" />
          ) : null}

          {telegram ? (
            <App.Icon icon="telegram2" />
          ) : null}

          {item.status == 'ongoing' && item.wallet ? (
            <App.Text size={small ? 16 : 20} weight={600} height={1}>{duration.minutes}:{duration.seconds}</App.Text>
          ) : null}
          <App.Text size={small ? 16 : 20} weight={600} height={1}>{t(text())}</App.Text>
        </button>
      )}
    </>
  )
}

export default AuctionButton