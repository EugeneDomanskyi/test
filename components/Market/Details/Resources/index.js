import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Resources({marketInfo}) {
  const handleClickLink = (url) => {
    window.open(url, '_blank')
  }

  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>Resources</SectionTitle>

      <App.Flex className={styles.container}>
        {
          marketInfo.resources.map((item, index) => {
            return (
              <App.Flex key={index} align="center" className={styles.link} onClick={() => handleClickLink(item.url)}>
                <App.Text size={16} weight={500}>{item.title}</App.Text> 
                <App.Icon icon="link-arrow" />
              </App.Flex>
            )
          })
        }
      </App.Flex>
    </App.Flex>
  )
}
