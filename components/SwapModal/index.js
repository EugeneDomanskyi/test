import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWalletClient } from 'wagmi'
import { Magic } from 'magic-sdk'

import { getClient } from '@reservoir0x/reservoir-sdk'

import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import SwapModalInput from '@/components/SwapModal/SwapModalInput'
import BuyModalConfirm from '@/components/BuyModal/BuyModalConfirm'
import BuyModalComplete from '@/components/BuyModal/BuyModalComplete'

const getMagic = (chains) => {
  const [initialChain] = chains.map((chain) => {
    const [rpcUrl] = chain.rpcUrls.public.http
    return {
      rpcUrl: rpcUrl,
      chainId: chain.id,
    }
  })
  return new Magic(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY, {
    network: initialChain
  })
}

const SwapModal = ({ collection, onClose, onStep }) => {
  const { network, getBalance, chains, walletClient } = useWalletConnect()

  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [type, setType] = useState('buy')
  const [step, setStep] = useState(0)

  const chainId = network(collection.chain)?.chainId

  useEffect(() => {
    onStep(step)
  }, [step])

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSwap = async (nfts) => {
    const totalPrice = nfts.reduce((acc, nft) => acc+nft.price, 0)
    const balance = await getBalance()
    if (totalPrice > balance) {
      const magic = getMagic(chains)
      const isMagicConnected = await magic.wallet.getInfo().catch(() => null)
      if (isMagicConnected) {
        await magic.wallet.showUI()
      }
    }

    const items = nfts.map(item => {
      return {
        token: `${collection.ognft}:${item.id}`,
        quantity: 1,
      }
    })

    try {
      getClient()?.actions.buyToken({
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
      })
    } catch (error) {
      console.log('Buy Error', error)
    }
  }

  const handleAmountChange = (val) => {
    setAmount(val)
  }

  const handlePriceChange = (val) => {
    setPrice(val)
  }

  const handleTypeChange = (val) => {
    setType(val)
  }

  const contentComponent = () => {
    switch (step) {
      case 0: return <SwapModalInput collection={collection} amount={amount} price={price} type={type} onAmountChange={handleAmountChange} onPriceChange={handlePriceChange} onTypeChange={handleTypeChange} onSwap={handleSwap} />
      /* case 1: return <BuyModalConfirm token={collection} amount={amount} />
      case 2: return <BuyModalComplete token={collection} amount={amount} onComplete={handleCloseModal} /> */
    }
  }

  return contentComponent()
}

export default SwapModal