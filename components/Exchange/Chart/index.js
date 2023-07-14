import styles from './styles.module.scss'
import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'

import { createChart, ColorType } from 'lightweight-charts'
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
    background: { type: ColorType.Solid, color: 'rgba(255, 255, 255, 0.0)' },
    textColor: 'rgba(255, 255, 255, 0.8)',
  },
  grid: {
    vertLines: { color: 'rgba(161, 159, 255, 0.2)' },
    horzLines: { color: 'rgba(161, 159, 255, 0.2)' },
  },
  timeScale: {
    borderColor: 'rgba(161, 159, 255, 0.2)',
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
    scaleMargins: {
      top: 0.2,
      bottom: 0,
    }
  },
  leftPriceScale: {
    visible: false,
  },
}

const TradeChart = (props) => {
  const kLineData = useSelector($exchange.get.kLineData())

  const wrapperRef = useRef(null)
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const candlestickSeriesRef = useRef([])

  useEffect(() => {
    buildChart()
  }, [])

  useEffect(() => {
    if (kLineData.length) {
      updateChart()
    }
  }, [kLineData])

  const buildChart = () => {
    chartRef.current = createChart(containerRef.current, {
      ...CHART_CONFIG,
      width: wrapperRef.current.offsetWidth,
      height: 400,
    })
    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({...TYPES_SETTINGS['candlesticks']})
  }

  const updateChart = () => {
    candlestickSeriesRef.current.setData(kLineData)
    chartRef.current.timeScale().setVisibleLogicalRange({ from: kLineData.length-40, to: kLineData.length-1})
  }

  return (
    <div ref={wrapperRef}>
      <div ref={containerRef} />
    </div>
  )
}

export default TradeChart
