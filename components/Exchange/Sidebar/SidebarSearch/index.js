import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { trackEvent } from '@/libs/analytics.lib'
import { fetchPrices, getTokens } from '@/api_services/tokens'

import $app from '@/store/app'
import $token from '@/store/token'
import $collection from '@/store/collection'

import App from '@/components/App'

const SidebarSearch = ({ type, ...props }) => {
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const loading = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.loading : $collection.loading)
  const sort = useSelector(({ $token, $collection }) => type == 'tokens' ? $token.sort : $collection.sort)
  const tokensPerPage = useSelector(({ $token }) => $token.pages.perPage)

  const [sortBy, sortDirection] = sort.split(':')
  let orderBy = sortBy.toLowerCase()
  if (type == 'tokens' && orderBy == 'volume') {
    orderBy = 'volumeUSD'
  }

  if (type == 'tokens' && orderBy == 'price') {
    orderBy = 'derivedETH'
  }

  const [localSearch, setLocalSearch] = useState('')

  let timeoutId = useRef(null)

  const handleSearchChange = (value) => {
    if ( ! loading) {
      setLocalSearch(value)
      clearTimeout(timeoutId.current)

      if (value.trim() == '') {
        if (type == 'tokens') {
          dispatch($token.set.searching(false))
        } else {
          dispatch($collection.set.search(''))
          dispatch($collection.set.searching(false))
        }
      }

      if (value.trim().length >= 3) {
        timeoutId.current = setTimeout(() => {
          handleSearch(value.trim().toLowerCase())
        }, 1000)
      }
    }
  }

  const handleSearch = (searchQuery) => {
    if (type == 'tokens') {
      searchTokens(searchQuery)
    } else {
      dispatch($collection.set.search(searchQuery))
    }

    trackEvent('Search Market', {
      'Network': blockchain.code.toUpperCase(),
      'Search term': searchQuery,
    })
  }

  const searchTokens = async (searchText) => {
    dispatch($token.set.searching(true))
    dispatch($token.set.loading(true))

    const isAddress = /^(0x)?[0-9a-fA-F]{40}$/.test(searchText)
    const post = {
      currentPage: 1,
      perPage: tokensPerPage,
      orderBy: orderBy,
      orderDirection: sortDirection.toLowerCase(),
      searchText: searchText,
      searchField: isAddress ? 'contract_address' : 'name',
    }

    const tokens = await getTokens(blockchain, post)
    dispatch($token.set.searched(tokens))

    const prices = await fetchPrices(blockchain, tokens)
    dispatch($token.set.updatedSearched(prices))

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
      {...props}
    />
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.type == nextProps.type
}

export default memo(SidebarSearch, isEqual)