import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import moment from 'moment'

import $auction from '@/store/auction'
import $bot from '@/store/bot'

import App from '@/components/App'
import Timer from '@/components/Bot/BotTimer'

import styles from './styles.module.scss'

const MyEarnings = ({ onClaim }) => {
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [buttonLoading, setButtonLoading] = useState()

  const earnings = useSelector(({ $auction }) => $auction.earnings)
  const user = useSelector(({ $bot }) => $bot.user)
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
    if (result && !result?.error) {
      dispatch($auction.set.earnings_v2(result.data.won_auctions))
      dispatch($auction.set.earnings_unclaimed_v2(result.data.uncalimed_won_auctions))
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
    await onClaim(auction)
    setButtonLoading(null)
  }
  
  const handleBack = () => {
    dispatch($bot.set.tab('auctions'))
  }

  const handleHistory = (auction) => {
    dispatch($auction.set.current(auction))
    dispatch($auction.set.auctionHistory([]))
    dispatch($bot.set.tab('auction-history'))
  }

  return (
    <App.Flex center sx={{padding: 16, paddingTop: 8}}>
      {loading ? (
        <App.LoaderBlock height={300} />
      ) : (
        <App.Flex column fullWidth gap={16}>
          {earnings?.length > 0 ? (
            <App.Flex column align="center" gap={16} className={styles.earningsWrapper}>
              <App.Flex fullWidth className={styles.header}>
                <App.Text className={styles.headerText}>Auction</App.Text>
                <App.Text className={styles.headerText}>Winning price</App.Text>
                <App.Text className={styles.headerText}>Expiry</App.Text>
              </App.Flex>

              {earnings.map((item, index) => (
                <App.Flex key={index} className={styles.claimItem}>
                  <App.Flex row className={styles.claimItemHeader}>
                    <App.Flex column>
                      <App.Text className={styles.claimItemText}>{item.name}</App.Text>
                      <App.Text className={styles.claimItemSecondarytext}>{moment(item.endsAt).format('DD-MM-YYYY')}</App.Text>
                    </App.Flex>

                    <App.Text className={styles.claimItemText}>{item.currentPrice + ' ' + item.currency}</App.Text>

                    <App.Flex justify="flex-end" width={80}>
                      <App.Text className={styles.claimItemText}>
                        {item.claimTime && item.claimTime.diff(moment()) > 0 ? (
                          <Timer claimTime={item.claimTime} />
                        ) : '---'}
                      </App.Text>
                    </App.Flex>
                  </App.Flex>

                  {item.claimHash == '' ? (
                    item.claimTime && item.claimTime.diff(moment()) > 0 ? (
                      <App.Button fullWidth variant="bot" loading={item.id == buttonLoading} onClick={() => item.id == buttonLoading ? null : handleClaim(item)}>Claim</App.Button>
                    ) : (
                      <App.Flex fullWidth center gap={4} className={styles.claimed}>
                        <App.Text size={14} weight={700} height={1}>Time&apos;s up</App.Text>
                      </App.Flex>
                    )
                  ) : (
                    <App.Flex fullWidth center gap={4} className={styles.claimed}>
                      <App.Icon icon="check" />
                      <App.Text size={14} weight={700} height={1}>Claimed</App.Text>
                    </App.Flex>
                  )}
                </App.Flex>
              ))}

              {earnings_page.total > 1 ? (
                <App.Flex row center gap={8}>
                  {Array.from({ length: earnings_page.total }, (_, i) => (
                    (i + 1) == earnings_page.current ? (
                      <App.Flex key={i} fullWidth center gap={4} className={styles.claimed}>
                        <App.Text size={14} weight={700} height={1}>{i + 1}</App.Text>
                      </App.Flex>
                    ) : (
                      <App.Button key={i} variant="bot" onClick={() =>  fetchEarnings(i + 1)}>{i + 1}</App.Button>
                    )
                  ))}
                </App.Flex>
              ) : null}
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