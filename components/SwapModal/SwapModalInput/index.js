import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import useTrade from '@/myhooks/trade'
import { usePropsHelper } from '@/myhooks/props-helper'

import $app from '@/store/app'
import $nft from '@/store/nft'

import App from '@/components/App'
import SwapModalInputList from '@/components/SwapModal/SwapModalInputList'

import styles from './styles.module.scss'

const SwapModalInput = ({ collection, onCollectionChange, currency, onCurrencyChange, type, onTypeChange, onSwap }) => {
  const { isMobile } = usePropsHelper()
  const { wallet, network, getBalance, usdt } = useWalletConnect()
  const { getNftPricesNative, getNftBalanceUser, buyPriceByAmount, buyAmountByPrice } = useTrade()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const { all: collections } = useSelector(({ $collection }) => $collection)
  const { prices } = useSelector(({ $nft }) => $nft)

  const [nftBalance, setNftBalance] = useState(0)
  const [currencyBalance, setCurrencyBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState()
  const [tokens, setTokens] = useState([])
  const [variant, setVariant] = useState()
  const [listOpen, setListOpen] = useState(false)

  let timeoutId = null

  useEffect(() => {
    if (wallet && collection && currency) {
      (async () => {
        const tempPrices = await getNftPricesNative(collection.address)
        dispatch($nft.set.prices(tempPrices))

        const tempNftBalance = await getNftBalanceUser(collection.address, wallet)
        setNftBalance(tempNftBalance * 1)

        const tempCurrencyBalance = await getBalance(currency == 'usdt' ? usdt[blockchain.code] : null)
        setCurrencyBalance(tempCurrencyBalance * 1)

        setBalanceLoading(false)
      })()
    }
  }, [wallet, collection, currency])

  const handleAmountChange = (event) => {
    setAmount(event.target.value)

    clearTimeout(timeoutId)

    timeoutId = setTimeout(async () => {
      if (event.target.value.trim() == '') {
        setPrice('')
      } else {
        const price = await buyPriceByAmount(event.target.value, prices, currency, collection.address)
        setPrice(price)
      }
    }, 1000)
  }

  const handlePriceChange = (event) => {
    setPrice(event.target.value)

    clearTimeout(timeoutId)

    timeoutId = setTimeout(async () => {
      if (event.target.value.trim() == '') {
        setAmount('')
      } else {
        const amount = await buyAmountByPrice(event.target.value, prices, currency, collection.address)
        setAmount(amount)
      }
    }, 1000)
  }

  const handleKeyPress = (event) => {
    if ((event.key === '0' && event.target.value.length == 0) || event.key === '-' || event.key === '+' || event.key === 'e') {
      event.preventDefault()
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
    }

    if (event.key == 'Enter' && onBuy) {
      onBuy()
    }
  }

  const handleSwap = () => {
    setError(null)

    if (amount * 1 > prices.length) {
      setError('amount')
      return
    }
    
    if (price * 1 > currencyBalance) {
      setError('price')
      return
    }

    if (onSwap) {
      onSwap(prices.slice(0, amount))
    }
  }

  const handleTypeChange = () => {
    if (onTypeChange) {
      onTypeChange(type == 'buy' ? 'sell' : 'buy')
    }
  }

  const handleListClick = (variant) => () => {
    let result = []
    if (variant == 'currency') {
      result.push({
        code: 'native',
        name: blockchain.name,
        currency: blockchain.currency,
        image: `/images/icon-${blockchain.code}.png`,
        active: currency == 'native',
      })

      result.push({
        code: 'usdt',
        name: `USDT`,
        currency: `USDT`,
        image: `/images/icon-usdt.png`,
        active: currency == 'usdt',
      })
    } else {
      result = collections.map(item => ({
        code: item.address,
        name: item.name,
        currency: item.slug,
        image: item.image,
        active: collection.address == item.address,
      }))
    }

    setVariant(variant)
    setTokens(result)
    setListOpen(true)
  }

  const handleListClose = () => {
    setListOpen(false)
    setTokens([])
  }

  const handleListSelect = (code, variant) => {
    setListOpen(false)

    if (variant == 'currency') {
      if (onCurrencyChange) {
        onCurrencyChange(code)
      }
    }

    if (variant == 'collection') {
      if (onCollectionChange) {
        onCollectionChange(collections.find(item => item.address == code))
      }
    }

    setPrice('')
    setAmount('')
  }

  return (
    <App.Flex column className={styles.container}>
      <div className={styles.box}>
        <App.Text size={[20, 16]} weight={[600, 700]}>Enter the amount you would like to swap</App.Text>
      </div>

      <App.Flex column gap={6} className={styles.content}>
        <App.Flex row gap={8} className={styles.item}>
          {type == 'buy' ? (
            <input type="number" placeholder="0" value={price} onChange={handlePriceChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error == 'price'})} />
          ) : (
            <input type="number" placeholder="0" value={amount} onChange={handleAmountChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error == 'amount'})} />
          )}


          <App.Flex column align="flex-end" gap={10}>
            <App.Flex row gap={8} align="center" className={styles.chip} onClick={handleListClick(type == 'buy' ? 'currency' : 'collection')}>
              <div className={styles.imgRound}>
                <Image src={type == 'buy' ? `/images/icon-${(currency == 'native' ? blockchain.code : 'usdt')}.png` : collection.image} width={25} height={25} alt="" />
              </div>
              <App.Text size={16}>{type == 'buy' ? (currency == 'native' ? blockchain.currency : 'USDT') : collection.name}</App.Text>
              <App.Icon icon="caret-down" />
            </App.Flex>

            <App.Text size={12} weight={400} color={(type == 'buy' && error == 'price') || (type == 'sell' && error == 'amount') ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <App.Loader size={12} /> : (type == 'buy' ? `${currencyBalance.toFixed(4)} ${(currency == 'native' ? blockchain.currency : 'USDT')}` : nftBalance)}
              </App.Flex>
            </App.Text>
          </App.Flex>
        </App.Flex>

        <div className={styles.arrowBox} onClick={handleTypeChange}>
          <App.Flex center className={styles.arrow}>
            <App.Icon icon="arrow-down" />
          </App.Flex>
        </div>

        <App.Flex row gap={8} className={styles.item}>
          {type == 'sell' ? (
            <input type="number" placeholder="0" value={price} onChange={handlePriceChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error == 'price'})} />
          ) : (
            <input type="number" placeholder="0" value={amount} onChange={handleAmountChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error == 'amount'})} />
          )}

          <App.Flex column align="flex-end" gap={10}>
            <App.Flex row gap={8} align="center" className={styles.chip} onClick={handleListClick(type == 'sell' ? 'currency' : 'collection')}>
              <div className={styles.imgRound}>
                <Image src={type == 'sell' ? `/images/icon-${(currency == 'native' ? blockchain.code : 'usdt')}.png` : collection.image} width={25} height={25} alt="" />
              </div>
              <App.Text size={16}>{type == 'sell' ? (currency == 'native' ? blockchain.currency : 'USDT') : collection.name}</App.Text>
              <App.Icon icon="caret-down" />
            </App.Flex>

            <App.Text size={12} weight={400} color={(type == 'sell' && error == 'price') || (type == 'buy' && error == 'amount') ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Balance:</span>
                {balanceLoading ? <App.Loader size={12} /> : (type == 'sell' ? `${currencyBalance.toFixed(4)} ${(currency == 'native' ? blockchain.currency : 'USDT')}` : nftBalance)}
              </App.Flex>
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large disabled={error || amount * 1 <= 0} onClick={handleSwap} sx={{ width: isMobile ? '100%' : 200 }}>Swap</App.Button>
      </App.Flex>

      <SwapModalInputList tokens={tokens} open={listOpen} variant={variant} onClose={handleListClose} onSelect={handleListSelect} />
    </App.Flex>
  )
}

export default SwapModalInput