import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { formatUnits } from 'viem'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import Socket from '@/libs/ws.lib'
import useWagmiHelper from '@/myhooks/useWagmiHelper'

import $alert from '@/store/alert'
import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionBar from '@/components/Auction/AuctionBar'
import AuctionImage from '@/components/Auction/AuctionImage'
import AuctionButton from '@/components/Auction/AuctionButton'
import AuctionClaim from '@/components/Auction/AuctionClaim'
import AuctionWarning from '@/components/Auction/AuctionWarning'
import AuctionSuybscribe from '@/components/Auction/AuctionSubscribe'
import AuctionCountdown from '@/components/Auction/AuctionCountdown'

import styles from './styles.module.scss'

const GemsAuctionInfo = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = router.query

  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const item = useSelector(({ $gem }) => $gem.current)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const auctionsLoading = useSelector(({ $gem }) => $gem.auctionsLoading)
  const claim = useSelector(({ $gem }) => $gem.claim)
  const claimItem = useSelector($gem.get.claimItem)

  useEffect(() => {    
    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [wallet])

  useEffect(() => {    
    console.log('GemsAuctionInfo useEffect', item);
  }, [item])

  useEffect(() => {
    if (socketConnected) {
      Socket.subscribe('auctions')

      return () => {
        Socket.unsubscribe('auctions')
      }
    }
  }, [socketConnected])

  useEffect(() => {
    if (id) {
      Socket.on('auctions', 'auction', handleUpdatedAuction)
      fetchInfo()

      if (wallet && id) {
        dispatch($gem.set.auctionsCheckCurrent(wallet))
      }
    }
  }, [id, wallet])

  const handleVisible = () => {
    if (!document.hidden) {
      fetchInfo()
    }
  }

  const handleUpdatedAuction = (data) => {
    if (data && data.type && data.type == 1) {
      dispatch($gem.set.auctionUpdated({data: { auction: data }, wallet}))
      console.log('handleUpdatedAuction', data);
      
      if (data.last_bidder.wallet_address.toLowerCase() != wallet) {
        const bidWallet = data.last_bidder.wallet_address.toLowerCase()
        const address = `0x...${bidWallet.substring(bidWallet.length - 4)}`
        const price = formatUnits(data.last_bid_price, data.auction_token.decimals)
        const currency = data.auction_token.symbol.toUpperCase()
        dispatch($alert.set.info({ text: t(`${address} placed a bid for ${price} ${currency}.`) }))
      }
    }
  }

  const fetchInfo = async () => {
    const result = await $gem.api.auction(id)
    if (result) {
      dispatch($gem.set.current({data: result, wallet}))
    }
  }

  const handleBack = () => {
    router.push(`/auctions`)
  }

  const sortedHistory = () => {
    return [...item.history].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }

  const getShort = (address) => {
    const n = 4
    return address ? `${address.substring(0, n)}...${address.substring(address.length - n)}` : ''
  }

  const handleClaimClose = () => {
    dispatch($gem.set.claim(false))
  }

  const handleClaimOver = () => {
    dispatch($gem.set.auctionNotClaim(item))
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

          {auctionsLoading ? (
            <App.LoaderBlock height={300} />
          ) : (
            item?.status && item.status != 'upcoming' ? (
              <App.Flex fullWidth column gap={16}>
                {item.status == 'closed' ? (
                  <App.Flex align="center" height={56}>
                    <App.Text size={24} weight={600} height={1}>{t('History')}</App.Text>
                  </App.Flex>
                ) : (
                  <AuctionBar />
                )}

                <App.Flex direction={['row', 'column']} gap={24}>
                  <App.Flex column gap={16} width={[384, '100%']}>
                    <AuctionImage item={item} large />

                    <App.Text nowrap size={20} weight={600} height={1}>{t('Buy {{title}} for', {title: item.name})}</App.Text>

                    {item.description ? (
                      <App.Text size={14} weight={400} color="#9B99AE">{item.description}</App.Text>
                    ) : null}

                    <App.Text size={24} weight={600} color={item.status == 'closed' && item.current ? '#53F19C' : '#fff'}>{item.currentPrice} {item.token.currency}</App.Text>

                    {item.status == 'closed' && item.current ? (
                      <App.Flex column gap={16}>
                        <App.Flex fullWidth center height={30} className={styles.badge}>
                          <App.Text size={16} weight={400} height={1} color="#53F19C">{t('You won the auction!')}</App.Text>
                        </App.Flex>

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
                      </App.Flex>
                    ) : null}

                    {item.status != 'closed' || (item.status == 'closed' && item.current && item.claimHash == '') ? (
                      <AuctionButton item={item} />
                    ) : null}
                  </App.Flex>

                  <App.Flex column gap={24} flex={1}>
                    <App.Flex column className={styles.box}>
                      <App.Flex row align="center" justify="space-between" sx={{ padding: 24 }}>
                        <App.Text size={14} weight={600} color="#FFFFFF99" height={1}>{t(item.status == 'closed' ? 'Winning Bid' : 'Current Bid')}</App.Text>
                        <App.Text size={32} weight={600} height={1} color={item.status == 'closed' && item.current ? '#53F19C' : '#fff'}>{item.currentPrice} {item.token.currency}</App.Text>
                      </App.Flex>

                      <div className={styles.line} />

                      <App.Flex row align="center" justify="space-between" className={cn(styles.shaker, {[styles.run]: item.updated})}>
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

      <AuctionWarning />
      <AuctionSuybscribe />
    </App.Flex>
  )
}

export default GemsAuctionInfo