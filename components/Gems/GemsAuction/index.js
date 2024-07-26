import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'
import Socket from '@/libs/ws.lib'
import WagmiHelper from '@/libs/WagmiHelper'

import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'
import AuctionItemNotify from '@/components/Auction/AuctionItemNotify'
import AuctionClaim from '@/components/Auction/AuctionClaim'

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

  const tempItem = {
    id: 1,
    status: 'upcoming',
    wallet,
    current: false,
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [])

  useEffect(() => {
    if (socketConnected) {
      Socket.subscribe('auctions')

      Socket.on('auctions', 'auction', handleUpdatedAuction)

      return () => {
        Socket.unsubscribe('auctions')
      }
    }
  }, [socketConnected])

  useEffect(() => {
    setTimeout(fetchJWT, 500)
    fetchAuctions()
    fetchStats()
  }, [wallet])

  const handleUpdatedAuction = (data) => {
    dispatch($gem.set.auctionUpdated({data, wallet}))
  }

  const handleVisible = () => {
    if (!document.hidden && wallet) {
      fetchReferrals()
    }
  }

  const fetchReferrals = async () => {
    const result = await $gem.api.referral(wallet)
    if (result) {
      dispatch($gem.set.referral(result))
    }
  }

  const fetchJWT = async () => {
    let jwt = getJWT()
    if (!jwt) {
      const signature = await WagmiHelper.signMessage(wallet)
      if (signature) {
        jwt = await $gem.api.login({ wallet_address: wallet, signature })
        if (jwt && !jwt?.error) {
          localStorage.setItem('bidding-token', JSON.stringify({ jwtToken: jwt, jwtWallet: wallet }))
        }
      }
    }

    dispatch($gem.set.jwt(jwt))
  }

  const getJWT = () => {
    const data = localStorage.getItem('bidding-token')
    if (data) {
      const { jwtToken, jwtWallet } = JSON.parse(data)
      if (wallet == jwtWallet) {
        return jwtToken
      }
    }
    return false
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

  return (
    <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
      <App.Flex column fullWidth flex={1} gap={16}>
        <App.Flex direction={['row', 'column']} align={['center', 'stretch']} justify="space-between" gap={[0, 16]}>
          <App.Flex row align="center" order={[0, 1]} gap={24}>
            <App.Flex row center gap={16} className={styles.frame} flex={[null, 1]}>
              <App.Text size={[28, 16]} weight={600} height={1}>{t('Gems')} {referral.points ?? 0}</App.Text>
            </App.Flex>

            <App.Flex row center gap={16} className={styles.frame} flex={[null, 1]}>
              <App.Text size={[24, 16]} weight={600} height={1}>{t('100 Gems = 1 Bid')}</App.Text>
            </App.Flex>
          </App.Flex>

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

        <App.Flex row wrap gap={24}>
          {auctions.length ? (
            getSortedAuctions().map(item => <AuctionItem key={item.id} item={item} onClear={handleClear} />)
          ) : null}
        </App.Flex>

        {/* <AuctionItemNotify item={tempItem} onClear={handleClear} /> */}
      </App.Flex>

      <App.Dialog hideHeader open={claim} onClose={handleClaimClose}>
        <AuctionClaim item={claimItem} onClose={handleClaimClose} />
      </App.Dialog>
    </App.Container>
  )
}

export default GemsAuction