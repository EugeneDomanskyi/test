import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import App from '@/components/App'
import TradeForm from '@/components/Exchange/TradeForm'

const OrderConfirm = dynamic(import('@/components/Exchange/OrderConfirm'), {ssr: false})

const TradeFormWrapper = forwardRef(({ item, side, onClose }, ref) => {
  const [tradeState, setTradeState] = useState('form')
  const [orderProps, setOrderProps] = useState({})

  const tradeForm = useRef()

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
          version="mobile"
          current={item}
          prevProps={orderProps}
          onSubmit={handleFormSubmit}
        />
      )
      case 'order-proceed': return (
        <OrderConfirm
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