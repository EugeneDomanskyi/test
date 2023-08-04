import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function LivePrice() {
  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <App.Text size={28} weight={700}>MetaSaga Warriors Live Price</App.Text>
      <App.Text size={16} weight={500} color="#B9B8C5">
        The live price of MetaSaga Warriors is $ 0.59 per (MS WARRIOR / USD) with a current market cap of $ 5,900 USD.
        24-hour trading volume is $ 1,350 USD. MS WARRIOR to USD price is updated in real-time. MetaSaga Warrior
        is +10.10% in the last 24 hours with a circulating supply of 10,000.
      </App.Text>
    </App.Flex>
  )
}
