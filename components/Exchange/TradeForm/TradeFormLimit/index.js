import styles from './styles.module.scss'
import { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { parseUnits } from 'viem'

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
  const { wallet, connect, changeNetwork } = useWalletConnect()
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

    const network = await changeNetwork(blockchain.code)
    if (!network) {
      return
    }
    loadingRef.current = true
    switch (currentTab) {
      case 'buy':
        // $exchange.api.executeOrder({
        //   maker: wallet,
        //   blockchain: blockchain.code,
        //   params: [{
        //     collection: currentCollection.address,
        //     weiPrice: parseUnits(`${form.total*form.amount}`, 18).toString()
        //   }],
        // }).then(async ({steps}) => {
        //   const currentStep = steps.filter(step => step.items.length).find(step => {
        //     const [action] = step.items
        //     return action.status !== 'complete'
        //   })
        //   if (currentStep) {
        //     switch (currentStep.kind) {
        //       case 'signature':
        //         const [step] = currentStep.items
        //         const needToSign = step.data.sign
        //         console.log(needToSign)
        //         const signature = await walletClient.signTypedData({
        //           ...needToSign,
        //           message: needToSign.value,
        //         })
        //         console.log('signature', signature)
        //         break
        //     }
        //   }
        // })
        // return
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
    trackEvent('Dex Add Total', {
      'Base Currency': blockchain.currency,
      'Quote Currency': currentCollection.name,
      'Total': form.total,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Network': blockchain.name,
    })
  }

  const handleBlurPrice = () => {
    trackEvent('Dex Add Price', {
      'Base Currency': blockchain.currency,
      'Quote Currency': currentCollection.name,
      'Price': form.price,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Network': blockchain.name,
    })
  }

  const handleBlurAmount = () => {
    trackEvent('Dex Add Amount', {
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
          onChange={handleChangeForm('price')} />
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
          onChange={handleChangeForm('total')} />
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
