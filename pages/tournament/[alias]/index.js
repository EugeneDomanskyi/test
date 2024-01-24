import {useEffect, useState} from "react"
import {useRouter} from "next/router"

import Image from 'next/image'
import App from '@/components/App'
import Countdown from "@/components/Tournamnet/Countdown";


import $tournament from  "@/store/tournament"
import styles from "./styles.module.scss";

const TournamentPage = () => {
  const router = useRouter()

  const [tournament, setTournament] = useState({})

  useEffect(() => {
    $tournament.api.get(router.query.alias).then(res => {
      console.log(res)
      setTournament(res.data)
    })
    $tournament.api.leaderboard(router.query.alias).then(res => {
      console.log(res)
    })
  }, [])



  return (
      <App.Flex column gap={[130, 70]} className={styles.container}>
        <App.Container>
          <App.Flex flex={1} className={styles.bannerContainer}>
            <App.Flex column justify={'center'}>
              <Image src="/images/tournament/tournament_image.png" width={592} height={451} />
            </App.Flex>
            <App.Flex column justify={'center'}>
              <h1 className={styles.title}><App.Text inline size={64} weight={800}>{tournament.title}</App.Text> Tournament</h1>
              <App.Text weight={400} size={12} color={'rgba(255,255,255,0.6)'}>{tournament.description}</App.Text>
              <Countdown endTime={tournament.end_time} />
              <App.Button variant={'tournament'}>
                Learn More
              </App.Button>
            </App.Flex>
          </App.Flex>
        </App.Container>
      </App.Flex>
  )
}

export default TournamentPage
