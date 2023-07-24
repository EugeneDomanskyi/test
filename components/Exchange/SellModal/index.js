import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { parseUnits } from 'viem'

import $collection from '@/store/collection'
import $modal from '@/store/modal'
import useTrade from '@/myhooks/trade'

import App from '@/components/App'
import SellModalSelect from '@/components/Exchange/SellModal/SellModalSelect'
import SellModalConfirm from '@/components/Exchange/SellModal/SellModalConfirm'

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

  console.log(data)

  const currentCollection = useSelector($collection.get.collection('address', data.collectionId))

  const loadingRef = useRef(false)

  const selectedAmount = selectedTokens.reduce((acc, token) => (acc + token.amount), 0)

  const tokens = [...data.tokens, ...data.tokens.map(generateNft(100)), ...data.tokens.map(generateNft(200)), ...data.tokens.map(generateNft(300))]

  const handleSelect = tokens => {
    setSelectedTokens(tokens)
    setStep('confirm')
    dispatch($modal.set.update({header: {
      title: `Buy ${currentCollection.name} for ${data.blockchain.currency}`
    }}))
    // const listing = selectedNfts.map((token) => ({
    //   token: `${data.collectionId}:${token.id}`,
    //   weiPrice: parseUnits(`${data.form.price}`, 18).toString(),
    //   orderKind: 'seaport-v1.5',
    //   options: {
    //     'seaport-v1.5': {
    //       "useOffChainCancellation": true
    //     },
    //   },
    //   quantity: 1,
    // }))
    // placeAsk(listing, progressHandler, onError)
  }

  const progressHandler = (steps) => {

  }

  const onError = (error) => {
    errorHandler(error)
    dispatch($modal.set.close())
  }

  return (() => {
    switch (step) {
      case 'select':
        return (
          <SellModalSelect
            nfts={tokens}
            token={currentCollection}
            onSelect={handleSelect} />
        )
      case 'confirm':
        return (
          <SellModalConfirm
            price={data.price}
            amount={selectedAmount}
            total={selectedAmount*data.price} />
        )
    }
  })()
}

export default SellModal
