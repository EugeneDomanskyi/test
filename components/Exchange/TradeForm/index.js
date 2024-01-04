import styles from './styles.module.scss'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cn from 'classnames'

import $portfolio from '@/store/portfolio'

import App from '@/components/App'
import Tabs from '@/components/Exchange/TradeForm/Tabs'
import TradeFormToken from '@/components/Exchange/TradeForm/TradeFormToken'

const TradeForm = forwardRef(({ version, onSubmit, prevProps }, ref) => {

  const dispatch = useDispatch()
  const current = useSelector(({ $token }) => $token.current)
  const prefill = useSelector(({ $portfolio }) => $portfolio.prefill)

  const [currentTab, setCurrentTab] = useState('buy')

  const tokenFormRef = useRef(null)

  const tabs = [
    { key: 'buy', title: 'BUY', color: 'rgb(13, 198, 109)' },
    { key: 'sell', title: 'SELL', color: 'rgb(206, 22, 93)' },
  ]

  const currentOption = tabs.find(opt => opt.key === currentTab)

  useImperativeHandle(ref, () => ({
    setForm: (data) => {
      handleChangeTab(data.side)
      if (tokenFormRef.current) {
        tokenFormRef.current.setForm({ amount: data.amount, price: data.price })
      }
    },

    setSide: (side) => {
      handleChangeTab(side)
    }
  }))

  useEffect(() => {
    if (prevProps?.side) {
      handleChangeTab(prevProps?.side)
    }
  }, [prevProps?.side])

  useEffect(() => {
    if (prefill.address) {
      if (currentTab != prefill.side) {
        handleChangeTab(prefill.side)
      }

      if (tokenFormRef.current) {
        tokenFormRef.current.setForm({
          amount: prefill.amount,
          side: prefill.side,
        })
      }

      dispatch($portfolio.set.prefill({
        address: null,
        side: 'buy',
        amount: 0,
      }))
    }
  }, [prefill.address])

  const handleChangeTab = tab => {
    setCurrentTab(tab)
  }

  return (
    <App.Flex column className={cn(styles.container, {[styles[version]]: version})}>
      <Tabs
        options={tabs}
        active={currentTab}
        version={version}
        onChange={handleChangeTab}
      />

      <TradeFormToken
        ref={tokenFormRef}
        current={current}
        version={version}
        currentTab={currentTab}
        formOption={currentOption}
        prevProps={prevProps}
        onSubmit={onSubmit}
      />
    </App.Flex>
  )
})

const isEqual = (prev, next) => {
  return prev.version === next.version
    && JSON.stringify(prev.prevProps) === JSON.stringify(next.prevProps)
    && prev.onSubmit === next.onSubmit
}

export default memo(TradeForm, isEqual)
