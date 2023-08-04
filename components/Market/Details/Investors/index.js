import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'

export default function Investors() {
  return (
    <App.Flex column sx={{width: '100%'}}>
      <App.Text size={28} weight={700}>Investors</App.Text>

      <App.Flex justify="center" sx={{padding: '32px 0'}} gap={64}>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
      </App.Flex>
    </App.Flex>
  )
}
