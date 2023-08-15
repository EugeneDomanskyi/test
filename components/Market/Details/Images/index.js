import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Images() {
  return (
    <App.Flex sx={{width: '100%'}} className={styles.container}>
      <App.Flex className={styles.imageBlock}>
        {/* insert image here */}
      </App.Flex>
      <App.Flex className={styles.imageBlock}>
        {/* insert image here */}
      </App.Flex>
      <App.Flex className={styles.imageBlock}>
        {/* insert image here */}
      </App.Flex>
      <App.Flex className={styles.imageBlock}>
        {/* insert image here */}
      </App.Flex>
    </App.Flex>
  )
}
