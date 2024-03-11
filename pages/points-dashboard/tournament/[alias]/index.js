import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {useRouter} from 'next/router'
import moment from 'moment'

import $tournament from  '@/store/tournament'

import App from '@/components/App'
import TournamentCountdown from '@/components/Tournamnet/TournamentCountdown'
import TournamentLeaderboard from '@/components/Tournamnet/TournamentLeaderboard'
import TournamentInfo from '@/components/Tournamnet/TournamentInfo'

import styles from './styles.module.scss'

const TournamentPage = () => {
  const router = useRouter()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [tournament, setTournament] = useState({tiers: []})
  
  useEffect(() => {
    fetchTournament()
  }, [])

  const fetchTournament = async () => {
    const result = await $tournament.api.get(router.query.alias)
    if (result && result?.data) {
      setTournament(result.data)
    }
  }

  const handleDashboard = () => {
    router.push(`/points-dashboard`)
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Container maxWidth={1230} sx={[{ paddingTop: 34 }, {paddingTop: 0}]}>
        <App.Flex column fullWidth gap={[94, 32]}>
          <App.Flex direction={['row', 'column']} fullWidth align="center" justify="space-between" gap={[0, 140]}>
            <App.Flex row center gap={16} sx={{ cursor: 'pointer' }} onClick={handleDashboard}>
              <App.Icon icon="chevron-left" width={24} height={24} />
              <App.Text tag="h1" family={'Playfair Display'} size={[40, 32]} weight={600} color="#A6DC37">
                <App.Text inline size={[40, 32]} weight={600}>{tournament.title}</App.Text> Championship
              </App.Text>
            </App.Flex>

            <App.Flex column justify="flex-end" align="center" gap={24}>
              {isMobile ? (
                <App.Button href="/exchange" primary rounded>Start Trading <App.Icon icon="arrow-45" /></App.Button>
              ) : null}

              <App.Flex direction={['row', 'column']} justify="flex-end" align="center" gap={[16, 4]}>
                {tournament.status === 'active' ?
                  moment().isAfter(tournament.start_time) ? (
                    <>
                      <App.Text weight={600} color="#9B99AE">Ends in</App.Text>
                      <TournamentCountdown endTime={tournament.end_time} />
                    </>
                  ) : (
                    <>
                      <App.Text weight={600} color="#9B99AE">Started in</App.Text>
                      <TournamentCountdown endTime={tournament.start_time} />
                    </>
                  )
                : (
                  <>
                    <App.Text weight={600} color="#9B99AE">Closed at</App.Text>
                    <App.Text weight={700} size={40} height={1.1}>{ moment(tournament.end_time).format('DD.MM.YYYY') }</App.Text>
                  </>
                )}
              </App.Flex>
            </App.Flex>
          </App.Flex>
          
          <App.Flex direction={['row', 'column']} gap={[126, 62]}>
            <App.Flex flex={1} order={[1, 2]}>
              <TournamentLeaderboard />
            </App.Flex>

            <App.Flex flex={1} order={[2, 1]}>
              <TournamentInfo tournament={tournament} />
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default TournamentPage
