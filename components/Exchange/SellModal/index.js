import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { parseUnits } from 'viem'

import $modal from '@/store/modal'
import useTrade from '@/myhooks/trade'
import useOrders from '@/myhooks/useOrders'
import { trackEvent } from '@/libs/analytics.lib'
import Order from '@/libs/structs/Order'

import SellModalSelect from '@/components/Exchange/SellModal/SellModalSelect'
import SellModalConfirm from '@/components/Exchange/SellModal/SellModalConfirm'
import SellModalConfirming from '@/components/Exchange/SellModal/SellModalConfirming'
import SellModalComplete from '@/components/Exchange/SellModal/SellModalComplete'

const SellModal = ({data}) => {

  const { tokenType, current } = data

  const dispatch = useDispatch()
  const { placeAsk, sellNft, errorHandler } = useTrade()
  const [selectedTokens, setSelectedTokens] = useState([])

  const [step, setStep] = useState(tokenType === 'nfts' ? 'select' : 'confirm')
  
  const { updateOrders } = useOrders({tokenAddress: current.address, type: tokenType})

  const loadingRef = useRef(false)

  const selectedAmount = selectedTokens.reduce((acc, token) => (acc + token.amount), 0)

  let amount = tokenType === 'nfts' ? selectedAmount : data.amount

  const handleSelect = tokens => {
    setSelectedTokens(tokens)
    setStep('confirm')
    dispatch($modal.set.update({header: {
      title: `Sell ${current.name} for ${data.type === 'place' ? data.blockchain.wrapped.shortName : data.blockchain.currency}`
    }}))
  }

  const handleConfirm = () => {
    loadingRef.current = true
    setStep('confirming')
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Sell ${current.name} using ${data.type === 'place' ? data.blockchain.wrapped.shortName : data.blockchain.currency}`
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
    const items = selectedTokens.map(token => ({token: `${current.address}:${token.id}`, quantity: token.amount}))
    sellNft(items, null, progressHandler, onError)
  }

  const placeOrder = () => {
    switch (tokenType) {
      case 'nfts':
        Order.NFT.place({
          type: 'sell',
          address: current.address,
          price: data.price,
          nfts: selectedTokens,
        }).then(onSuccessPlaced)
        break
      case 'tokens':
        Order.TOKEN.place({
          type: 'sell',
          address: current.address,
          price: data.price,
          amount: data.amount,
        }).then(onSuccessPlaced)
        break
    }

    trackEvent('Create Order Submit', {
      'Wallet connect Status': 'Connected',
      'Network': data.blockchain.name,
      'Price': data.price,
      'Quantity': selectedAmount,
      'Total': selectedAmount*data.price,
      'Side': 'Sell',
      'Base Currency': data.blockchain.currency,
      'Quote Currency': current.name
    })
  }

  const onSuccessPlaced = (res) => {
    console.log('onSuccessPlaced', res)
    dispatch($modal.set.update({
      header: {
        title: 'Success',
        subtitle: `Sell ${current.name} using ${data.blockchain.wrapped.shortName}`
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
      'Quote Currency': current.name
    })
  }

  const progressHandler = (steps) => {
    const isAllStepsComplete = steps.flatMap(step => step.items).every(step => step.status === 'complete')
    if (isAllStepsComplete && loadingRef.current) {
      loadingRef.current = false
      dispatch($modal.set.update({
        header: {
          title: 'Success',
          subtitle: `Sell ${current.name} using ${data.blockchain.wrapped.shortName}`
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
        'Quote Currency': current.name
      })
    }
  }

  const onError = (error) => {
    errorHandler(error)
    dispatch($modal.set.close())
  }

  const handleComplete = () => {
    dispatch($modal.set.close())
    updateOrders()
  }

  return (() => {
    switch (step) {
      case 'select':
        return (
          <SellModalSelect
            amount={data.amount}
            nfts={data.tokens}
            token={current}
            onSelect={handleSelect} />
        )
      case 'confirm':
        return (
          <SellModalConfirm
            price={data.price}
            amount={amount}
            total={amount*data.price}
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
            currentCollection={current}
            blockchain={data.blockchain}
            price={data.price}
            amount={amount}
            total={amount*data.price}
            onComplete={handleComplete} />
        )
    }
  })()
}

export default SellModal
