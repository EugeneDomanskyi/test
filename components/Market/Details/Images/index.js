import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Images() {
  const { marketInfo } = useSelector(({$collection}) => $collection)

  
  // const images = []
  
  const images = marketInfo?.sampleImages?.split(',')
  console.log('images', images);


  return (
    <App.Flex sx={{width: '100%'}} className={styles.container}>
      {
        images && Object.values(images).map((image, index) => {
          return (
            <App.Flex key={index} className={styles.imageBlock}>
              <img src={image} alt="" />
            </App.Flex>
          )
        })
      }
    </App.Flex>
  )
}
