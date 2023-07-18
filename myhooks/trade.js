import { useSelector } from 'react-redux'

import useWalletConnect from './wallet-connect'

import $app from '@/store/app'
import $nft from '@/store/nft'

const useTrade = () => {
  const { getPrice, network, usdt } = useWalletConnect()
  const blockchain = useSelector($app.get.blockchain)

  const getNftPricesNative = async (collection) => {
    let result = []
    const response = await $nft.api.prices({
      blockchain: blockchain.code,
      collection
    })

    if (response && response?.tokens) {
      result = Object.entries(response.tokens).map(([id, price]) => ({ id, price }))
      result.sort((a, b) => a.price - b.price)
    }

    return result
  }

  const getNftPricesCurrency = async (collection, ids = [], currencyContract = null) => {
    const response = await getNftInfo(collection, ids, currencyContract)
    const result = response.map(item => ({
      id: item.token.tokenId,
      price: item.market?.floorAsk?.price?.amount.decimal,
    }))
    result.sort((a, b) => a.price - b.price)
    
    return result
  }

  const getNftInfo = async (collection, ids = [], currencyContract = null) => {
    let result = []
    let continuation = null

    do {
      const response = await $nft.api.all({
        blockchain: blockchain.code,
        tokens: ids.map(item => `${collection}:${item}`),
        displayCurrency: currencyContract,
        limit: 100,
        continuation,
      })

      if (response && response?.tokens) {
        result = [
          ...result,
          ...response.tokens
        ]

        continuation = response.continuation
      }
    } while (continuation)

    return result
  }

  const getNftBalanceUser = async (collection, wallet) => {
    let result = 0
    const response = await $nft.api.users({
      blockchain: blockchain.code,
      user: wallet,
      collection
    })

    if (response && response?.tokens) {
      result = response.tokens.length
    }

    return result
  }

  const buyPriceByAmount = async (amount, prices = [], currency = 'native', collection = null) => {
    amount = amount > prices.length ? prices.length : amount

    let result = 0

    if (amount > 0) {
      let pricesData = []
      if (currency == 'native') {
        pricesData = prices
      } else {
        const ids = prices.slice(0, amount).map(item => item.id)
        pricesData = await getNftPricesCurrency(collection, ids, usdt[blockchain.code])
      }

      for (let i = 0; i < amount; i++) {
        result += (pricesData[i].price * 1)
      }
    }

    return result
  }

  const buyAmountByPrice = async (price, prices = [], currency = 'native', collection = null) => {
    let amount = 0
    let maxPrice = price

    let pricesData = []
    if (currency == 'native') {
      pricesData = prices
    } else {
      const rate = await getPrice(network(blockchain.code)?.coingecko, 'usd')
      if (rate) {
        let usdAmount = 0
        let usdMaxPrice = maxPrice
        while (usdMaxPrice > 0) {
          const usdPrice = prices[usdAmount].price * rate
          if (usdPrice <= maxPrice) {
            usdMaxPrice -= usdPrice
            usdAmount++
          } else {
            usdMaxPrice = 0
          }
        }

        const delta = 5
        const ids = prices.slice(0, usdAmount + delta).map(item => item.id)
        pricesData = await getNftPricesCurrency(collection, ids, usdt[blockchain.code])
      }
    }

    while (maxPrice > 0) {
      if (pricesData[amount].price <= maxPrice) {
        maxPrice -= pricesData[amount].price
        amount++
      } else {
        maxPrice = 0
      }
    }

    return amount
  }

  return {
    getNftPricesNative,
    getNftPricesCurrency,
    getNftInfo,
    getNftBalanceUser,
    buyPriceByAmount,
    buyAmountByPrice,
  }
}

export default useTrade