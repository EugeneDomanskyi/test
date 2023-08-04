import { useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'

import TradeForm from '@/components/Exchange/TradeForm'
import OrderBook from '@/components/Exchange/OrderBook'

import App from '@/components/App'

export default function Trading() {
  const tradeForm = useRef(null)

  const handleClickOrder = useCallback(order => {
    tradeForm.current.setForm({formType: 'market', amount: order.quantity, side: order.side})
  }, [])

  return (
    <App.Flex column sx={{paddingTop: 64}} gap={16}>
      <App.Flex justify="center">
        <TradeForm ref={tradeForm} fullWidth />
      </App.Flex>

      <App.Flex justify="center">
        <OrderBook onClickOrder={handleClickOrder} />
      </App.Flex>
    </App.Flex>
  )
}
