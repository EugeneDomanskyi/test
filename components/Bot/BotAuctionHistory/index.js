import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $bot from '@/store/bot'
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
      dispatch($auction.set.bid_history_v2(result.bid_histories ?? []))
      dispatch($auction.set.bid_history_page_v2({
        current: page ?? bid_page.current,
        limit: bid_page.limit,
        total: result.total_pages,
      }))
    }
  }

  const renderPagination = () => {
    const totalPages = bid_page.total
    const currentPage = bid_page.current
    const pages = []
  
    pages.push(currentPage == 1 ? (
      <App.Flex key={1} fullWidth center gap={4} className={styles.claimed}>
        <App.Text size={14} weight={700} height={1}>1</App.Text>
      </App.Flex>
    ) : (
      <App.Button key={1} variant="bot" onClick={() =>  fetchHistory(1)}>1</App.Button>
    ))
  
    if (currentPage > 3) {
      pages.push(<App.Text key="dots1">...</App.Text>);
    }
  
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i === currentPage ? (
        <App.Flex key={i} fullWidth center gap={4} className={styles.claimed}>
          <App.Text size={14} weight={700} height={1}>{i}</App.Text>
        </App.Flex>
      ) : (
        <App.Button key={i} variant="bot" onClick={() => fetchHistory(i)}>{i}</App.Button>
      ))
    }
  
    if (currentPage < totalPages - 2) {
      pages.push(<App.Text key="dots2">...</App.Text>);
    }
  
    if (totalPages > 1) {
      pages.push(currentPage == totalPages ? (
        <App.Flex key={totalPages} fullWidth center gap={4} className={styles.claimed}>
          <App.Text size={14} weight={700} height={1}>{totalPages}</App.Text>
        </App.Flex>
      ) : (
        <App.Button key={totalPages} variant="bot" onClick={() =>  fetchHistory(totalPages)}>{totalPages}</App.Button>
      ))
    }
  
    return pages
  }

  const handleBack = () => {
    dispatch($bot.set.tab('auctions'))
  }

  return current ? (
    <App.Flex column center className={styles.container}>
      <App.Flex row align="center" fullWidth className={styles.back} onClick={handleBack}>
        <App.Icon icon="chevron-left2" width={24} height={24} />
        <App.Text size={16} weiht={600} height={1}>Back</App.Text>
      </App.Flex>

      <App.Flex column gap={16} className={styles.item}>
        <App.Flex fullWidth justify="center">
          <BotAuctionsImage item={current} />
        </App.Flex>

        <App.Flex column gap={12}>
          <App.Text nowrap size={20} weight={600} height={1}>Buy {current.name} for</App.Text>

          <App.Text nowrap size={24} weight={600} height={1}>{current.currentPrice} {current.token.currency}</App.Text>

          <App.Flex column gap={24} center>
            <App.Flex column fullWidth className={styles.box}>
              <App.Flex row align="center" justify="space-between" sx={{ padding: 24 }}>
                <App.Text size={14} weight={600} color="#FFFFFF99" height={1}>Winning Bid</App.Text>
                <App.Text size={32} weight={600} height={1}>{current.currentPrice} {current.token.currency}</App.Text>
              </App.Flex>

              <div className={styles.line} />

              <App.Flex row align="center" justify="space-between" sx={{ padding: 24 }}>
                <App.Flex row align="center" gap={12}>
                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={600} height={1} color="#FFFFFF99">Bid by</App.Text>
                    <App.Text size={16} weight={600} height={1}>{current.wallet}</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex column fullWidth className={styles.table}>
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

            {bid_page.total > 1 ? (
              <App.Flex row center gap={8}>
                {renderPagination()}
              </App.Flex>
            ) : null}
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  ) : null
}

export default BotAuctionHistory