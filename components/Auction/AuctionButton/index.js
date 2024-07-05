import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import moment from 'moment'

import useInterval from '@/myhooks/useInterval'
import WagmiHelper from '@/libs/WagmiHelper'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'
import AuctionItemSimple from '@/components/Auction/AuctionItemSimple'

const AuctionButton = ({ item, small }) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const stats = useSelector(({ $gem }) => $gem.stats)
  const jwt = useSelector(({ $gem }) => $gem.jwt)

  const [isWarningDialog, setIsWarningDialog] = useState(false)
  const [time, setTime] = useState(item.time)
  const [duration, setDuration] = useState({
    minutes: '00',
    seconds: '00',
    minutesNumber: 0,
    secondsNumber: 0,
    isEnd: false,
  })

  useEffect(() => {
    if (item?.id) {
      setDuration(getDuration())
    }
  }, [item?.id, time])

  const text = () => {
    switch (item.status) {
      case 'upcoming': return 'Notify Me'
      case 'ongoing': return item.wallet ? 'Place Bid' : 'Bid Now'
      case 'closed': return item.current ? 'Proceed to checkout' : 'View History'
    }
  }

  const getDuration = () => {
    const duration = moment.duration(time)
    console.log(duration)
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
    e.stopPropagation()

    if (item.status == 'upcoming') {
      console.log('Upcoming')
    }

    if (item.status == 'ongoing') {
      let currentJwt = jwt
      if (!currentJwt) {
        const signature = await WagmiHelper.signMessage(wallet)
        if (signature) {
          currentJwt = await $gem.api.login({ wallet_address: wallet, signature })
          if (currentJwt && !currentJwt?.error) {
            localStorage.setItem('bidding-token', JSON.stringify({ jwtToken: currentJwt, jwtWallet: wallet }))
          }
        }
      }

      if (currentJwt) {
        if (stats.total_points * 1 >= item.pointsPrice * 1) {
          $gem.api.bid({
            auction_id: item.id,
            jwt_token: currentJwt,
          })
        } else {
          setIsWarningDialog(true)
        }
      }
    }

    if (item.status == 'closed') {
      if (item.current) {
        router.push(`/earnings`)
      } else {
        router.push(`/gems-dashboard/${item.id}`)
      }
    }
  }

  const handleClose = () => {
    setIsWarningDialog(false)
  }

  const handleExchange = () => {
    router.push('/exchange')
  }

  return (
    <>
      {item.status == 'ongoing' && item.current ? (
        <div className={cn(styles.badge, {[styles.small]: small}, {[styles.highlight]: duration.minutesNumber == 0 && duration.secondsNumber <= 5 })}>
          <App.Text size={small ? 16 : 20} weight={600} height={1} color={duration.minutesNumber == 0 && duration.secondsNumber <= 5 ? '#098C47' : '#FFFFFF99'}>{t('Winning In')}</App.Text>
          {item.status == 'ongoing' && item.wallet ? (
            <App.Text size={small ? 16 : 20} weight={600} height={1} color={duration.minutesNumber == 0 && duration.secondsNumber <= 5 ? '#098C47' : '#FFFFFF99'}>{duration.minutes}:{duration.seconds}</App.Text>
          ) : null}
        </div>
      ) : (
        <button className={cn(styles.button, {[styles.small]: small}, styles[item.status], {[styles.empty]: !item.wallet}, {[styles.current]: item.current}, {[styles.highlight]: duration.minutesNumber == 0 && duration.secondsNumber <= 15 })} onClick={handeClick}>
          {item.status == 'ongoing' && item.wallet ? (
            <App.Text size={small ? 16 : 20} weight={600} height={1}>{duration.minutes}:{duration.seconds}</App.Text>
          ) : null}
          <App.Text size={small ? 16 : 20} weight={600} height={1}>{t(text())}</App.Text>
        </button>
      )}

      <App.Dialog open={isWarningDialog} onClose={handleClose} title={t('Warning')}>
        <App.Flex column align="center" gap={32} sx={{ padding: 32 }}>
          <App.Flex column center gap={8}>
            <App.Text center size={24} weight={600} height={1}>{t('You do not have enough gems to bid')}</App.Text>
            <App.Text center size={14} weight={400} color="#FFFFFF99">{t('You will need to earn gems through the various task and bid for the rewards')}</App.Text>
          </App.Flex>

          <App.Flex column gap={12} className={styles.warningBox}>
            <AuctionItemSimple item={item} />

            <App.Flex className={styles.blur} />

            <App.Flex center className={styles.icon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="68" height="59" viewBox="0 0 68 59" fill="none">
                <rect x="22.2751" y="17.9134" width="23.0315" height="31.9882" fill="#0A0A0A"/>
                <path d="M66.2323 43.9633L42.6563 4.86466C41.703 3.3733 40.3895 2.14596 38.8371 1.29579C37.2846 0.445627 35.5431 0 33.773 0C32.003 0 30.2615 0.445627 28.709 1.29579C27.1565 2.14596 25.8431 3.3733 24.8898 4.86466L1.31376 43.9633C0.480921 45.3516 0.0282594 46.9347 0.00128079 48.5534C-0.0256978 50.1722 0.373957 51.7694 1.16007 53.1847C2.06892 54.7778 3.38445 56.1009 4.97219 57.019C6.55993 57.9371 8.36297 58.4172 10.197 58.4102H57.349C59.171 58.4296 60.9659 57.9681 62.5526 57.0722C64.1393 56.1764 65.4615 54.8778 66.386 53.3077C67.1952 51.8777 67.6076 50.2574 67.5806 48.6146C67.5536 46.9717 67.0881 45.3659 66.2323 43.9633ZM33.773 46.115C33.1651 46.115 32.5708 45.9347 32.0653 45.597C31.5598 45.2592 31.1659 44.7792 30.9332 44.2175C30.7006 43.6558 30.6397 43.0378 30.7583 42.4415C30.8769 41.8453 31.1697 41.2976 31.5995 40.8677C32.0294 40.4378 32.5771 40.1451 33.1734 40.0265C33.7696 39.9079 34.3877 39.9687 34.9493 40.2014C35.511 40.434 35.991 40.828 36.3288 41.3335C36.6666 41.839 36.8468 42.4333 36.8468 43.0412C36.8468 43.8564 36.523 44.6383 35.9465 45.2147C35.3701 45.7911 34.5883 46.115 33.773 46.115ZM36.8468 33.8198C36.8468 34.635 36.523 35.4169 35.9465 35.9933C35.3701 36.5698 34.5883 36.8936 33.773 36.8936C32.9578 36.8936 32.176 36.5698 31.5995 35.9933C31.0231 35.4169 30.6992 34.635 30.6992 33.8198V21.5246C30.6992 20.7094 31.0231 19.9276 31.5995 19.3511C32.176 18.7747 32.9578 18.4508 33.773 18.4508C34.5883 18.4508 35.3701 18.7747 35.9465 19.3511C36.523 19.9276 36.8468 20.7094 36.8468 21.5246V33.8198Z" fill="#FFBB01"/>
              </svg>
            </App.Flex>
          </App.Flex>

          <App.Flex column center fullWidth gap={16}>
            <App.Text center size={20} weight={600} height={1}>{t('Increase liquidity now to earn gems')}</App.Text>
            <App.Flex row center fullWidth gap={16}>
              <App.Flex flex={1}>
                <App.Button primary2 outlined fullWidth onClick={handleClose}>{t('Continue')}</App.Button>
              </App.Flex>

              <App.Flex flex={1}>
                <App.Button primary2 fullWidth onClick={handleExchange}>{t('Increase Liquidity')}</App.Button>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Dialog>
    </>
  )
}

export default AuctionButton