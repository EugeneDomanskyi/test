import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { usePropsHelper } from '@/myhooks/props-helper'
import { CHAINS } from '@/config'
import { getApolloClient, queries } from '@/api_services/graphql'
import $token, { staticTemplate } from '@/store/token'
import { getPrices } from '@/api_services/coingecko'
import coingeckoAssets from '@/public/files/coingecko_ids'
import $exchange from '@/store/exchange'
import $markets from '@/store/markets'

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
    variables: { id: id }
  })
  return res.data.token && res.data.token.symbol !== 'unknown' ? res.data.token : null
}

export default function Markets({ marketData, currentChain }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isMobile } = usePropsHelper()

  const activeInterval = useSelector(({ $exchange }) => $exchange.interval)

  const [queryMarketType, queryBlockchainCode, queryMarketId] = router.query.segments || []

  const [marketInfo, setMarketInfo] = useState(marketData)

  useEffect(() => {
    console.log('marketInfo', marketInfo);
  }, [marketInfo])

  useEffect(() => {
    if (marketData.id) {
      dispatch($token.set.current(marketInfo))
      $markets.api.strapi(marketInfo.id, token).then(res => {
        if (res.data && res.data.length) {
          const info = res.data[0].attributes
          console.log('info', info);
          const resources = info?.project_data.project.resources.length ? info?.project_data.project.resources : null
          const investors = info?.project_data.project.investors && info?.project_data.project.investors !== "null" ? info?.project_data.project.investors : null
          const team = info?.project_data.project.creator.length ? info?.project_data.project.creator : null
          const description = info?.token_metadata.token.long_description ?? null
          const parent_collection_name = info?.token_metadata.token.parent_collection_name ?? null
          const project_name = info?.token_metadata.token.project_name ?? null
          
          setMarketInfo(state => (
            {
              ...state,
              sampleImages: info?.token_metadata.token.nft_gallery ?? null,
              resources: resources,
              investors: investors,
              team: team,
              ...(description ? {description: description} : null),
              ...(parent_collection_name ? {parent_collection_name: parent_collection_name} : null),
              ...(project_name ? {project_name: project_name} : null),
            }
          ))
        }
      })
      $exchange.api.get.tokenChartData(marketInfo.id, currentChain.code, activeInterval.seconds).then(res => {
        if (res) {
          setMarketInfo(state => (
            {
              ...state,
              charts: true,
            }
          ))
          dispatch($exchange.set.chartData({ type: 'tokens', data: res.data }))
          return
        }

        setMarketInfo(state => (
          {
            ...state,
            charts: null,
          }
        ))
        dispatch($exchange.set.chartData({ type: 'tokens', data: [] }))
      })
    }
  }, [marketData, activeInterval.seconds])

  return (
    <>
      <Head>
        <title>{`${marketInfo.name} Price, ${marketInfo.symbol ?? 'USDT'} Price Chart & Marketcap | Tegro: The CEX-DEX`}</title>
        <meta name="description" content={`Buy, sell, and trade ${marketInfo.symbol ?? 'USDT'} or ${marketInfo.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${marketInfo.name} at the best prices.`} />
        <meta name="keywords" content={`${marketInfo.symbol ?? 'USDT'}, ${marketInfo.name}`} />
        <meta property="og:title" content={`${marketInfo.name} Price, ${marketInfo.symbol ?? 'USDT'} Price Chart & Marketcap | Tegro: The CEX-DEX`} />
        <meta property="og:description" content={`Buy, sell, and trade ${marketInfo.symbol ?? 'USDT'} or ${marketInfo.name} instantly. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${marketInfo.name} at the best prices.`} />
      </Head>
      <App.Container>
        <App.Flex sx={{ paddingBottom: 48, paddingTop: 64, overflow: 'hidden' }} gap={32}>
          {
            marketInfo
              ? !isMobile
                ? <>
                  <App.Flex column sx={{ flex: .8 }}>
                    <Market.Details type={queryMarketType} marketInfo={marketInfo} />
                  </App.Flex>

                  <App.Flex column sx={{ flex: .3 }} gap={48}>
                    <Market.Trading type={queryMarketType} marketInfo={marketInfo} />
                  </App.Flex>
                </>
                : <App.Flex column sx={{ paddingTop: 32, width: '100%' }} gap={48}>
                  <Info type={queryMarketType} marketInfo={marketInfo} />
                  {
                    marketInfo.price
                      ? <TradeForm
                        current={marketInfo}
                        type={queryMarketType}
                      />
                      : null
                  }
                  <OrderBook
                    type={queryMarketType}
                    onClickOrder={handleClickOrder}
                  />
                  <LivePrice marketInfo={marketInfo} />
                  <Stats marketInfo={marketInfo} />
                  <Trending />
                  <About />
                  <Images />
                  {/* <Ad /> */}
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

export async function getServerSideProps({ query }) {
  const blockchainCode = query.segments[1]
  const marketId = query.segments[2]
  const currentChain = CHAINS.find(chain => chain.code === blockchainCode)
  let marketData = {}

  const tokenRes = await getToken(currentChain.baseUniswapUrl, marketId)
  const tokenInfo = await $token.api.coingecko.full({ platform: blockchainCode, address: marketId })

  if (tokenInfo) {
    const token = { ...tokenRes, ...tokenInfo }
    if (token) {
      const full = staticTemplate(token)
      marketData = full
      const id = { [coingeckoAssets[currentChain.platform][full.id]]: full.id }
      const prices = await getPrices(id)

      if (prices) {
        marketData = ({ ...full, ...prices[marketId] })
      }
    }
  }

  return {
    props: {
      marketData,
      currentChain
    },
  }
}