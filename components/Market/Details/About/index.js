import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function About() {
  const { isMobile } = usePropsHelper()

  const { current, currentMarketSeoInfo } = useSelector(({$collection}) => $collection)

  const market = currentMarketSeoInfo?.token_metadata?.length ? currentMarketSeoInfo?.token_metadata[0] : null

  return (
    <App.Flex column gap={8}>
      <SectionTitle>About { current.name }</SectionTitle>
      
      <App.Text size={isMobile ? 14 : 16} weight={500} color="#B9B8C5">
        <div dangerouslySetInnerHTML={{ __html: market?.long_description }} />
      </App.Text>
    </App.Flex>
  )
}
