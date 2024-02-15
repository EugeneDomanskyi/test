import Link from 'next/link'

import App from '@/components/App'
import { useSelector } from 'react-redux'

const HomeTop = () => {
  const loading = useSelector(({ $tournament }) => $tournament.loading)
  const tournament = useSelector(({ $tournament }) => $tournament.current)

  return (
    <App.Container fluid sx={[{ padding: '200px 0 96px' }, { padding: '138px 0 78px' }]}>
      <App.Flex column gap={[64, 40]} center fullWidth>
        <App.Flex column center width={[715, 337]} gap={20}>
          <App.Text center size={[80, 64]} weight={800} height={['88px', 1]}>The Gen II Exchange <App.Text inline italic size={[80, 64]} weight={700} color="#7364FF" family="Playfair Display">Is Here!</App.Text></App.Text>
          <App.Text center size={16} weight={400} color="rgba(255, 255, 255, .6)">Testnet is live. Participate and start earning points.</App.Text>
        </App.Flex>

        {tournament?.alias ? (
          <Link href={`/tournament/${tournament.alias}`}>
            <App.ButtonGradient>Earn Points</App.ButtonGradient>
          </Link>
        ) : (
          <App.ButtonGradient>{loading ? 'Loading...' : 'There are no active tournaments'}</App.ButtonGradient>
        )}
      </App.Flex>
    </App.Container>
  )
}

export default HomeTop