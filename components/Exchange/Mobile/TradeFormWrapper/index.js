import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import App from '@/components/App'
import TradeForm from '@/components/Exchange/TradeForm'

const OrderProceed = dynamic(import('@/components/Exchange/OrderProceed'), {ssr: false})

const TradeFormWrapper = ({ item, side, onClose }) => {
  const [tradeState, setTradeState] = useState('form')
  const [orderProps, setOrderProps] = useState({})

  const tradeForm = useRef()

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
          type="tokens"
          version="mobile"
          fullWidth
          current={item}
          prevProps={orderProps}
          onSubmit={handleFormSubmit}
        />
      )
      case 'order-proceed': return (
        <OrderProceed
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
}

export default TradeFormWrapper