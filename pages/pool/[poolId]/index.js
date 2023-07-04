import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import numeral from 'numeral'
import { useSelector } from 'react-redux'
import Image from 'next/image'

import { getPoolDayData, getPool } from '@/libs/query.lib'
import $app from '@/store/app'

import App from '@/components/App'

const CHART_OPTIONS = [
  {key: 'volume', title: 'Volume', field: 'volumeUSD'},
  {key: 'liquidity', title: 'Liquidity', field: 'tvlUSD'},
  {key: 'fees', title: 'Fees', field: 'feesUSD'},
]

const USDTImage = 'https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/polygon/assets/0xc2132D05D31c914a87C6611C10748AEb04B58e8F/logo.png'
const CHART_SECTION_HEIGHT = 450
const CHART_HEIGHT = 400

const Chart = dynamic(() => import('@/components/Chart'), {
  ssr: false
})

const PoolPage = () => {
  const router = useRouter()
  const { poolId } = router.query

  const tokens = useSelector(({$app}) => $app.tokens)
  const token = useSelector($app.get.token('poolId', poolId))

  const [poolData, setPoolData] = useState({})
  const [chartData, setChartData] = useState([])
  const [chartView, setChartView] = useState(CHART_OPTIONS[0].key)
  const [isShowTooltip, setIsShowTooltip] = useState(false)

  useEffect(() => {
    if (poolId) {
      getPool(poolId).then(res => {
        setPoolData(res)
      })
      getPoolDayData(poolId).then(res => {
        setChartData(res)
      })
    }
  }, [poolId])

  const handleChangeTab = tab => {
    setChartView(tab)
  }

  return (
    <App.Flex column sx={{paddingTop: 64}}>
      <App.Container sx={{paddingTop: 16}}>
        <App.Flex column gap={16}>
          <App.Text size={24}>{ poolData.token0?.symbol } / { poolData.token1?.symbol  }</App.Text>
          <App.Card>
            <App.Flex align="center" sx={{marginBottom: 10}}>
              <Image src={token?.image} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
              <App.Text size={16}>1 { poolData.token0?.symbol } = { numeral(poolData.token1Price).format('0.[0000]') } { poolData.token1?.symbol }</App.Text>
            </App.Flex>

            <App.Flex align="center">
              <Image src={USDTImage} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
              <App.Text size={16}>1 { poolData.token1?.symbol } = { numeral(poolData.token0Price).format('0.[0000]') } { poolData.token0?.symbol }</App.Text>
            </App.Flex>
          </App.Card>

          <App.Flex gap={16} sx={{height: CHART_SECTION_HEIGHT}}>
            <App.Card style={{flex: 1}}>
              <App.Text sx={{marginBottom: 10}}>Total Tokens Locked</App.Text>

              <App.Flex align="center" sx={{marginBottom: 10}}>
                <Image src={token?.image} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
                <App.Text size={16}>{ poolData.token0?.symbol }</App.Text>
                <App.Text size={16} sx={{marginLeft: 'auto'}}>{ numeral(poolData.totalValueLockedToken0).format('$0.00a') }</App.Text>
              </App.Flex>

              <App.Flex align="center" sx={{marginBottom: 16}}>
                <Image src={USDTImage} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
                <App.Text size={16}>{ poolData.token1?.symbol }</App.Text>
                <App.Text size={16} sx={{marginLeft: 'auto'}}>{ numeral(poolData.totalValueLockedToken1).format('$0.00a') }</App.Text>
              </App.Flex>

              <App.Text size={16} color="rgb(195, 197, 203)">TVL</App.Text>
              <App.Text size={24}>{numeral(poolData.totalValueLockedToken1).format('$0.00a')}</App.Text>
              <App.Text size={16} sx={{marginBottom: 16}}></App.Text>
              <App.Text size={16} color="rgb(195, 197, 203)">Volume 24h</App.Text>
              <App.Text size={24}>{numeral(poolData.totalValueLockedToken1).format('$0.00a')}</App.Text>
              <App.Text size={16} sx={{marginBottom: 16}}></App.Text>
              <App.Text size={16} color="rgb(195, 197, 203)">24h Fees</App.Text>
              <App.Text size={24}>{numeral(poolData.totalValueLockedToken1).format('$0.00a')}</App.Text>
              <App.Text size={16} sx={{marginBottom: 16}}></App.Text>
            </App.Card>

            <App.Card>
              <App.Flex justify={'flex-end'} sx={{marginBottom: 16}}>
                <App.Tabs
                  width={250}
                  options={CHART_OPTIONS}
                  onChange={handleChangeTab}
                  active={chartView}
                />
              </App.Flex>

              <Chart
                width={1000}
                height={CHART_HEIGHT}
                data={chartData}
                dataKey={CHART_OPTIONS.find(o => o.key === chartView).field}
                onShowTooltip={() => setIsShowTooltip(true)}
                onHideTooltip={() => setIsShowTooltip(false)} />
            </App.Card>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default PoolPage
