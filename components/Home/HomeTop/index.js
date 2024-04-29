import { useSelector } from 'react-redux'
import Link from 'next/link'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = () => {
  const loading = useSelector(({ $tournament }) => $tournament.loading)
  const tournament = useSelector(({ $tournament }) => $tournament.current)

  return (
    <App.Container fluid sx={[{ padding: '200px 0 96px' }, { padding: '138px 0 78px' }]}>
      <App.Flex column gap={[64, 40]} center fullWidth>
        <App.Flex column center gap={20}>
          <App.Text tag="h1" center size={[80, 64]} weight={800} height={['88px', 1]}>The Gen2 DEX<br /><App.Text inline size={[80, 64]} weight={700} color="#7364FF" height={1}>for high-frequency trading!</App.Text></App.Text>

          <App.Flex direction={['row', 'column']} center gap={16}>
            <App.Button href="/exchange" outlined rounded variant="success">
              <App.Flex row center gap={8}>
                <div className={styles.circle} />
                <App.Text size={16} weight={500} color="#1cbc7c">Testnet Live</App.Text>
              </App.Flex>
            </App.Button>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeTop