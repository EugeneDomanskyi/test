import { useEffect, useRef, useState } from 'react'
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
  const { wallet, network, getBalance, getPrice, usdt } = useWalletConnect()
  const { getNftPricesNative, getNftUser, getNftBids, buyPriceByAmount, buyAmountByPrice, sellPriceByAmount, sellAmountByPrice } = useTrade()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const { all: collections } = useSelector(({ $collection }) => $collection)
  const { prices, bids } = useSelector(({ $nft }) => $nft)

  const [nftBalance, setNftBalance] = useState(0)
  const [nftTotalBalance, setNftTotalBalance] = useState(0)
  const [currencyBalance, setCurrencyBalance] = useState(0)
  const [bidsCount, setBidsCount] = useState(0)
  const [calculateLoading, setCalculateLoading] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [usdPrice, setUsdPrice] = useState(0)
  const [error, setError] = useState()
  const [tokens, setTokens] = useState([])
  const [variant, setVariant] = useState()
  const [listOpen, setListOpen] = useState(false)

  let timeoutId = useRef(null)

  const tabs = [
    { key: 'buy', title: 'Buy' },
    { key: 'sell', title: 'Sell' },
  ]

  useEffect(() => {
    if (wallet && collection && currency) {
      (async () => {
        setBalanceLoading(true)

        const tempPrices = await getNftPricesNative(collection.address)
        dispatch($nft.set.prices(tempPrices))

        const tempNft = await getNftUser(collection.address, wallet)
        setNftBalance(tempNft.length)
        setNftTotalBalance(tempNft.reduce((acc, item) => acc + item?.ownership?.tokenCount * 1, 0))

        const tempBids = await getNftBids(collection.address, currency == 'usdt' ? usdt[blockchain.code] : null)
        dispatch($nft.set.bids(tempBids))

        const tempBidsCount = tempBids.reduce((acc, bid) => [...acc, ...new Array(bid.quantity).fill(bid.price)], []).length
        setBidsCount(tempBidsCount)

        const tempCurrencyBalance = await getBalance(currency == 'usdt' ? usdt[blockchain.code] : null)
        setCurrencyBalance(tempCurrencyBalance * 1)

        const tempPrice = await getPrice(currency == 'usdt' ? 'tether' : network(blockchain.code)?.coingecko, 'usd')
        setUsdPrice(tempPrice)

        setBalanceLoading(false)
      })()
    }
  }, [wallet, collection, currency])

  useEffect(() => {
    handleValidate(true)
  }, [price])

  const handleAmountChange = (event) => {
    const value = (event?.target?.value ?? event).toString()
    setAmount(value)

    setCalculateLoading(true)
    clearTimeout(timeoutId.current)

    timeoutId.current = setTimeout(() => {
      if (value.trim() == '') {
        setPrice('')
        setCalculateLoading(false)
      } else {
        calculatePrice(value.trim())
      }
    }, 1000)
  }

  const calculatePrice = async (customAmount = amount, customType = type) => {
    setCalculateLoading(true)
    let price = 0
    if (customType == 'buy') {
      price = await buyPriceByAmount(customAmount, prices, currency, collection.address)
    } else {
      price = await sellPriceByAmount(customAmount, bids)
    }
    setPrice(price)
    setCalculateLoading(false)
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

  const handleTypeChange = () => {
    const newType = type == 'buy' ? 'sell' : 'buy'
    if (onTypeChange) {
      onTypeChange(newType)
    }

    let newAmount = amount
    if (amount > getNftBalance(newType)) {
      newAmount = getNftBalance(newType)
      setAmount(newAmount)
    }

    calculatePrice(newAmount, newType)
  }

  const getNftBalance = (customType = type) => {
    if (customType == 'buy') {
      return prices.length
    }

    if (customType == 'sell') {
      return nftBalance
    }

    return 0
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

    calculatePrice()
  }

  const handleValidate = (withErrors = false) => {
    if (withErrors) {
      setError(null)
    }

    if (amount * 1 <= 0) {
      if (amount != '' && withErrors) {
        setError('amount')
      }

      console.log('Amount is equal or lower than zero')
      return false
    }

    if (price * 1 <= 0) {
      if (price != '' && withErrors) {
        setError('price')
      }

      console.log('Price is equal or lower than zero')
      return false
    }

    if (type == 'buy') {
      if (amount * 1 > prices.length) {
        if (withErrors) {
          setError('amount')
        }

        console.log('Amount is higher than balance')
        return false
      }

      if (currencyBalance == 0) {
        console.log('Empty currency balance')
        return false
      }
      
      if (price * 1 > currencyBalance) {
        if (withErrors) {
          setError('price')
        }

        console.log('Price is higher than balance')
        return false
      }
    } else {
      if (bidsCount <= 0) {
        console.log('Empty bids')
        return false
      }

      if (nftBalance == 0) {
        console.log('Empty NFT balance')
        return false
      }

      if (amount * 1 > nftBalance) {
        if (withErrors) {
          setError('amount')
        }

        console.log('Amount is higher than balance')
        return false
      }

      if (amount * 1 > bidsCount) {
        if (withErrors) {
          setError('offer')
        }

        console.log('Amount is higher than total offers count')
        return false
      }
    }

    return true
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

  return (
    <App.Flex column align="center" gap={24} className={styles.container}>
      <App.Flex gap={8} center className={styles.collection}>
        <App.Flex center width={32} height={32} sx={{ borderRadius: 4, overflow: 'hidden' }}>
          <Image src={collection.image} width={32} height={32} alt="" />
        </App.Flex>

        <App.Text size={16}>{collection.name}</App.Text>
      </App.Flex>

      <App.Flex column align="center" gap={12}>
        <App.Tabs options={tabs} active={type} variant="back" onChange={handleTypeChange} />

        <App.Flex row align="center" gap={16} className={styles.item}>
          <App.Text size={16} color="#B9B8C5">Amount</App.Text>
          <input type="number" placeholder="0" value={amount} onChange={handleAmountChange} onKeyDown={handleKeyPress} className={cn(styles.input, {[styles.error]: error == 'amount'})} />

          <App.Flex row gap={8} align="center" className={styles.chip} onClick={handleListClick('collection')}>
            <div className={styles.imgRound}>
              <Image src={collection.image} width={25} height={25} alt="" />
            </div>
            <App.Text size={16}>{collection.name}</App.Text>
            <App.Icon icon="caret-down" />
          </App.Flex>
        </App.Flex>

        <App.Flex column width="100%" align="flex-end">
          <App.RangeInput value={amount * 1} onChange={handleAmountChange} min={0} max={getNftBalance()} containerStyle={{width: '100%'}} />

          <App.Text right color={error == 'amount' ? '#DE5C64' : '#B9B8C5'}>
            <App.Flex row align="center" justify="flex-end" gap={4}>
              <span>{type == 'buy' ? 'Available ': ''}Balance:</span>
              {balanceLoading ? <App.Loader size={12} /> : `${getNftBalance()} NFT${getNftBalance() > 1 ? 's' : ''}`}
            </App.Flex>
          </App.Text>

          {type == 'sell' ? (
            <App.Text right color={error == 'offer' ? '#DE5C64' : '#B9B8C5'}>
              <App.Flex row align="center" justify="flex-end" gap={4}>
                <span>Total Offers:</span>
                {balanceLoading ? <App.Loader size={12} /> : `${bidsCount} NFT${bidsCount > 1 ? 's' : ''}`}
              </App.Flex>
            </App.Text>
          ) : null}
        </App.Flex>

        <App.Flex row align="center" gap={16} className={styles.item}>
          <App.Text size={16} color="#B9B8C5">Price</App.Text>
          <input type="number" placeholder="0" value={price != '' ? (price * 1).toFixed(4) : ''} readOnly className={cn(styles.input, {[styles.error]: error == 'price'})} />

          <App.Flex row gap={8} align="center" className={styles.chip} onClick={handleListClick('currency')}>
            <div className={styles.imgRound}>
              {calculateLoading ? (
                <App.Loader size={25} />
              ) : (
                <Image src={`/images/icon-${currency == 'native' ? blockchain.code : 'usdt'}.png`} priority width={25} height={25} alt="" />
              )}
            </div>
            <App.Text size={16}>{currency == 'native' ? blockchain.currency : 'USDT'}</App.Text>
            <App.Icon icon="caret-down" />
          </App.Flex>
        </App.Flex>

        <App.Flex column width="100%" align="flex-end">
          <App.Text right color={error == 'price' ? '#DE5C64' : '#B9B8C5'}>
            <App.Flex row align="center" justify="flex-end" gap={4}>
              <span>Balance:</span>
              {balanceLoading ? <App.Loader size={12} /> : `${currencyBalance.toFixed(4)} ${(currency == 'native' ? blockchain.currency : 'USDT')}`}
            </App.Flex>
          </App.Text>
        </App.Flex>

        <App.Flex row center gap={4}>
          <div className={styles.imgRound}>
            {calculateLoading ? (
              <App.Loader size={25} />
            ) : (
              <Image src={`/images/icon-${currency == 'native' ? blockchain.code : 'usdt'}.png`} width={25} height={25} alt="" />
            )}
          </div>

          <App.Text size={16}>{price != '' ? (price * 1).toFixed(4) : 0} {currency == 'native' ? blockchain.currency : 'USDT'}</App.Text>
          
          <App.Text color="#929292">&asymp;</App.Text>

          <App.Text color="#929292">$ {price != '' ? (price * usdPrice).toFixed(4) : 0}</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex center>
        <App.Button primary large disabled={error || !handleValidate()} onClick={handleSwap} sx={{ width: isMobile ? '100%' : 200 }}>Swap</App.Button>
      </App.Flex>

      <SwapModalInputList tokens={tokens} open={listOpen} variant={variant} onClose={handleListClose} onSelect={handleListSelect} />
    </App.Flex>
  )
}

export default SwapModalInput