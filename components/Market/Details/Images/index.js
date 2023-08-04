import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Images() {
  return (
    <App.Flex sx={{width: '100%'}} gap={32}>
      <App.Flex sx={{flex: 1, height: 192, borderRadius: 12, ovefrlow: 'hidden', background: 'yellow'}}>
        {/* insert image here */}
      </App.Flex>
      <App.Flex sx={{flex: 1, height: 192, borderRadius: 12, ovefrlow: 'hidden', background: 'yellow'}}>
        {/* insert image here */}
      </App.Flex>
      <App.Flex sx={{flex: 1, height: 192, borderRadius: 12, ovefrlow: 'hidden', background: 'yellow'}}>
        {/* insert image here */}
      </App.Flex>
      <App.Flex sx={{flex: 1, height: 192, borderRadius: 12, ovefrlow: 'hidden', background: 'yellow'}}>
        {/* insert image here */}
      </App.Flex>
    </App.Flex>
  )
}
