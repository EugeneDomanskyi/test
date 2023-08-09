import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { parseUnits } from 'viem'

import $modal from '@/store/modal'
import useTrade from '@/myhooks/trade'
import { trackEvent } from '@/libs/analytics.lib'

import SellModalSelect from '@/components/Exchange/SellModal/SellModalSelect'
import SellModalConfirm from '@/components/Exchange/SellModal/SellModalConfirm'
import SellModalConfirming from '@/components/Exchange/SellModal/SellModalConfirming'
import SellModalComplete from '@/components/Exchange/SellModal/SellModalComplete'

const SellModal = ({data}) => {
  const dispatch = useDispatch()
  const { placeAsk, sellNft, errorHandler } = useTrade()
  const [selectedTokens, setSelectedTokens] = useState([])
  const [step, setStep] = useState('select')

  const currentCollection = useSelector(({$collection}) => $collection.current)

  const loadingRef = useRef(false)

  const selectedAmount = selectedTokens.reduce((acc, token) => (acc + token.amount), 0)

  const handleSelect = tokens => {
    setSelectedTokens(tokens)
    setStep('confirm')
    dispatch($modal.set.update({header: {
      title: `Sell ${currentCollection.name} for ${data.type === 'place' ? data.blockchain.wrapped.shortName : data.blockchain.currency}`
    }}))
  }

  const handleConfirm = () => {
    loadingRef.current = true
    setStep('confirming')
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Sell ${currentCollection.name} using ${data.type === 'place' ? data.blockchain.wrapped.shortName : data.blockchain.currency}`
      },
    }))
    switch (data.type) {
      case 'place':
        placeOrder()
        break
      case 'fulfill':
        fulfillOrder()
        break
    }
  }

  const fulfillOrder = () => {
    const items = selectedTokens.map(token => ({token: `${data.collectionId}:${token.id}`, quantity: token.amount}))
    sellNft(items, null, progressHandler, onError)
  }

  const placeOrder = () => {
    const listing = selectedTokens.map((token) => ({
      token: `${data.collectionId}:${token.id}`,
      weiPrice: parseUnits(`${data.price}`, 18).toString(),
      quantity: token.amount,
      royaltyBps: 0,
      currency: data.blockchain.wrapped.contract,
    }))
    placeAsk(listing, progressHandler, onError)
    trackEvent('Create Order Submit', {
      'Wallet connect Status': 'Connected',
      'Network': data.blockchain.name,
      'Price': data.price,
      'Quantity': selectedAmount,
      'Total': selectedAmount*data.price,
      'Side': 'Sell',
      'Base Currency': data.blockchain.currency,
      'Quote Currency': currentCollection.name
    })
  }

  const progressHandler = (steps) => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete && loadingRef.current) {
      loadingRef.current = false
      dispatch($modal.set.update({
        header: {
          title: 'Success',
          subtitle: `Sell ${currentCollection.name} using ${data.blockchain.wrapped.shortName}`
        },
      }))
      setStep('complete')
      trackEvent('Create Order Success', {
        'Wallet connect Status': 'Connected',
        'Network': data.blockchain.name,
        'Price': data.price,
        'Quantity': selectedAmount,
        'Total': selectedAmount*data.price,
        'Side': 'Sell',
        'Base Currency': data.blockchain.currency,
        'Quote Currency': currentCollection.name
      })
    }
  }

  const onError = (error) => {
    errorHandler(error)
    dispatch($modal.set.close())
  }

  const handleComplete = () => {
    dispatch($modal.set.close())
  }

  return (() => {
    switch (step) {
      case 'select':
        return (
          <SellModalSelect
            amount={data.amount}
            nfts={data.tokens}
            token={currentCollection}
            onSelect={handleSelect} />
        )
      case 'confirm':
        return (
          <SellModalConfirm
            price={data.price}
            amount={selectedAmount}
            total={selectedAmount*data.price}
            onConfirm={handleConfirm} />
        )
      case 'confirming':
        return (
          <SellModalConfirming />
        )
      case 'complete':
        return (
          <SellModalComplete
            type={data.type}
            currentCollection={currentCollection}
            blockchain={data.blockchain}
            price={data.price}
            amount={selectedAmount}
            total={selectedAmount*data.price}
            onComplete={handleComplete} />
        )
    }
  })()
}

export default SellModal
