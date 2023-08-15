import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function LivePrice() {
  const { isMobile } = usePropsHelper()

  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>MetaSaga Warriors Live Price</SectionTitle>
      
      <App.Text size={isMobile ? 14 : 16} weight={500} color="#B9B8C5">
        The live price of MetaSaga Warriors is $ 0.59 per (MS WARRIOR / USD) with a current market cap of $ 5,900 USD.
        24-hour trading volume is $ 1,350 USD. MS WARRIOR to USD price is updated in real-time. MetaSaga Warrior
        is +10.10% in the last 24 hours with a circulating supply of 10,000.
      </App.Text>
    </App.Flex>
  )
}
