import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import { trackEvent } from '@/libs/analytics.lib'

import RedeemModalInput from '@/components/RedeemModal/RedeemModalInput'
import RedeemModalApprove from '@/components/RedeemModal/RedeemModalApprove'
import RedeemModalConfirm from '@/components/RedeemModal/RedeemModalConfirm'
import RedeemModalComplete from '@/components/RedeemModal/RedeemModalComplete'

const RedeemModal = ({ token, onClose, onStep }) => {
  const { network } = useWalletConnect()

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState(0)
  const [hash, setHash] = useState()

  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  useEffect(() => {
    onStep(step)
  }, [step])

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleApprove = async () => {
    setStep(2)

    const txHash = await contracts.withdrawNFTs(amount, token.nft20)
    if (txHash.error) {
      setStep(0)
      toast.error("Redeem NFTs failed", { pauseOnFocusLoss: false })
      return
    }

    setHash(txHash)
    const result = await contracts.waitForTransaction(txHash)
    if (result.error) {
      setStep(0)
      toast.error("Redeem NFTs failed", { pauseOnFocusLoss: false })
      return 
    }

    trackEvent('Redeem Successful', {
      'Token': token.collection,
      'Quantity': amount,
    })

    toast.success("Your Redemption Was Successful!", { pauseOnFocusLoss: false })
    setStep(3)
  }

  const handleRedeem = () => {
    setStep(1)
  }

  const handleBack = () => {
    setStep(0)
  }

  const handleAmountChange = (val) => {
    setAmount(val)
  }

  const contentComponent = () => {
    switch (step) {
      case 0: return <RedeemModalInput token={token} amount={amount} onAmountChange={handleAmountChange} onRedeem={handleRedeem} />
      case 1: return <RedeemModalApprove token={token} amount={amount} onBack={handleBack} onApprove={handleApprove} />
      case 2: return <RedeemModalConfirm token={token} amount={amount} />
      case 3: return <RedeemModalComplete token={token} amount={amount} onComplete={handleCloseModal} />
    }
  }

  return contentComponent()
}

export default RedeemModal