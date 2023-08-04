import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function FAQ() {
  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <App.Text size={28} weight={700}>FAQs</App.Text>
      
    </App.Flex>
  )
}
