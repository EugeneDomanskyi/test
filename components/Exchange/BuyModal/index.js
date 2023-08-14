import { useState, useRef } from 'react'
import { parseUnits } from 'viem'
import { useDispatch, useSelector } from 'react-redux'

import useTrade from '@/myhooks/trade'
import useOrders from '@/myhooks/useOrders'
import useWalletConnect from '@/myhooks/wallet-connect'
import $modal from '@/store/modal'
import { trackEvent } from '@/libs/analytics.lib'

import BuyModalConfirm from './BuyModalConfirm'
import BuyModalConfirming from './BuyModalConfirming'
import BuyModalComplete from './BuyModalComplete'

const TradeBuyModal = ({data}) => {
  const dispatch = useDispatch()

  const currentCollection = useSelector(({$collection}) => $collection.current)

  const { placeBid, buyNft, errorHandler } = useTrade()
  const { updateOrders } = useOrders({collectionId: currentCollection.address})
  const { wallet } = useWalletConnect()

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
    buyNft(data.items, null, progressHandler('Market order'), onError)
    trackEvent('Create Order Submit', {
      'Wallet connect Status': 'Connected',
      'Wallet Address': wallet || null,
      'Order type': 'Market order',
      'Network': data.blockchain.name,
      'Price': data.price,
      'Quantity': data.amount,
      'Total': data.total*data.amount,
      'Side': 'Buy',
      'Base Currency': data.blockchain.currency,
      'Quote Currency': currentCollection.name
    })
  }

  const palceOrder = () => {
    const bids = [{  
      weiPrice: parseUnits(`${data.total*data.amount}`, 18).toString(),
      collection: data.collectionId,
      quantity: data.amount,
      royaltyBps: 0,
      currency: data.blockchain.wrapped.contract,
      // currency: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      // orderbookApiKey: '895d629046a0458199e9e8639b63bb57',
      // orderbook: 'opensea',
    }]
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Buy ${currentCollection.name} using ${data.blockchain.wrapped.shortName}`
      },
    }))
    placeBid(bids, progressHandler('Limit order'), onError)
    trackEvent('Create Order Submit', {
      'Wallet connect Status': 'Connected',
      'Wallet Address': wallet || null,
      'Order type': 'Limit order',
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

  const progressHandler = (orderType) => steps => {
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
      trackEvent('Create Order Success', {
        'Wallet connect Status': 'Connected',
        'Wallet Address': wallet || null,
        'Order type': orderType,
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
            currentCollection={currentCollection}
            onComplete={handleComplete} />
        )
    }
  })()
}

export default TradeBuyModal
