import { useDispatch, useSelector } from 'react-redux'

import $raffle from '@/store/raffle'

import App from '@/components/App'

const RaffleSearch = () => {
  const dispatch = useDispatch()
  const search = useSelector(({ $raffle }) => $raffle.search)

  const handleSearchChange = (value) => {
    dispatch($raffle.set.search(value))
  }

  return (
    <App.TextField
      value={search}
      type="text"
      labelFixed
      placeholder="Search"
      onChange={handleSearchChange}
      start={<App.Icon icon="search" color={search.trim() != '' ? '#fff' : null } />}
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