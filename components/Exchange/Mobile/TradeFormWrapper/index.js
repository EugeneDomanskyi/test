import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'

import $app from '@/store/app'

import App from '@/components/App'
import TradeForm from '@/components/Exchange/TradeForm'

const OrderProceed = dynamic(import('@/components/Exchange/OrderProceed'), {ssr: false})
const OrderConfirm = dynamic(import('@/components/Exchange/OrderConfirm'), {ssr: false})

const TradeFormWrapper = forwardRef(({ item, side, type, onClose }, ref) => {
  const [tradeState, setTradeState] = useState('form')
  const [orderProps, setOrderProps] = useState({})

  const blockchain = useSelector($app.get.blockchain)

  const tradeForm = useRef()

  const OrderFlow = blockchain?.useBackend ? OrderConfirm : OrderProceed

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      tradeForm.current.setForm(data)
    }
  }))

  useEffect(() => {
    if (side && tradeForm.current) {
      tradeForm.current.setSide(side)
    }
  }, [side])

  const handleFormSubmit = (props) => {
    setOrderProps(props)
    setTradeState('order-proceed')
  }
  
  const handleBackToForm = () => {
    setTradeState('form')
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const ComponentCurrent = () => {
    switch (tradeState) {
      case 'form': return (
        <TradeForm
          ref={tradeForm}
          type={type}
          version="mobile"
          fullWidth
          current={item}
          prevProps={orderProps}
          onSubmit={handleFormSubmit}
        />
      )
      case 'order-proceed': return (
        <OrderFlow
          version="mobile"
          onBack={handleBackToForm}
          onClose={handleClose}
          {...orderProps}
        />
      )
      default: return null
    }
  }

  return (
    <App.Flex>
      {ComponentCurrent()}
    </App.Flex>
  )
})

export default TradeFormWrapper