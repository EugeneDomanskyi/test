import { useDispatch, useSelector } from 'react-redux'

import { trackEvent } from '@/libs/analytics.lib'

import $raffle from '@/store/raffle'

import App from '@/components/App'

const RaffleSearch = ({onSearch}) => {
  const dispatch = useDispatch()
  const search = useSelector(({ $raffle }) => $raffle.search)

  const handleSearchChange = (value) => {
    dispatch($raffle.set.search(value))
  }

  const handleBlur = () => {
    onSearch(search)
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
      onBlur={handleBlur}
    />
  )
}

export default RaffleSearch