import styles from './styles.module.scss'
import { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { hashTypedData } from 'viem'
import {
  LimitOrderBuilder,
  Web3ProviderConnector,
  contractAddresses,
} from '@1inch/limit-order-protocol-utils'

import * as givno from '@1inch/limit-order-protocol-utils'

console.log(givno)

import $app from '@/store/app'
import $exchange from '@/store/exchange'
import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'
import useTrade from '@/myhooks/trade'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'

const TradeFormLimit = ({initialForm, currentTab, currentOption, userBalances}) => {
  const dispatch = useDispatch()
  const { wallet, connect, changeNetwork, walletClient } = useWalletConnect()
  const { getNftUser } = useTrade()
  
  const currentCollection = useSelector(({$collection}) => $collection.current)
  const blockchain = useSelector($app.get.blockchainByCode(currentCollection?.blockchain))

  const [form, setForm] = useState(initialForm)

  const loadingRef = useRef(false)

  useEffect(() => {
    Object.entries(initialForm).forEach(([key, value]) => {
      if (key !== 'total' && form[key] !== value) {
        handleChangeForm(key)(value)
      }
    })
  }, [initialForm])

  const handleChangeForm = field => value => {
    switch (field) {
      case 'price':
        setForm(state => ({
          ...state,
          price: value,
          total: (value*state.amount).toString(),
        }))
        return
      case 'amount':
        const regex = /^\d+[,]?\d{0,2}$/
        if (value && !regex.test(value)) {
          return 
        }
        setForm(state => ({
          ...state,
          amount: value,
          total: (value*state.price).toString(),
        }))
        return
      case 'total':
        setForm(state => {
          const amount = Math.floor(value/state.price)
          return {
            ...state,
            total: value,
            amount: amount,
          }
        })
        return
    }
  }

  const handleSubmit = async () => {
    const address = await connect()
    if (!address) {
      return
    }
    console.log('handleSubmit')
    const network = await changeNetwork(blockchain.code)
    if (!network) {
      return
    }
    
    loadingRef.current = true
    switch (currentTab) {
      case 'buy':
        console.log(contractAddresses)
        return
        const limitOrderBuilder = new LimitOrderBuilder(contractAddresses[blockchain.id], blockchain.id, walletClient)
        const limitOrder = limitOrderBuilder.buildLimitOrder({
          makerAssetAddress: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
          takerAssetAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
          makerAddress: wallet,
          makingAmount: '100',
          takingAmount: '200',
          // predicate = '0x',
          // permit = '0x',
          // receiver = ZERO_ADDRESS,
          // allowedSender = ZERO_ADDRESS,
          // getMakingAmount = ZERO_ADDRESS,
          // getTakingAmount = ZERO_ADDRESS,
          // preInteraction: '0x',
          // postInteraction: '0x0000000000000000000000000000000000000000' + wallet.slice(2),
        })
        const limitOrderTypedData = limitOrderBuilder.buildLimitOrderTypedData(limitOrder)
        const limitOrderHash = hashTypedData(limitOrderTypedData)
        const signature = await walletClient.signTypedData(limitOrderTypedData)

        const post = {
          orderHash: limitOrderHash,
          signature: signature,
          data: limitOrder,
          chainId: blockchain.id,
          orderType: 'active',
        }
        fetch(
          `https://limit-orders.1inch.io/v3.0/${blockchain.id}/limit-order`,
          {
            method: 'POST',
            headers: {'content-type': 'application/json', 'accept': 'application/json, text/plain, */*'},
            body: JSON.stringify(post),
          }
        )
        
        return
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/BuyModal',
          props: {
            header: {
              title: `Buy ${currentCollection.name} for ${blockchain.wrapped.shortName}`,
            },
            data: {
              ...form,
              type: 'place',
              collectionId: currentCollection.address,
              blockchain: blockchain,
            },
          }
        }))
        return
      case 'sell':
        const tokenIds = await getNftUser(currentCollection.address, wallet)
        if (tokenIds.length < form.amount) {
          toast.error(`You don't have enough NFTs`)
          return
        }
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/SellModal',
          props: {
            header: {
              title: `${tokenIds.length} NFTs available`,
              subtitle: `Choose the NFT collection you want to sell`
            },
            data: {
              ...form,
              type: 'place',
              tokens: tokenIds,
              collectionId: currentCollection.address,
              blockchain: blockchain,
            },
          }
        }))
    }
  }

  const handleTotalBlur = () => {
    handleChangeForm('price')(form.total/form.amount)
    trackEvent('Add Total', {
      'Base Currency': blockchain.currency,
      'Quote Currency': currentCollection.name,
      'Total': form.total,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Network': blockchain.name,
    })
  }

  const handleBlurPrice = () => {
    trackEvent('Add Price', {
      'Base Currency': blockchain.currency,
      'Quote Currency': currentCollection.name,
      'Price': form.price,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Network': blockchain.name,
    })
  }

  const handleBlurAmount = () => {
    trackEvent('Add Amount', {
      'Base Currency': blockchain.currency,
      'Quote Currency': currentCollection.name,
      'Amount': form.amount,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Network': blockchain.name,
    })
  }

  const handleClickMultipler = (percentage) => () => {
    if (currentTab === 'buy') {
      handleChangeForm('total')(userBalances.wrapped * percentage)
    } else {
      handleChangeForm('amount')(userBalances.token * percentage)
    }
  }

  const renderBalance = () => {
    return (
      <App.Flex className={styles.balance}>
        <App.Flex flex={1} align="center" gap={4}>
          <App.Icon icon="wallet" />
          <App.Text size={10} color="rgba(255,255,255,0.6)">
            {
              currentTab === 'buy'
                ? `${userBalances.wrapped} ${blockchain.wrapped.shortName}`
                : `${userBalances.token} NFT`
            }
          </App.Text>
        </App.Flex>
        <App.Flex className={styles.multipler} align="center" gap={8}>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.25)}>25%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.5)}>50%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(0.75)}>75%</App.Text>
          <App.Text color="#B9B8C5" size={10} weight={600} sx={{cursor: 'pointer'}} onClick={handleClickMultipler(1)}>100%</App.Text>
        </App.Flex>
      </App.Flex>
    )
  }

  return (
    <App.Flex column className={styles.form}>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="AT PRICE"
          currency={blockchain.wrapped.shortName}
          value={form.price}
          onBlur={handleBlurPrice}
          onChange={handleChangeForm('price')}
          type="number" />
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="AMOUNT"
          value={form.amount}
          currency={`NFT${form.amount > 1 ? `s` : ''}`}
          onBlur={handleBlurAmount}
          onChange={handleChangeForm('amount')} />
        {
          currentTab === 'sell'
            ? renderBalance()
            : null
        }
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="TOTAL"
          currency={blockchain.wrapped.shortName}
          value={form.total}
          onBlur={handleTotalBlur}
          onChange={handleChangeForm('total')}
          type="number" />
          {
            currentTab === 'buy'
              ? renderBalance()
              : null
          }
      </App.Flex>
      <App.Button
        sx={{backgroundColor: currentOption.color}}
        className={styles.button}
        disabled={!form.total}
        onClick={handleSubmit}>
        <App.Text color="#09051D" size={15} weight={700}>{ currentOption.title } {`${form.amount || 0} NFT${form.amount > 1 ? `s` : ''}` }</App.Text>
        { currentCollection?.image ? <Image src={currentCollection?.image} width={32} height={32} alt="" /> : null }
      </App.Button>
    </App.Flex>
  )
}

export default TradeFormLimit
