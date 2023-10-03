import { formatUnits } from 'viem'
import * as math from 'mathjs'
import { CHAINS } from '../../../../config'

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

const formatter = (order, makerAsset, takerAsset, network) => {
  order.id = order.signature
  order.side = network.usdtContract.toLowerCase() === makerAsset.address ? 'buy' : 'sell'
  order.baseCurrency = order.side === 'buy' ? makerAsset.symbol : takerAsset.symbol
  order.quoteCurrency = order.side === 'sell' ? makerAsset.symbol : takerAsset.symbol
  order.makerAsset = makerAsset
  order.takerAsset = takerAsset
  order.image = order.side === 'sell' ? makerAsset.image : takerAsset.image
  order.contractAddress = order.side === 'buy' ? takerAsset.address : makerAsset.address

  const makingAmountFormatted = formatUnits(order.data.makingAmount, makerAsset.decimals)
  const takingAmountFormatted = formatUnits(order.data.takingAmount, takerAsset.decimals)
  const remainingMakingAmount = formatUnits(order.remainingMakerAmount, makerAsset.decimals)
  const remainingTakingAmount = formatUnits(math.chain(order.remainingMakerAmount).multiply(order.data.takingAmount).divide(order.data.makingAmount).round().done(), takerAsset.decimals)

  order.quantity = order.side === 'sell' ? makingAmountFormatted : takingAmountFormatted
  order.quantityFilled = order.quantity - (order.side === 'sell' ? remainingMakingAmount : remainingTakingAmount)
  order.price = order.side === 'buy' ? makingAmountFormatted : takingAmountFormatted
  order.status = !order.orderInvalidReason ? 'open' : (order.orderInvalidReason === 'order filled' ? 'completed' : (order.orderInvalidReason === 'order cancelled' ? 'cancelled' : null))
  return order
}

const handler = async (req, res) => {
  const [chainId, walletAddress] = req.query.route
  const query = queryBuilder({
    statuses: '[1,2,3]',
    sortBy: 'createDateTime'
  })
  const [assetsResponse, ordersResponse] = await Promise.all([
    fetch('https://tegro-imagekit-tora.s3.eu-central-1.amazonaws.com/assets_new.json'),
    fetch(`${INCH_URL}/${chainId}/address/${walletAddress}${query}`, options)
  ])

  if (assetsResponse.ok && ordersResponse.ok) {
    const assets = await assetsResponse.json()
    const orders = await ordersResponse.json()
    const tokenAssets = assets.reduce((acc, item) => ({
      ...acc,
      [item.address?.toLowerCase()]: item
    }), {})

    const network = CHAINS.find(chain => chain.id.toString() === chainId)
    const list = orders
      .filter(order => tokenAssets[order.data.makerAsset.toLowerCase()] && tokenAssets[order.data.takerAsset.toLowerCase()])
      .map(order => formatter(order, tokenAssets[order.data.makerAsset.toLowerCase()], tokenAssets[order.data.takerAsset.toLowerCase()], network))

    res.status(200).json(list)
    return
  }
  res.status(400).json([])
}

export default handler
