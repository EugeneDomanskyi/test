import { INCH_TOKENS } from '@/config'
import { formatUnits, parseUnits } from 'viem'

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

const getDecimals = address => {
  return INCH_TOKENS[address.toLowerCase()].decimals
}

const formatter = (order, makerDecimals, takerDecimals) => {
  const makingAmount = Number(order.remainingMakerAmount)
  const takingAmount = makingAmount * order.data.takingAmount / order.data.makingAmount
  const makingAmountFormatted = formatUnits(makingAmount, makerDecimals)*1
  const takingAmountFormatted = formatUnits(takingAmount.toFixed(), takerDecimals)*1
  console.log(makingAmount, order.remainingMakerAmount)
  return {
    ...order,
    makingAmount: makingAmount,
    takingAmount: takingAmount,
    makingAmountFormatted: makingAmountFormatted,
    takingAmountFormatted: takingAmountFormatted,
    makerPrice: takingAmountFormatted/makingAmountFormatted,
    takerPrice: makingAmountFormatted/takingAmountFormatted,
  }
}

const handler = async (req, res) => {
  const [chainId, makerAsset, takerAsset, price, amount, side] = req.query.route
  const query = queryBuilder({
    makerAsset,
    takerAsset,
    limit: 500,
    statuses: '[1]',
    sortBy: 'takerRate',
  })
  const response = await fetch(`${INCH_URL}/${chainId}/all${query}`, options)
  if (response.ok) {
    const json = await response.json()
    if (json && Array.isArray(json)) {
      const makerDecimals = getDecimals(makerAsset)
      const takerDecimals = getDecimals(takerAsset)
      const amountInWei = Math.pow(10, side === 'buy' ? makerDecimals : takerDecimals)*amount
      const list = json.map(order => formatter(order, makerDecimals, takerDecimals))

      const filter = {
        buy: order => order.makerPrice*1 <= price*1,
        sell: order => order.takerPrice*1 >= price*1,
      }

      const filteredByPrice = list.filter(filter[side])

      const temp = filteredByPrice.reduce((acc, order) => {
        if (side === 'sell') {
          acc.totalToBuy = acc.totalToBuy * order.takerRate
        }
        if (acc.totalToBuy <= 0) {
          return acc
        }
        const diff = order.makingAmount - acc.totalToBuy
        let willTakeMakingAmount = 0
        let willSpendTakingAmount = 0

        if (diff >= 0) {
          // can fill in this order
          willTakeMakingAmount = acc.totalToBuy
          willSpendTakingAmount = side === 'buy' ? willTakeMakingAmount * order.makerRate : willTakeMakingAmount / order.takerRate
          
          acc.totalToBuy = 0
        } else {
          // need next order
          willTakeMakingAmount = order.makingAmount
          willSpendTakingAmount = side === 'buy' ? willTakeMakingAmount * order.makerRate : willTakeMakingAmount / order.takerRate
          acc.totalToBuy = side === 'sell' ? (diff * -1) / order.takerRate : diff * -1
        }
        const willTakeMakingAmountFormatted = formatUnits(willTakeMakingAmount.toFixed(), makerDecimals)
        const willSpendTakingAmountFormatted = formatUnits(willSpendTakingAmount.toFixed(), takerDecimals)
        
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
        totalAmountOnSell: acc.totalAmountOnSell + order.makingAmount,
        totalAmountToSell: acc.totalAmountToSell + order.takingAmount,
      }), {totalAmountOnSell: 0, totalAmountToSell: 0})

      const rates = temp.orders.reduce((acc, order) => ({
        willSpendAmount: acc.willSpendAmount + order.willSpendTakingAmount,
        willTakeAmount: acc.willTakeAmount + order.willTakeMakingAmount,
      }), {willSpendAmount: 0, willTakeAmount: 0})
      
      res.status(200).json({
        totalAmountOnSell: formatUnits(stats.totalAmountOnSell.toFixed(), makerDecimals),
        totalAmountToSell: formatUnits(stats.totalAmountToSell.toFixed(), takerDecimals),
        willSpendAmount: formatUnits(rates.willSpendAmount.toFixed(), takerDecimals),
        willTakeAmount: formatUnits(rates.willTakeAmount.toFixed(), makerDecimals),
        orders: temp.orders,
      })
      return
    }
  }
  res.status(400).json({})
}

export default handler
