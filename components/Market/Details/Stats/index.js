import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Stats() {
  const { isMobile } = usePropsHelper()

  const { marketInfo } = useSelector(({$app}) => $app)

  return (
    <App.Flex column sx={{width: '100%'}} gap={16}>
      <SectionTitle>{ marketInfo.name } Stats</SectionTitle>
      
      <App.Flex column sx={{width: '100%'}} gap={isMobile ? 16 : 32}>
        <App.Flex sx={{width: '100%'}} className={styles.container}>
          <App.Flex className={styles.statBlock} column>
            <App.Text size={isMobile ? 12 : 14} weight={500} color="#B9B8C5">Floor Price</App.Text>
            <App.Text size={isMobile ? 20 : 24} weight={700}>${ marketInfo.price }</App.Text>
          </App.Flex>

          <App.Flex className={styles.statBlock} column>
            <App.Text size={isMobile ? 12 : 14} weight={500} color="#B9B8C5">24H Volume</App.Text>
            <App.Text size={isMobile ? 20 : 24} weight={700}>${ marketInfo.volume }</App.Text>
          </App.Flex>

          <App.Flex className={styles.statBlock} column>
            <App.Text size={isMobile ? 12 : 14} weight={500} color="#B9B8C5">Total Supply</App.Text>
            <App.Text size={isMobile ? 20 : 24} weight={700}>{ marketInfo.tokenCount }</App.Text>
          </App.Flex>

          <App.Flex className={styles.statBlock} column>
            <App.Text size={isMobile ? 12 : 14} weight={500} color="#B9B8C5">Market Cap</App.Text>
            <App.Text size={isMobile ? 20 : 24} weight={700}>${ marketInfo.marketCap }</App.Text>
          </App.Flex>
        </App.Flex>

        {/* <App.Flex justify="flex-end">
          <App.Text size={10} weight={500} color="#908F99">3 hours ago (08:30 AM, UTC+05:30, 15 Feb 2023)</App.Text>
        </App.Flex> */}
      </App.Flex>
    </App.Flex>
  )
}
