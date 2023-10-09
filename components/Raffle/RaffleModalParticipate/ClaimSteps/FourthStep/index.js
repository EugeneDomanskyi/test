import { useEffect, useRef, useState } from 'react'
import lottie from 'lottie-web'
import Image from 'next/image'
import animationData from '@/public/animations/confetti_new.json'
import styles from './styles.module.scss'

import App from '@/components/App'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'
import RaffleReward from '@/components/Raffle/RaffleModalParticipate/RaffleReward'

const FourthStep = ({campaign, onSubmit}) => {
  const audioRef = useRef(null)

  const [showConfetti, setShowConfetti] = useState(true)
  const [prize, setPrize] = useState({amount: '', title: ''})

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: document.getElementById('lottie-container'),
      animationData: animationData,
      renderer: 'svg',
      loop: false,
      autoplay: true,
    })

    const currentPrize = campaign.rewardRange.find(item => item.reward === campaign.expectedReward)
    const currentOdds = campaign.odds.find(item => item.range === currentPrize.range*1)
    setPrize({amount: currentPrize.reward / 1000000, title: currentOdds.title})

    anim.onComplete = () => {
      setShowConfetti(false)
    }

    return () => {
      anim.destroy()
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
    }
  }, [audioRef])

  const handleClickNextStep = () => {
    onSubmit()
  }

  console.log('campaign', campaign);

  return (
    <>
      <audio ref={audioRef} src='/audio/roulette_win_original.wav'></audio>

      {
        showConfetti
          ? <App.Flex id="lottie-container" className={styles.confetti} />
          : null
      }

      <App.Flex className={styles.titleBlock}>
        <Image src="/images/raffle/lootbox.png" width={49} height={45} alt="" />
        <App.Text center size={14} weight={400}>Rewards that might be in this case</App.Text>
      </App.Flex>
      
      <App.Flex>
        <App.ShadowText color="#FFCB04" shadowColor="#FF7708" center size={26} weight={700}>YOU HAVE WON!</App.ShadowText>
      </App.Flex>

      <App.Flex sx={{position: 'relative'}}>
        <div className={styles.bgGlow} />
        <RaffleReward title={prize.title} amount={`${prize.amount} USDT`} additionalText="Reward" size="large" />
      </App.Flex>

      <App.Flex>
        <ClaimText
          title="Reward will be sent to your wallet within a few mins!"
          subTitle="Incase you get a reward, it will be sent to your wallet.
          Check your wallet in 5 minutes."
        />
      </App.Flex>

      <App.Button primary sx={{width: 240, height: 56, fontSize: 16}} onClick={handleClickNextStep}>
        Got It
      </App.Button>
    </>
  )
}

export default FourthStep