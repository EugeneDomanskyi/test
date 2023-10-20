import styles from './styles.module.scss'
import { useRef, useEffect, memo, useState } from 'react'
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

const TradeChart = ({type, version, showSwitch}) => {
  const dispatch = useDispatch()
  
  const activeInterval = useSelector(({$exchange}) => $exchange.interval)
  const kLineData = useSelector($exchange.get.kLineData(activeInterval))
  const tokenChartData = useSelector($exchange.get.chartData)

  const chartData = type === 'nfts' ? kLineData : tokenChartData

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
    areaSeriesRef.current = chartRef.current.addAreaSeries({...TYPES_SETTINGS['area']})
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
      <App.Flex row align="center" justify="space-between" gap={16}>
        <App.Flex row align="center" flex={[null, 1]} className={styles.intervalBox}>
          {INTERVALS.map((interval, i) => {
            const isActive = activeInterval.key === interval.key
            return (
              <App.Flex key={i} center flex={1} onClick={handleChangeInterval(interval)} className={cn(styles.interval, {[styles.active]: isActive})}>
                <App.Text weight={500} color={isActive ? 'rgba(255,255,255,0.87)' : "#ACA3D3"} size={14}>{ interval.key.toUpperCase() }</App.Text>
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
    <App.Flex column gap={16} flex={1} className={cn(styles.container, {[styles[version]]: version})}>
      {version != 'mobile' ? ComponentIntervals() : null}

      <div ref={wrapperRef} style={{flex: 1}}>
        <div ref={containerRef} />
      </div>

      {version == 'mobile' ? ComponentIntervals() : null}
    </App.Flex>
  )
}

const isEqual = (prevProps, nextProps) => {
  return prevProps.type === nextProps.type &&
    prevProps.variant === nextProps.variant
}

export default memo(TradeChart, isEqual)
