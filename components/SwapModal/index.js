import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

import { trackEvent } from '@/libs/analytics.lib'
import useTrade from '@/myhooks/trade'

import $app from '@/store/app'

import SwapModalInput from '@/components/SwapModal/SwapModalInput'
import SwapModalAccept from '@/components/SwapModal/SwapModalAccept'
import SwapModalConfirm from '@/components/SwapModal/SwapModalConfirm'
import SwapModalComplete from '@/components/SwapModal/SwapModalComplete'

const SwapModal = ({ collection, onClose, onStep }) => {
  const { buyNft, sellNft } = useTrade()

  const blockchain = useSelector($app.get.blockchain)

  const [currentCollection, setCurrentCollection] = useState(collection)
  const [currentCurrency, setCurrentCurrency] = useState('native')
  const [type, setType] = useState('buy')
  const [step, setStep] = useState(0)
  const [nfts, setNfts] = useState([])
  const [form, setForm] = useState({price: 0, amount: 0, usdPrice: 0})

  const nftsRef = useRef([])
  const completeRef = useRef(false)

  useEffect(() => {
    onStep(step)
  }, [step])

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleContinue = (price, amount, usdPrice, nfts) => {
    setForm({price, amount, usdPrice})
    nftsRef.current = nfts
    setStep(1)
  }

  const handleSwap = () => {
    trackEvent('Swap Confirmation', {
      'Token': collection.name,
      'Network': blockchain.code.toUpperCase(),
      'Quantity': nftsRef.current.length,
    })

    setNfts(nftsRef.current)

    const items = nftsRef.current.map(item => {
      return {
        token: `${collection.address}:${item.id}`,
        quantity: 1,
      }
    })

    completeRef.current = false

    if (type == 'buy') {
      buyNft(items, currentCurrency, onBuyProgress(nftsRef.current), onBuyError)
    } else {
      sellNft(items, currentCurrency, onSellProgress(nftsRef.current), onSellError)
    }
  }

  const onBuyProgress = (nfts) => (steps) => {
    const transaction = steps.find(item => item.kind == 'transaction' && item.items.length)
    if (transaction.items[0] && transaction.items[0].hasOwnProperty('status')) {
      if (transaction.items[0].status == 'incomplete') {
        setStep(2)
        console.log('Incomplete txHash', transaction.items[0]?.txHash)
      } else {
        if ( ! completeRef.current) {
          completeRef.current = true
          
          setStep(3)
          console.log('Complete txHash', transaction.items[0]?.txHash)

          trackEvent('Swap Successful', {
            'Token': collection.name,
            'Network': blockchain.code.toUpperCase(),
            'Quantity': nfts.length,
            'At Price': 0,
          })
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

  const onSellProgress = (nfts) => (steps) => {
    const transaction = steps.find(item => item.kind == 'transaction' && item.items.length)
    if (transaction.items[0] && transaction.items[0].hasOwnProperty('status')) {
      if (transaction.items[0].status == 'incomplete') {
        setStep(2)
        console.log('Incomplete txHash', transaction.items[0]?.txHash)
      } else {
        setStep(3)
        console.log('Complete txHash', transaction.items[0]?.txHash)

        trackEvent('Swap Successful', {
          'Token': collection.name,
          'Network': blockchain.code.toUpperCase(),
          'Quantity': nfts.length,
          'At Price': 0,
        })
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
      case 0: return <SwapModalInput collection={currentCollection} currency={currentCurrency} type={type} onCollectionChange={handleCollectionChange} onCurrencyChange={handleCurrencyChange} onTypeChange={handleTypeChange} onSwap={handleContinue} />
      case 1: return <SwapModalAccept form={form} currency={currentCurrency} collection={currentCollection} type={type} onSwap={handleSwap} onBack={() => setStep(0)} />
      case 2: return <SwapModalConfirm collection={currentCollection} currency={currentCurrency} type={type} nfts={nfts} />
      case 3: return <SwapModalComplete collection={currentCollection} currency={currentCurrency} type={type} nfts={nfts} onComplete={handleCloseModal} />
    }
  }

  return contentComponent()
}

export default SwapModal