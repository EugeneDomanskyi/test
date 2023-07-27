import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import App from '@/components/App'

import $exchange from '@/store/exchange'

const CollectionListSort = () => {
  const dispatch = useDispatch()
  const { sortType } = useSelector(({$exchange}) => $exchange)

  const [sortField, sortVerctor] = sortType.split(':')

  const setSort = (field) => () => {
    if (field === sortField) {
      dispatch($exchange.set.sortType(`${field}:${sortVerctor === 'ASC' ? 'DESC' : 'ASC'}`))
    } else {
      dispatch($exchange.set.sortType(`${field}:ASC`))
    }
  }

  return (
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
  )
}

export default  memo(CollectionListSort, () => true)