import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

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
  const { updateOrders } = useOrders({tokenAddress: current.address, type: tokenType})

  const [step, setStep] = useState('confirm')

  const loadingRef = useRef(false)

  const handleConfirm = () => {
    loadingRef.current = true
    setStep('confirming')
    switch (data.type) {
      case 'place':
        placeOrder()
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
        .then(onSuccess('Taker order'))
        .catch(onError)
        break
      case 'tokens':
        Order.TOKEN.fulfill({
          address: current.address, //current.address,
          amount: data.amount,
          price: data.price,
          side: 'buy',
        })
        .then(onSuccess('Taker order'))
        .catch(onError)
        break
    }

    trackEvent('Confirm Order Submit', {
      'Base Currency': current.symbol,
      'Quote Currency': 'USDT',
      'Side': 'BUY',
      'Quantity': data.amount,
      'Price': data.price,
      'Total': data.total,
      'Network': data.blockchain.code.toUpperCase(),
      'Order Type': 'Taker',
      'Step': '',
    })
  }

  const placeOrder = () => {
    switch (tokenType) {
      case 'nfts':
        Order.NFT.place({
          address: current.address,
          price: data.total,
          amount: data.amount,
          type: 'buy',
        })
        .then(onSuccess('Maker order'))
        .catch(onError)
        break
      case 'tokens':
        Order.TOKEN.place({
          address: current.address,
          price: data.total,
          amount: data.amount,
          type: 'buy',
        })
        .then(onSuccess('Maker order'))
        .catch(onError)
        break
    }
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Buy ${current.name} using ${data.blockchain.wrapped.shortName}`
      },
    }))

    trackEvent('Confirm Order Submit', {
      'Base Currency': current.symbol,
      'Quote Currency': 'USDT',
      'Side': 'BUY',
      'Quantity': data.amount,
      'Price': data.price,
      'Total': data.total,
      'Network': data.blockchain.code.toUpperCase(),
      'Order Type': 'Maker',
      'Step': '',
    })
  }

  const onSuccess = orderType => () => {
    dispatch($modal.set.update({
      header: {
        title: 'Success',
        subtitle: `Buy ${current.name} using USDT`
      },
    }))
    setStep('complete')
    trackEvent('Create Order Success', {
      'Base Currency': current.symbol,
      'Quote Currency': 'USDT',
      'Side': 'BUY',
      'Quantity': data.amount,
      'Price': data.price,
      'Total': data.total,
      'Network': data.blockchain.code.toUpperCase(),
      'Order Type': orderType.replace(' order', ''),
    })
  }

  const onError = (error) => {
    dispatch($modal.set.close())
  }

  const handleComplete = () => {
    dispatch($modal.set.close())
    updateOrders()
  }

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
}

export default TradeBuyModal
