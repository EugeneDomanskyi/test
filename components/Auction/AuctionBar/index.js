import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionBar = () => {
  const { t } = useTranslation()

  const { wallet, connection } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $gem }) => $gem.referral)
  const auctionWarning = useSelector(({ $gem }) => $gem.auctionWarning)
  const gemsLoading = useSelector(({ $gem }) => $gem.gemsLoading)
  const auctionsLoading = useSelector(({ $gem }) => $gem.auctionsLoading)
  const bidPrice = useSelector($gem.get.bidPrice)

  useEffect(() => {
    if (!connection.loading) {
      if (connection.connected) {
        fetchReferrals()
      } else {
        dispatch($gem.set.referral([]))
      }
    }
  }, [connection])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [wallet])

  const fetchReferrals = async () => {
    const result = await $gem.api.referral(wallet)
    if (result) {
      dispatch($gem.set.referral(result))
    }
  }

  const handleVisible = () => {
    if (!document.hidden) {
      if (wallet) {
        fetchReferrals()
      }
    }
  }

  const getTooltip = () => {
    return auctionWarning ? '' : (
      <App.Text size={14} weight={600}>{t('Earn gems for Connecting your wallet, trading and completing quests on Tegro.')} <App.Text inline size={14} weight={600} color="#A6DC37" onClick={handleWarning} sx={{ textDecoration: 'underline' }}>{t('Learn More')}</App.Text></App.Text>
    )
  }

  const handleWarning = () => {
    dispatch($gem.set.auctionWarning(true))
  }

  return (
    <App.Flex direction={['row', 'column']} align={['center', 'stretch']} justify="space-between" gap={[0, 16]}>
      <App.Flex row align="center" order={[0, 1]} gap={24}>
        <App.Flex row center gap={16} className={cn(styles.frame, {[styles.hidden]: gemsLoading})} flex={[null, 1]}>
          <App.Text size={[28, 16]} weight={600} height={1}>{t('Gems')} {Math.floor(referral.points ?? 0)}</App.Text>
          <App.Tooltip variant="v2" click={isMobile} text={getTooltip()} placement="bottom">
            <App.Icon icon="info2" />
          </App.Tooltip>
        </App.Flex>

        <App.Flex row center gap={16} className={cn(styles.frame, {[styles.hidden]: auctionsLoading})} flex={[null, 1]}>
          <App.Text size={[24, 16]} weight={600} height={1}>{t('{{price}} Gems = 1 Bid', {price: bidPrice})}</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionBar