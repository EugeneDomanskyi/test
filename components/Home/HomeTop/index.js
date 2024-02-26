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
        <App.Flex column center width={[590, 337]} gap={20}>
          <App.Text tag="h1" center size={[80, 64]} weight={800} height={['88px', 1]}>The Gen2 DEX <App.Text inline italic size={[80, 64]} weight={700} color="#7364FF" family="Playfair Display">is here!</App.Text></App.Text>

          <App.Flex direction={['row', 'column']} center gap={16}>
            <App.Button href="/exchange" outlined rounded variant="success">
              <App.Flex row center gap={8}>
                <div className={styles.circle} />
                <App.Text size={16} weight={500} color="#1cbc7c">Testnet Live</App.Text>
              </App.Flex>
            </App.Button>

            <App.Text center size={16} weight={400} color="rgba(255, 255, 255, .6)">
              Trade for FREE & Earn POINTS!
            </App.Text>
          </App.Flex>
        </App.Flex>

        {/* {tournament?.alias ? (
          <Link href={`/tournament/${tournament.alias}`}>
            <App.ButtonGradient>Earn Points</App.ButtonGradient>
          </Link>
        ) : (
          <App.ButtonGradient>{loading ? 'Loading...' : 'There are no active tournaments'}</App.ButtonGradient>
        )} */}
      </App.Flex>
    </App.Container>
  )
}

export default HomeTop