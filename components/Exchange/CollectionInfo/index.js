import styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import Image from 'next/image'

import $collection from '@/store/collection'

import App from '@/components/App'

const CollectionInfo = ({collectionId}) => {

  const currentCollection = useSelector($collection.get.collection('address', collectionId))
  
  return (
    <App.Flex className={styles.container}>
      {
        currentCollection?.image
          ? <Image
              width={130}
              height={130}
              alt=""
              className={styles.image}
              src={currentCollection?.image} />
          : null
      }
    </App.Flex>
  )
}

export default CollectionInfo
