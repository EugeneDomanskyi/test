import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import $app from '@/store/app'
import $token from '@/store/token'
import $orders from '@/store/orders'
import $portfolio from '@/store/portfolio'

import useWagmiHelper from '@/myhooks/useWagmiHelper'
import Socket from '@/libs/ws.lib'

import App from '@/components/App'
import TradeFormWrapper from '@/components/Exchange/Mobile/TradeFormWrapper'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import Orders from '@/components/Exchange/Orders'

import styles from './styles.module.scss'

const Chart = dynamic(() => import('@/components/Exchange/Chart'), {ssr: false})

const formatNumber = (number) => {
  if (number < 1e3) {
    return number.toString()
  } else if (number < 1e6) {
    return (number / 1e3).toFixed(1) + ' K'
  } else if (number < 1e9) {
    return (number / 1e6).toFixed(1) + ' M'
  } else {
    return (number / 1e9).toFixed(1) + ' B'
  }
}

const Mobile = forwardRef((_, ref) => {
  const router = useRouter()
  const [queryAddress] = router.query.address || []
  const address = queryAddress ? queryAddress?.toLowerCase() : ''
  const queryBlockchainCode = router.query.blockchain

  const { wallet } = useWagmiHelper()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const socketConnected = useSelector(({ $app }) => $app.socketConnected)
  const updatePortfolio = useSelector(({ $portfolio }) => $portfolio.update)
  const isApp = useSelector(({ $app }) => $app.isApp)
  const list = useSelector(({ $token }) => $token.all)
  const item = useSelector(({ $token }) => $token.current)
  const sort = useSelector(({ $token }) => $token.sort)

  const [sortBy, sortDirection] = sort.split(':')

  const [tab, setTab] = useState('charts')
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)
  const [tradeSide, setTradeSide] = useState()
  const [chartTop, setChartTop] = useState([])
  
  const tradeForm = useRef()

  const tabs = [
    { key: 'charts', title: 'Charts' },
    { key: 'orderbook', title: 'Orderbook' },
    { key: 'trades', title: 'Trades' },
    { key: 'orders', title: 'My Orders' },
  ]

  useImperativeHandle(ref, () => ({
    handleClickOrder: (order) => {
      handleClickOrder(order)
    }
  }))

  useEffect(() => {
    Socket.on('order_placed', 'my_orders', (data) => {
      dispatch($orders.set.add(data))
    })
    
    Socket.on('order_submitted', 'my_orders', (data) => {
      dispatch($orders.set.update(data))
    })
  }, [wallet, item?.id])

  useEffect(() => {
    if (wallet && socketConnected) {
      Socket.subscribe(wallet)

      return () => {
        Socket.unsubscribe(wallet)
      }
    }
  }, [wallet, socketConnected])

  useEffect(() => {
    if (isApp, wallet && blockchain?.id) {
      getPortfolio()
    }
  }, [isApp, wallet, blockchain?.id])

  useEffect(() => {
    if (isApp, updatePortfolio) {
      getPortfolio()
      dispatch($portfolio.set.update(false))
    }
  }, [isApp, updatePortfolio])

  useEffect(() => {
    if (item?.id) {
      setChartTop([
        {value: formatNumber(item.volume ?? 0), text: 'Vol'},
        {value: formatNumber(item.high ?? 0), text: 'High'},
        {value: formatNumber(item.low ?? 0), text: 'Low'},
      ])
    } else {
      fetchToken(address)
    }
  }, [item?.id])

  const fetchToken = async (currentAddress) => {
    const existInList = list.find(item => item.id === currentAddress)
    if (!existInList) {
      const id = `${blockchain.id}_${currentAddress}_${blockchain.token?.address}`
      const res = await $token.api.all({
        page: 1,
        page_size: 1,
        chain_id: blockchain.id,
        sort_by: sortBy,
        sort_order: sortDirection,
        market_id: id,
        verified: true,
      })

      if (res.success && res.data.length) {
        dispatch($token.set.current(res.data[0]))
      }
    } else {
      dispatch($token.set.current(existInList))
    }
  }

  const getPortfolio = async () => {
    const result = await $portfolio.api.details({ wallet, blockchain })
    if (result?.success) {
      dispatch($portfolio.set.details({...result, blockchain}))
    } else {
      dispatch($portfolio.set.details({data: [], blockchain}))
    }
  }

  const handleBack = () => {
    const page = router.pathname.split('/').filter(item => item != '')[0]
    router.push(`/${page}/${queryBlockchainCode}/`)
  }

  const handleTabChange = (value) => {
    setTab(value)
  }

  const handleTradeFormOpen = (side) => () => {
    setTradeSide(side)
    setIsTradeDialogOpen(true)
  }

  const handleTradeDialogClose = () => {
    setIsTradeDialogOpen(false)
  }

  const handleClickOrder = useCallback(async order => {
    setIsTradeDialogOpen(true)
    setTimeout(() => {
      tradeForm.current.setForm({formType: 'market', amount: order.quantity, price: order.price, side: order.side})
    }, 300)
  }, [])

  return (
    <App.Flex column full gap={16}>
      <App.Flex row align="center" justify="space-between" sx={{ padding: '8px 8px 0' }}>
        <App.Flex row align="center" gap={8}>
          <App.Flex row align="center" className={styles.back} onClick={handleBack} fullWidth>
            <App.Icon icon="chevron-left" width={24} height={24} color="#fff" />
          </App.Flex>

          <App.Flex row align="center" gap={8}>
            {item.image ? (
              <Image src={item.image} priority width={50} height={50} className={styles.image} alt="" />
            ) : (
              <div className={styles.emptyImage} />
            )}

            <App.Flex column sx={{ maxWidth: 170 }}>
              <App.Text nowrap uppercase size={16} weight={600}>{item.symbol ?? item?.slug}<App.Text inline color="#B9B8C5" size={10} weight={600} >/{item?.name ? item.name.split('/')[1] : 'USDT'}</App.Text></App.Text>
              <App.Text nowrap size={12} color="#5E5C6B">{item.name}</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex column>
          <App.Text right size={16} weight={600}>${ item.price }</App.Text>
          <App.Flex row align="center" justify="flex-end" gap={2}>
            <App.Icon icon="caret-down" width={10} height={10} color={item.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${item.ticker?.type == 'plus' ? '180deg' : '0deg'})`}} />
            <App.Text size={12} color={item.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ item.ticker?.value }%</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex column gap={16} sx={{ padding: '0 8px' }} flex={1}>
        <App.Tabs options={tabs} active={tab} onChange={handleTabChange} height={22} variant={`mobile${isApp ? '-app' : ''}`} />

        <App.Flex column flex={1} sx={{ position: 'relative' }}>
          {(currentTab => {
            switch (currentTab) {
              case 'charts':
                return (
                  <App.Flex className={styles.absolute}><Chart version="mobile" showSwitch top={chartTop} /></App.Flex>
                )
              case 'orderbook':
                return (
                  <OrderBook version="mobile" onClickOrder={handleClickOrder} />
                )
              case 'trades':
                return (
                  <Sales version="mobile" onClickSale={handleClickOrder} />
                )
              case 'orders':
                return (
                  <Orders current={item} version="mobile" onClickOrder={handleClickOrder} />
                )
              default: return null
            }
          })(tab)}
        </App.Flex>
      </App.Flex>

      <App.Flex column height={91} justify="flex-end">
        <App.Hr color="#1F1C30" />

        <App.Flex row gap={16} sx={{ padding: '16px' }}>
          <App.Flex flex={1}>
            <App.Button xl fullWidth variant="success" onClick={handleTradeFormOpen('buy')}>BUY</App.Button>
          </App.Flex>

          <App.Flex flex={1}>
            <App.Button xl fullWidth variant="danger" onClick={handleTradeFormOpen('sell')}>SELL</App.Button>
          </App.Flex>
        </App.Flex>

        <App.Dialog open={isTradeDialogOpen} hideHeader onClose={handleTradeDialogClose}>
          <TradeFormWrapper
            ref={tradeForm}
            item={item}
            side={tradeSide}
            onClose={handleTradeDialogClose}
          />
        </App.Dialog>
      </App.Flex>
    </App.Flex>
  )
})

export default Mobile