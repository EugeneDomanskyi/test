import { useSelector } from 'react-redux'
import styles from './styles.module.scss'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

export default function Investors() {
  return (
    <App.Flex column sx={{width: '100%'}}>
      <SectionTitle>Investors</SectionTitle>

      <App.Flex className={styles.container}>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
        <App.Flex sx={{width: 110, height: 30, background: 'purple'}} justify="center" align="center">Investor</App.Flex>
      </App.Flex>
    </App.Flex>
  )
}
