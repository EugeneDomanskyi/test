import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'
import $token from '@/store/token'

import App from '@/components/App'

const SidebarSearch = ({ search, loading, onSearch, ...props }) => {
  const blockchain = useSelector($app.get.blockchain)

  const [localSearch, setLocalSearch] = useState(search)

  let timeoutId = useRef(null)

  const handleSearchChange = (value) => {
    if ( ! loading) {
      setLocalSearch(value)
      clearTimeout(timeoutId.current)

      if (value.trim() == '' && onSearch) {
        onSearch('')
      }

      if (value.trim().length >= 3) {
        timeoutId.current = setTimeout(() => {
          handleSearch(value.trim().toLowerCase())
        }, 1000)
      }
    }
  }

  const handleSearch = (searchQuery) => {
    if (onSearch) {
      onSearch(searchQuery)
    }

    trackEvent('Search Asset', {
      'Network': blockchain.code.toUpperCase(),
      'Search Term': searchQuery,
    })

    /* if (isExchange) {
      const params = {
        blockchain: blockchain.code,
        sortBy: '1DayVolume',
        limit: 10,
        // displayCurrency: usdt[blockchain.code],
      }

      if (isContractAddress(searchQuery)) {
        params.id = searchQuery
      } else {
        params.name = searchQuery
      }

      const result = await $collection.api.all(params)

      if (result && result.hasOwnProperty('collections')) {
        dispatch($collection.set.searched(result.collections.map(item => ({ ...item, blockchain: blockchain.code, currency: blockchain.currency }))))
      }
    } */
  }

  return (
    <App.TextField
      value={localSearch}
      type="text"
      labelFixed
      placeholder="Assets, Tokens, Games"
      onChange={handleSearchChange}
      start={<App.Icon icon="search" color={localSearch.trim() != '' ? '#fff' : null } />}
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
  return prevProps.search == nextProps.search &&
  prevProps.loading == nextProps.loading &&
  prevProps.onSearch == nextProps.onSearch
}

export default memo(SidebarSearch, isEqual)