import { useRef, useCallback } from 'react'

import TradeForm from '@/components/Exchange/TradeForm'
import OrderBook from '@/components/Exchange/OrderBook'
import Trending from '@/components/Market/Trading/Trending'
import Analysis from '@/components/Market/Trading/Analysis'

import App from '@/components/App'

export default function Trading({type, marketInfo}) {
  const tradeForm = useRef(null)

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, side: order.side})
  }, [])

  return (
    <App.Flex column justify="center" sx={{paddingTop: 64}} gap={96}>
      <App.Flex column gap={16}>
        <TradeForm ref={tradeForm} type={type} current={marketInfo} fullWidth />
        <OrderBook type={type} onClickOrder={handleClickOrder} />
      </App.Flex>

      <Trending />
      {
        marketInfo.analysis
          ? <Analysis />
          : null
      }
    </App.Flex>
  )
}
