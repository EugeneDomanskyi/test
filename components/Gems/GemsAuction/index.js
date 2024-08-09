import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import useWagmiHelper from '@/myhooks/useWagmiHelper'
import Socket from '@/libs/ws.lib'
import WagmiHelper from '@/libs/WagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'
import AuctionItemNotify from '@/components/Auction/AuctionItemNotify'
import AuctionClaim from '@/components/Auction/AuctionClaim'
import AuctionWarning from '@/components/Auction/AuctionWarning'

import styles from './styles.module.scss'

const GemsAuction = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const auctions = useSelector(({ $gem }) => $gem.auctions)
  const referral = useSelector(({ $gem }) => $gem.referral)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const claim = useSelector(({ $gem }) => $gem.claim)
  const claimItem = useSelector($gem.get.claimItem)
  const auctionWarning = useSelector(({ $gem }) => $gem.auctionWarning)

  const timer = 1723132800000

  const [openIndex, setOpenIndex] = useState()
  const [loading, setLoading] = useState(true)
  const [host, setHost] = useState()
  const [endTime, setEndTime] = useState(timer)
  const [diffTime, setDiffTime] = useState(timer - new Date().getTime())

  useEffect(() => {
    fetchAuctions()

    dispatch($gem.set.auctionsUpdateTimer())
  }, [])

  useEffect(() => {
    setHost(window.location.hostname)
  }, [])

  useEffect(() => {
    if (wallet && auctions.length) {
      dispatch($gem.set.auctionsCheckCurrent(wallet))
    }
  }, [wallet, auctions.length])

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [wallet])

  useEffect(() => {
    if (socketConnected) {
      Socket.subscribe('auctions')

      return () => {
        Socket.unsubscribe('auctions')
      }
    }
  }, [socketConnected])

  useEffect(() => {
    if (wallet) {
      fetchStats()
    }

    Socket.on('auctions', 'auction', handleUpdatedAuction)
  }, [wallet])

  const handleUpdatedAuction = async (data) => {
    //dispatch($gem.set.auctionUpdated({data: {auction: data}, wallet}))

    const result = await $gem.api.auction(data.id)
    if (result) {
      dispatch($gem.set.auctionUpdated({data: {auction: result.auction_id}, wallet}))
    }
  }

  const handleVisible = () => {
    if (!document.hidden) {
      if (wallet) {
        fetchReferrals()
      }

      fetchAuctions()
    }
  }

  const fetchReferrals = async () => {
    const result = await $gem.api.referral(wallet)
    if (result) {
      dispatch($gem.set.referral(result))
    }
  }

  const fetchStats = async () => {
    const result = await $gem.api.stats(wallet, {})
    if (result) {
      dispatch($gem.set.stats(result))
    }
  }

  const fetchAuctions = async () => {
    const result = await $gem.api.auctions()
    if (result) {
      dispatch($gem.set.auctions({data: result, wallet}))
    }

    setLoading(false)
  }

  const handleHistory = () => {
    router.push('/transaction-history')
  }

  const handleClear = async (id) => {
    const result = await $gem.api.clear(id)
    if (result) {
      fetchAuctions()
    }
  }

  const getSortedAuctions = () => {
    return [...auctions].sort((a, b) => {
      if (a.status == 'ongoing') return -1
      if (b.status == 'ongoing') return 1
      if (a.status == 'upcoming' && b.status == 'upcoming') {
        return new Date(a.startsIn) - new Date(b.startsIn)
      }
      if (a.status == 'upcoming') return -1
      if (b.status == 'upcoming') return 1
      if (a.status == 'closed' && b.status == 'closed') {
        return new Date(b.last_bid_timestamp) - new Date(a.last_bid_timestamp)
      }
      if (a.status == 'closed') return -1
      if (b.status == 'closed') return 1
      return 0
    })
  }

  const handleClaimClose = () => {
    dispatch($gem.set.claim(false))
  }

  const handleWarning = () => {
    dispatch($gem.set.auctionWarning(true))
  }

  const getTooltip = () => {
    return auctionWarning ? '' : (
      <App.Text size={14} weight={600}>{t('Earn gems for Connecting your wallet, trading and completing quests on Tegro.')} <App.Text inline size={14} weight={600} color="#A6DC37" onClick={handleWarning} sx={{ textDecoration: 'underline' }}>{t('Learn More')}</App.Text></App.Text>
    )
  }

  const questions = [
    {
      question: t('What are Tegro Auctions?'),
      answer: t('Auctions are an incentive for you to use the Tegro exchange while acquiring cryptocurrencies like Ethereum, Bitcoin, and more at huge discounts.'),
    }, {
      question: t('How to participate in auctions?'),
      answer: t('You can trade on the Tegro exchange to acquire Gems. These gems can be used to bid on any ongoing auction.'),
    }, {
      question: t('How do auctions work?'),
      answer: t('<ol type="a" style="list-style: lower-alpha; padding-inline-start: 20px;"><li>You need gems to bid. 100 gems equate to 1 bid.</li><li>Each bid raises the price by $1.</li><li>The auction countdown restarts from 24 hours every time someone bids. The time will reduce as the auction progresses.</li><li>If no new bids are placed before the countdown runs out, the last bidder wins.</li><li>The winner can then purchase the cryptocurrency at the final auction price.</li></ol>'),
    }, {
      question: t('How to collect gems for auctions?'),
      answer: t('<ol type="a" style="list-style: lower-alpha; padding-inline-start: 20px;"><li>When you connect your wallet and place complete first trade on Tegro, you earn 150 gems.</li><li>You can earn another 50 gems by tweeting about Tegro.</li><li>You can earn an unlimited number of gems by trading on Tegro or placing open limit orders on the Tegro Orderbook.</li></ol>'),
    }, {
      question: t('What Happens When I Win?'),
      answer: t('You celebrate! Next, you buy the cryptocurrency by paying the final auction price. For example, if Alice wins the auction for 1 ETH at a final price of $500, they can purchase the 1 ETH for that amount.'),
    }, {
      question: t('What are gems?'),
      answer: t('Gems are a fun way to get rewarded for trading and engaging with the Tegro ecosystem.'),
    }, {
      question: t('How many gems do I earn for completing a trade?'),
      answer: t('You get 1 Gem for every $1 traded on Tegro. For example, if Alice buys $100 worth of WETH using USDC on the Tegro exchange, she will receive 100 Gems.'),
    }, {
      question: t('How do I earn gems for keeping open orders?'),
      answer: t('Liquidity mining on Tegro lets you earn gems by placing open limit orders. The longer your order stays active, the more gems you collect per hour. You can maximize your gems collection by placing larger orders or by pricing your orders closer to the market’s last traded price.<br /><br />For instance, the mid-price of the WETH USDC trading pair is $3000 and two traders - Alice places a $50 buy order for WETH at $2990, while Bob places a $50 buy order at $2995. Since Bobʼs order is larger and closer to the last traded price, he earns more gems than Alice.'),
    },
  ]

  const handleToggle = (i) => () => {
    setOpenIndex(state => state == i ? null : i)
  }

  const handleTimer = () => {
    const newEndTime = new Date().getTime() + 10000
    setEndTime(newEndTime)
    setDiffTime(newEndTime - new Date().getTime())
  }

  const handleZero = () => {
    setDiffTime(endTime - new Date().getTime())
  }

  return (
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
      <App.Flex column fullWidth flex={1} gap={16}>
        <App.Flex direction={['row', 'column']} align={['center', 'stretch']} justify="space-between" gap={[0, 16]}>
          <App.Flex row align="center" order={[0, 1]} gap={24}>
            <App.Flex row center gap={16} className={styles.frame} flex={[null, 1]}>
              <App.Text size={[28, 16]} weight={600} height={1}>{t('Gems')} {Math.floor(referral.points ?? 0)}</App.Text>
              <App.Tooltip variant="v2" click={isMobile} text={getTooltip()} placement="bottom">
                <App.Icon icon="info2" />
              </App.Tooltip>
            </App.Flex>

            <App.Flex row center gap={16} className={styles.frame} flex={[null, 1]}>
              <App.Text size={[24, 16]} weight={600} height={1}>{t('100 Gems = 1 Bid')}</App.Text>
            </App.Flex>
          </App.Flex>

          {host != null && host != 'tegro.com' ? (
            <App.Button primary2 outlined onClick={handleTimer}>{t('Reduce timer')}</App.Button>
          ) : null}

          {/* <App.Button primary2 outlined order={[1, 0]} onClick={handleHistory}>{t('Transaction History')}</App.Button> */}
        </App.Flex>

        {/* <App.Flex row align="center" justify="space-between" className={styles.videoBox}>
          <App.Flex row align="center" gap={[16, 8]}>
            <App.Flex center className={styles.question}>
              <App.Text size={[40, 14]} weight={700} height={1}>?</App.Text>
            </App.Flex>

            {!isMobile ? (
              <App.Flex column gap={8}>
                <App.Text size={16} weight={700} height={1}>{t('Want to participate in Auctions but don’t know how?')}</App.Text>
                <App.Text size={14} weight={500} height={1}>{t('Watch our detailed guide on how to earn gems and place bids in auctions.')}</App.Text>
              </App.Flex>
            ) : (
              <App.Text size={14} weight={400} height={1.2}>Want to participate in Auctions but don’t know how? <App.Text inline size={14} weight={700} height={1.2} color="#7364FF">Watch this video guide</App.Text></App.Text>
            )}
          </App.Flex>
          
          {!isMobile ? (
            <App.Button primary2 outlined>Watch Now <App.Icon icon="play-circle" /></App.Button>
          ) : null}
        </App.Flex> */}

        <App.Flex column gap={24}>
          <App.Flex column gap={8} order={[0, 1]}>
            <App.Flex direction={['row', 'column']} gap={[24, 8]}>
              <App.Flex flex={[1, null]} className={styles.box}>
                <App.Flex fullWidth height={['auto', 96]} column gap={8} className={cn(styles.boxInner, styles.notify1)}>
                  <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Step {{number}}', {number: 1})}</App.Text>
                  <App.Text size={[20, 16]} weight={600} height={1.2}>{t('Trade on Tegro to collect gems')}</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex flex={[1, null]} className={styles.box}>
                <App.Flex fullWidth height={['auto', 96]} column gap={8} className={cn(styles.boxInner, styles.notify2)}>
                  <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Step {{number}}', {number: 2})}</App.Text>
                  <App.Text size={[20, 16]} weight={600} height={1.2}>{t('Use gems to bid on auctions')}</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex flex={[1, null]} className={styles.box}>
                <App.Flex fullWidth height={['auto', 96]} column gap={8} className={cn(styles.boxInner, styles.notify3)}>
                  <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Step {{number}}', {number: 3})}</App.Text>
                  <App.Text size={[20, 16]} weight={600} height={1.2}>{t('Last person to bid wins the auction')}</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex justify="flex-end">
              <App.Text size={16} weight={700} height={1} color="#7E91F1" className={styles.link}><a href="https://medium.com/@TegroFi/announcing-tegro-auctions-d35c6a94c7d5" target="_blank" rel="noreferrer">{t('Learn More')}</a></App.Text>
            </App.Flex>
          </App.Flex>

          {diffTime <= 0 ? (
            <App.Flex row wrap align="flex-start" gap={24}>
              {auctions.length ? (
                getSortedAuctions().map(item => <AuctionItem key={item.id + item.time} item={item} onClear={handleClear} />)
              ) : null}
            </App.Flex>
          ) : (
            <AuctionItemNotify endTime={endTime} onZero={handleZero} />
          )}
        </App.Flex>
      </App.Flex>

      <App.Flex height={[48, 0]} />

      <App.Flex column gap={32}>
        <App.Flex column center>
          <App.Text center size={[32, 24]} weight={700}>{t('Frequently Asked Questions')}</App.Text>
          <App.Text center size={16} weight={400} color="#9B99AE">{t('Hey there! Curious about how the auctions work? We’ve got you covered! Read on to learn more.')}</App.Text>
        </App.Flex>

        <App.Flex column gap={[32, 16]}>
          {questions.map((item, i) => {
            return (
              <App.Flex key={i} column className={cn(styles.faqItem, {[styles.open]: openIndex == i})} onClick={handleToggle(i)}>
                <App.Flex row align="center" justify="space-between" gap={16} sx={{ cursor: 'pointer' }}>
                  <App.Text tag="h3" size={16} weight={700}>{item.question}</App.Text>

                  <App.Frame padding={0} radius={32} width={32} height={32} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                    <App.Flex full center>
                      <App.Icon icon="chevron-down" width={16} height={16} className={styles.arrow}/>
                    </App.Flex>
                  </App.Frame>
                </App.Flex>

                <App.Flex className={styles.answer}>
                  <App.Flex className={styles.answerInner}>
                    <App.Text tag="div" size={16} weight={400} color="#9B99AE">
                      <div dangerouslySetInnerHTML={{__html: item.answer}} />
                    </App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            )
          })}
        </App.Flex>
      </App.Flex>

      <App.Dialog hideHeader open={claim} onClose={handleClaimClose}>
        <AuctionClaim item={claimItem} onClose={handleClaimClose} />
      </App.Dialog>

      <AuctionWarning />
    </App.Container>
  )
}

export default GemsAuction