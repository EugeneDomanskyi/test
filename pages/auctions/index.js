import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import useWagmiHelper from '@/myhooks/useWagmiHelper'
import Socket from '@/libs/ws.lib'

import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'
import AuctionClaim from '@/components/Auction/AuctionClaim'
import AuctionWarning from '@/components/Auction/AuctionWarning'

import styles from './styles.module.scss'
import AuctionBar from '@/components/Auction/AuctionBar'
import AuctionFaq from '@/components/Auction/AuctionFaq'
import AuctionSteps from '@/components/Auction/AuctionSteps'
import AuctionVideo from '@/components/Auction/AuctionVideo'
import AuctionSuybscribe from '@/components/Auction/AuctionSubscribe'

const Auctions = () => {
  const { t } = useTranslation()
  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const auctions = useSelector(({ $gem }) => $gem.auctions)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const claim = useSelector(({ $gem }) => $gem.claim)
  const claimItem = useSelector($gem.get.claimItem)

  useEffect(() => {
    fetchAuctions()
    dispatch($gem.set.auctionsUpdateTimer())
  }, [])

  useEffect(() => {
    if (wallet && auctions.length) {
      dispatch($gem.set.auctionsCheckCurrent(wallet))
    }
  }, [wallet, auctions.length])

  useEffect(() => {
    Socket.on('auctions', 'auction', handleUpdatedAuction)

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

  const handleUpdatedAuction = async (data) => {
    //dispatch($gem.set.auctionUpdated({data: {auction: data}, wallet}))

    const result = await $gem.api.auction(data.id)
    if (result) {
      dispatch($gem.set.auctionUpdated({data: {...result, auction: result.auction_id}, wallet}))
    }
  }

  const handleVisible = () => {
    if (!document.hidden) {
      fetchAuctions()
    }
  }

  const fetchAuctions = async () => {
    const result = await $gem.api.auctions()
    if (result) {
      dispatch($gem.set.auctions({data: result, wallet}))
    }
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
        return new Date(b.lastBidTimestamp) - new Date(a.lastBidTimestamp)
      }
      if (a.status == 'closed') return -1
      if (b.status == 'closed') return 1
      return 0
    }).slice(0, 12)
  }

  const handleClaimClose = () => {
    dispatch($gem.set.claim(false))
  }

  return (
    <App.Container maxWidth={1230} className={styles.container}>
      <App.Flex column fullWidth flex={1} gap={16}>
        <AuctionBar />
        {/* <AuctionVideo /> */}

        <App.Flex column gap={24}>
          <AuctionSteps />

          <App.Flex row wrap align="flex-start" gap={24}>
            {auctions.length ? (
              getSortedAuctions().map(item => <AuctionItem key={item.id + item.time} item={item} onClear={handleClear} />)
            ) : null}
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex height={48} />

      <AuctionFaq />

      <App.Dialog hideHeader open={claim} onClose={handleClaimClose}>
        <AuctionClaim item={claimItem} onClose={handleClaimClose} />
      </App.Dialog>

      <AuctionWarning />
      <AuctionSuybscribe />
    </App.Container>
  )
}

export default Auctions