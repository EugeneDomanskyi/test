import * as math from 'mathjs'
import { formatUnits } from 'viem'
import moment from 'moment'
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

const groupByPrice = (data, sort = 'asc') => {
  const temp = {}
  for (const item of data) {
    if (!isNaN(item.priceFormatted) && item.price) {
      if ( ! temp[item.priceFormatted]) {
        temp[item.priceFormatted] = item
      } else {
        
        temp[item.priceFormatted] = {
          ...temp[item.priceFormatted],
          amount: math.chain(temp[item.priceFormatted].amount).add(item.amount).done(),
          quantity: math.round(math.chain(temp[item.priceFormatted].quantity).add(item.quantity).done(), 5),
        }
      }
    }
  }
  
  const array = Object.keys(temp).map(key => temp[key]).filter(el => el.quantity)
  array.sort((a, b) => sort == 'asc' ? (a.price - b.price) : (b.price - a.price))
  let prevVolume = 0
  
  return array.slice(0, 10).map(item => {
    prevVolume = math.add(prevVolume, item.amount).toLocaleString('fullwide', { useGrouping: false })
    return {
      ...item,
      volume: prevVolume
    }
  }).map(item => {
    return {
      ...item,
      volume: math.round(formatUnits(item.volume, item.side === 'buy' ? item.takerDecimals : item.makerDecimals), 5)
    }
  }) //.map(item => ({...item, amount: math.round(formatUnits(item.amount, item.side === 'buy' ? item.takerDecimals : item.makerDecimals), 5)}))
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
    makerPrice: makerPrice,
    takerPrice: takerPrice,
    price: order.side === 'sell' ? makerPrice : takerPrice,
    priceFormatted: math.round(order.side === 'sell' ? makerPrice : takerPrice, 5),
    amount: order.side === 'buy' ? takingAmount : makingAmount,
    quantity: math.round(order.side === 'buy' ? takingAmountFormatted : makingAmountFormatted, 5),
    timestamp: moment(order.createDateTime).unix(),
    makerDecimals: makerDecimals,
    takerDecimals: takerDecimals,
  }
}

const handler = async (req, res) => {
  const [chainId, usdtAsset, tokenAsset] = req.query.route
  const query = {
    buy: queryBuilder({
      makerAsset: usdtAsset,
      takerAsset: tokenAsset,
      limit: 50,
      statuses: '[1]',
      sortBy: 'takerRate'
    }),
    sell: queryBuilder({
      makerAsset: tokenAsset,
      takerAsset: usdtAsset,
      limit: 100,
      statuses: '[1]',
      sortBy: 'takerRate'
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
      buy: buy && Array.isArray(buy) ? buy.map(order => ({...order, side: 'buy'})) : [],
      sell: sell && Array.isArray(sell) ? sell.map(order => ({...order, side: 'sell'})) : [],
    }
  })
  const usdtDecimals = await getDecimals(usdtAsset, chainId)
  const tokenDecimals = await getDecimals(tokenAsset, chainId)

  res.status(200).json({
    buy: groupByPrice(buy.map(order => formatter(order, usdtDecimals, tokenDecimals)), 'desc'),
    sell: groupByPrice(sell.map(order => formatter(order, tokenDecimals, usdtDecimals)), 'asc'),
  })
}

export default handler