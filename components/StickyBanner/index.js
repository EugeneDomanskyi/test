import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

const StickyBanner = () => {
  const router = useRouter()
  const { connection } = useWagmiHelper()

  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)
  const referral = useSelector(({ $gem }) => $gem.referral)
  const stickyBannerVisible = useSelector(({ $app }) => $app.stickyBannerVisible)

  const delayBetweenShow = 24 * 60 * 60 * 1000
  const targetLink = '/gems-dashboard?utm_source=stickyb'

  useEffect(() => {
    if (!connection.loading) {
      if (!connection.connected || (connection.connected && referral?.id)) {
        checkBannerVisibility()
      }
    }
  }, [connection, referral])

  const checkBannerVisibility = () => {
    let result = false
    if (!isApp && (!connection.connected || (connection.connected && !referral.is_telegram_present))) {
      const stickyBannerCloseTime = localStorage.getItem('stickyBannerCloseTime')
      if ( ! stickyBannerCloseTime) {
        result = true
      } else {
        const now = new Date().getTime()
        result = now - stickyBannerCloseTime > delayBetweenShow
      }
    }
    
    dispatch($app.set.stickyBannerVisible(result))
  }

  const handleClose = (redirect = false) => {
    const now = new Date().getTime()
    localStorage.setItem('stickyBannerCloseTime', now)
    dispatch($app.set.stickyBannerVisible(false))

    Amplitude.event('Gems Banner V1', {'Page': Amplitude.page(), 'Activity': redirect ? 'Redirected' : 'Closed'})
  }
  
  const handleOpen = () => {
    router.push(targetLink)
    handleClose(true)
  }

  return (
    <App.Flex center className={cn(styles.container, {[styles.open]: stickyBannerVisible})} onClick={handleOpen}>
      <App.Flex className={styles.textWrapper}>
        <App.Text center size={16} weight={600}>
          Grab ETH at HUGE Discounts! ✨ Join Tegro Auctions!
        </App.Text>
        
        <App.Flex center className={styles.getStarted}>
          <App.Text size={16} weight={600}>
            GET STARTED
          </App.Text>

          <App.Flex className={styles.getStartedIcon}>
            <App.Icon icon="arrow-right" width={16} height={16} />
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex className={styles.lines}>
        <App.Flex className={styles.line} />
        <App.Flex className={styles.line} />
      </App.Flex>

      <App.Flex center className={styles.close} onClick={(e) => {
        e.stopPropagation()
        handleClose()
      }}>
        <App.Icon icon="cross" color="#fff" width={16} height={16} />
      </App.Flex>
    </App.Flex>
  )
}

export default StickyBanner