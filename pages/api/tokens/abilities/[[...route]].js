import { formatUnits } from 'viem'
import * as math from 'mathjs'
import numeral from 'numeral'
import { createPublicClient, http } from 'viem'
import * as viemChains from 'viem/chains'

const INCH_URL = 'https://limit-orders.1inch.io/v3.0'

const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'content-type': 'application/json',
  },
}

const queryBuilder = data => {
  const params = new URLSearchParams()
  for (const key in data) {
    if (data[key] != null) {
      if (typeof data[key] == 'object') {
        for (const value of data[key]) {
          params.append(key, value)
        }
      } else {
        params.append(key, data[key])
      }
    }
  }
  return `?${params}`
}

const getDecimals = async (address, chainId) => {
  const network = Object.values(viemChains).find(chain => chain.id.toString() === chainId)
  console.log('network', network)
  console.log('viemChains', viemChains.mainnet)
  const client = createPublicClient({ 
    chain: network,
    transport: http()
  })
  const abi = {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{name: '', type: 'uint8'}],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
  const res = await client.readContract({
    address: address,
    abi: [abi],
    functionName: 'decimals',
  })
  return res
}

const formatter = (order, makerDecimals, takerDecimals) => {
  const makingAmount = order.remainingMakerAmount
  const takingAmount = math.chain(makingAmount).multiply(order.data.takingAmount).divide(order.data.makingAmount).round().done()
  const makingAmountFormatted = formatUnits(makingAmount, makerDecimals)*1
  const takingAmountFormatted = formatUnits(takingAmount, takerDecimals)*1

  const makerPrice = math.chain(takingAmountFormatted).divide(makingAmountFormatted).done()
  const takerPrice = math.chain(makingAmountFormatted).divide(takingAmountFormatted).done()
  return {
    ...order,
    makingAmount: makingAmount,
    takingAmount: takingAmount,
    makingAmountFormatted: makingAmountFormatted,
    takingAmountFormatted: takingAmountFormatted,
    makerPrice: math.round(takerPrice, 5),
    takerPrice: math.round(makerPrice, 5),
  }
}

const handler = async (req, res) => {
  const [chainId, makerAsset, takerAsset, price, amount, side] = req.query.route
  const query = queryBuilder({
    makerAsset,
    takerAsset,
    limit: 100,
    statuses: '[1]',
    sortBy: 'takerRate',
  })
  const response = await fetch(`${INCH_URL}/${chainId}/all${query}`, options)
  if (response.ok) {
    const json = await response.json()
    if (json && Array.isArray(json)) {
      const makerDecimals = await getDecimals(makerAsset, chainId)
      const takerDecimals = await getDecimals(takerAsset, chainId)
      const amountInWei = Math.pow(10, side === 'buy' ? makerDecimals : takerDecimals)*amount
      const list = json.map(order => formatter(order, makerDecimals, takerDecimals))

      const filter = {
        buy: order => {
          return order.takerPrice <= price*1
        },
        sell: order => {
          return order.makerPrice >= price*1
        },
      }

      const filteredByPrice = list.filter(filter[side])

      const temp = filteredByPrice.reduce((acc, order) => {
        if (side === 'sell') {
          acc.totalToBuy = math.chain(acc.totalToBuy).multiply(order.takerRate).done()
        }
        if (acc.totalToBuy <= 0) {
          return acc
        }
        const diff = math.chain(order.makingAmount).subtract(acc.totalToBuy).done()
        let willTakeMakingAmount = 0
        let willSpendTakingAmount = 0

        if (diff >= 0) {
          // can fill in this order
          willTakeMakingAmount = math.chain(acc.totalToBuy).done()
          willSpendTakingAmount = side === 'buy' ? math.chain(willTakeMakingAmount).multiply(order.makerRate).round().done() : math.chain(willTakeMakingAmount).divide(order.takerRate).round().done()
          
          acc.totalToBuy = 0
        } else {
          // need next order
          willTakeMakingAmount = math.chain(order.makingAmount).done()
          willSpendTakingAmount = side === 'buy' ? math.chain(willTakeMakingAmount).multiply(order.makerRate).done() : math.chain(willTakeMakingAmount).divide(order.takerRate).done()
          acc.totalToBuy = side === 'sell' ? math.chain(diff).multiply(-1).divide(order.takerRate).done() : math.chain(diff).multiply(-1).done()
        }
        const willTakeMakingAmountFormatted = formatUnits(willTakeMakingAmount, makerDecimals)
        const willSpendTakingAmountFormatted = formatUnits(willSpendTakingAmount, takerDecimals)
        
        return {
          ...acc,
          orders: [
            ...acc.orders,
            {
              ...order,
              willTakeMakingAmount,
              willTakeMakingAmountFormatted,
              willSpendTakingAmount,
              willSpendTakingAmountFormatted,
            }
          ]
        }
      }, {totalToBuy: amountInWei, orders: []})

      const stats = filteredByPrice.reduce((acc, order) => ({
        totalAmountOnSell: math.chain(acc.totalAmountOnSell).add(formatUnits(order.makingAmount, makerDecimals)).done(),
        totalAmountToSell: math.chain(acc.totalAmountToSell).add(formatUnits(order.takingAmount, takerDecimals)).done(),
      }), {totalAmountOnSell: 0, totalAmountToSell: 0})

      const rates = temp.orders.reduce((acc, order) => ({
        willSpendAmount: math.chain(acc.willSpendAmount).add(order.willSpendTakingAmount).done(),
        willTakeAmount: math.chain(acc.willTakeAmount).add(order.willTakeMakingAmount).done(),
      }), {willSpendAmount: 0, willTakeAmount: 0})
      
      res.status(200).json({
        totalAmountOnSell: numeral(stats.totalAmountOnSell).format('0.0[00000]'),
        totalAmountToSell: numeral(stats.totalAmountToSell).format('0.0[00000]'),
        willSpendAmount: numeral(formatUnits(rates.willSpendAmount.toFixed(), takerDecimals)).format('0.0[00000]'),
        willSpendAmountValue: rates.willSpendAmount.toFixed(),
        willTakeAmount: numeral(formatUnits(rates.willTakeAmount.toFixed(), makerDecimals)).format('0.0[00000]'),
        willTakeAmountValue: rates.willTakeAmount.toFixed(),
        orders: temp.orders,
        filteredByPrice: filteredByPrice,
      })
      return
    }
  }
  res.status(400).json({})
}

export default handler
