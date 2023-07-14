import styles from './styles.module.scss'
import { useSelector } from 'react-redux'

import App from '@/components/App'
import CollectionCard from '@/components/Exchange/CollectionCard'

const CollectionList = ({collectionId}) => {
  const collections = useSelector(({$exchange}) => $exchange.collections)
  
  return (
    <App.Flex column className={styles.container}>
      {
        collections.filter(collection => collection.image).map((collection) => {
          return (
            <CollectionCard
              key={collection.id}
              {...collection}
              isActive={collectionId === collection.id} />
          )
        })
      }
    </App.Flex>
  )
}

export default CollectionList
