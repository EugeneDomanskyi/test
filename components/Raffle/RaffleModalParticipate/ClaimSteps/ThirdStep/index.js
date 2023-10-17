import styles from './styles.module.scss'

import App from '@/components/App'
import Raffle from '@/components/Raffle'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

const ThirdStep = ({campaign, onSubmit}) => {
  const handlePrizeDefined = () => {
    setTimeout(() => {
      onSubmit()
    }, 1000)
  }

  return (
    <>
      <div className={styles.transparentCircle} />
      <App.Flex sx={{position: 'absolute', top: 64}}>
        <ClaimImage onlyShadow />
      </App.Flex>
      
      <App.Flex className={styles.rouletteWrapper}>
        <Raffle.Roulette autoStart onPrizeDefined={handlePrizeDefined} campaign={campaign} />
      </App.Flex>

      <App.Flex sx={{zIndex: 4}}>
        <ClaimText
          title="Fingers crossed, Best of Luck!"
          subTitle="This case can only be opened once"
        />
      </App.Flex>
    </>
  )
}

export default ThirdStep