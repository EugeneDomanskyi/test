import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Magic } from 'magic-sdk'
import { getClient } from '@reservoir0x/reservoir-sdk'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'

import SwapModalInput from '@/components/SwapModal/SwapModalInput'
import BuyModalConfirm from '@/components/BuyModal/BuyModalConfirm'
import BuyModalComplete from '@/components/BuyModal/BuyModalComplete'

const getMagic = (chains) => {
  const [initialChain] = chains.map((chain) => {
    const [rpcUrl] = chain.rpcUrls.public.http
    return {
      rpcUrl: rpcUrl,
      chainId: chain.id,
    }
  })

  return new Magic(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY, {
    network: initialChain
  })
}

const SwapModal = ({ collection, onClose, onStep }) => {
  const { network, usdt, walletClient } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchain)

  const [currentCollection, setCurrentCollection] = useState(collection)
  const [currentCurrency, setCurrentCurrency] = useState('native')
  const [type, setType] = useState('buy')
  const [step, setStep] = useState(0)

  const chainId = network(collection.chain)?.chainId

  useEffect(() => {
    onStep(step)
  }, [step])

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSwap = async (nfts) => {
    /* const totalPrice = nfts.reduce((acc, nft) => acc+nft.price, 0)
    const balance = await getBalance()
    if (totalPrice > balance) {
      const magic = getMagic(chains)
      const isMagicConnected = await magic.wallet.getInfo().catch(() => null)
      if (isMagicConnected) {
        await magic.wallet.showUI()
      }
    } */

    const options = {}
    if (currentCurrency == 'usdt') {
      options.currency = usdt[blockchain.code]
    }

    const items = nfts.map(item => {
      return {
        token: `${collection.address}:${item.id}`,
        quantity: 1,
      }
    })

    try {
      getClient()?.actions.buyToken({
        items,
        chainId,
        wallet: walletClient,
        options,
        onProgress: (steps) => {
          const transaction = steps.find(item => item.kind == 'transaction')
          if (transaction && transaction.hasOwnProperty('items')) {
            if (transaction.items[0] && transaction.items[0].hasOwnProperty('status')) {
              if (transaction.items[0].status == 'incomplete') {
                setStep(1)
                console.log('Incomplete txHash', transaction.items[0]?.txHash)
              } else {
                setStep(2)
                console.log('Complete txHash', transaction.items[0]?.txHash)
              }
            }
          }
        }
      })
    } catch (error) {
      console.log('Buy Error', error)
    }
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
      case 0: return <SwapModalInput collection={currentCollection} currency={currentCurrency} type={type} onCollectionChange={handleCollectionChange} onCurrencyChange={handleCurrencyChange} onTypeChange={handleTypeChange} onSwap={handleSwap} />
      /* case 1: return <BuyModalConfirm token={collection} amount={amount} />
      case 2: return <BuyModalComplete token={collection} amount={amount} onComplete={handleCloseModal} /> */
    }
  }

  return contentComponent()
}

export default SwapModal