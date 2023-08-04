import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Stats() {
  return (
    <App.Flex column sx={{width: '100%'}} gap={16}>
      <App.Text size={28} weight={700}>MetaSaga Warriors Stats</App.Text>
      
      <App.Flex column sx={{width: '100%'}} gap={32}>
        <App.Flex sx={{width: '100%'}} justify="space-between" gap={32}>
          <App.Flex className={styles.statBlock}>
            <App.Flex column>
              <App.Text size={14} weight={500} color="#B9B8C5">Floor Price</App.Text>
              <App.Text size={24} weight={700}>$0.59</App.Text>
            </App.Flex>
            
            <App.Flex align="center" gap={8}>
              <App.Text size={14} weight={400} color="#53F19C">
                <App.Icon icon="caret-up-fill" /> 3.4%
              </App.Text>
              <App.Flex sx={{width: 208, height: 62, background: "green"}} />
            </App.Flex>
          </App.Flex>
          
          <App.Flex className={styles.statBlock}>
            <App.Flex column>
              <App.Text size={14} weight={500} color="#B9B8C5">24H Volume</App.Text>
              <App.Text size={24} weight={700}>$1,350</App.Text>
            </App.Flex>
            
            <App.Flex align="center" gap={8}>
              <App.Text size={14} weight={400} color="#53F19C">
                <App.Icon icon="caret-up-fill" /> 3.4%
              </App.Text>
              <App.Flex sx={{width: 208, height: 62, background: "green"}} />
            </App.Flex>
          </App.Flex>
        </App.Flex>
        
        <App.Flex sx={{width: '100%'}} justify="space-between" gap={32}>
          <App.Flex className={styles.statBlock}>
            <App.Flex column>
              <App.Text size={14} weight={500} color="#B9B8C5">Total Suppy</App.Text>
              <App.Text size={24} weight={700}>10,000</App.Text>
            </App.Flex>
            
            <App.Flex align="center" gap={8}>
              <App.Text size={14} weight={400} color="#53F19C">
                <App.Icon icon="caret-up-fill" /> 3.4%
              </App.Text>
              <App.Flex sx={{width: 208, height: 62, background: "green"}} />
            </App.Flex>
          </App.Flex>
          
          <App.Flex className={styles.statBlock}>
            <App.Flex column>
              <App.Text size={14} weight={500} color="#B9B8C5">Market Cap</App.Text>
              <App.Text size={24} weight={700}>$5,900</App.Text>
            </App.Flex>
            
            <App.Flex align="center" gap={8}>
              <App.Text size={14} weight={400} color="#53F19C">
                <App.Icon icon="caret-up-fill" /> 3.4%
              </App.Text>
              <App.Flex sx={{width: 208, height: 62, background: "green"}} />
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex justify="flex-end">
          <App.Text size={10} weight={500} color="#908F99">3 hours ago (08:30 AM, UTC+05:30, 15 Feb 2023)</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}
