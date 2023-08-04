import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Ad() {
  return (
    <App.Flex sx={{width: '100%', height: 148, background: '#7204FF', borderRadius: 10, overflow: 'hidden'}} justify="center" align="center">
      <App.Text size={28} weight={700}>
        Trade MetaSaga Warriors on Tegro! (Ad)
      </App.Text>
    </App.Flex>
  )
}
