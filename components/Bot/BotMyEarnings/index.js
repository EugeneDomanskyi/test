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

  const fetchEarnings = async () => {
    const result = await $auction.api.earnings()
    if (result && !result?.error) {
      dispatch($auction.set.earnings(result))
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
          {/* <App.Flex row fullWidth align="center" gap={8} onClick={handleBack}>
            <App.Flex sx={{transform: 'rotate(180deg)'}}>
              <App.Icon icon='arrow-right' />
            </App.Flex>

            <App.Text>Auctions</App.Text>
          </App.Flex> */}

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
                      <App.Text className={styles.claimItemSecondarytext}>{moment(item.startsIn).format('DD-MM-YYYY')}</App.Text>
                    </App.Flex>
                    <App.Text className={styles.claimItemText}>{item.currentPrice + ' ' + item.token.currency}</App.Text>

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
                      <App.Button fullWidth primary2 loading={item.id == buttonLoading} onClick={() => item.id == buttonLoading ? null : handleClaim(item)}>Claim</App.Button>
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

{/* <App.Button fullWidth primary2 onClick={() => handleHistory(item)}>History</App.Button> */}
                </App.Flex>
              ))}
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