import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

import useTrade from '@/myhooks/trade'
import useOrders from '@/myhooks/useOrders'
import useWalletConnect from '@/myhooks/wallet-connect'
import $modal from '@/store/modal'
import { trackEvent } from '@/libs/analytics.lib'
import Order from '@/libs/structs/Order'

import BuyModalConfirm from './BuyModalConfirm'
import BuyModalConfirming from './BuyModalConfirming'
import BuyModalComplete from './BuyModalComplete'

const TradeBuyModal = ({data}) => {
  const dispatch = useDispatch()

  const { current, tokenType } = data

  const { errorHandler } = useTrade()
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
    switch (tokenType) {
      case 'nfts':
        Order.NFT.fulfill({
          side: 'buy',
          amount: data.amount,
          address: current.address,
        })
        .then(onSuccessPlaced)
        .catch(onError)
        break
      case 'tokens':
        Order.TOKEN.fulfill({
          address: current.address, //current.address,
          amount: data.amount,
          price: data.price,
          side: 'buy',
        })
        .then(onSuccessPlaced)
        .catch(onError)
        break
    }
  }

  const palceOrder = () => {
    switch (tokenType) {
      case 'nfts':
        console.log('data', data)
        Order.NFT.place({
          address: current.address,
          price: data.total,
          amount: data.amount,
          type: 'buy',
        }).then(onSuccessPlaced).catch(onFailurePlaced)
        break
      case 'tokens':
        Order.TOKEN.place({
          address: current.address,
          price: data.total,
          amount: data.amount,
          type: 'buy',
        }).then(onSuccessPlaced).catch(onFailurePlaced)
        break
    }
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Buy ${current.name} using ${data.blockchain.wrapped.shortName}`
      },
    }))
  }

  const onFailurePlaced = (error) => {
    console.log('onFailurePlaced', error)
    dispatch($modal.set.close())
  }

  const onSuccessPlaced = (res) => {
    console.log(res)
    dispatch($modal.set.update({
      header: {
        title: 'Success',
        subtitle: `Buy ${current.name} using USDT`
      },
    }))
    setStep('complete')
    trackEvent('Create Order Success', {
      'Wallet connect Status': 'Connected',
      'Wallet Address': wallet || null,
      'Order type': 'Limit order',
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

  const progressHandler = (orderType) => steps => {
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
        'Wallet Address': wallet || null,
        'Order type': orderType,
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
