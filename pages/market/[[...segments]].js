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
      console.log('marketData', marketData);
      dispatch($collection.set.current(marketData))
    }

    if (marketSales) {
      dispatch($exchange.set.sales(marketSales))
      dispatch($orders.set.trades({type: 'nfts', data: marketSales}))
    }

    if (marketOrders) {
      dispatch($orders.set.orderBook({type: 'nfts', data: marketOrders}))
    }

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

  const marketInfo = await prisma.market.findFirst({
    where: {
      address: address,
    }
  });

  marketInfo.createdAt = marketInfo.createdAt.toString()
  marketInfo.updatedAt = marketInfo.updatedAt.toString()

  console.log('marketInfo', marketInfo);

  const marketSales = await $exchange.api.get.sales({
    collection: address,
    blockchain: blockchainCode,
    includeDeleted: false,
    includeTokenMetadata: false,
    sortDirection: 'desc',
    limit: 80,
  })

  const marketOrders = await $orders.api.get.nfts.orderBook({
    collection: address,
    blockchain: blockchainCode,
  })

  return {
    props: {
      marketData,
      marketInfo,
      // marketSales,
      // marketOrders
    },
  };
}
