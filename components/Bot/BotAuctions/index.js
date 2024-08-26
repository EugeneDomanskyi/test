import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Socket from '@/libs/ws.lib'

import $gem from '@/store/gem'

import App from '@/components/App'
import AuctionItem from '@/components/Auction/AuctionItem'

const BotAuctions = () => {
  const dispatch = useDispatch()
  const auctions = useSelector(({ $gem }) => $gem.auctions)

  useEffect(() => {
    Socket.on('auctions', 'auction', handleUpdatedAuction)
    fetchAuctions()

    document.addEventListener('visibilitychange', handleVisible)
    return () => {
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [])

  const fetchAuctions = async () => {
    const result = await $gem.api.auctions()
    if (result) {
      dispatch($gem.set.auctions({data: result, wallet: null}))
    }
  }

  const handleUpdatedAuction = async (data) => {
    const result = await $gem.api.auction(data.id)
    if (result) {
      dispatch($gem.set.auctionUpdated({data: {...result, auction: result.auction_id}, wallet: null}))
    }
  }

  const handleVisible = () => {
    if (!document.hidden) {
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
    })
  }

  return (
    <App.Flex row wrap align="flex-start" gap={24}>
      {auctions.length ? (
        getSortedAuctions().map(item => <AuctionItem key={item.id + item.time} item={item} />)
      ) : null}
    </App.Flex>
  )
}

export default BotAuctions