import { useState, useRef } from 'react'
import { parseUnits } from 'viem'
import { useDispatch, useSelector } from 'react-redux'

import useTrade from '@/myhooks/trade'
import $modal from '@/store/modal'
import { trackEvent } from '@/libs/analytics.lib'

import BuyModalConfirm from './BuyModalConfirm'
import BuyModalConfirming from './BuyModalConfirming'
import BuyModalComplete from './BuyModalComplete'

const TradeBuyModal = ({data}) => {
  const dispatch = useDispatch()

  const currentCollection = useSelector(({$collection}) => $collection.current)

  const { placeBid, errorHandler } = useTrade()
  const [step, setStep] = useState('confirm')

  const loadingRef = useRef(false)

  const handleConfirm = () => {
    const bids = [{  
      weiPrice: parseUnits(`${data.total*data.amount}`, 18).toString(),
      collection: data.collectionId,
      quantity: data.amount,
      royaltyBps: 0,
      // currency: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      // orderbookApiKey: '895d629046a0458199e9e8639b63bb57',
      // orderbook: 'opensea',
    }]
    loadingRef.current = true
    setStep('confirming')
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Buy ${currentCollection.name} using ${data.blockchain.currency}`
      },
    }))
    placeBid(bids, progressHandler, onError)
    trackEvent('Dex Create Order Submit', {
      'Wallet connect Status': 'Connected',
      'Network': data.blockchain.name,
      'Price': data.price,
      'Quantity': data.amount,
      'Total': data.total*data.amount,
      'Side': 'Buy',
      'Base Currency': data.blockchain.currency,
      'Quote Currency': currentCollection.name
    })
  }

  const onError = (error) => {
    errorHandler(error)
    dispatch($modal.set.close())
  }

  const progressHandler = steps => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete && loadingRef.current) {
      loadingRef.current = false
      dispatch($modal.set.update({
        header: {
          title: 'Success',
          subtitle: `Buy ${currentCollection.name} using USDT`
        },
      }))
      setStep('complete')
      trackEvent('Dex Create Order Success', {
        'Wallet connect Status': 'Connected',
        'Network': data.blockchain.name,
        'Price': data.price,
        'Quantity': data.amount,
        'Total': data.total*data.amount,
        'Side': 'Buy',
        'Base Currency': data.blockchain.currency,
        'Quote Currency': currentCollection.name
      })
    }
  }

  const handleComplete = () => {
    dispatch($modal.set.close())
  }

  return (() => {
    switch (step) {
      case 'confirm':
        return (
          <BuyModalConfirm
            {...data}
            onConfirm={handleConfirm} />
        )
      case 'confirming':
        return (
          <BuyModalConfirming />
        )
      case 'complete':
        return (
          <BuyModalComplete
            currentCollection={currentCollection}
            amount={data.amount}
            onComplete={handleComplete} />
        )
    }
  })()
}

export default TradeBuyModal
