import { memo, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import $token from '@/store/token'

import App from '@/components/App'

import styles from './styles.module.scss'

const SidebarSort = () => {
  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)
  const loading = useSelector(({ $token }) => $token.loading)
  const sort = useSelector(({ $token }) => $token.sort)
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
      const newSort = (field === sortBy) ? `${field}:${sortDirection === 'asc' ? 'desc' : 'asc'}` : `${field}:asc`

      dispatch($token.set.sort(newSort))
      dispatch($token.set.pages({current: 1}))
    }
  }

  return (
    <App.Flex row className={styles.container}>
      <App.Flex row flex={1} gap={6} align="center" justify="flex-start" onClick={handleSort('symbol')} sx={{ cursor: 'pointer' }}>
        <App.Text size={isApp ? 14 : 10} weight={600} height={1} color={sortBy === 'symbol' ? '#fff' : '#908f99'}>Name</App.Text>
        {loading && sorting.current && sortBy === 'symbol' ? (
          <App.Flex center width={7}><App.Loader size={7} /></App.Flex>
        ) : (
          <App.Icon icon="arrow-down2" width={isApp ? 12 : null} height={isApp ? 12 : null} color={sortBy === 'symbol' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortDirection === 'asc' ? '180deg' : '0deg'})`}} />
        )}
      </App.Flex>

      <App.Flex row flex={1} gap={6} center onClick={handleSort('volume')} sx={{ cursor: 'pointer' }}>
        <App.Text size={isApp ? 14 : 10} weight={600} height={1} color={sortBy === 'volume' ? '#fff' : '#908f99'}>Volume</App.Text>
        {loading && sorting.current && sortBy === 'volume' ? (
          <App.Flex center width={isApp ? 12 : 7}><App.Loader size={isApp ? 12 : 7} /></App.Flex>
        ) : (
          <App.Icon icon="arrow-down2" width={isApp ? 12 : null} height={isApp ? 12 : null} color={sortBy === 'volume' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortDirection === 'asc' ? '180deg' : '0deg'})`}} />
        )}
      </App.Flex>

      <App.Flex row flex={1} gap={6} align="center" justify="flex-end" onClick={handleSort('price')} sx={{ cursor: 'pointer' }}>
        {loading && sorting.current && sortBy === 'price' ? (
          <App.Flex center width={isApp ? 12 : 7}><App.Loader size={isApp ? 12 : 7} /></App.Flex>
        ) : (
          <App.Icon icon="arrow-down2" width={isApp ? 12 : null} height={isApp ? 12 : null}color={sortBy === 'price' ? '#fff' : 'transparent'} style={{transform: `rotate(${sortDirection === 'asc' ? '180deg' : '0deg'})`}} />
        )}
        <App.Text size={isApp ? 14 : 10} weight={600} height={1} color={sortBy === 'price' ? '#fff' : '#908f99'}>Price</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

const isEqual = () => {
  return true
}

export default  memo(SidebarSort, isEqual)