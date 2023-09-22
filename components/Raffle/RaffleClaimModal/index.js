import { useState, useEffect } from 'react'

import Contracts from '@/libs/contracts.lib'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'
import FirstStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/FirstStep'
import SecondStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/SecondStep'
import ThirdStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/ThirdStep'

import styles from './styles.module.scss'

const RaffleClaimModal = ({item, onStep}) => {
  const { wallet } = useWalletConnect()

  const contract = new Contracts()

  console.log('wallet', wallet);

  const [step, setStep] = useState(0)

  const handleClickNextStep = async () => {
    const contractAddr = '0xddbe6cb6c57511e36e3fe6c06a2de92d196cda84'
    const owner = wallet
    const operator = '0xA4cDD0FEe85c917A68a9432a3ebfF1f66E9f281A'

    if (step === 0) {
      const isApproved = await contract.isApprovedForAll(contractAddr, owner, operator)
      console.log('isApproved', isApproved);
      // const approve = await contract.setApprovalForAll(contractAddr, operator)
      // console.log('approve', approve);
      
    }
    
    if (step === 1) {
      const enterCampaign = await contract.enterCampaign(contractAddr, item.id)
      // const approve = await contract.setApprovalForAll(contractAddr, operator)
      // console.log('approve', approve);
      console.log('enterCampaign', enterCampaign);
      
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