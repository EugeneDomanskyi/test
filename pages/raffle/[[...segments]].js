import App from '@/components/App'
import Raffle from '@/components/Raffle'

import styles from './styles.module.scss'

const RafflePage = () => {
  return (
    <App.Flex column className={styles.container}>
      <Raffle.Top />
      {/* <Raffle.Roulette /> */}
      <Raffle.List />
    </App.Flex>
  )
}

export default RafflePage