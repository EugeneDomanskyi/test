import { useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'

import { getClient } from '@reservoir0x/reservoir-sdk'

import useWalletConnect from '@/myhooks/wallet-connect'

import SellModalInput from '@/components/SellModal/SellModalInput'
import SellModalConfirm from '@/components/SellModal/SellModalConfirm'
import SellModalComplete from '@/components/SellModal/SellModalComplete'

const SellModal = ({ token, onClose, onStep }) => {
  const { data: walletClient } = useWalletClient()
  const { network } = useWalletConnect()

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState(0)

  const chainId = network(token.chain)?.chainId

  useEffect(() => {
    onStep(step)
  }, [step])

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSell = async (nfts) => {
    const items = nfts.map(item => {
      return {
        token: `${token.ognft}:${item.id}`,
        quantity: 1,
      }
    })

    try {
      getClient()?.actions.acceptOffer({
        items,
        chainId,
        wallet: walletClient,
        onProgress: (steps) => {
          const transaction = steps.find(item => item.kind == 'transaction')
          if (transaction && transaction.hasOwnProperty('items')) {
            if (transaction.items[0] && transaction.items[0].hasOwnProperty('status')) {
              if (transaction.items[0].status == 'incomplete') {
                setStep(1)
                console.log('Incomplete txHash', transaction.items[0]?.txHash)
              } else {
                setStep(2)
                console.log('Complete txHash', transaction.items[0]?.txHash)
              }
            }
          }
        }
      }).then(response => {
        console.log('acceptOffer response', response)
      }).catch(error => {
        if (error?.response && error?.response?.data && error?.response?.data?.message) {
          alert(error?.response?.data?.message)
        }
      })
    } catch (error) {
      console.log('Sell Error', error)
    }
  }

  const handleAmountChange = (val) => {
    setAmount(val)
  }

  const contentComponent = () => {
    switch (step) {
      case 0: return <SellModalInput token={token} amount={amount} onAmountChange={handleAmountChange} onSell={handleSell} />
      case 1: return <SellModalConfirm token={token} amount={amount} />
      case 2: return <SellModalComplete token={token} amount={amount} onComplete={handleCloseModal} />
    }
  }

  return contentComponent()
}

export default SellModal