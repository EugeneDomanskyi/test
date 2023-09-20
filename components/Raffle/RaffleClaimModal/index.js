import { useState, useEffect } from 'react'

import App from '@/components/App'
import FirstStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/FirstStep'
import SecondStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/SecondStep'
import ThirdStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/ThirdStep'

import styles from './styles.module.scss'

const RaffleClaimModal = ({item, onStep}) => {
  const [step, setStep] = useState(0)

  const handleClickNextStep = () => {
    setStep(step >= 2 ? 0 : step+1)
    onStep(step >= 2 ? 0 : step+1)
  }

  return (
    <>
      <App.Flex column gap={32} align="center" className={styles.content} sx={{padding: step === 2 ? 0 : 32}}>
        {
          (currentStep => {
            switch (currentStep) {
              case 0:
                return (
                  <FirstStep item={item} onSubmit={handleClickNextStep} />
                )
              case 1:
                return (
                  <SecondStep item={item} onSubmit={handleClickNextStep} />
                )
              default:
                return <ThirdStep item={item} onSubmit={handleClickNextStep} />
            }
          })(step)
        }
      </App.Flex>
    </>
  )
}

export default RaffleClaimModal