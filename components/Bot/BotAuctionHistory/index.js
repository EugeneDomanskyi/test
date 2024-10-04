import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $auction from '@/store/auction'

import App from '@/components/App'
import BotAuctionsImage from '@/components/Bot/BotAuctionsImage'

import styles from './styles.module.scss'

const BotAuctionHistory = () => {
  const dispatch = useDispatch()
  const current = useSelector(({ $auction }) => $auction.current)
  const bid_history = useSelector(({ $auction }) => $auction.bid_history)
  const bid_page = useSelector(({ $auction }) => $auction.bid_page)

  useEffect(() => {
    if (current?.id) {
      fetchHistory()
    }
  }, [current?.id])

  const fetchHistory = async (page) => {
    const result = await $auction.api.bid_history_v2(current?.id, { page: page ?? bid_page.current, limit: bid_page.limit })
    if (result && !result?.error) {
      dispatch($auction.set.bid_history_v2(result.bid_histories))
      dispatch($auction.set.bid_history_page_v2({
        current: page ?? bid_page.current,
        limit: bid_page.limit,
        total: result.total_pages,
      }))
    }
  }

  return current ? (
    <App.Flex column center className={styles.container}>
      <App.Flex column gap={16} className={styles.item}>
        <App.Flex fullWidth justify="center">
          <BotAuctionsImage item={current} />
        </App.Flex>

        <App.Flex column gap={12}>
          <App.Text nowrap size={20} weight={600} height={1}>Buy {current.name} for</App.Text>

          <App.Text nowrap size={24} weight={600} height={1}>{current.currentPrice} {current.currency}</App.Text>

          <App.Flex column gap={24} flex={1}>
            <App.Flex column className={styles.box}>
              <App.Flex row align="center" justify="space-between" sx={{ padding: 24 }}>
                <App.Text size={14} weight={600} color="#FFFFFF99" height={1}>Winning Bid</App.Text>
                <App.Text size={32} weight={600} height={1}>{current.currentPrice} {current.currency}</App.Text>
              </App.Flex>

              {/* <div className={styles.line} />

              <App.Flex row align="center" justify="space-between" sx={{ padding: 24 }}>
                <App.Flex row align="center" gap={12}>
                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={600} height={1} color="#FFFFFF99">Bid by</App.Text>
                    <App.Text size={16} weight={600} height={1}>{current.wallet}</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex> */}
            </App.Flex>

            <App.Flex column className={styles.table}>
              <App.Flex row gap={8} className={styles.row}>
                <App.Flex width={70} align="center">
                  <App.Text size={14} weight={600} height={1} color="#A6DC37">Bid</App.Text>
                </App.Flex>

                <App.Flex flex={1} align="center">
                  <App.Text size={14} weight={600} height={1} color="#A6DC37">User</App.Text>
                </App.Flex>

                <App.Flex width={50} align="center" justify="flex-end">
                  <App.Text right size={14} weight={600} height={1} color="#A6DC37">Time</App.Text>
                </App.Flex>
              </App.Flex>
              
              {bid_history.length ? (
                bid_history.map((bid, index) => (
                  <App.Flex key={index} row gap={8} className={styles.row}>
                    <App.Flex width={70} align="center">
                      <App.Text size={14} weight={600} height={1}>{bid.bid}</App.Text>
                    </App.Flex>

                    <App.Flex flex={1} align="center">
                      <App.Text size={14} weight={600} height={1}>{bid.user}</App.Text>
                    </App.Flex>

                    <App.Flex width={50} align="center" justify="flex-end">
                      <App.Text right size={14} weight={600} height={1}>{bid.time}</App.Text>
                    </App.Flex>
                  </App.Flex>
                ))
              ) : (
                <App.Flex center height={150}>
                  <App.Text size={16} weight={600}>Loading...</App.Text>
                </App.Flex>
              )}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  ) : null
}

export default BotAuctionHistory