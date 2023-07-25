import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import $app from '@/store/app'
import $exchange from '@/store/exchange'
import $collection from '@/store/collection'

import App from '@/components/App'
import CollectionCard from '@/components/Exchange/CollectionCard'

import styles from './styles.module.scss'

const CollectionList = ({collectionId}) => {
  const { isContractAddress, usdt } = useWalletConnect()
  const dispatch = useDispatch()

  const blockchain = useSelector($app.get.blockchain)
  const pages = useSelector($collection.get.pages)
  const { sortType } = useSelector(({$exchange}) => $exchange)
  const { loading } = useSelector(({$collection}) => $collection)
  const { collections, searched } = useSelector($collection.get.all)

  const [collectionList, setCollectionList] = useState([])
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [wasSearched, setWasSearched] = useState(false)
  const [pageType, setPageType] = useState(null)

  const [sortField, sortVerctor] = sortType.split(':')
  let timeoutId = useRef(null)

  useEffect(() => {
    if (search.trim() == '') {
      setCollectionList(collections)
    } else {
      if (wasSearched) {
        setCollectionList(searched)
      }
    }
  }, [search, collections, searched, wasSearched])

  useEffect(() => {
    setSearch('')
  }, [blockchain])

  const setSort = field => () => {
    if (field === sortField) {
      dispatch($exchange.set.sortType(`${field}:${sortVerctor === 'ASC' ? 'DESC' : 'ASC'}`))
    } else {
      dispatch($exchange.set.sortType(`${field}:ASC`))
    }
  }

  const handleFocus = () => {
    trackEvent('Dex Search Asset', {
      'Network': blockchain.code.toUpperCase(),
    })
  }

  const handleSearchChange = (value) => {
    setSearch(value)
    
    clearTimeout(timeoutId.current)

    if (value.trim() == '') {
      setWasSearched(false)
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
      displayCurrency: usdt[blockchain.code],
      // maxFloorAskPrice: process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null,
    }

    if (isContractAddress(searchQuery)) {
      params.id = searchQuery
    } else {
      params.name = searchQuery
    }

    const result = await $collection.api.all(params)

    if (result && result.hasOwnProperty('collections')) {
      dispatch($collection.set.searched(result.collections))
    }

    setSearchLoading(false)
    setWasSearched(true)
  }

  const handlePage = (page) => () => {
    let continuation = null
    if (page != null) {
      continuation = pages[page]
    }

    dispatch($collection.set.page(continuation))
    setPageType(page)
  }
  
  return (
    <App.Flex column className={styles.container}>
      <App.Flex column gap={16} sx={{ padding: 16 }}>
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

        <App.Flex row>
          <App.Flex row flex={1} gap={4} align="center" justify="flex-start" onClick={setSort('NAME')} sx={{ cursor: 'pointer' }}>
            <App.Text color={sortField === 'NAME' ? '#fff' : '#908f99'}>Name</App.Text>
            <App.Icon icon="arrow-down" color={sortField === 'NAME' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortVerctor === 'DESC' ? '180deg' : '0deg'})`}} />
          </App.Flex>

          <App.Flex row flex={1} gap={4} center onClick={setSort('VOLUME')} sx={{ cursor: 'pointer' }}>
            <App.Text color={sortField === 'VOLUME' ? '#fff' : '#908f99'}>Volume</App.Text>
            <App.Icon icon="arrow-down" color={sortField === 'VOLUME' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortVerctor === 'DESC' ? '180deg' : '0deg'})`}} />
          </App.Flex>

          <App.Flex row flex={1} gap={4} align="center" justify="flex-end" onClick={setSort('PRICE')} sx={{ cursor: 'pointer' }}>
            <App.Icon icon="arrow-down" color={sortField === 'PRICE' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortVerctor === 'DESC' ? '180deg' : '0deg'})`}} />
            <App.Text color={sortField === 'PRICE' ? '#fff' : '#908f99'}>Price</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <div className={styles.cardBox}>
        <div className={styles.cardBoxContent}>
          {collectionList.map((collection) => {
            return (
              <CollectionCard
                key={collection.address}
                collection={collection}
                isActive={collectionId === collection.address}
              />
            )
          })}
        </div>
      </div>
      
      {!wasSearched ? (
        <App.Flex row align="center" justify="space-between" sx={{ padding: 16 }}>
          <App.Button small primary outlined={! pages.prev} disabled={! pages.prev} onClick={handlePage('prev')}>
            {loading && pageType == 'prev' ? (
              <App.Loader size={16} />
            ) : (
              <App.Icon icon="chevron-left" color="#fff" />
            )}
            Prev
          </App.Button>

          <App.Button small primary outlined={! pages.next} disabled={! pages.next} onClick={handlePage('next')}>
            Next
            {loading && pageType == 'next' ? (
              <App.Loader size={16} />
            ) : (
              <App.Icon icon="chevron-right" width={16} height={16} />
            )}
          </App.Button>
        </App.Flex>
      ) : null}
    </App.Flex>
  )
}

export default CollectionList
