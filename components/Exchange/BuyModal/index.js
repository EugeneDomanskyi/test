import { useState, useRef } from 'react'
import { parseUnits } from 'viem'
import { useDispatch } from 'react-redux'

import useTrade from '@/myhooks/trade'
import useOrders from '@/myhooks/useOrders'
import $modal from '@/store/modal'
import { trackEvent } from '@/libs/analytics.lib'
import Order from '@/libs/structs/Order'

import BuyModalConfirm from './BuyModalConfirm'
import BuyModalConfirming from './BuyModalConfirming'
import BuyModalComplete from './BuyModalComplete'

const TradeBuyModal = ({data}) => {
  const dispatch = useDispatch()

  const { current, tokenType } = data

  const { placeBid, buyNft, errorHandler } = useTrade()
  const { updateOrders } = useOrders({tokenAddress: current.address, type: tokenType})

  const [step, setStep] = useState('confirm')

  const loadingRef = useRef(false)

  const handleConfirm = () => {
    loadingRef.current = true
    setStep('confirming')
    switch (data.type) {
      case 'place':
        palceOrder()
        break
      case 'fulfill':
        fulfillOrder()
        break
      default:
        return
    }
  }

  const fulfillOrder = () => {
    buyNft(data.items, null, progressHandler, onError)
  }

  const palceOrder = () => {
    switch (tokenType) {
      case 'nfts':
        Order.NFT.place({
          address: current.address,
          price: data.total*data.amount,
          amount: data.amount,
        }).then(onSuccessPlaced)
        break
      case 'tokens':
        break
    }
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Buy ${current.name} using ${data.blockchain.wrapped.shortName}`
      },
    }))
  }

  const onSuccessPlaced = () => {
    console.log('order placed')
    dispatch($modal.set.update({
      header: {
        title: 'Success',
        subtitle: `Buy ${current.name} using USDT`
      },
    }))
    setStep('complete')
    trackEvent('Create Order Success', {
      'Wallet connect Status': 'Connected',
      'Network': data.blockchain.name,
      'Price': data.price,
      'Quantity': data.amount,
      'Total': data.total*data.amount,
      'Side': 'Buy',
      'Base Currency': data.blockchain.currency,
      'Quote Currency': current.name
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
          subtitle: `Buy ${current.name} using USDT`
        },
      }))
      setStep('complete')
      trackEvent('Create Order Success', {
        'Wallet connect Status': 'Connected',
        'Network': data.blockchain.name,
        'Price': data.price,
        'Quantity': data.amount,
        'Total': data.total*data.amount,
        'Side': 'Buy',
        'Base Currency': data.blockchain.currency,
        'Quote Currency': current.name
      })
    }
  }

  const handleComplete = () => {
    dispatch($modal.set.close())
    updateOrders()
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
            {...data}
            currentCollection={current}
            onComplete={handleComplete} />
        )
    }
  })()
}

export default TradeBuyModal
