import { useRouter } from 'next/router'
import cn from 'classnames'

import { useTranslation } from 'react-i18next'

import App from '@/components/App'
import AuctionImage from '@/components/Auction/AuctionImage'
import AuctionCountdown from '@/components/Auction/AuctionCountdown'
import AuctionButton from '@/components/Auction/AuctionButton'

import styles from './styles.module.scss'

const AuctionItem = ({ item }) => {
  const router = useRouter()
  const { t } = useTranslation()

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

  const getShort = (address) => {
    const n = 8
    return address ? `${address.substring(0, n)}...${address.substring(address.length - n)}` : ''
  }

  const handleClick = () => {
    if (item.status != 'upcoming') {
      router.push(`/gems-dashboard/${item.id}`)
    }
  }

  return (
    <App.Flex column gap={10} className={styles.item} onClick={handleClick}>
      {item.updated ? (
        <App.Flex className={styles.ripple}>
          <App.Flex className={styles.circle} />
        </App.Flex>
      ) : null}

      <AuctionImage item={item} />

      <App.Flex column gap={12} className={styles.itemContent}>
        <App.Text center nowrap weight={600} height={1}>{item.name}</App.Text>
        <App.Text center nowrap size={24} weight={600} height={1}>{item.currentPrice} {item.currency}</App.Text>

        <App.Flex center gap={8} className={cn(styles.info, {[styles.win]: item.status == 'closed' && item.current})}>
          <App.Text weight={400} height={1} color={item.status == 'closed' && item.current ? '#53F19C' : "#FFFFFF99"}>{t(firstText())}</App.Text>
          {secondText() != 'hide' ? (
            item.status == 'upcoming' ? (
              <AuctionCountdown time={item.startsIn} />
            ) : (
              <App.Text weight={400} height={1}>{t(secondText())}</App.Text>
            )
          ) : null}
        </App.Flex>

        <AuctionButton item={item} />
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionItem