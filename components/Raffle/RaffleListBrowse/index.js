import { useDispatch, useSelector } from 'react-redux'

import $raffle from '@/store/raffle'

import App from '@/components/App'
import RaffleListBrowseItem from '@/components/Raffle/RaffleListBrowseItem'
import { useEffect, useState } from 'react'

const RaffleListBrowse = ({ onParticipate, onShare }) => {
  const dispatch = useDispatch()
  const campaigns = useSelector($raffle.get.filtered)
  const page = useSelector(({ $raffle }) => $raffle.page)

  const [pagesCount, setPagesCount] = useState(1)

  const perPage = 12

  useEffect(() => {
    if (campaigns.length) {
      const count = Math.ceil(campaigns.length / perPage)
      setPagesCount(count)

      if (page > count) {
        dispatch($raffle.set.page(count))
      }
    } else {
      setPagesCount(1)
    }
  }, [campaigns])

  const handlePageChange = (value) => {
    dispatch($raffle.set.page(value))
  }

  return (
    <App.Flex column gap={16}>
      <App.Flex wrap gap={[32, 16]} >
        {campaigns.slice((page - 1) * perPage, page * perPage).map(item => (
          <RaffleListBrowseItem key={item.id} item={item} onParticipate={onParticipate} onShare={onShare} />
        ))}
      </App.Flex>

      <App.Flex center>
        <App.Pagination page={page} count={pagesCount} onChange={handlePageChange} />
      </App.Flex>
    </App.Flex>
  )
}

export default RaffleListBrowse