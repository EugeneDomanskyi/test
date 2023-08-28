import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import { usePropsHelper } from '@/myhooks/props-helper'

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

export default function Markets() {
  const router = useRouter()
  const { isMobile } = usePropsHelper()

  const [marketId] = router.query.marketId || []
  const { loading } = useSelector(({ $collection }) => $collection)
  console.log('marketId', marketId);

  useEffect(() => {
    fetch('https://strapi.tegro.com/api/markets', {method: 'GET', headers: { Authorization: `Bearer ${token}` }})
      .then((res) => res.json())
      .then(({data}) => {
        console.log('data', data);
        const [currentMarket] = data.filter(item => {
          console.log('item.attributes.token_metadata[0].contract_address', item.attributes.token_metadata[0].contract_address);
          return item.attributes.token_metadata[0].contract_address === marketId
        })

        console.log('currentMarket', currentMarket.attributes);
      })
  }, [])

  return (
    <App.Container>
      <App.Flex sx={{ paddingBottom: 48, paddingTop: 64, overflow: 'hidden' }} gap={32}>
        {
          ! isMobile
            ? <>
                <App.Flex column sx={{flex: .8}}>
                  <Market.Details />
                </App.Flex>

                <App.Flex column  sx={{flex: .3, height: 1000}} gap={48}>
                  <Market.Trading />
                </App.Flex>
              </>
            : <App.Flex column sx={{paddingTop: 32, width: '100%'}} gap={48}>
                <Info />
                <TradeForm />
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
