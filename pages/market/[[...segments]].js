import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { usePropsHelper } from '@/myhooks/props-helper'
import { CHAINS } from '@/config'
import { getApolloClient, queries } from '@/api_services/graphql'
import { template } from '@/store/token'
import { getPrices } from '@/api_services/coingecko'
import coingeckoAssets from '@/public/files/coingecko_ids'
import $exchange from '@/store/exchange'

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

import assetsFile from '@/public/files/assets_new.json'

const token = 'fc873434915ecf9e639339b325338f768e1f5b81fc88e3e4299641a3f87de70fcf93c09316c0d1e5146fa36171076ead7c5797f1d1882f35a9f60aaf5ec065ad7757b0615886847a307d3b25dbaadb42b98d63c59a39744667ff3f5438393a87f3b63ce948bfb260ac0041c44dbe0a10e1646dfa8f8d2c85abd18e45c0bb02c6'

const getToken = async (url, id) => {
  const client = getApolloClient(url)
  const res = await client.query({
    query: queries.tokenById,
    variables: {id: id}
  })
  return res.data.token && res.data.token.symbol !== 'unknown' ? res.data.token : null
}

export default function Markets({}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isMobile } = usePropsHelper()

  const activeInterval = useSelector(({$exchange}) => $exchange.interval)
  const [marketInfo, setMarketInfo] = useState({})

  const [queryMarketType, queryBlockchainCode, queryMarketId] = router.query.segments || []

  console.log(marketInfo)

  const currentChain = CHAINS.find(chain => chain.code === queryBlockchainCode)

  useEffect(() => {
    getMarket()
  }, [])

  const getMarket = async () => {
    const token = await getToken(currentChain.baseUniswapUrl, queryMarketId)
    if (token) {
      setMarketInfo(template(token))
      const id = {[coingeckoAssets[currentChain.platform][token.id]]: token.id}
      const prices = await getPrices(id)
      setMarketInfo(template({...token, ...Object.values(prices)[0]}))
    }
  }

  useEffect(() => {
    if (marketInfo.id) {
      $exchange.api.get.tokenChartData(marketInfo.id, currentChain.code, activeInterval.seconds).then(res => {
        if (res) {
          dispatch($exchange.set.chartData({type: 'tokens', data: res.data}))
          return
        }
        dispatch($exchange.set.chartData({type: 'tokens', data: []}))
      })
    }
  }, [marketInfo.id, activeInterval.seconds])

  return (
    <>
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
                      <Info type={queryMarketType} marketInfo={marketInfo} />
                      <TradeForm
                        current={marketInfo}
                        type={queryMarketType}
                      />
                      <OrderBook
                        type={queryMarketType}
                        onClickOrder={handleClickOrder}
                      />
                      <LivePrice marketInfo={marketInfo} />
                      <Stats marketInfo={marketInfo} />
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