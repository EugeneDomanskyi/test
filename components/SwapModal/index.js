import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Magic } from 'magic-sdk'

import useTrade from '@/myhooks/trade'

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
  const { buyNft, sellNft } = useTrade()

  const [currentCollection, setCurrentCollection] = useState(collection)
  const [currentCurrency, setCurrentCurrency] = useState('native')
  const [type, setType] = useState('buy')
  const [step, setStep] = useState(0)

  useEffect(() => {
    onStep(step)
  }, [step])

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSwap = (nfts) => {
    if (type == 'buy') {
      const items = nfts.map(item => {
        return {
          token: `${collection.address}:${item.id}`,
          quantity: 1,
        }
      })

      buyNft(items, currentCurrency, onBuyProgress, onBuyError)
    } else {
      const items = nfts.map(item => {
        return {
          token: `${collection.address}:${item.id}`,
          quantity: 1,
        }
      })

      sellNft(items, currentCurrency, onSellProgress, onSellError)
    }
  }

  const onBuyProgress = (steps) => {
    const transaction = steps.find(item => item.kind == 'transaction')
    if (transaction && transaction.hasOwnProperty('items')) {
      if (transaction.items[0] && transaction.items[0].hasOwnProperty('status')) {
        if (transaction.items[0].status == 'incomplete') {
          setStep(1)
          console.log('Incomplete txHash', transaction.items[0]?.txHash)
        } else {
          setStep(2)
          console.log('Complete txHash', transaction.items[0]?.txHash)
          console.log(transaction.items)
          toast.success('Swap was successful', { pauseOnFocusLoss: false })
          setStep(0)
        }
      }
    }
  }

  const onBuyError = (error) => {
    if (error && error?.response) {
      const message = error.response?.data?.message
      toast.error(message, { pauseOnFocusLoss: false })
    } else {
      console.log('Swap Buy Error', error)
    }
    setStep(0)
  }

  const onSellProgress = (steps) => {
    const transaction = steps.find(item => item.kind == 'transaction')
    if (transaction && transaction.hasOwnProperty('items')) {
      if (transaction.items[0] && transaction.items[0].hasOwnProperty('status')) {
        if (transaction.items[0].status == 'incomplete') {
          setStep(1)
          console.log('Incomplete txHash', transaction.items[0]?.txHash)
        } else {
          setStep(2)
          console.log('Complete txHash', transaction.items[0]?.txHash)

          toast.success('Swap was successful', { pauseOnFocusLoss: false })
          setStep(0)
        }
      }
    }
  }

  const onSellError = (error) => {
    if (error && error?.response) {
      const message = error.response?.data?.message
      toast.error(message, { pauseOnFocusLoss: false })
    } else {
      console.log('Swap Sell Error', error)
    }
    setStep(0)
  }

  const handleCollectionChange = (val) => {
    setCurrentCollection(val)
  }

  const handleCurrencyChange = (val) => {
    setCurrentCurrency(val)
  }

  const handleTypeChange = (val) => {
    setType(val)
  }

  const contentComponent = () => {
    switch (step) {
      case 0: return <SwapModalInput collection={currentCollection} currency={currentCurrency} type={type} onCollectionChange={handleCollectionChange} onCurrencyChange={handleCurrencyChange} onTypeChange={handleTypeChange} onSwap={handleSwap} />
      /* case 1: return <BuyModalConfirm token={collection} amount={amount} />
      case 2: return <BuyModalComplete token={collection} amount={amount} onComplete={handleCloseModal} /> */
    }
  }

  return contentComponent()
}

export default SwapModal