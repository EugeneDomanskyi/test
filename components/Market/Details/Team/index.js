import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Team() {
  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>Team</SectionTitle>
      
      <App.Flex className={styles.container}>
        <App.Flex className={styles.teamItem}>
          <App.Flex className={styles.teamImage}>
            {/* IMAGE */}
          </App.Flex>
          
          <App.Flex column gap={8}>
            <App.Flex column>
              <App.Text size={16} weight={500}>
                Andy Agnas
              </App.Text>
              
              <App.Text size={14} weight={500} color="#B9B8C5">
                CEO
              </App.Text>
            </App.Flex>
            
            <App.Flex gap={16}>
              <App.Icon icon="telegram" />
              <App.Icon icon="youtube" />
              <App.Icon icon="discord" />
            </App.Flex>
          </App.Flex>
        </App.Flex>
        
        <App.Flex className={styles.teamItem}>
          <App.Flex sx={{width: 192, height: 192, borderRadius: '50%', overflow: 'hidden', background: 'grey'}}>
            {/* IMAGE */}
          </App.Flex>
          
          <App.Flex column gap={8}>
            <App.Flex column>
              <App.Text size={16} weight={500}>
                Andy Agnas
              </App.Text>
              
              <App.Text size={14} weight={500} color="#B9B8C5">
                CEO
              </App.Text>
            </App.Flex>
            
            <App.Flex gap={16}>
              <App.Icon icon="telegram" />
              <App.Icon icon="youtube" />
              <App.Icon icon="discord" />
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex className={styles.teamItem}>
          <App.Flex sx={{width: 192, height: 192, borderRadius: '50%', overflow: 'hidden', background: 'grey'}}>
            {/* IMAGE */}
          </App.Flex>
          
          <App.Flex column gap={8}>
            <App.Flex column>
              <App.Text size={16} weight={500}>
                Andy Agnas
              </App.Text>
              
              <App.Text size={14} weight={500} color="#B9B8C5">
                CEO
              </App.Text>
            </App.Flex>
            
            <App.Flex gap={16}>
              <App.Icon icon="telegram" />
              <App.Icon icon="youtube" />
              <App.Icon icon="discord" />
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex className={styles.teamItem}>
          <App.Flex sx={{width: 192, height: 192, borderRadius: '50%', overflow: 'hidden', background: 'grey'}}>
            {/* IMAGE */}
          </App.Flex>
          
          <App.Flex column gap={8}>
            <App.Flex column>
              <App.Text size={16} weight={500}>
                Andy Agnas
              </App.Text>
              
              <App.Text size={14} weight={500} color="#B9B8C5">
                CEO
              </App.Text>
            </App.Flex>
            
            <App.Flex gap={16}>
              <App.Icon icon="telegram" />
              <App.Icon icon="youtube" />
              <App.Icon icon="discord" />
            </App.Flex>
          </App.Flex>
        </App.Flex>
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
