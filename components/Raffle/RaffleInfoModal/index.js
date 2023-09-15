import { useSelector } from 'react-redux'
import Image from 'next/image'

import $app from '@/store/app'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

import styles from './styles.module.scss'

const RaffleInfoModal = ({}) => {
  const blockchain = useSelector($app.get.blockchain)

  return (
    <App.Flex column gap={32} align="center" className={styles.content}>
      <Raffle.Roulette />
    </App.Flex>
  )
}

export default RaffleInfoModal