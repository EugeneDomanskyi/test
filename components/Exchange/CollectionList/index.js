import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import $exchange from '@/store/exchange'
import $collection from '@/store/collection'

import App from '@/components/App'
import CollectionCard from '@/components/Exchange/CollectionCard'

import { ArrowIcon } from '@/components/Icons/exchange'

import styles from './styles.module.scss'

const CollectionList = ({collectionId}) => {
  const dispatch = useDispatch()

  const { collections } = useSelector($collection.get.all)
  const sortType = useSelector(({$exchange}) => $exchange.sortType)

  const [search, setSearch] = useState('')

  const [sortField, sortVerctor] = sortType.split(':')

  const setSort = field => () => {
    if (field === sortField) {
      dispatch($exchange.set.sortType(`${field}:${sortVerctor === 'ASC' ? 'DESC' : 'ASC'}`))
    } else {
      dispatch($exchange.set.sortType(`${field}:ASC`))
    }
  }

  const handleSearchChange = (value) => {
    setSearch(value)
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
          size="small"
          variant="search"
          variantNotEmpty
          withClear
          autoComplete="search no-autocomplete"
          name="search no-autocomplete"
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

      {collections.map((collection) => {
        return (
          <CollectionCard
            key={collection.address}
            {...collection}
            isActive={collectionId === collection.address}
          />
        )
      })}
    </App.Flex>
  )
}

export default CollectionList
