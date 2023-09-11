import styles from './styles.module.scss'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Image from 'next/image'

import $app from '@/store/app'
import $modal from '@/store/modal'
import useWalletConnect from '@/myhooks/wallet-connect'
import useTrade from '@/myhooks/trade'
import { trackEvent } from '@/libs/analytics.lib'
import { INCH_TOKENS } from '@/config'

import App from '@/components/App'
import TradeInput from '@/components/Exchange/TradeInput'

const TradeFormLimit = ({current, type, initialForm, currentTab, currentOption, userBalances}) => {
  const dispatch = useDispatch()
  const { wallet, connect, changeNetwork } = useWalletConnect()
  const { getNftUser } = useTrade()
  
  const blockchain = useSelector($app.get.blockchainByCode(current?.blockchain))

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
    const decimalRegExp = /^(?=.*\d)\d*(?:\.\d*)?$/
    if (!decimalRegExp.test(value) && value) {
      return
    }
    switch (field) {
      case 'price':
        setForm(state => ({
          ...state,
          price: value,
          total: (value*state.amount).toString(),
        }))
        return
      case 'amount':
        if (type === 'nfts') {
          const regex = /^\d+[,]?\d{0,2}$/
          if (value && !regex.test(value)) {
            return 
          }
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

    const usdtAsset = INCH_TOKENS[blockchain.usdtContract.toLowerCase()]
    const usdtFormatted = {
      ...usdtAsset,
      image: usdtAsset.logoURI,
    }
    switch (currentTab) {
      case 'buy':
        if (type === 'nfts') {
          dispatch($modal.set.show({
            show: true,
            modal: 'Exchange/BuyModal',
            props: {
              header: {
                title: `Buy ${current.name} for ${type === 'nfts' ? blockchain.wrapped.shortName : 'USDT'}`,
              },
              data: {
                ...form,
                type: 'place',
                blockchain: blockchain,
                current: current,
                tokenType: type,
              },
            }
          }))
          return
        }
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/PlaceOrder',
          props: {
            data: {
              side: 'buy',
              makerAsset: usdtFormatted,
              takerAsset: current,
              amount: form.amount,
              price: form.price,
              blockchain: blockchain,
            },
          }
        }))
        break
      case 'sell':
        if (type === 'nfts') {
          const tokenIds = await getNftUser(current.address, wallet)
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
                current: current,
                blockchain: blockchain,
                tokenType: type,
              },
            }
          }))
          return
        }
        dispatch($modal.set.show({
          show: true,
          modal: 'Exchange/PlaceOrder',
          props: {
            data: {
              side: 'sell',
              makerAsset: current,
              takerAsset: usdtFormatted,
              amount: form.amount,
              price: form.price,
              blockchain: blockchain,
            },
          }
        }))
        // dispatch($modal.set.show({
        //   show: true,
        //   modal: 'Exchange/SellModal',
        //   props: {
        //     header: {
        //       title: `Sell ${current.name} for USDT`,
        //     },
        //     data: {
        //       ...form,
        //       type: 'place',
        //       current: current,
        //       blockchain: blockchain,
        //       tokenType: type,
        //       tokens: [],
        //     },
        //   }
        // }))
    }
  }

  const handleTotalBlur = () => {
    handleChangeForm('price')(form.total/form.amount)
    trackEvent('Add Total', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Total': form.total,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Wallet Address': wallet || null,
      'Network': blockchain.name,
    })
  }

  const handleBlurPrice = () => {
    trackEvent('Add Price', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Price': form.price,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Wallet Address': wallet || null,
      'Network': blockchain.name,
    })
  }

  const handleBlurAmount = () => {
    trackEvent('Add Amount', {
      'Base Currency': blockchain.currency,
      'Quote Currency': current.name,
      'Amount': form.amount,
      'Wallet connect Status': wallet ? 'Connected' : 'Not Connected',
      'Wallet Address': wallet || null,
      'Network': blockchain.name,
    })
  }

  const handleClickMultipler = (percentage) => () => {
    if (type === 'nfts') {
      if (currentTab === 'buy') {
        handleChangeForm('total')(userBalances.wrapped * percentage)
      } else {
        handleChangeForm('amount')(Math.round(userBalances.token * percentage))
      }
    } else {
      if (currentTab === 'buy') {
        handleChangeForm('total')(userBalances.usdt * percentage)
      } else {
        handleChangeForm('amount')(userBalances.token * percentage)
      }
    }
  }

  const renderBalance = () => {
    return (
      <App.Flex className={styles.balance}>
        <App.Flex flex={1} align="center" gap={4}>
          <App.Icon icon="wallet" />
          <App.Text size={10} color="rgba(255,255,255,0.6)">
            {
              type === 'nfts'
                ? currentTab === 'buy'
                  ? `${userBalances.wrapped} ${blockchain.wrapped.shortName}`
                  : `${userBalances.token} NFT`
                : currentTab === 'buy'
                  ? `${userBalances.usdt} USDT`
                  : `${userBalances.token} ${current.symbol}`
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
          currency={type === 'nfts' ? blockchain.wrapped.shortName : 'USDT'}
          value={form.price}
          onBlur={handleBlurPrice}
          onChange={handleChangeForm('price')}
          type="number" />
      </App.Flex>
      <App.Flex column sx={{marginBottom: 24}}>
        <TradeInput
          label="AMOUNT"
          value={form.amount}
          currency={type === 'nfts' ? `NFT${form.amount > 1 ? `s` : ''}` : current.symbol}
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
          currency={type === 'nfts' ? blockchain.wrapped.shortName : 'USDT'}
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
        <App.Text color="#09051D" size={15} weight={700}>
          { currentOption.title } {`${form.amount || 0}` } { type === 'nfts' ? `NFT${form.amount > 1 ? `s` : ''}` : current.symbol }
        </App.Text>
        { current?.image ? <Image src={current?.image} width={32} height={32} alt="" /> : null }
      </App.Button>
    </App.Flex>
  )
}

export default TradeFormLimit
