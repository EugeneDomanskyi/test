import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Resources() {
  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>Resources</SectionTitle>

      <App.Flex className={styles.container}>
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
