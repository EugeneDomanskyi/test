import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import moment from 'moment'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'

import $auction from '@/store/auction'
import $bot from '@/store/bot'

import App from '@/components/App'
import BotProgress from '@/components/Bot/BotProgress'

import styles from './styles.module.scss'
import { createPortal } from 'react-dom'

const MyEarnings = ({ onClaim }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState()

  const earnings = useSelector(({ $auction }) => $auction.earnings)
  const earnings_limit = useSelector(({ $auction }) => $auction.earnings_limit)
  const earnings_page = useSelector(({ $auction }) => $auction.earnings_page)

  useEffect(() => {
    fetchEarnings()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      setButtonLoading(null)
    }
  }

  const fetchEarnings = async (page) => {
    const result = await $auction.api.earnings_v2({ page: page ?? earnings_page.current, limit: earnings_page.limit })
    // const result = await $auction.api.earnings()
    if (result && !result?.error) {
      // dispatch($auction.set.earnings(result))
      dispatch($auction.set.earnings_v2(result.data.won_auctions))
      dispatch($auction.set.earnings_unclaimed_v2(result.data.uncalimed_won_auctions))
      dispatch($auction.set.earnings_limit_v2({
        required: result.data.required_profit,
        current: result.data.profit_limit,
      }))
      dispatch($auction.set.earnings_page_v2({
        current: result.current_page,
        limit: earnings_page.limit,
        total: result.total_pages,
      }))
    }

    setLoading(false)
  }
  
  const handleClaim = async (auction) => {
    setButtonLoading(auction.id)
    Amplitude.event(`Initiated Prize Claim`, {
      'Page': 'My earnings',
      'Source': 'Telegram',
    })

    await onClaim(auction)
    setButtonLoading(null)
  }
  
  const handleBack = () => {
    dispatch($bot.set.tab('auctions'))
  }

  const renderPagination = () => {
    const totalPages = earnings_page.total
    const currentPage = earnings_page.current
    const pages = []
  
    pages.push(currentPage == 1 ? (
      <App.Flex key={1} center gap={4} className={cn(styles.claimed, styles.page)}>
        <App.Text size={14} weight={700} height={1}>1</App.Text>
      </App.Flex>
    ) : (
      <App.Button key={1} variant="bot" onClick={() =>  fetchEarnings(1)}>1</App.Button>
    ))
  
    if (currentPage > 3) {
      pages.push(<App.Text key="dots1">...</App.Text>);
    }
  
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i === currentPage ? (
        <App.Flex key={i} center gap={4} className={cn(styles.claimed, styles.page)}>
          <App.Text size={14} weight={700} height={1}>{i}</App.Text>
        </App.Flex>
      ) : (
        <App.Button key={i} variant="bot" onClick={() => fetchEarnings(i)}>{i}</App.Button>
      ))
    }
  
    if (currentPage < totalPages - 2) {
      pages.push(<App.Text key="dots2">...</App.Text>);
    }
  
    if (totalPages > 1) {
      pages.push(currentPage == totalPages ? (
        <App.Flex key={totalPages} center gap={4} className={cn(styles.claimed, styles.page)}>
          <App.Text size={14} weight={700} height={1}>{totalPages}</App.Text>
        </App.Flex>
      ) : (
        <App.Button key={totalPages} variant="bot" onClick={() =>  fetchEarnings(totalPages)}>{totalPages}</App.Button>
      ))
    }
  
    return pages
  }

  return (
    <App.Flex center sx={{padding: 8}}>
      {loading ? (
        <App.LoaderBlock height={300} />
      ) : (
        <App.Flex column fullWidth gap={16}>
          <App.Flex column fullWidth className={styles.taskContainer}>
            <App.Flex column fullWidth gap={8} className={styles.title}>
              <App.Flex fullWidth align="center" justify="space-between" gap={8}>
                <App.Text size={14} weight={700} height={1}>Your winnings</App.Text>

                <App.Text size={14} weight={700} height={1}>{earnings_limit?.current} USDC</App.Text>
              </App.Flex>

              <BotProgress currentValue={earnings_limit?.current} maxValue={earnings_limit?.required} limit />
            </App.Flex>
          </App.Flex>

          {earnings?.length > 0 ? (
            <App.Flex fullWidth column gap={16} sx={{ paddingBottom: !earnings_limit?.ready ? 116 : 0 }}>
              <App.Flex column align="center" fullWidth gap={12} className={styles.earningsWrapper}>
                <App.Flex fullWidth align="center" justify="space-between" className={styles.header}>
                  <App.Flex width={110}>
                    <App.Text left size={14} weight={400} height={1}>Auction</App.Text>
                  </App.Flex>

                  <App.Flex center flex={1}>
                    <App.Text center size={14} weight={400} height={1}>Winning price</App.Text>
                  </App.Flex>

                  <App.Flex justify="flex-end" width={110}>
                    <App.Text right size={14} weight={400} height={1}>Status</App.Text>
                  </App.Flex>
                </App.Flex>

                {earnings.map((item, index) => (
                  <App.Flex key={index} column fullWidth gap={8} className={styles.row}>
                    <App.Flex row gap={4} fullWidth align="center" justify="space-between">
                      <App.Flex column gap={4} width={110}>
                        <App.Text size={13} weight={400} height={1.2}>Buy {item.name}<br />for {item.currentPrice + ' ' + item.token.currency}</App.Text>
                        <App.Text size={12} weight={400} height={1} color="#FFFFFF99">{moment(item.endsAt).format('DD-MM-YYYY')}</App.Text>
                      </App.Flex>

                      <App.Flex center flex={1}>
                        <App.Text size={13} weight={400} height={1}>{item.currentPrice + ' ' + item.token.currency}</App.Text>
                      </App.Flex>

                      <App.Flex justify="flex-end" width={110}>
                        <App.Flex row justify="flex-end" gap={4}>
                          <App.Flex className={cn(styles.circle, {[styles.ready]: item?.ready})} />

                          <App.Flex row width={90}>
                            <App.Text right size={13} weight={400} height={1.2}>{(item?.ready || item.claimHash !== '') ? 'ready for claim' : 'min withdrawal not met'}</App.Text>
                          </App.Flex>
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>

                    {item?.ready ? (
                      item.claimHash == '' ? (
                        <App.Button fullWidth variant="green" small loading={item.id == buttonLoading} onClick={() => item.id == buttonLoading ? null : handleClaim(item)}>Claim</App.Button>
                      ) : (
                        <App.Flex fullWidth center gap={4} className={styles.claimed}>
                          <App.Icon icon="check-circle-fill2" width={14} height={14} />
                          <App.Text size={14} weight={600} height={1}>Claimed</App.Text>
                        </App.Flex>
                      )
                    ) : null}
                  </App.Flex>
                ))}
              </App.Flex>

              {earnings_page.total > 1 ? (
                <App.Flex row center gap={8}>
                  {renderPagination()}
                </App.Flex>
              ) : null}

              {!earnings_limit?.ready ? createPortal(
                <App.Flex column gap={8} className={styles.bottom}>
                  <App.Flex center className={styles.frame}>
                    <App.Text center size={12} weight={400}>{earnings_limit?.required - earnings_limit?.current} USDT left before you withdraw your winnings to your wallet.</App.Text>
                  </App.Flex>

                  <App.Button variant="bot" fullWidth onClick={handleBack}>Go back to win more Auctions</App.Button>
                </App.Flex>,
              document.getElementById('content')) : null}
            </App.Flex>
          ) : (
            <App.Flex column gap={16} className={styles.emptyBox}>
              <App.Text size={16} weight={700}>Mmm...</App.Text>
              <App.Text size={16} weight={400} color="#FFFFFFCC">Looks like you haven’t won any auctions yet.</App.Text>
              <App.Flex center>
                <Image src="/images/bot/tiger.png" width={198} height={202} alt="" />
              </App.Flex>
              <App.Text size={16} weight={400} color="#FFFFFFCC">No worries.</App.Text>
              <App.Text size={16} weight={400} color="#FFFFFFCC">Keep trying fellow Tiger.</App.Text>
              <App.Text size={16} weight={400} color="#FFFFFFCC">You got this.</App.Text>

              <App.Button primary2 onClick={handleBack}>Go back to Auctions 🔥</App.Button>
            </App.Flex>
          )}
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default MyEarnings