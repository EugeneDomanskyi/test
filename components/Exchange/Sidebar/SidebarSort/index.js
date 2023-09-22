import { memo, useEffect, useRef } from 'react'

import App from '@/components/App'

const SidebarSort = ({ sort, loading, onSort }) => {
  const [sortBy, sortDirection] = sort.split(':')

  const sorting = useRef(false)

  useEffect(() => {
    if ( ! loading) {
      sorting.current = false
    }
  }, [loading])

  const handleSort = (field) => () => {
    if ( ! loading) {
      sorting.current = true
      const newSort = (field === sortBy) ? `${field}:${sortDirection === 'ASC' ? 'DESC' : 'ASC'}` : `${field}:ASC`

      if (onSort) {
        onSort(newSort)
      }
    }
  }

  return (
    <App.Flex row>
      <App.Flex row flex={1} gap={4} align="center" justify="flex-start" onClick={handleSort('NAME')} sx={{ cursor: 'pointer' }}>
        <App.Text color={sortBy === 'NAME' ? '#fff' : '#908f99'}>Name</App.Text>
        {loading && sorting.current && sortBy === 'NAME' ? (
          <App.Flex center width={17}><App.Loader size={12} /></App.Flex>
        ) : (
          <App.Icon icon={"arrow-down"} color={sortBy === 'NAME' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortDirection === 'ASC' ? '180deg' : '0deg'})`}} />
        )}
      </App.Flex>

      <App.Flex row flex={1} gap={4} center onClick={handleSort('VOLUME')} sx={{ cursor: 'pointer' }}>
        <App.Text color={sortBy === 'VOLUME' ? '#fff' : '#908f99'}>Volume</App.Text>
        {loading && sorting.current && sortBy === 'VOLUME' ? (
          <App.Flex center width={17}><App.Loader size={12} /></App.Flex>
        ) : (
          <App.Icon icon="arrow-down" color={sortBy === 'VOLUME' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortDirection === 'ASC' ? '180deg' : '0deg'})`}} />
        )}
      </App.Flex>

      <App.Flex row flex={1} gap={4} align="center" justify="flex-end" onClick={handleSort('PRICE')} sx={{ cursor: 'pointer' }}>
        {loading && sorting.current && sortBy === 'PRICE' ? (
          <App.Flex center width={17}><App.Loader size={12} /></App.Flex>
        ) : (
          <App.Icon icon="arrow-down" color={sortBy === 'PRICE' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortDirection === 'ASC' ? '180deg' : '0deg'})`}} />
        )}
        <App.Text color={sortBy === 'PRICE' ? '#fff' : '#908f99'}>Price</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.sort == nextProps.sort &&
  prevProps.loading == nextProps.loading &&
  prevProps.onSort == nextProps.onSort
}

export default  memo(SidebarSort, isEqual)