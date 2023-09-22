import styles from './styles.module.scss'
import { useRef, useEffect, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import cn from 'classnames'
import * as LightweightCharts from 'lightweight-charts'

import $exchange from '@/store/exchange'

import App from '@/components/App'

const TYPES_SETTINGS = {
  candlesticks: {
    upColor: "#53F19C",
    downColor: "#EB3169",
    borderUpColor: "#53F19C",
    borderDownColor: "#EB3169",
    wickUpColor: "#53F19C",
    wickDownColor: "#EB3169",
  },
}

const CHART_CONFIG = {
  layout: {
    background: {
      type: LightweightCharts.ColorType.Solid,
      color: 'rgba(255, 255, 255, 0.0)'
    },
    textColor: 'rgba(161, 159, 255, 0.4)',
    fontFamily: 'Gilroy',
  },
  lineStyle: 0,
  grid: {
    vertLines: { color: 'rgba(161, 159, 255, 0)' },
    horzLines: { color: 'rgba(161, 159, 255, 0.4)', style: 3 },
  },
  timeScale: {
    borderColor: 'rgba(161, 159, 255, 0.2)',
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
}

const INTERVALS = [
  {key: '5m', count: 5, unit: 'minutes', seconds: 5*60},
  {key: '15m', count: 15, unit: 'minutes', seconds: 15*60},
  {key: '1h', count: 1, unit: 'hours', seconds: 60*60},
  {key: '4h', count: 4, unit: 'hours', seconds: 4*60*60},
  {key: '1d', count: 1, unit: 'days', seconds: 24*60*60},
  {key: '1w', count: 1, unit: 'weeks', seconds: 7*24*60*60},
]

const TradeChart = ({type}) => {
  const dispatch = useDispatch()
  
  const activeInterval = useSelector(({$exchange}) => $exchange.interval)
  const kLineData = useSelector($exchange.get.kLineData(activeInterval))
  const tokenChartData = useSelector($exchange.get.chartData)

  const chartData = type === 'nfts' ? kLineData : tokenChartData

  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const candlestickSeriesRef = useRef([])

  useEffect(() => {
    buildChart()
  }, [])

  useEffect(() => {
    if (chartData) {
      updateChart()
    }
  }, [chartData])

  const handleChangeInterval = (interval) => () => {
    dispatch($exchange.set.interval(interval))
  }

  const buildChart = () => {
    chartRef.current = LightweightCharts.createChart(containerRef.current, {
      ...CHART_CONFIG,
      width: wrapperRef.current.offsetWidth,
      height: wrapperRef.current.offsetHeight,
    })
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({...TYPES_SETTINGS['candlesticks']})
  }

  const updateChart = () => {
    candlestickSeriesRef.current.setData(chartData)
    chartRef.current.timeScale().setVisibleLogicalRange({ from: chartData.length-30, to: chartData.length-1})
  }

  return (
    <div className={styles.container}>
      <App.Flex sx={{marginBottom: 16}}>
        {
          INTERVALS.map((interval, i) => {
            const isActive = activeInterval.key === interval.key
            return (
              <div
                key={i}
                onClick={handleChangeInterval(interval)}
                className={cn(styles.interval, {[styles.active]: activeInterval.key === interval.key})}>
                <App.Text weight={500} color={isActive ? 'rgba(255,255,255,0.87)' : "#ACA3D3"} size={14}>{ interval.key.toUpperCase() }</App.Text>
              </div>
            )
          })
        }
      </App.Flex>
      <div ref={wrapperRef} style={{flex: 1}}>
        <div ref={containerRef} />
      </div>
    </div>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type
}

export default memo(TradeChart, isEqual)
