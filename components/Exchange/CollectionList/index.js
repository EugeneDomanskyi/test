import { memo, useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import $collection from '@/store/collection'

import App from '@/components/App'
import CollectionListSearch from '@/components/Exchange/CollectionList/CollectionListSearch'
import CollectionListSort from '@/components/Exchange/CollectionList/CollectionListSort'
import CollectionListPagination from '@/components/Exchange/CollectionList/CollectionListPagination'
import CollectionListItem from '@/components/Exchange/CollectionList/CollectionListItem'

import styles from './styles.module.scss'

const CollectionList = () => {
  const { collections, searched } = useSelector($collection.get.all)
  const current = useSelector(({$collection}) => $collection.current)

  const [wasSearched, setWasSearched] = useState(false)

  const collectionList = () => {
    return (wasSearched) ? searched : collections
  }

  const handleSearched = useCallback((value) => {
    setWasSearched(value)
  }, [])
  
  return (
    <App.Flex column className={styles.container}>
      <App.Flex column gap={16} sx={{ padding: 16 }}>
        <CollectionListSearch onSearched={handleSearched} />
        <CollectionListSort />
      </App.Flex>

      <div className={styles.cardBox}>
        <div className={styles.cardBoxContent}>
          {collectionList().map((collection) => {
            return (
              <CollectionListItem
                key={collection.address}
                collection={collection}
                isActive={current.address === collection.address}
              />
            )
          })}
        </div>
      </div>
      
      {!wasSearched ? (
        <CollectionListPagination />
      ) : null}
    </App.Flex>
  )
}

export default memo(CollectionList, () => true)
