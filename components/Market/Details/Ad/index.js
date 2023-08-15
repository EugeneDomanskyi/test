import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

export default function Ad() {
  const { isMobile } = usePropsHelper()

  return (
    <App.Flex sx={{width: '100%', height: 148, background: '#7204FF', borderRadius: 10, overflow: 'hidden'}} justify="center" align="center">
      <App.Text size={isMobile ? 20 : 28} center weight={700}>
        Trade MetaSaga Warriors on Tegro! (Ad)
      </App.Text>
    </App.Flex>
  )
}
