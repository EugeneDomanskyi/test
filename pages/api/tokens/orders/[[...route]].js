import { formatUnits } from 'viem'
import * as math from 'mathjs'
import { createPublicClient, http } from 'viem'
import * as viemChains from 'viem/chains'
import { CHAINS } from '../../../../config'
import assets from '@/public/files/assets'

const INCH_URL = 'https://limit-orders.1inch.io/v3.0'

const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'content-type': 'application/json',
  },
}

const getInfo = async (address, client) => {
  const abi = [{
    inputs:[],
    name: 'symbol',
    outputs: [{internalType: 'string', name: '', type: 'string'}],
    stateMutability: 'view',
    type: 'function'
  }, {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{name: '', type: 'uint8'}],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }]
  const [symbol, decimals] = await client.multicall({
    contracts: [
      {
        address: address,
        abi: abi,
        functionName: 'symbol',
      }, {
        address: address,
        abi: abi,
        functionName: 'decimals',
      }
    ]
  })
  return {
    symbol: symbol.result,
    decimals: decimals.result,
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

const formatter = (order, makerAsset, takerAsset, network) => {
  order.id = order.signature
  order.side = network.usdtContract.toLowerCase() === makerAsset.address ? 'buy' : 'sell'
  order.baseCurrency = order.side === 'buy' ? makerAsset.symbol : takerAsset.symbol
  order.quoteCurrency = order.side === 'sell' ? makerAsset.symbol : takerAsset.symbol
  order.makerAsset = makerAsset
  order.takerAsset = takerAsset
  // order.image = order.side === 'sell' ? makerAsset.image : takerAsset.image
  order.contractAddress = order.side === 'buy' ? takerAsset.address : makerAsset.address

  const makingAmountFormatted = formatUnits(order.data.makingAmount, makerAsset.decimals)
  const takingAmountFormatted = formatUnits(order.data.takingAmount, takerAsset.decimals)
  const remainingMakingAmount = formatUnits(order.remainingMakerAmount, makerAsset.decimals)
  const remainingTakingAmount = formatUnits(math.chain(order.remainingMakerAmount).multiply(order.data.takingAmount).divide(order.data.makingAmount).round().done(), takerAsset.decimals)

  order.quantity = math.chain(order.side === 'sell' ? makingAmountFormatted : takingAmountFormatted).round(5).done()
  order.quantityFilled = math.chain(order.quantity - (order.side === 'sell' ? remainingMakingAmount : remainingTakingAmount)).round(5).done()
  order.price = math.chain(order.side === 'buy' ? makingAmountFormatted : takingAmountFormatted).round(5).done()
  order.status = !order.orderInvalidReason ? 'open' : (order.orderInvalidReason === 'order filled' ? 'completed' : (order.orderInvalidReason === 'order cancelled' ? 'cancelled' : null))
  return order
}

const handler = async (req, res) => {
  const [chainId, walletAddress] = req.query.route
  const query = queryBuilder({
    statuses: '[1,2,3]',
    sortBy: 'createDateTime'
  })
  const network = CHAINS.find(chain => chain.id.toString() === chainId)
  
  const ordersResponse = await fetch(`${INCH_URL}/${chainId}/address/${walletAddress}${query}`, options)

  if (ordersResponse.ok) {
    const orders = await ordersResponse.json()
    let tokenInfo = {}

    const addresses = [...new Set(orders.flatMap(order => [order.data.makerAsset, order.data.takerAsset]))]
    const chain = Object.values(viemChains).find(chain => chain.id.toString() === chainId)
    const client = createPublicClient({ 
      chain: chain,
      transport: http()
    })

    for (let address of addresses) {
      if (assets[address]) {
        tokenInfo[address] = {
          decimals: assets[address].decimals,
          symbol: assets[address].symbol
        }
      } else {
        const info = await getInfo(address, client)
        tokenInfo[address] = {
          decimals: info.decimals,
          symbol: info.symbol,
        }
      }
    }

    const list = orders
      .filter(order => {
        return tokenInfo[order.data.makerAsset.toLowerCase()] && tokenInfo[order.data.takerAsset.toLowerCase()]
      })
      .map(order => formatter(order, tokenInfo[order.data.makerAsset.toLowerCase()], tokenInfo[order.data.takerAsset.toLowerCase()], network))

    res.status(200).json(list)
    return
  }
  res.status(400).json([])
}

export default handler

  // let transactions = {
  //   buy: [],
  //   sell: [],
  // }

  // if (network.tegroSubgraphUrl) {
  //   const apolloClient = new ApolloClient({
  //     uri: network.tegroSubgraphUrl,
  //     cache: new InMemoryCache(),
  //     connectToDevTools: true,
  //   })
  
  //   const apolloQuery = {
  //     buy: gql`
  //       {
  //         tradeSuccessfuls(
  //           where: {
  //             and: [
  //               {taker: "0xe12a7327e660d1f05192eeae4e36f7b5dbbf7251", makerAsset: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"}
  //             ]
  //           }
  //           first: 1
  //           orderBy: blockTimestamp
  //           orderDirection: desc
  //         ) {
  //           id
  //           maker
  //           taker
  //           makerAsset
  //           makerAmount
  //           takerAmount
  //           takerAsset
  //           blockTimestamp
  //         }
  //       }
  //     `,
  //     sell: gql`
  //       {
  //         tradeSuccessfuls(
  //           where: {
  //             and: [
  //               {taker: "0xe12a7327e660d1f05192eeae4e36f7b5dbbf7251", takerAsset: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"}
  //             ]
  //           }
  //           orderBy: blockTimestamp
  //           orderDirection: desc
  //           first: 1
  //         ) {
  //           id
  //           maker
  //           taker
  //           makerAsset
  //           makerAmount
  //           takerAmount
  //           takerAsset
  //           blockTimestamp
  //         }
  //       }
  //     `
  //   }
  //   const [buy, sell] = await Promise.all([
  //     apolloClient.query({query: apolloQuery.buy}),
  //     apolloClient.query({query: apolloQuery.sell}),
  //   ])
  //   transactions = {
  //     buy: buy.data.tradeSuccessfuls,
  //     sell: sell.data.tradeSuccessfuls,
  //   }

  //   console.log('transactions', transactions)
  // }
