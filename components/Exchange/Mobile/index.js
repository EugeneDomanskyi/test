import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'
import useUtils from '@/myhooks/utils'

import $app from '@/store/app'

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

const Mobile = forwardRef(({ item, onOrdersUpdate }, ref) => {
  const router = useRouter()
  const queryBlockchainCode = router.query.blockchain

  const { wallet, getAddress, getBalance, getPrice } = useWalletConnect()
  const { formatWithPrecision } = useUtils()

  const blockchain = useSelector($app.get.blockchain)
  const infoList = useSelector(({ $token }) => $token.infoList)

  const [bottomHeight, setBottomHeight] = useState(91)
  const [tab, setTab] = useState('charts')
  const [tabs, setTabs] = useState([
    { key: 'charts', title: 'Charts' },
    { key: 'orderbook', title: 'Orderbook' },
    { key: 'trades', title: 'Trades' },
    { key: 'orders', title: 'My Orders' },
  ])
  const [balance, setBalance] = useState({ currency: 0, usd: 0, usdt: 0, loading: true })
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)
  const [tradeSide, setTradeSide] = useState()
  const [chartTop, setChartTop] = useState([])
  
  const tradeForm = useRef()

  useImperativeHandle(ref, () => ({
    handleClickOrder: (order) => {
      handleClickOrder(order)
    }
  }))

  useEffect(() => {
    // if (getAddress()) {
    //   setBottomHeight(230)
    // } else {
    //   setBottomHeight(91)
    // }

    setTabs(tabs.map(item => {
      if (item.key == 'orders') {
        item.disabled = !wallet
      }
      return item
    }))

    if ( ! wallet && tab == 'orders') {
      setTab('charts')
    }
  }, [wallet])

  useEffect(() => {
    if (item?.id) {
      setChartTop([
        {value: formatNumber(item.volume ?? 0), text: 'Vol'},
        {value: formatNumber(item.high ?? 0), text: 'High'},
        {value: formatNumber(item.low ?? 0), text: 'Low'},
      ])
    }
  }, [item?.id])

  // useEffect(() => {
  //   if (wallet) {
  //     fetchBalance()
  //   }
  // }, [wallet, blockchain.code])

  const fetchBalance = async () => {
    const tempBalance = {
      currency: 0,
      usd: 0,
      usdt: 0,
      loading: true,
    }

    if (item.id) {
      const currency = await getBalance(item.id)
      if (currency) {
        tempBalance.currency = currency
      }
    }

    const cgId = infoList?.[blockchain.platform]?.[item.id]
    if (cgId && tempBalance.currency > 0) {
      const rate = await getPrice(cgId, 'usd')
      tempBalance.usd = rate * tempBalance.currency
    }

    if (blockchain.usdtContract) {
      const usdt = await getBalance(blockchain.usdtContract)
      if (usdt) {
        tempBalance.usdt = usdt
      }
    }

    tempBalance.loading = false
    setBalance(tempBalance)
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
      <App.Flex row align="center" height={72} justify="space-between" sx={{ padding: 8 }}>
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

            <App.Flex column>
              <App.Text nowrap uppercase size={16} weight={600}>{item.symbol}</App.Text>
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
        <App.Tabs options={tabs} active={tab} onChange={handleTabChange} height={38} variant="mobile" />

        <App.Flex column flex={1} sx={{ position: 'relative' }}>
          {(currentTab => {
            switch (currentTab) {
              case 'charts':
                return (
                  <App.Flex className={styles.absolute}><Chart type="tokens" version="mobile" showSwitch top={chartTop} /></App.Flex>
                )
              case 'orderbook':
                return (
                  <OrderBook type="tokens" version="mobile" onClickOrder={handleClickOrder} />
                )
              case 'trades':
                return (
                  <Sales type="tokens" version="mobile" onClickSale={handleClickOrder} />
                )
              case 'orders':
                return (
                  <Orders current={item} version="mobile" type="tokens" onOrderCancelled={onOrdersUpdate} onClickOrder={handleClickOrder} />
                )
              default: return null
            }
          })(tab)}
        </App.Flex>
      </App.Flex>

      <App.Flex column height={bottomHeight} justify="flex-end">
        {/* {wallet ? (
          <App.Flex column gap={8} sx={{ padding: '0 8px' }}>
            <App.Text szie={16} color="#878598" height={1}>My Balance</App.Text>

            <App.Flex column gap={8} className={styles.balanceBox}>
              <App.Flex row align="center" justify="space-between">
                <App.Flex column>
                  <App.Text size={16} weight={700}>{item.symbol}</App.Text>
                  <App.Text size={14} color="#5E5C6B">{item.name}</App.Text>
                </App.Flex>

                <App.Flex column>
                  {balance.loading ? <App.Loader size={16} /> : <App.Text right size={16} weight={700}>{formatWithPrecision(balance.currency, 6, 1)}</App.Text>}
                  {balance.loading ? <App.Loader size={14} /> : <App.Text right size={14} color="#5E5C6B">${formatWithPrecision(balance.usd, 6, 1)}</App.Text>}
                </App.Flex>
              </App.Flex>

              <App.Hr color="#1D1937" />

              <App.Flex row align="center" justify="space-between">
                <App.Flex column>
                  <App.Text size={16} weight={700}>USDT</App.Text>
                </App.Flex>

                <App.Flex column>
                  {balance.loading ? <App.Loader size={16} /> : <App.Text right size={16} weight={700}>${formatWithPrecision(balance.usdt, 6, 1)}</App.Text>}
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        ) : null} */}

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