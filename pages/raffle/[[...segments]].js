import { useDispatch, useSelector } from 'react-redux'

import App from '@/components/App'
import Raffle from '@/components/Raffle'

import $modal from '@/store/modal'

import styles from './styles.module.scss'

const RafflePage = () => {
  const dispatch = useDispatch()

  const handleOpenModal = () => {
    dispatch($modal.set.show({modal: 'Raffle/RaffleInfoModal', props: {
      header: {
        title: `Win your prize!`,
      },
    }}))
  }

  return (
    <App.Flex column className={styles.container}>
      <Raffle.Top />
      <App.Button sx={{width: 210}} onClick={handleOpenModal}>
        Open Modal
      </App.Button>
      <Raffle.List />
    </App.Flex>
  )
}

export default RafflePage