import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client'

import { usePropsHelper } from '@/myhooks/props-helper'
import $collection, { template } from '@/store/collection'
import $exchange from '@/store/exchange'
import $orders from '@/store/orders'

import App from '@/components/App'
import Market from '@/components/Market'
import TradeForm from '@/components/Exchange/TradeForm'
import OrderBook from '@/components/Exchange/OrderBook'
import Trending from '@/components/Market/Trading/Trending'
import Analysis from '@/components/Market/Trading/Analysis'
import Info from '@/components/Market/Details/Info'
import LivePrice from '@/components/Market/Details/LivePrice'
import Stats from '@/components/Market/Details/Stats'
import About from '@/components/Market/Details/About'
import Images from '@/components/Market/Details/Images'
import Ad from '@/components/Market/Details/Ad'
import Team from '@/components/Market/Details/Team'
import Investors from '@/components/Market/Details/Investors'
import Resources from '@/components/Market/Details/Resources'
import FAQ from '@/components/Market/Details/FAQ'

import { getAssetsFile, putAssetsFile } from '@/libs/aws.lib'

const token = 'fc873434915ecf9e639339b325338f768e1f5b81fc88e3e4299641a3f87de70fcf93c09316c0d1e5146fa36171076ead7c5797f1d1882f35a9f60aaf5ec065ad7757b0615886847a307d3b25dbaadb42b98d63c59a39744667ff3f5438393a87f3b63ce948bfb260ac0041c44dbe0a10e1646dfa8f8d2c85abd18e45c0bb02c6'

const prisma = new PrismaClient()

export default function Markets({marketData, marketSales, marketOrders, marketInfo}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isMobile } = usePropsHelper()

  const [queryMarketType, queryBlockchainCode, queryMarketId] = router.query.segments || []

  const current = useSelector(({$collection}) => $collection.current)

  useEffect(() => {
    if (marketData) {
      // console.log('marketData', marketData);
      dispatch($collection.set.current(marketData))
    }

    const obj = [{
      "id": "0x5d843fa9495d23de997c394296ac7b4d721e841c",
      "cgId": "relay-token",
      "address": "0x5d843fa9495d23de997c394296ac7b4d721e841c",
      "decimals": 18,
      "image": "https://assets.coingecko.com/coins/images/17816/large/relay-logo-200.png?1629339288",
      "symbol": "RELAY",
      "currency": "USD",
      "description": "RELAY is a multi cross-chain platform developed to bring BaaS (Bridging as a Service) to help the often fragmented DeFi liquidity space. What is really unique to our bridge is that when a new ecosystem is created, our bridge connects that asset and ecosystem to all the other ones we support. At launch we currently support bridging to Ethereum, BSC, Avalanche, Polygon (Matic), and Heco — with more coming soon. Relay's bridges were first to introduce the bridge gas token faucet to Defi where the bridge itself airdrops the native gas token to new users to reduce friction for people starting out on new chains.\r\n\r\nOur goal at Relay Chain is simple, \"\"Have the best and safest bridge\"\". We will provide value to our token holders by giving them native gas tokens for providing liquidity instead of our native project token (RELAY). By doing this we eliminate all sell pressure to Relay and we can give the highest APY's to Relay Liquidity Providers. This allows us to have a token that provides value, and it's deflationary (via buyback and burns) which is doing with a portion of the gas token profits from bridge transactional volume. The brings the positive feedback loops and true ecosystem synergy into the Relay Chain ecosystem where all partners provide utility to the end users of our platform.",
      "tokenCount": 8823406,
      "discordUrl": null,
      "externalUrl": "https://www.relaychain.com/",
      "twitterUrl": "https://twitter.com/relay_chain",
      "openseaVerificationStatus": null
    }]

    // putAssetsFile(obj)
    getAssetsFile()

    // if (marketSales) {
    //   dispatch($exchange.set.sales(marketSales))
    //   dispatch($orders.set.trades({type: 'nfts', data: marketSales}))
    // }

    // if (marketOrders) {
    //   dispatch($orders.set.orderBook({type: 'nfts', data: marketOrders}))
    // }

    if (marketInfo) {
      dispatch($collection.set.currentMarketSeoInfo(marketInfo))
    }
  }, [marketData, marketSales, marketOrders, marketInfo])

  return (
    <App.Container>
      <App.Flex sx={{ paddingBottom: 48, paddingTop: 64, overflow: 'hidden' }} gap={32}>
        {
          ! isMobile
            ? <>
                <App.Flex column sx={{flex: .8}}>
                  <Market.Details />
                </App.Flex>

                <App.Flex column  sx={{flex: .3}} gap={48}>
                  <Market.Trading />
                </App.Flex>
              </>
            : <App.Flex column sx={{paddingTop: 32, width: '100%'}} gap={48}>
                <Info />
                <TradeForm
                  current={current}
                  type={queryMarketType}
                />
                <OrderBook />
                <LivePrice />
                <Stats />
                <Trending />
                <About />
                <Images />
                <Ad />
                <Team />
                <Investors />
                <Resources />
                <Analysis />
                <FAQ />
              </App.Flex>
        }
      </App.Flex>
    </App.Container>
  )
}

