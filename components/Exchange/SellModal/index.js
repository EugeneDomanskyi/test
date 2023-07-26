import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { parseUnits } from 'viem'

import $collection from '@/store/collection'
import $modal from '@/store/modal'
import useTrade from '@/myhooks/trade'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import SellModalSelect from '@/components/Exchange/SellModal/SellModalSelect'
import SellModalConfirm from '@/components/Exchange/SellModal/SellModalConfirm'
import SellModalConfirming from '@/components/Exchange/SellModal/SellModalConfirming'
import SellModalComplete from '@/components/Exchange/SellModal/SellModalComplete'

const generateNft = (mod) => (el, i) => {
  return {
    ...el,
    token: {
      ...el.token,
      tokenId: `${el.token.tokenId*1 + (i+1)*mod}`
    }
  }
}

const SellModal = ({data}) => {
  const dispatch = useDispatch()
  const { placeAsk, errorHandler } = useTrade()
  const [selectedTokens, setSelectedTokens] = useState([])
  const [step, setStep] = useState('select')

  const currentCollection = useSelector($collection.get.collection('address', data.collectionId))

  const loadingRef = useRef(false)

  const selectedAmount = selectedTokens.reduce((acc, token) => (acc + token.amount), 0)

  // const tokens = [...data.tokens, ...data.tokens.map(generateNft(100)), ...data.tokens.map(generateNft(200)), ...data.tokens.map(generateNft(300))]

  const handleSelect = tokens => {
    setSelectedTokens(tokens)
    setStep('confirm')
    dispatch($modal.set.update({header: {
      title: `Buy ${currentCollection.name} for ${data.blockchain.currency}`
    }}))
  }

  const handleConfirm = () => {
    const listing = selectedTokens.map((token) => ({
      token: `${data.collectionId}:${token.id}`,
      weiPrice: parseUnits(`${data.price}`, 18).toString(),
      orderKind: 'seaport-v1.5',
      options: {
        'seaport-v1.5': {
          "useOffChainCancellation": true
        },
      },
      quantity: token.amount,
    }))
    loadingRef.current = true
    setStep('confirming')
    dispatch($modal.set.update({
      header: {
        title: 'Approve Transfer',
        subtitle: `Sell ${currentCollection.name} using ${data.blockchain.currency}`
      },
    }))
    placeAsk(listing, progressHandler, onError)
    trackEvent('Dex Create Order Submit', {
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
          subtitle: `Sell ${currentCollection.name} using ${data.blockchain.currency}`
        },
      }))
      setStep('complete')
      trackEvent('Dex Create Order Success', {
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
          currentCollection={currentCollection}
          amount={selectedAmount}
          onComplete={handleComplete} />
        )
    }
  })()
}

export default SellModal
