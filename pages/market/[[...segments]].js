import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { usePropsHelper } from '@/myhooks/props-helper'
import $collection from '@/store/collection'
import $token, { template } from '@/store/token'
import $app from '@/store/app'
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

export default function Markets({marketData, marketSales, marketOrders}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const { isMobile } = usePropsHelper()

  const [queryMarketType, queryBlockchainCode, queryMarketId] = router.query.segments || []

  const marketInfo = useSelector(({$app}) => $app.marketInfo)

  useEffect(() => {
    console.log('marketData', marketData);
    initPage(marketData, marketSales, marketOrders)
    // if (marketData) {
    //   // console.log('marketData', marketData);
    //   dispatch($app.set.marketInfo(marketData))
    // }

    // if (marketSales) {
    //   dispatch($exchange.set.sales(marketSales))
    //   dispatch($orders.set.trades({type: queryMarketType, data: marketSales}))
    // }

    // if (marketOrders) {
    //   dispatch($orders.set.orderBook({type: queryMarketType, data: marketOrders}))
    // }

    // if (marketInfo) {
    //   dispatch($collection.set.currentMarketSeoInfo(marketInfo))
    // }
  }, [marketData, marketSales, marketOrders])

  const initPage = async (data, sales, orders) => {

  }

  return (
    <>
      {
        marketInfo
          ? <Head>
              <title>{`${marketInfo.name} Price, ${marketInfo.symbol ?? 'USDT'} Price Chart & Marketcap | Tegro: The CEX-DEX`}</title>
              <meta name="description" content={`Buy, sell, and trade ${marketInfo.symbol ?? 'USDT'} or ${marketInfo.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${marketInfo.name} at the best prices.`} />
              <meta name="keywords" content="keyword1, keyword2, keyword3" />
              <meta property="og:title" content={`${marketInfo.name} Price, ${marketInfo.symbol ?? 'USDT'} Price Chart & Marketcap | Tegro: The CEX-DEX`} />
              <meta property="og:description" content={`Buy, sell, and trade ${marketInfo.symbol ?? 'USDT'} or ${marketInfo.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${marketInfo.name} at the best prices.`} />
              {/* <meta property="og:image" content="https://example.com/image.jpg" /> */}
            </Head>
          : null
      }      

      <App.Container>
        <App.Flex sx={{ paddingBottom: 48, paddingTop: 64, overflow: 'hidden' }} gap={32}>
          {
            marketInfo
              ? ! isMobile
                  ? <>
                      <App.Flex column sx={{flex: .8}}>
                        <Market.Details type={queryMarketType} marketInfo={marketInfo} />
                      </App.Flex>
    
                      <App.Flex column  sx={{flex: .3}} gap={48}>
                        <Market.Trading type={queryMarketType} marketInfo={marketInfo} />
                      </App.Flex>
                    </>
                  : <App.Flex column sx={{paddingTop: 32, width: '100%'}} gap={48}>
                      <Info type={queryMarketType} />
                      <TradeForm
                        ref={tradeForm}
                        current={marketInfo}
                        type={queryMarketType}
                      />
                      <OrderBook
                        type={queryMarketType}
                        onClickOrder={handleClickOrder}
                      />
                      <LivePrice />
                      <Stats />
                      <Trending />
                      <About />
                      <Images />
                      <Ad />
                      {
                        marketInfo.team
                          ? <Team />
                          : null
                      }
                      {
                        marketInfo.invedtors
                          ? <Investors />
                          : null
                      }
                      
                      <Resources />
                      <Analysis />
                      <FAQ />
                    </App.Flex>
              : null
          }
        </App.Flex>
      </App.Container>
    </>
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

  console.log('queryMarketType', queryMarketType);
  if (queryMarketType === 'nfts') {
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
  } else {
    // const full = await fetch(`https://api.coingecko.com/api/v3/coins/${blockchainCode}/contract/${address.toLowerCase()}`)
    const full = await $token.api.coingecko.full({ platform: blockchainCode, address: address.toLowerCase() })
    console.log('address', address);
    console.log('full', full);
    const info = await $token.api.coingecko.info({ vs_currency: 'usd', ids: [address.toLowerCase()] })
    console.log('info', info);
    let fullToken = {}
    fullToken.full = full
    fullToken.info = info

    // const [priceInfo] = await getInfo([existingToken])
    // const priceTemplate = template({info: priceInfo})
    // mergedData = {...priceTemplate, ...existingToken, currency: priceTemplate.currency}

    // marketData = template(fullToken)
  }
    

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
      marketSales,
      marketOrders
    },
  };
}