export async function getServerSideProps(context) {
  const [queryMarketType, blockchainCode, address] = context.params.segments
  let marketData = []

  const queryParams = (blockchainCode, page, sortType, searchQuery, customParams) => {
    const [sortBy] = sortType.split(':')

    let orderBy = sortBy.toLowerCase()
    switch (orderBy) {
      case 'volume':
        orderBy = '1DayVolume'
        break
      case 'price':
        orderBy = 'floorAskPrice'
        break
      case 'name':
        orderBy = 'createdAt'
        break
    }

    // Need to make Server Side Sort
    orderBy = '1DayVolume'

    const defaultParams = {
      blockchain: blockchainCode,
      sortBy: orderBy,
      limit: 10,
    }

    if (searchQuery != '') {
      if (isContractAddress(searchQuery)) {
        defaultParams.id = searchQuery
      } else {
        defaultParams.name = searchQuery
      }
    } else {
      defaultParams.minFloorAskPrice = '0.000001'
      // defaultParams.maxFloorAskPrice = process.env.NEXT_PUBLIC_APP_ENV == 'local' ? 0.01 : null
    }

    let continuation = null
    if (page != 'init' && searchQuery == '') {
      continuation = page
    }

    return {
      ...defaultParams,
      ...customParams,
      continuation,
    }
  }

  const result = await $collection.api.all(queryParams(
    blockchainCode,
    null,
    'desc',
    '',
    { id: address, limit: 1 }
  ))
  
  if (result && result.hasOwnProperty('collections')) {
    if (result.collections.length) {
      const [current] = result.collections
      current.blockchain = blockchainCode
      current.currency = null
      // current.currency = network(blockchainCode)?.currency
      marketData = template(current)
    } else {
      console.log('Collection was not found in current blockchain')
    }
  }

  // const marketInfo = await prisma.market.findFirst({
  //   where: {
  //     address: address,
  //   }
  // });

  // marketInfo.createdAt = marketInfo.createdAt.toString()
  // marketInfo.updatedAt = marketInfo.updatedAt.toString()

  // console.log('marketInfo', marketInfo);

  // const marketSales = await $exchange.api.get.sales({
  //   collection: address,
  //   blockchain: blockchainCode,
  //   includeDeleted: false,
  //   includeTokenMetadata: false,
  //   sortDirection: 'desc',
  //   limit: 80,
  // })

  // const marketOrders = await $orders.api.get.nfts.orderBook({
  //   collection: address,
  //   blockchain: blockchainCode,
  // })

  return {
    props: {
      marketData,
      // marketInfo,
      // marketSales,
      // marketOrders
    },
  };
}
