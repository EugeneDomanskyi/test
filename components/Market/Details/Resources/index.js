import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Resources() {
  const marketInfo = useSelector(({$app}) => $app.marketInfo)

  const handleClickLink = (url) => {
    window.open(url, '_blank')
  }

  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>Resources</SectionTitle>

      <App.Flex className={styles.container}>
        {
          marketInfo.externalUrl
            ? <App.Flex align="center" className={styles.link} onClick={() => handleClickLink(marketInfo.externalUrl)}>
                <App.Text size={16} weight={500}>Website</App.Text> 
                <App.Icon icon="link-arrow" />
              </App.Flex>
            : null
        }
        {
          marketInfo.discordUrl
            ? <App.Flex align="center" className={styles.link} onClick={() => handleClickLink(marketInfo.discordUrl)}>
                <App.Text size={16} weight={500}>Dicord</App.Text> 
                <App.Icon icon="link-arrow" />
              </App.Flex>
            : null
        }
        {
          marketInfo.twitterUrl
            ? <App.Flex align="center" className={styles.link} onClick={() => handleClickLink(marketInfo.twitterUrl)}>
                <App.Text size={16} weight={500}>Twitter</App.Text> 
                <App.Icon icon="link-arrow" />
              </App.Flex>
            : null
        }
      </App.Flex>
    </App.Flex>
  )
}
