import * as math from 'mathjs'
import { formatUnits } from 'viem'
import { createPublicClient, http } from 'viem'
import * as viemChains from 'viem/chains'
import moment from 'moment'

const INCH_URL = 'https://limit-orders.1inch.io/v3.0'

const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'content-type': 'application/json',
  },
}

const getDecimals = async (address, chainId) => {
  const network = Object.values(viemChains).find(chain => chain.id.toString() === chainId)
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
  const makingAmount = order.data.makingAmount
  const takingAmount = math.chain(makingAmount).multiply(order.data.takingAmount).divide(order.data.makingAmount).round().done()
  const makingAmountFormatted = formatUnits(makingAmount, makerDecimals)*1
  const takingAmountFormatted = formatUnits(takingAmount, takerDecimals)*1
  
  const makerPrice = math.chain(takingAmountFormatted).divide(makingAmountFormatted).done()
  const takerPrice = math.chain(makingAmountFormatted).divide(takingAmountFormatted).done()
  return {
    ...order,
    makingAmountFormatted: makingAmountFormatted,
    takingAmountFormatted: takingAmountFormatted,
    price: order.side === 'sell' ? makerPrice : takerPrice,
    priceFormatted: math.round(order.side === 'sell' ? makerPrice : takerPrice, 5),
    amount: math.round(order.side === 'buy' ? takingAmountFormatted : makingAmountFormatted, 5),
    timestamp: moment(order.createDateTime).unix(),
  }
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

const handler = async (req, res) => {
  const [chainId, usdtAsset, tokenAsset] = req.query.route

  const query = {
    buy: queryBuilder({
      makerAsset: usdtAsset,
      takerAsset: tokenAsset,
      limit: 50,
      statuses: '[3]',
    }),
    sell: queryBuilder({
      makerAsset: tokenAsset,
      takerAsset: usdtAsset,
      limit: 50,
      statuses: '[3]',
    })
  }

  const {buy, sell} = await Promise.all([
    fetch(`${INCH_URL}/${chainId}/all${query.buy}`, options),
    fetch(`${INCH_URL}/${chainId}/all${query.sell}`, options),
  ]).then(async ([responseBuy, responseSell]) => {
    let buy = []
    let sell = []
    if (responseBuy.ok) {
      buy = await responseBuy.json()
    }
    if (responseSell.ok) {
      sell = await responseSell.json()
    }
    return {
      buy: buy && Array.isArray(buy) ? buy.filter(order => order.orderInvalidReason === 'order filled').map(order => ({...order, side: 'buy'})) : [],
      sell: sell && Array.isArray(sell) ? sell.filter(order => order.orderInvalidReason === 'order filled').map(order => ({...order, side: 'sell'})) : [],
    }
  })

  const usdtDecimals = await getDecimals(usdtAsset, chainId)
  const tokenDecimals = await getDecimals(tokenAsset, chainId)

  res.status(200).json([
    ...buy.map(order => formatter(order, usdtDecimals, tokenDecimals)),
    ...sell.map(order => formatter(order, tokenDecimals, usdtDecimals)),
  ].sort((a, b) => b.timestamp - a.timestamp))
}

export default handler