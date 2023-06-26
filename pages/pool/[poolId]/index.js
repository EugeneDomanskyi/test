import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Container } from '@mui/material'
import numeral from 'numeral'
import { useSelector } from 'react-redux'
import Image from 'next/image'

import { getPoolDayData, getPool } from '@/libs/query.lib'
import $app from '@/store/app'

import AppFlex from '@/components/App/AppFlex'
import AppText from '@/components/App/AppText'
import AppCard from '@/components/AppCard'
import AppTabs from '@/components/AppTabs'

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
    setChartView(tab.key)
  }

  return (
    <AppFlex column sx={{paddingTop: 64}}>
      <Container maxWidth="xl" sx={{paddingTop: 2}}>
        <AppFlex column gap={16}>
          <AppText size={24}>{ poolData.token0?.symbol } / { poolData.token1?.symbol  }</AppText>
          <AppCard>
            <AppFlex align="center" sx={{marginBottom: 10}}>
              <Image src={token?.image} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
              <AppText size={16}>1 { poolData.token0?.symbol } = { numeral(poolData.token1Price).format('0.[0000]') } { poolData.token1?.symbol }</AppText>
            </AppFlex>
            <AppFlex align="center">
              <Image src={USDTImage} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
              <AppText size={16}>1 { poolData.token1?.symbol } = { numeral(poolData.token0Price).format('0.[0000]') } { poolData.token0?.symbol }</AppText>
            </AppFlex>
          </AppCard>
          <AppFlex gap={16} sx={{height: CHART_SECTION_HEIGHT}}>
            <AppCard style={{flex: 1}}>
              <AppText sx={{marginBottom: 10}}>Total Tokens Locked</AppText>
              <AppFlex align="center" sx={{marginBottom: 10}}>
                <Image src={token?.image} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
                <AppText size={16}>{ poolData.token0?.symbol }</AppText>
                <AppText size={16} sx={{marginLeft: 'auto'}}>{ numeral(poolData.totalValueLockedToken0).format('$0.00a') }</AppText>
              </AppFlex>
              <AppFlex align="center" sx={{marginBottom: 16}}>
                <Image src={USDTImage} width={30} height={30} alt="" style={{borderRadius: '50%', marginRight: 10}} />
                <AppText size={16}>{ poolData.token1?.symbol }</AppText>
                <AppText size={16} sx={{marginLeft: 'auto'}}>{ numeral(poolData.totalValueLockedToken1).format('$0.00a') }</AppText>
              </AppFlex>
              <AppText size={16} color="rgb(195, 197, 203)">TVL</AppText>
              <AppText size={24}>{numeral(poolData.totalValueLockedToken1).format('$0.00a')}</AppText>
              <AppText size={16} sx={{marginBottom: 16}}></AppText>
              <AppText size={16} color="rgb(195, 197, 203)">Volume 24h</AppText>
              <AppText size={24}>{numeral(poolData.totalValueLockedToken1).format('$0.00a')}</AppText>
              <AppText size={16} sx={{marginBottom: 16}}></AppText>
              <AppText size={16} color="rgb(195, 197, 203)">24h Fees</AppText>
              <AppText size={24}>{numeral(poolData.totalValueLockedToken1).format('$0.00a')}</AppText>
              <AppText size={16} sx={{marginBottom: 16}}></AppText>
            </AppCard>
            <AppCard>
              <AppFlex justify={'flex-end'} sx={{marginBottom: 16}}>
                <AppTabs
                  width={250}
                  options={CHART_OPTIONS}
                  onChange={handleChangeTab}
                  active={chartView} />
              </AppFlex>
              <Chart
                width={1000}
                height={CHART_HEIGHT}
                data={chartData}
                dataKey={CHART_OPTIONS.find(o => o.key === chartView).field}
                onShowTooltip={() => setIsShowTooltip(true)}
                onHideTooltip={() => setIsShowTooltip(false)} />
            </AppCard>
          </AppFlex>
        </AppFlex>
      </Container>
    </AppFlex>
  )
}

export default PoolPage
