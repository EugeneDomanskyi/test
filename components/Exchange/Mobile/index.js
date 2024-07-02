import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Decimal from 'decimal.js'
import cn from 'classnames'

import $app from '@/store/app'
import $alert from '@/store/alert'
import $token from '@/store/token'
import $orders from '@/store/orders'
import $portfolio from '@/store/portfolio'
import $gem from '@/store/gem'

import useWagmiHelper from '@/myhooks/useWagmiHelper'
import Socket from '@/libs/ws.lib'

import App from '@/components/App'
import TradeFormWrapper from '@/components/Exchange/Mobile/TradeFormWrapper'
import OrderBook from '@/components/Exchange/OrderBook'
import Sales from '@/components/Exchange/Sales'
import Orders from '@/components/Exchange/Orders'
import Markets from '@/components/Exchange/Markets'

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
  const sort = useSelector(({ $token }) => $token.sort)
  const pages = useSelector($token.get.pages)
  const item = useSelector(({ $token }) => $token.current)

  const [sortBy, sortDirection] = sort.split(':')

  const [tab, setTab] = useState('charts')
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)
  const [isMarketsDialogOpen, setIsMarketsDialogOpen] = useState(false)
  const [tradeSide, setTradeSide] = useState()
  const [logo, setLogo] = useState()
  
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
    // Socket.on('order_placed', 'my_orders', (data) => {
    //   dispatch($orders.set.add(data))
    // })
    
    Socket.on('order_submitted', 'my_orders', (data) => {
      dispatch($orders.set.update(data))
    })

    Socket.on('trade_points_rewarded', 'trade_points_rewarded', async (data) => {
      dispatch($alert.set.success({title: '500 Gems Credited'}))

      const result = await $gem.api.referral(wallet)
      if (result) {
        dispatch($gem.set.referral(result))
      }
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
    if (isApp && wallet && blockchain?.id) {
      getPortfolio()
    }
  }, [isApp, wallet, blockchain?.id])

  useEffect(() => {
    if (isApp && updatePortfolio) {
      getPortfolio()
      dispatch($portfolio.set.update(false))
    }
  }, [isApp, updatePortfolio])

  useEffect(() => {
    if (item?.id) {
      setLogo(item.image)
    }

    if (address != '0x') {
      fetchToken(address)
    }
  }, [item?.id, address])

  useEffect(() => {
    fetchTokensList()
  }, [blockchain?.code, sort, pages.current, queryBlockchainCode])

  const fetchTokensList = async () => {
    const result = await $token.api.all({
      page: pages.current,
      page_size: pages.perPage,
      chain_id: blockchain.id,
      sort_by: sortBy,
      sort_order: sortDirection,
      verified: true,
    })

    if (result && result.length) {
      dispatch($token.set.all(result))
      dispatch($token.set.pages({ next: (pages.current * 1 + 1) }))

      if (address == '0x') {
        router.replace(`/exchange/${queryBlockchainCode}/${result[0].base_contract_address.toLowerCase()}`)
      }
    }

    dispatch($token.set.loading(false))
  }

  const fetchToken = async (currentAddress) => {
    const existInList = list.find(item => item.id === currentAddress)
    if (!existInList) {
      const id = `${blockchain.id}_${currentAddress}_${blockchain.token?.address}`
      const result = await $token.api.all({
        page: 1,
        page_size: 1,
        chain_id: blockchain.id,
        sort_by: sortBy,
        sort_order: sortDirection,
        market_id: id,
        verified: true,
      })

      if (result && result.length) {
        dispatch($token.set.current(result[0]))
      }
    } else {
      dispatch($token.set.current(existInList))
    }
  }

  const getPortfolio = async () => {
    const result = await $portfolio.api.details({ wallet, blockchain })
    if (result && result.length) {
      dispatch($portfolio.set.details({data: result, blockchain}))
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

  const handleMarketsDialogClose = () => {
    setIsMarketsDialogOpen(false)
  }

  const handleClickOrder = useCallback(async order => {
    setIsTradeDialogOpen(true)
    setTimeout(() => {
      tradeForm.current.setForm({formType: 'market', amount: order.quantity, price: order.price, side: order.side})
    }, 300)
  }, [])

  const handleMarketsDialogOpen = () => {
    setIsMarketsDialogOpen(true)
  }

  const handleMarketSelect = (item) => {
    dispatch($token.set.current(item))
    router.push(`/exchange/${blockchain.code}/${item.address}`, undefined, { scroll: false })
    setIsMarketsDialogOpen(false)
  }

  return (
    <App.Flex column full>
      <App.Flex column className={cn(styles.info, {[styles.webview]: isApp})}>
        <App.Flex fullWidth className={styles.dropdownBox}>
          <App.Flex row fullWidth align="center" justify="space-between" className={styles.dropdown} onClick={handleMarketsDialogOpen}>
            <App.Flex row aling="center" gap={8}>
              {logo ? (
                <Image src={logo} width={24} height={24} className={styles.image} alt="" onError={() => setLogo(null)} />
              ) : (
                <div className={styles.emptyImage} />
              )}

              <App.Text nowrap uppercase size={16} weight={600}>{item.symbol}/{item.quoteSymbol}</App.Text>
            </App.Flex>

            <App.Icon icon="chevron-right3" />
          </App.Flex>
        </App.Flex>
        
        <App.Flex fullWidth className={styles.numbersBox}>
          <App.Flex row center fullWidth align="flex-start" justify="space-between">
            <App.Flex column gap={8}>
              <App.Text size={20} weight={700} height={1}>${ item.price }</App.Text>
              <App.Flex row align="center" justify="flex-start" gap={2}>
                <App.Text size={14} weight={600} height={1} color={item.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C'}>{ item.ticker?.value }%</App.Text>
                <App.Icon icon="caret-down" width={12} height={12} color={item.ticker?.type == 'minus' ? '#FF1D61' : '#53F19C'} style={{transform: `rotate(${item.ticker?.type == 'plus' ? '180deg' : '0deg'})`}} />
              </App.Flex>
            </App.Flex>

            <App.Flex column gap={4}>
              <App.Flex row align="center" justify="space-between" gap={16}>
                <App.Text size={14} weight={400} height={1} color="#5E5C6B">High</App.Text>
                <App.Text size={14} weight={400} height={1}>{item.high ?? 0} {item.quoteSymbol}</App.Text>
              </App.Flex>

              <App.Flex row align="center" justify="space-between" gap={16}>
                <App.Text size={14} weight={400} height={1} color="#5E5C6B">Low</App.Text>
                <App.Text size={14} weight={400} height={1}>{item.low ?? 0} {item.quoteSymbol}</App.Text>
              </App.Flex>

              <App.Flex row align="center" justify="space-between" gap={16}>
                <App.Text size={14} weight={400} height={1} color="#5E5C6B">Volume</App.Text>
                <App.Text size={14} weight={400} height={1}>{new Decimal(item.volume ?? 0).toDecimalPlaces(2).toFixed()} {item.quoteSymbol}</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex column gap={8} sx={{ padding: '8px 16px 0' }} flex={1}>
        <App.Tabs options={tabs} active={tab} onChange={handleTabChange} height={36} variant={`mobile${isApp ? '-app' : ''}`} />

        <App.Flex column flex={1} sx={{ position: 'relative' }}>
          {(currentTab => {
            switch (currentTab) {
              case 'charts':
                return (
                  <App.Flex className={styles.absolute}><Chart version="mobile" showSwitch /></App.Flex>
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

      <App.Flex column height={73} justify="flex-end">
        <App.Flex row gap={16} className={styles.buttonBox}>
          <App.Flex flex={1}>
            <App.Button large fullWidth variant="success" onClick={handleTradeFormOpen('buy')}>BUY</App.Button>
          </App.Flex>

          <App.Flex flex={1}>
            <App.Button large fullWidth variant="danger" onClick={handleTradeFormOpen('sell')}>SELL</App.Button>
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

        <App.Dialog open={isMarketsDialogOpen} hideHeader fullBody fromRight onClose={handleMarketsDialogClose}>
          <Markets markets={list} onClose={handleMarketsDialogClose} onSelect={handleMarketSelect} />
        </App.Dialog>
      </App.Flex>
    </App.Flex>
  )
})

export default Mobile