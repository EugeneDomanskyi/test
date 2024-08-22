import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import cn from 'classnames'

import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionImage from '@/components/Auction/AuctionImage'
import AuctionCountdown from '@/components/Auction/AuctionCountdown'
import AuctionButton from '@/components/Auction/AuctionButton'

import styles from './styles.module.scss'

const AuctionItem = ({ item, onClear }) => {
  const router = useRouter()
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $gem }) => $gem.referral)

  const [host, setHost] = useState()

  useEffect(() => {
    setHost(window.location.hostname)
  }, [])

  useEffect(() => {
    if (item?.updated) {
      setTimeout(() => {
        dispatch($gem.set.auctionNotUpdated(item))
      }, 3000)
    }
  }, [item?.updated])

  const firstText = () => {
    switch (item.status) {
      case 'upcoming': return 'Starts in'
      case 'ongoing': return item.wallet ? 'Bid by' : 'Be the first to bid'
      case 'closed': return item.current ? 'You won the auction!' : 'Winning bid by'
    }
  }

  const secondText = () => {
    switch (item.status) {
      case 'upcoming': return
      case 'ongoing': return item.wallet ? getShort(item.wallet) : 'hide'
      case 'closed': return item.current ? 'hide' : getShort(item.wallet)
    }
  }

  const nextLine = () => {
    switch (item.status) {
      case 'upcoming': return <App.Flex row center gap={8} height={20}><App.Text center size={14} weight={600} height={1}>{referral.is_telegram_present ? 'Get +50 gems on Tweeting' : 'Get notified when auction starts'}</App.Text></App.Flex>
      case 'ongoing': return null
      case 'closed': return item.current && item.claimHash == '' ? (
        <App.Flex row center gap={8} height={20}>
          {item.isClaimable ? (
            <App.Flex row center>
              <App.Text size={14} weight={400} height={1} color="#737373">{t('Claim in')}</App.Text>
              <AuctionCountdown red time={item.claimTime} onZero={handleClaimOver} />
            </App.Flex>
           ) : (
            <App.Text center size={14} weight={600} height={1}>Claim your winnings in 72 hours!</App.Text>
           )}
          <App.Tooltip variant="v2" click={isMobile} text={'You have to claim your winnings within 72 hours. If not, it gets deposited back to the reward pool.'} placement="top-end">
            <App.Icon icon="info2" width={20} height={20} />
          </App.Tooltip>
        </App.Flex>
      ) : (
        <App.Flex row center gap={8} height={20}>
          <App.Icon icon="cup2" />
          <App.Text size={14} weight={600} color="#FFBB01" height={1}>Winning bid: {getShort(item.wallet)}</App.Text>
        </App.Flex>
      )
    }
  }

  const getShort = (address) => {
    const n = 4
    return address ? `${address.substring(0, n)}...${address.substring(address.length - n)}` : ''
  }

  const handleClick = () => {
    if (item.status != 'upcoming') {
      router.push(`/auctions/${item.id}`)
    }
  }

  const handleClear = async (e) => {
    e.stopPropagation()
    if (onClear) {
      onClear(item.id)
    }
  }

  const handleClaimOver = () => {
    dispatch($gem.set.auctionNotClaim(item))
  }

  return (
    <App.Flex column gap={10} className={styles.item}>
      {item.updated ? (
        <App.Flex className={styles.ripple}>
          <App.Flex className={styles.circle} />
        </App.Flex>
      ) : null}

      <AuctionImage item={item} />

      <App.Flex column gap={12} className={styles.itemContent}>
        <App.Text center nowrap size={14} weight={600} height={1}>{item.status == 'closed' && (!item.current || (item.current && item.claimHash != '')) ? t('{{title}} auctioned at', {title: item.name}) : t('Buy {{title}} for', {title: item.name})}</App.Text>
        {item.status == 'closed' && (!item.current || (item.current && item.claimHash != '')) ? (
          <App.Text center nowrap size={24} weight={600} height={1} color="#A6DC37">{item.discount}% {t('OFF')}</App.Text>
        ) : (
          <App.Text center nowrap size={24} weight={600} height={1}>{item.currentPrice} {item.token.currency}</App.Text>
        )}

        {item.status == 'closed' && (!item.current || (item.current && item.claimHash != '')) ? (
          <App.Flex row center gap={8} height={22}>
            <App.Icon icon="users" />
            <App.Text size={14} weight={600} height={1}>{item.bidsCount} Bidder{item.bidsCount != 1 ? 's' : ''}</App.Text>
          </App.Flex>
        ) : (
          <App.Flex center gap={8} className={cn(styles.info, {[styles.win]: item.status == 'closed' && item.current})}>
            <App.Text size={14} weight={400} height={1} color={item.status == 'closed' && item.current ? '#53F19C' : "#737373"}>{t(firstText())}</App.Text>
            {secondText() != 'hide' ? (
              item.status == 'upcoming' ? (
                <AuctionCountdown red time={item.startsIn} />
              ) : (
                <App.Text weight={400} height={1}>{t(secondText())}</App.Text>
              )
            ) : null}
          </App.Flex>
        )}

        {nextLine()}
        
        {item.status != 'closed' || (item.status == 'closed' && item.current && item.claimHash == '') ? (
          <AuctionButton key={item.currentPrice} item={item} share={item.status == 'upcoming' && referral.is_telegram_present} short />
        ) : null}

        {item.status == 'ongoing' || (item.status == 'closed' && (!item.current || item.current && item.claimHash != '')) ? (
          <App.Button primary2 large outlined onClick={handleClick}>View {item.status == 'closed' ? 'history' : 'more'}</App.Button>
        ) : null}

        {item.status == 'closed' && host != null && host != 'tegro.com' ? (
          <App.Button small onClick={handleClear}>Clear</App.Button>
        ) : null}
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionItem