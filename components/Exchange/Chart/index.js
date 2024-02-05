import { useRef, useEffect, memo, useState } from 'react'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'
import * as LightweightCharts from 'lightweight-charts'

import $app from '@/store/app'
import $orders from '@/store/orders'

import App from '@/components/App'

import styles from './styles.module.scss'

const TYPES_SETTINGS = {
  candlesticks: {
    upColor: "#53F19C",
    downColor: "#EB3169",
    borderUpColor: "#53F19C",
    borderDownColor: "#EB3169",
    wickUpColor: "#53F19C",
    wickDownColor: "#EB3169",
  },

  area: {
    lineWidth: 1,
    lineColor: '#53F19C',
    topColor: '#53F19C',
    bottomColor: 'rgba(49, 27, 146, 0.2)',
  },
}

const CHART_CONFIG = {
  layout: {
    background: {
      type: LightweightCharts.ColorType.Solid,
      color: 'rgba(255, 255, 255, 0.0)'
    },
    textColor: '#B9B8C5',
    fontFamily: 'GilroyRegular',
    fontSize: 12,
  },
  lineStyle: 0,
  grid: {
    vertLines: { color: 'rgba(161, 159, 255, 0)' },
    horzLines: { color: 'rgba(161, 159, 255, 0.3)', style: 3 },
  },
  timeScale: {
    borderColor: 'transparent',
    tickMarkFormatter: (time) => {
      return moment(time).format('DD MMM HH:mm')
    },
    fixRightEdge: true,
  },
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
  },
  localization: {
    locale: 'en-US',
    dateFormat: 'dd.MM.yyyy',
    timeFormatter: (time) => {
      return moment(time).format('DD.MM.YY HH:mm')
    }
  },
  rightPriceScale: {
    visible: true,
    borderColor: 'transparent',
    scaleMargins: {
      top: 0.2,
      bottom: 0,
    }
  },
  leftPriceScale: {
    visible: false,
  },
  autoSize: true,
}

const INTERVALS = [
  {key: '5m', count: 5, unit: 'minutes', seconds: 5*60},
  {key: '15m', count: 15, unit: 'minutes', seconds: 15*60},
  {key: '1h', count: 1, unit: 'hours', seconds: 60*60},
  {key: '4h', count: 4, unit: 'hours', seconds: 4*60*60},
  {key: '1d', count: 1, unit: 'days', seconds: 24*60*60},
  {key: '1w', count: 1, unit: 'weeks', seconds: 7*24*60*60},
]

const TradeChart = ({ version, showSwitch, top = [] }) => {
  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const current = useSelector(({ $token }) => $token.current)
  const activeInterval = useSelector(({$orders}) => $orders.interval)
  const chartData = useSelector(({ $orders }) => $orders.chart)

  const [variant, setVariant] = useState('candlesticks')

  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const candlestickSeriesRef = useRef([])
  const areaSeriesRef = useRef([])

  useEffect(() => {
    buildChart()
  }, [])

  useEffect(() => {
    if (chartData) {
      updateChart()
    }
  }, [chartData, variant])

  useEffect(() => {
    if (current?.id) {
      fetchTokenChartData()
    }
  }, [current?.id, activeInterval.seconds])

  const fetchTokenChartData = async () => {
    const to = new Date()
    const from = new Date(to)
    from.setDate(to.getDate() - 10)
    const post = {
      market_id: current.marketId,
      chain_id: blockchain.id,
      base_asset: current.id,
      quote_asset: current.quote,
      interval: activeInterval.seconds,
      to: to.getTime(),
      from: from.getTime(),
    }

    const result = await $orders.api.chart(post)
    dispatch($orders.set.chart(result ?? []))
  }

  const handleChangeInterval = (interval) => () => {
    dispatch($orders.set.interval(interval))
  }

  const buildChart = () => {
    if ( ! chartRef.current) {
      chartRef.current = LightweightCharts.createChart(containerRef.current, {
        ...CHART_CONFIG,
      })
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({...TYPES_SETTINGS['candlesticks']})
      areaSeriesRef.current = chartRef.current.addAreaSeries({...TYPES_SETTINGS['area']})
    }
  }

  const updateChart = () => {
    chartRef.current.applyOptions({
      chartType: variant,
    })

    if (variant == 'candlesticks') {
      candlestickSeriesRef.current.setData(chartData)
      candlestickSeriesRef.current.applyOptions({visible: true})
      areaSeriesRef.current.applyOptions({visible: false})
    }

    if (variant == 'area') {
      areaSeriesRef.current.setData(chartData.map(item => ({
        time: item.time,
        value: item.close,
      })))
      candlestickSeriesRef.current.applyOptions({visible: false})
      areaSeriesRef.current.applyOptions({visible: true})
    }

    chartRef.current.timeScale().setVisibleLogicalRange({ from: chartData.length-30, to: chartData.length-1})
  }

  const handleVariantChange = () => {
    setVariant(variant => {
      return variant == 'area' ? 'candlesticks' : 'area'
    })
  }

  const ComponentIntervals = () => {
    return (
      <App.Flex row align="center" justify="space-between" gap={16} className={styles.intervalContainer}>
        <App.Flex row align="center" flex={[null, 1]} className={styles.intervalBox}>
          {INTERVALS.map((interval, i) => {
            const isActive = activeInterval.key === interval.key
            return (
              <App.Flex key={i} center flex={1} onClick={handleChangeInterval(interval)} className={cn(styles.interval, {[styles.active]: isActive})}>
                <App.Text color={isActive ? '#fff' : '#B9B8C5'} size={12}>{ interval.key.toUpperCase() }</App.Text>
              </App.Flex>
            )
          })}
        </App.Flex>

        {showSwitch ? (
          <App.Flex row center className={styles.switcher} onClick={handleVariantChange}>
            <App.Icon icon={variant == 'area' ? 'chart-candles' : 'chart-area'} />
          </App.Flex>
        ) : null}
      </App.Flex>
    )
  }

  return (
    <App.Flex column gap={[0, 8]} className={cn(styles.container, {[styles[version]]: version})}>
      {version != 'mobile' ? ComponentIntervals() : null}

      {top && top.length ? (
        <App.Flex row align="center" justify="space-between">
          {top.map((item, index) => (
            <App.Flex key={index} row gap={4} align="flex-end" sx={{ padding: '0 12px' }}>
              <App.Text size={16} weight={700} color="rgba(255, 255, 255, 0.70)">{item.value}</App.Text>
              <App.Text size={12} color="#5E5C6B">{item.text}</App.Text>
            </App.Flex>
          ))}
        </App.Flex>
      ) : null}

      <div ref={wrapperRef} style={version == 'mobile' ? {height: `calc(100% - ${top.length ? '76px' : '44px'})`} : {height: '100%', position: 'relative', zIndex: 0}}>
        <div ref={containerRef} style={{ height: '100%' }} />
      </div>

      {version == 'mobile' ? ComponentIntervals() : null}
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.version === nextProps.version
    && prevProps.showSwitch === nextProps.showSwitch
    && prevProps.top === nextProps.top
}

export default memo(TradeChart, isEqual)
