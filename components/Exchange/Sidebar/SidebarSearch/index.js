import { memo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $token from '@/store/token'

import App from '@/components/App'

const SidebarSearch = () => {
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const loading = useSelector(({ $token }) => $token.loading)
  const pages = useSelector($token.get.pages)
  const sort = useSelector(({ $token }) => $token.sort)

  const [localSearch, setLocalSearch] = useState('')

  const [sortBy, sortDirection] = sort.split(':')

  let timeoutId = useRef(null)

  const handleSearchChange = (value) => {
    if ( ! loading) {
      setLocalSearch(value)
      clearTimeout(timeoutId.current)

      if (value.trim() == '') {
        dispatch($token.set.searching(false))
      }

      if (value.trim().length >= 3) {
        timeoutId.current = setTimeout(() => {
          handleSearch(value.trim().toLowerCase())
        }, 1000)
      }
    }
  }

  const handleSearch = (searchQuery) => {
    searchTokens(searchQuery)

    trackEvent('Search Market', {
      'Network': blockchain.code.toUpperCase(),
      'Search term': searchQuery,
    })
  }

  const searchTokens = async (searchText) => {
    dispatch($token.set.searching(true))
    dispatch($token.set.loading(true))

    const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(searchText)
    
    const tokens = await $token.api.backend.all({
      page: 1,
      page_size: pages.perPage,
      chain_id: blockchain.id,
      sort_by: sortBy,
      sort_order: sortDirection,
      filter_val: searchText,
      filter_col: isAddress ? 'contract_address' : 'symbol',
      verified: true,
    })

    if (tokens) {
      dispatch($token.set.searched(tokens))
    }

    dispatch($token.set.loading(false))
  }

  return (
    <App.TextField
      value={localSearch}
      type="text"
      labelFixed
      placeholder="Search"
      onChange={handleSearchChange}
      start={<App.Icon icon="search" color={localSearch.trim() != '' ? '#fff' : '#5E5C6B' } />}
      end={localSearch.trim() != '' && loading ? <App.Loader size={12} /> : null}
      size="small"
      variant="search"
      variantNotEmpty
      withClear
      autoComplete="search no-autocomplete"
      name="search no-autocomplete"
    />
  )
}

const isEqual = () => {
  return true
}

export default memo(SidebarSearch, isEqual)