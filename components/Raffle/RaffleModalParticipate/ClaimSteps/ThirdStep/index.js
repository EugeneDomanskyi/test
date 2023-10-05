import { useState, useEffect } from 'react'
import lottie from 'lottie-web'
import Image from 'next/image'
import animationData from '@/public/animations/confetti.json'
import styles from './styles.module.scss'

import App from '@/components/App'
import Raffle from '@/components/Raffle'
import ClaimImage from '@/components/Raffle/RaffleModalParticipate/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleModalParticipate/ClaimText'

const ThirdStep = ({item, onSubmit}) => {
  const [showRoulette, setShowRoulette] = useState(true)

  useEffect(() => {
    if (! showRoulette) {
      const anim = lottie.loadAnimation({
        container: document.getElementById('lottie-container'), // Replace with your container element's ID or reference
        animationData: animationData, // Your JSON animation data
        renderer: 'svg', // Use 'svg' or 'canvas' as per your preference
        loop: false, // Set to true for looping
        autoplay: true, // Set to true to start playing immediately
      })
  
      return () => {
        anim.destroy()
      }
    }
  }, [showRoulette])

  const handlePrizeDefined = () => {
    setShowRoulette(prevState => ! prevState)
  }

  const handleClickNextStep = () => {
    onSubmit()
  }

  return (
    <>
      {
        showRoulette
          ? <>
              <App.Flex sx={{position: 'absolute', top: 64}}>
                <ClaimImage onlyShadow />
              </App.Flex>
              
              <App.Flex className={styles.rouletteWrapper}>
                <Raffle.Roulette autoStart onPrizeDefined={handlePrizeDefined} />
              </App.Flex>
      
              <ClaimText
                title="Fingers crossed, Best of Luck!"
                subTitle="This case can only be opened once"
              />
            </>
          : <>
              <App.Flex id="lottie-container" sx={{position: 'absolute'}} />

              <App.Flex className={styles.titleBlock}>
                <Image src="/images/raffle/lootbox.png" width={49} height={45} alt="" />
                <App.Text center size={14} weight={400}>Rewards that might be in this case</App.Text>
              </App.Flex>
              
              <App.Flex>
                <App.ShadowText color="#FFCB04" shadowColor="#FF7708" center size={26} weight={700}>YOU HAVE WON!</App.ShadowText>
              </App.Flex>

              <App.Flex sx={{marginTop: -32}}>
                <ClaimImage onlyShadow contentImg={{src: "/images/raffle/box-legendary.png", width: 102, height: 102}} />
              </App.Flex>

              <App.Flex sx={{marginTop: -64}}>
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
      }
      
    </>
  )
}

export default ThirdStep