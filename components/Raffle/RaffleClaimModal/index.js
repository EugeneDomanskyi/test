import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

import styles from './styles.module.scss'

const RaffleClaimModal = ({item}) => {
  const { propValue } = usePropsHelper()

  return (
    <>
      <App.Flex column gap={32} align="center" className={styles.content}>
        <Raffle.Roulette />
      </App.Flex>
    </>
  )
}

export default RaffleClaimModal