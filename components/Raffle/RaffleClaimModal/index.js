import { useState, useEffect } from 'react'

import Contracts from '@/libs/contracts.lib'

import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import App from '@/components/App'
import FirstStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/FirstStep'
import SecondStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/SecondStep'
import ThirdStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/ThirdStep'

import styles from './styles.module.scss'
import { useDispatch } from 'react-redux'

const RaffleClaimModal = ({item, onStep}) => {
  const dispatch = useDispatch()
  const { wallet } = useWalletConnect()

  const contract = new Contracts()

  const [step, setStep] = useState(0)

  const contractAddr = '0xddbe6cb6c57511e36e3fe6c06a2de92d196cda84'
  const factoryAddr = '0xA4cDD0FEe85c917A68a9432a3ebfF1f66E9f281A'

  useEffect(() => {
    const isApproved = checkIfApproved()
    setStep(isApproved ? 1 : 0)
    onStep(isApproved ? 1 : 0)
  }, [])

  const checkIfApproved = async () => {
    return await contract.isApprovedForAll(contractAddr, wallet, factoryAddr)
  }

  const handleClickNextStep = async () => {
    if (step === 0) {
      const isApproved = checkIfApproved()
      if (! isApproved) {
        const approve = await contract.setApprovalForAll(contractAddr, factoryAddr)
        console.log('approve', approve);
      }
    }
    
    if (step === 1) {
      const enterCampaign = await contract.enterCampaign(factoryAddr, item.id)
      if (enterCampaign.error) {
        return
      }
      console.log('enterCampaign', enterCampaign);
      
    }

    if (step === 2) {
      dispatch($modal.set.close())
      return
    }
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