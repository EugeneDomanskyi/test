import { useSelector } from 'react-redux'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function About() {
  const { isMobile } = usePropsHelper()

  const { marketInfo } = useSelector(({$app}) => $app)

  return (
    <App.Flex column gap={8}>
      <SectionTitle>About { marketInfo.name }</SectionTitle>
      
      <App.Text size={isMobile ? 14 : 16} weight={500} color="#B9B8C5">
        { marketInfo?.description }
      </App.Text>
    </App.Flex>
  )
}
