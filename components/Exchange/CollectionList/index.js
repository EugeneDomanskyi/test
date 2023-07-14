import styles from './styles.module.scss'
import { useSelector } from 'react-redux'

import App from '@/components/App'
import CollectionCard from '@/components/Exchange/CollectionCard'

const CollectionList = ({collectionId}) => {
  const collections = useSelector(({$collection}) => $collection.all)
  
  return (
    <App.Flex column className={styles.container}>
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
