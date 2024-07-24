import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import Socket from '@/libs/ws.lib'
import useWagmiHelper from '@/myhooks/useWagmiHelper'
import WagmiHelper from '@/libs/WagmiHelper'

import $app from '@/store/app'
import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionImage from '@/components/Auction/AuctionImage'
import AuctionButton from '@/components/Auction/AuctionButton'
import AuctionClaim from '@/components/Auction/AuctionClaim'

import styles from './styles.module.scss'

const GemsAuctionInfo = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query

  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const referral = useSelector(({ $gem }) => $gem.referral)
  const item = useSelector(({ $gem }) => $gem.current)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const claim = useSelector(({ $gem }) => $gem.claim)
  const claimItem = useSelector($gem.get.claimItem)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Socket.init(() => {}, handleCloseConnection).then(() => {
      dispatch($app.set.socketConnected(true))
    })

    return () => {
      dispatch($app.set.socketConnected(false))
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
    if (id && wallet) {
      setTimeout(fetchJWT, 500)
      fetchInfo()
    }
  }, [id, wallet])

  useEffect(() => {
    if (wallet) {
      fetchStats()
    }
  }, [wallet])

  const handleUpdatedAuction = (data) => {
    dispatch($gem.set.auctionUpdated({data, wallet}))
    dispatch($gem.set.current({data, wallet}))
  }

  const handleCloseConnection = (e) => {
    Socket.init(() => {}, handleCloseConnection)
  }

  const fetchStats = async () => {
    const result = await $gem.api.stats(wallet, {})
    if (result) {
      dispatch($gem.set.stats(result))
    }
  }

  const fetchInfo = async () => {
    const result = await $gem.api.auction(id)
    if (result) {
      dispatch($gem.set.current({data: result, wallet}))
    }

    setLoading(false)
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

  const handleBack = () => {
    router.push(`/gems-dashboard`)
  }

  const sortedHistory = () => {
    return [...item.history].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }

  const getShort = (address) => {
    const n = isMobile ? 10 : 24
    return address ? `${address.substring(0, n)}...${address.substring(address.length - n)}` : ''
  }

  const handleClaimClose = () => {
    dispatch($gem.set.claim(false))
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Container maxWidth={1230} sx={{ paddingBottom: 32 }}>
        <App.Flex column gap={32}>
          <App.Flex fullWidth row align="center">
            <App.Flex row sx={{ cursor: 'pointer' }} onClick={handleBack}>
              <App.Text weight={600}>&lt; Back</App.Text>
            </App.Flex>
          </App.Flex>

          {loading ? (
            <App.LoaderBlock height={300} />
          ) : (
            item?.status && item.status != 'upcoming' ? (
              <App.Flex fullWidth column gap={16}>
                {item.status == 'closed' ? (
                  <App.Flex align="center" height={56}>
                    <App.Text size={24} weight={600} height={1}>{t('History')}</App.Text>
                  </App.Flex>
                ) : (
                  <App.Flex center height={56} gap={16} className={styles.gems}>
                    <App.Text size={16} weight={600} height={1}>{t('Gems Balance')}</App.Text>
                    <App.Text size={28} weight={600} height={1}>{referral.points}</App.Text>
                  </App.Flex>
                )}

                <App.Flex direction={['row', 'column']} gap={24}>
                  <App.Flex column gap={16} width={[384, '100%']}>
                    <AuctionImage item={item} large />

                    <App.Text nowrap size={20} weight={600} height={1}>{item.name}</App.Text>

                    {item.description ? (
                      <App.Text size={14} weight={400} color="#9B99AE">{item.description}</App.Text>
                    ) : null}

                    <App.Text size={24} weight={600} color={item.status == 'closed' && item.current ? '#53F19C' : '#fff'}>{item.currentPrice} {item.token.currency}</App.Text>

                    {item.status == 'closed' && item.current ? (
                      <App.Flex fullWidth center height={30} className={styles.badge}>
                        <App.Text size={16} weight={400} height={1} color="#53F19C">{t('You won the auction!')}</App.Text>
                      </App.Flex>
                    ) : null}

                    {item.status != 'closed' || (item.status == 'closed' && item.current) ? (
                      <AuctionButton item={item} />
                    ) : null}

                    <App.Flex fullWidth center={item.status != 'closed' || (item.status == 'closed' && item.current)}>
                      <App.Text size={14} weight={400} color="#FFFFFF99">ID: {item.id}</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <App.Flex column gap={24} flex={1}>
                    <App.Flex column gap={24} className={styles.box}>
                      <App.Flex row align="center" justify="space-between">
                        <App.Text size={14} weight={600} color="#FFFFFF99" height={1}>{t(item.status == 'closed' ? 'Winning Bid' : 'Current Bid')}</App.Text>
                        <App.Text size={32} weight={600} height={1} color={item.status == 'closed' && item.current ? '#53F19C' : '#fff'}>{item.currentPrice} {item.token.currency}</App.Text>
                      </App.Flex>

                      <div className={styles.line} />

                      <App.Flex row align="center" justify="space-between">
                        <App.Flex row align="center" gap={12}>
                          {/* <App.Flex center className={styles.circle}></App.Flex> */}

                          {item.wallet ? (
                            <App.Flex column gap={8}>
                              <App.Text size={14} weight={600} height={1} color="#FFFFFF99">{t('Bid by')}</App.Text>
                              <App.Text size={16} weight={600} height={1}>{getShort(item.wallet)}</App.Text>
                            </App.Flex>
                          ) : (
                            <App.Text size={14} weight={600} height={1} color="#FFFFFF99">{t('Be the first to bid')}</App.Text>
                          )}
                        </App.Flex>
                        
                        {item.status != 'closed' ? (
                          <AuctionButton item={item} small />
                        ) : null}
                      </App.Flex>
                    </App.Flex>

                    <App.Flex column className={styles.table}>
                      <App.Flex row gap={[24, 8]} className={styles.row}>
                        <App.Flex width={[100, 70]} align="center">
                          <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('Bid')}</App.Text>
                        </App.Flex>

                        <App.Flex flex={1} align="center">
                          <App.Text size={14} weight={600} height={1} color="#A6DC37">{t('User')}</App.Text>
                        </App.Flex>

                        <App.Flex width={[200, 50]} align="center" justify="flex-end">
                          <App.Text right size={14} weight={600} height={1} color="#A6DC37">{t('Time')}</App.Text>
                        </App.Flex>
                      </App.Flex>
                      
                      {item.history.length ? (
                        sortedHistory().map((bid, index) => (
                          <App.Flex key={index} row gap={[24, 8]} className={styles.row}>
                            <App.Flex width={[100, 70]} align="center">
                              <App.Text size={14} weight={600} height={1}>{bid.bid}</App.Text>
                            </App.Flex>

                            <App.Flex flex={1} align="center">
                              <App.Text size={14} weight={600} height={1}>{getShort(bid.wallet)}</App.Text>
                            </App.Flex>

                            <App.Flex width={[200, 50]} align="center" justify="flex-end">
                              <App.Text right size={14} weight={600} height={1}>{isMobile ? bid.time : bid.date}</App.Text>
                            </App.Flex>
                          </App.Flex>
                        ))
                      ) : (
                        <App.Flex center height={300}>
                          <App.Text size={24} weight={600}>No bids yet</App.Text>
                        </App.Flex>
                      )}
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            ) : (
              <App.Flex center height={300}>
                <App.Text size={24} weight={600}>Sorry! Auction not found</App.Text>
              </App.Flex>
            )
          )}
        </App.Flex>
      </App.Container>

      <App.Dialog hideHeader open={claim} onClose={handleClaimClose}>
        <AuctionClaim item={claimItem} onClose={handleClaimClose} />
      </App.Dialog>
    </App.Flex>
  )
}

export default GemsAuctionInfo