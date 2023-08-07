import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $collection from '@/store/collection'
import $token from '@/store/token'

import App from '@/components/App'

const CollectionListSearch = ({ onSearched, ...props }) => {
  const router = useRouter()
  const isExchange = router.pathname.includes('/exchange')

  const { isContractAddress, usdt, network } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const prepared = useSelector(({ $token }) => $token.prepared)
  const client = useSelector($token.get.client)
  const query = useSelector($token.get.query)
  const tokenIds = useSelector($token.get.ids)

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
        handleSearch(value.trim().toLowerCase())
      }, 1000)
    }
  }

  const handleSearch = async (searchQuery) => {
    setSearchLoading(true)

    if (isExchange) {
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
    } else {
      const result = await client.query({
        query: query.tokens,
        variables: {
          skip: 0,
          orderBy: 'volumeUSD',
          orderDirection: 'desc',
          searchText: searchQuery,
        },
      })

      if (result && result.hasOwnProperty('data') && result.data.hasOwnProperty('tokens')) {
        const currentIds = result.data.tokens.map(item => item.id.toLowerCase())
        const cgIds = tokenIds(currentIds, network(blockchain.code)?.platform)
        let infos = []
        if (cgIds.length) {
          infos = await $token.api.tokens.info({ vs_currency: 'usd', ids: cgIds.join(',') })
        }

        dispatch($token.set.searched(result.data.tokens.map(item => {
          const preparedToken = prepared.find(el => el.address.toLowerCase() == item.id.toLowerCase())
          const info = infos.find(el => el.symbol.toLowerCase() == item.symbol.toLowerCase())

          return {
            ...item,
            blockchain: blockchain.code,
            currency: blockchain.currency,
            prepared: preparedToken,
            info,
          }
        })))
      }
    }

    setSearchLoading(false)

    trackEvent('Search Asset', {
      'Network': blockchain.code.toUpperCase(),
      'Search Term': searchQuery,
    })
    
    if (onSearched) {
      onSearched(true)
    }
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
      {...props}
    />
  )
}

export default memo(CollectionListSearch, () => true)