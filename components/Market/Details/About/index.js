import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function About() {
  const { isMobile } = usePropsHelper()

  const { current, marketInfo } = useSelector(({$collection}) => $collection)

  return (
    <App.Flex column gap={8}>
      <SectionTitle>About { current.name }</SectionTitle>
      
      <App.Text size={isMobile ? 14 : 16} weight={500} color="#B9B8C5">
        {/* <div dangerouslySetInnerHTML={{ __html: marketInfo?.description }} /> */}
        { marketInfo?.description }
      </App.Text>
    </App.Flex>
  )
}
