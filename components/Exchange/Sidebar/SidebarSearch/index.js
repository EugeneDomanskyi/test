import { memo, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'

import App from '@/components/App'

const SidebarSearch = ({ search, loading, onSearch, ...props }) => {
  const blockchain = useSelector($app.get.blockchain)

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
  }

  return (
    <App.TextField
      value={localSearch}
      type="text"
      labelFixed
      placeholder="Search by name or paste address"
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