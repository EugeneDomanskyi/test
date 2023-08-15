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


export default function Markets() {
  const router = useRouter()
  const { isMobile } = usePropsHelper()

  const [marketId] = router.query.marketId || []
  const { loading } = useSelector(({ $collection }) => $collection)
  console.log('marketId', marketId);

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
