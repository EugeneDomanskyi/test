import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Team() {
  const { current, currentMarketSeoInfo } = useSelector(({$collection}) => $collection)

  const team = currentMarketSeoInfo?.project_data?.length ? currentMarketSeoInfo?.project_data[0].team : null

  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>Team</SectionTitle>
      
      <App.Flex className={styles.container}>
        {
          team && Object.values(team).map(item => {
            return (
              <App.Flex className={styles.teamItem}>
                <App.Flex className={styles.teamImage}>
                  <img src={item.pfp} alt="" />
                </App.Flex>
                
                <App.Flex column gap={8}>
                  <App.Flex column>
                    <App.Text size={16} weight={500}>
                      { item.name }
                    </App.Text>
                    
                    <App.Text size={14} weight={500} color="#B9B8C5">
                      { item.role }
                    </App.Text>
                  </App.Flex>
                  
                  <App.Flex gap={16}>
                    <App.Icon icon="telegram" />
                    <App.Icon icon="youtube" />
                    <App.Icon icon="discord" />
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            )
          })
        }
      </App.Flex>

      <App.Flex justify="center" align="center" sx={{marginTop: 8}} >
        <App.Text size={16} weight={500} color="#4C69FF">
          View all team members
        </App.Text>
        <App.Icon icon="link-arrow" />
      </App.Flex>
    </App.Flex>
  )
}
