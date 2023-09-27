import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'

import Contracts from '@/libs/contracts.lib'

import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'
import $raffle from '@/store/raffle'

import App from '@/components/App'
import FirstStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/FirstStep'
import SecondStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/SecondStep'
import ThirdStep from '@/components/Raffle/RaffleClaimModal/ClaimSteps/ThirdStep'

import styles from './styles.module.scss'

const RaffleClaimModal = ({item, onStep}) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { wallet } = useWalletConnect()

  const tokenIds = useSelector(({ $raffle }) => $raffle.tokenIds)
  const showModal = useSelector((state) => state.$modal.show)

  const contract = new Contracts()

  const [step, setStep] = useState(0)

  const contractAddr = '0x9bfdfdac362f810ff15240045e600a7468caf91c' //'0xddbe6cb6c57511e36e3fe6c06a2de92d196cda84'
  const factoryAddr = '0xc8217B265320981C5F0fFD6239D3cE33CBD7abB7' //'0xA4cDD0FEe85c917A68a9432a3ebfF1f66E9f281A'
  
  useEffect(() => {
    if (!showModal) {
      router.push('/raffle', undefined, { scroll: false })
    }
  }, [showModal])

  useEffect(() => {
    (async () => {
      if (wallet) {
        const isApproved = await checkIfApproved()
        setStep(isApproved ? 1 : 0)
        onStep(isApproved ? 1 : 0)
      }
    })()
  }, [wallet])

  const checkIfApproved = async () => {
    const res = await contract.isApprovedForAll(contractAddr, wallet, factoryAddr)
    console.log('res', res);
    return res
  }

  const handleClickNextStep = async () => {
    if (step === 0) {
      const isApproved = await checkIfApproved()
      if (! isApproved) {
        const approveRes = await contract.setApprovalForAll(contractAddr, factoryAddr)
        dispatch($raffle.set.loading(false))
        if (approveRes.error) {
          return
        }
      }
    }
    
    if (step === 1) {
      if (tokenIds.length < item.tKeyRequired) {
        return
      }

      const ids = tokenIds.slice(0, item.tKeyRequired)
      const enterCampaign = await contract.enterCampaign(factoryAddr, item.id, ids)

      dispatch($raffle.set.loading(false))
      if (enterCampaign.error) {
        return
      }
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