import {useEffect, useState} from "react"
import {useRouter} from "next/router"

import App from '@/components/App'
import TierBlock from "@/components/Tournamnet/TierBlock";
import Banner from '@/components/Tournamnet/Banner'


import $tournament from  "@/store/tournament"
import styles from "./styles.module.scss";
import useWalletConnect from "@/myhooks/wallet-connect";
import Leaderboard from "@/components/Tournamnet/Leaderboard";
import Header from '@/components/Tournamnet/Header'
import HowWorks from "@/components/Tournamnet/HowWorks";

const TournamentPage = () => {
  const router = useRouter()
  const { wallet } = useWalletConnect()

  const [tournament, setTournament] = useState({tiers: []})
  const [walletResults, setWalletResults] = useState({position: 0, points: 0, volume: 0, address: ''})
  const [leaderboard, setLeaderboard] = useState([])
  const [openModal, setOpenModal] = useState(false)

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
        setWalletResults(res.data)
      })
    } else {
      setWalletResults({position: 0, points: 0, volume: 0, address: ''})
    }
  }, [wallet])

  return (
      <App.Flex column className={styles.container}>
        <Header />
        <Banner tournament={tournament} />
        <TierBlock
          tiers={tournament.tiers}
          walletResults={walletResults}
          onClickWorks={() => setOpenModal(true)} />
        <Leaderboard leaderboard={leaderboard} onClickWorks={() => setOpenModal(true)} />
        <App.Dialog hideClose hideHeader width={1000} open={openModal} onClose={() => setOpenModal(false)}>
          <HowWorks tournament={tournament} />
        </App.Dialog>
      </App.Flex>
  )
}

export default TournamentPage
