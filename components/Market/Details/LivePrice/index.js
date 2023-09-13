import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import moment from 'moment'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function LivePrice({type}) {
  const { isMobile } = usePropsHelper()

  const marketInfo = useSelector(({$app}) => $app.marketInfo)

  const dateNow = moment().format('MMMM DD, YYYY')
  const price = type === 'tokens' ? 'current price' : 'floor price'
  const symbol = type === 'tokens' ? marketInfo.symbol : 'USDT'
  const diffPercentage = ((((marketInfo.high*1 - marketInfo.price*1) - marketInfo.high*1)/100) * -1).toFixed(2)
  const volume = type === 'tokens' ? marketInfo?.tokenCount : marketInfo?.tvl

  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>{ marketInfo.name } Live Price</SectionTitle>
      
      <App.Text size={isMobile ? 14 : 16} weight={500} color="#B9B8C5">
        { dateNow } - The {price} of <b>{marketInfo.name}</b> is ${ marketInfo.price } per <b>{ symbol }</b> on Tegro: The CEX-DEX.&nbsp;
        <b>{ marketInfo.name }</b> is { diffPercentage }% below the all time high of ${ marketInfo.high }.
        The current circulating supply is { volume } <b>{ symbol }</b>. Discover new cryptocurrencies to add to your portfolio.
      </App.Text>
    </App.Flex>
  )
}
