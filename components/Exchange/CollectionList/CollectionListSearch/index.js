import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'

import App from '@/components/App'

const CollectionListSearch = ({ onSearched }) => {
  const { isContractAddress, usdt } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)

  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  let timeoutId = useRef(null)

  useEffect(() => {
    setSearch('')
  }, [blockchain.code])

  const handleSearchChange = (value) => {
    setSearch(value)

    clearTimeout(timeoutId.current)

    if (value.trim() == '' && onSearched) {
      onSearched(false)
    }

    if (value.trim().length >= 3) {
      timeoutId.current = setTimeout(() => {
        handleSearch(value.trim())
      }, 1000)
    }
  }

  const handleSearch = async (searchQuery) => {
    setSearchLoading(true)

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

    setSearchLoading(false)
    
    if (onSearched) {
      onSearched(true)
    }
  }

  const handleFocus = () => {
    trackEvent('Dex Search Asset', {
      'Network': blockchain.code.toUpperCase(),
    })
  }

  return (
    <App.TextField
      value={search}
      type="text"
      labelFixed
      placeholder="Assets, Tokens, Games"
      onChange={handleSearchChange}
      start={<App.Icon icon="search" color={search.trim() != '' ? '#fff' : null } />}
      end={searchLoading ? <App.Loader size={12} /> : null}
      size="small"
      variant="search"
      variantNotEmpty
      withClear
      autoComplete="search no-autocomplete"
      name="search no-autocomplete"
      onFocus={handleFocus}
    />
  )
}

export default memo(CollectionListSearch, () => true)