import {useEffect, useState} from "react"
import {useRouter} from "next/router"

import App from '@/components/App'
import TierBlock from "@/components/Tournamnet/TierBlock";
import Banner from '@/components/Tournamnet/Banner'


import $tournament from  "@/store/tournament"
import styles from "./styles.module.scss";
import useWalletConnect from "@/myhooks/wallet-connect";
import Leaderboard from "@/components/Tournamnet/Leaderboard";

const TournamentPage = () => {
  const router = useRouter()
  const { wallet } = useWalletConnect()

  const [tournament, setTournament] = useState({})
  const [walletResults, setWalletresults] = useState({position: 0, points: 0})
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    $tournament.api.get(router.query.alias).then(res => {
      setTournament(res.data)
    })
    $tournament.api.leaderboard(router.query.alias).then(res => {
      setLeaderboard(res.data)
    })
  }, [])

  useEffect(() => {
    if (wallet) {
      $tournament.api.walletResult(router.query.alias, wallet).then(res => {
        setWalletresults(res.data)
      })
    }
  }, [wallet])

  return (
      <App.Flex column className={styles.container}>
        <Banner tournament={tournament} />
        <TierBlock tiers={tournament.tiers} walletResults={walletResults} />
        <Leaderboard leaderboard={leaderboard} />
      </App.Flex>
  )
}

export default TournamentPage
