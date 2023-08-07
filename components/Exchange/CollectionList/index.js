import { memo, useCallback, useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'
import CollectionListSearch from '@/components/Exchange/CollectionList/CollectionListSearch'
import CollectionListSort from '@/components/Exchange/CollectionList/CollectionListSort'
import CollectionListPagination from '@/components/Exchange/CollectionList/CollectionListPagination'
import CollectionListItem from '@/components/Exchange/CollectionList/CollectionListItem'

import styles from './styles.module.scss'

const CollectionList = ({ items, searched, current, className, pages, page, loading, onPageChange, onClose }) => {
  const [wasSearched, setWasSearched] = useState(false)

  const itemList = () => {
    return (wasSearched) ? searched : items
  }

  const handleSearched = useCallback((value) => {
    setWasSearched(value)
  }, [])
  
  return (
    <App.Flex column className={cn(styles.container, styles[className])}>
      <App.Flex column gap={16} sx={{ padding: 16 }}>
        <CollectionListSearch onSearched={handleSearched} />
        <CollectionListSort />
      </App.Flex>

      <div className={styles.cardBox}>
        <div className={styles.cardBoxContent}>
          {itemList().map((item) => {
            return (
              <CollectionListItem
                isSearched={wasSearched}
                key={item.address}
                collection={item}
                isActive={current.address === item.address}
                onClose={onClose}
              />
            )
          })}
        </div>
      </div>
      
      {!wasSearched ? (
        <CollectionListPagination pages={pages} page={page} loading={loading} onPageChange={onPageChange} />
      ) : null}
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return JSON.stringify(prevProps.items) == JSON.stringify(nextProps.items) &&
    JSON.stringify(prevProps.searched) == JSON.stringify(nextProps.searched) &&
    JSON.stringify(prevProps.current) == JSON.stringify(nextProps.current) &&
    prevProps.className == nextProps.className &&
    JSON.stringify(prevProps.pages) == JSON.stringify(nextProps.pages) &&
    prevProps.page == nextProps.page &&
    prevProps.loading == nextProps.loading &&
    prevProps.onPageChange == nextProps.onPageChange &&
    prevProps.onClose == nextProps.onClose
}

export default memo(CollectionList, isEqual)
