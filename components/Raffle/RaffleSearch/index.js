import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $raffle from '@/store/raffle'

import App from '@/components/App'

const RaffleSearch = () => {
  const dispatch = useDispatch()
  const search = useSelector(({ $raffle }) => $raffle.search)
  const loading = useSelector(({ $raffle }) => $raffle.loading)

  const [localSearch, setLocalSearch] = useState(search)

  let timeoutId = useRef(null)

  useEffect(() => {
    if (search == '') {
      setLocalSearch('')
    }
  }, [search])

  const handleSearchChange = (value) => {
    if ( ! loading) {
      setLocalSearch(value)
      clearTimeout(timeoutId.current)
      if (value.trim().length >= 3) {
        timeoutId.current = setTimeout(() => {
          handleSearch(value.trim().toLowerCase())
        }, 1000)
      }
    }
  }

  const handleSearch = (searchQuery) => {
    dispatch($raffle.set.search(searchQuery))
  }

  return (
    <App.TextField
      value={localSearch}
      type="text"
      labelFixed
      placeholder="Search"
      onChange={handleSearchChange}
      start={<App.Icon icon="search" color={localSearch.trim() != '' ? '#fff' : null } />}
      end={localSearch.trim() != '' && loading ? <App.Loader size={12} /> : null}
      size="small"
      variant="search-light"
      variantNotEmpty
      withClear
      autoComplete="search no-autocomplete"
      name="search no-autocomplete"
    />
  )
}

export default RaffleSearch