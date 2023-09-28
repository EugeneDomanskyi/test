import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Images() {
  const marketInfo = useSelector(({$app}) => $app.marketInfo)

  const images = marketInfo?.sampleImages || []

  return (
    <App.Flex sx={{width: '100%'}} className={styles.container}>
      {
       images.map((image, index) => {
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
