import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Resources() {
  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <App.Text size={28} weight={700}>Resources</App.Text>

      <App.Flex gap={32}>
        <App.Flex align="center">
          <App.Text size={16} weight={500} color="#4C69FF">Website</App.Text> 
          <App.Icon icon="link-arrow" />
        </App.Flex>
        <App.Flex align="center">
          <App.Text size={16} weight={500} color="#4C69FF">Whitepaper</App.Text> 
          <App.Icon icon="link-arrow" />
        </App.Flex>
        <App.Flex align="center">
          <App.Text size={16} weight={500} color="#4C69FF">Dicord</App.Text> 
          <App.Icon icon="link-arrow" />
        </App.Flex>
        <App.Flex align="center">
          <App.Text size={16} weight={500} color="#4C69FF">X</App.Text> 
          <App.Icon icon="link-arrow" />
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}
