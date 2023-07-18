import styles from './styles.module.scss'
import { useSelector, useDispatch } from 'react-redux'

import $exchange from '@/store/exchange'
import $collection from '@/store/collection'

import App from '@/components/App'
import CollectionCard from '@/components/Exchange/CollectionCard'
import { ArrowIcon } from '@/components/Icons/exchange'

const CollectionList = ({collectionId}) => {
  const dispatch = useDispatch()

  const { collections } = useSelector($collection.get.all)
  const sortType = useSelector(({$exchange}) => $exchange.sortType)

  const [sortField, sortVerctor] = sortType.split(':')

  const setSort = field => () => {
    if (field === sortField) {
      dispatch($exchange.set.sortType(`${field}:${sortVerctor === 'ASC' ? 'DESC' : 'ASC'}`))
    } else {
      dispatch($exchange.set.sortType(`${field}:ASC`))
    }
  }
  
  return (
    <App.Flex column className={styles.container}>
      <App.Flex sx={{height: 64}}>
        <App.Flex flex={1} center onClick={setSort('NAME')}>
          <App.Text color={sortField === 'NAME' ? '#fff' : '#908f99'} sx={{marginRight: 5}}>Name</App.Text>
          <ArrowIcon
            color={sortField === 'NAME' ? '#fff' : 'transparent'}
            style={{transform: `rotate(${sortVerctor === 'DESC' ? '180deg' : '0deg'})`}} />
        </App.Flex>
        <App.Flex flex={1} center onClick={setSort('VOLUME')}>
          <App.Text color={sortField === 'VOLUME' ? '#fff' : '#908f99'} sx={{marginRight: 5}}>Volume</App.Text>
          <ArrowIcon
            color={sortField === 'VOLUME' ? '#fff' : 'transparent'}
            style={{transform: `rotate(${sortVerctor === 'DESC' ? '180deg' : '0deg'})`}} />
        </App.Flex>
        <App.Flex flex={1} center onClick={setSort('PRICE')}>
          <App.Text color={sortField === 'PRICE' ? '#fff' : '#908f99'} sx={{marginRight: 5}}>Price</App.Text>
          <ArrowIcon
            color={sortField === 'PRICE' ? '#fff' : 'transparent'}
            style={{transform: `rotate(${sortVerctor === 'DESC' ? '180deg' : '0deg'})`}} />
        </App.Flex>
      </App.Flex>
      {
        collections.filter(collection => collection.image).map((collection) => {
          return (
            <CollectionCard
              key={collection.address}
              {...collection}
              isActive={collectionId === collection.address} />
          )
        })
      }
    </App.Flex>
  )
}

export default CollectionList
