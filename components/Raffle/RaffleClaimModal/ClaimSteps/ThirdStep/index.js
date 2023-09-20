import { useState, useEffect } from 'react'
import lottie from 'lottie-web'
import Image from 'next/image'
import animationData from '@/public/animations/confetti.json'
import styles from './styles.module.scss'

import App from '@/components/App'
import Raffle from '@/components/Raffle'
import ClaimImage from '@/components/Raffle/RaffleClaimModal/ClaimImage'
import ClaimText from '@/components/Raffle/RaffleClaimModal/ClaimText'

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
        // Cleanup animation on unmount (optional)
        anim.destroy()
      }
    }
  }, [showRoulette])

  const handlePrizeDefined = () => {
    // onSubmit()
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
                title=""
                subTitle="Collecting your mystery box to see what reward you win."
              />
            </>
          : <>
              <App.Flex id="lottie-container" sx={{position: 'absolute', inset: -32}} />
              
              <App.Flex sx={{position: 'absolute', top: 32}}>
                <App.ShadowText color="#FFCB04" shadowColor="#FF7708" center size={26} weight={700}>MYSTERY BOX<br/> COLLECTED!</App.ShadowText>
              </App.Flex>

              <App.Flex sx={{paddingTop: 32}}>
                <ClaimImage onlyShadow contentImg={{src: "/images/raffle/box-legendary.png", width: 102, height: 102}} />
                {/* <ClaimImage onlyShadow /> */}
                {/* <Image src="/images/raffle/box-legendary.png" width={110} height={101} className="roulette-pro-regular-prize-item-image" alt='' /> */}
              </App.Flex>

              <App.Flex sx={{marginTop: -64}}>
                <ClaimText
                  title="Reward will be sent to your wallet within a few mins!"
                  subTitle="Incase you get a reward, it will be sent to your wallet.
                  Check your wallet in 5 minutes."
                />
              </App.Flex>
        
              <App.Button primary onClick={handleClickNextStep}>
                Got It
              </App.Button>
            </>
      }
      
    </>
  )
}

export default ThirdStep