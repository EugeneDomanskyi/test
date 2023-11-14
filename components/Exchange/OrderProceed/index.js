import { useState, useEffect, Fragment, useRef } from 'react'
import styles from './styles.module.scss'
import numeral from 'numeral'
import Image from 'next/image'
import cn from 'classnames'
import ProgressBar from 'progressbar.js'

import useWalletConnect from '@/myhooks/wallet-connect'
import Order from '@/libs/structs/Order'
import { INCH_CONTRACTS, TEGRO_FILL_ORDERS_CONTRACTS } from '@/config'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'
import Tabs from './Tabs'

const SIGN_STEPS = [
  {
    name: `🔑 Sign`,
    key: 'approval',
    title: 'Spending Approval',
    description: 'Enable spending of $TOKEN on Tegro',
    current: true,
  }, {
    name: `⚡ TX{index}: Instant`,
    key: 'fill_order',
    title: 'Execute Instant Order',
    description: 'Sign in your wallet',
    current: false,
    signed: false,
  }, {
    name: `⌛ TX{index}: Orderbook Entry`,
    key: 'place_order',
    title: 'Place Order in the Orderbook',
    description: 'Sign your gasless maker order',
    current: false,
    signed: false,
  }
]

const TABS = [
  {
    title: 'Overall Summary',
    key: 'overall',
  }, {
    title: 'Instant Settle',
    key: 'fill_order',
  }, {
    title: 'Limit Order',
    key: 'limit_order',
  }
]

const getErrorAssets = (errorType) => {
  switch (errorType) {
    case 'balance':
      return {
        title: 'Oops!',
        description: 'It looks like your wallet is low on balance'
      }
    case '':
      return {
        title: 'Oops! Rejected',
        description: 'Looks like you cancelled the transaction. Please restart again to continue.'
      }
    default:
      return {
        title: 'Oops!',
        description: 'Something went wrong. Please try again later'
      }
  }
}

const OrderProceed = ({side, blockchain, makerAsset, takerAsset, makerAmountFormatted, takerAmountFormatted, price, version, onClose, onBack}) => {
  const [matchingLoaded, setMatchingLoaded] = useState(false)
  const [step, setStep] = useState('preview')
  const [signSteps, setSignSteps] = useState(SIGN_STEPS)
  const [abilities, setAbilities] = useState({willSpendAmount: 0, willTakeAmount: 0, orders: []})
  const [currentTab, setCurrentTab] = useState('overall')
  const [successOrders, setSuccessOrders] = useState([])
  const [failedOrders, setFailedOrders] = useState([])
  const [results, setResults] = useState({approval: {}, fill_order: {}, place_order: {}})
  const [fillOrderTransactionData, setFillOrderTransactionData] = useState(null)

  const { wallet } = useWalletConnect()

  const progressBarRef = useRef(null)
  const progress = useRef(null)

  const errors = getErrorAssets(results.fill_order.type || results.place_order.type)

  const amountFillOrder = side === 'buy' ? abilities.willTakeAmount : abilities.willSpendAmount
  const amountFillOrderUsdt = side === 'buy' ? abilities.willSpendAmount : abilities.willTakeAmount
  const amountLimitOrder = makerAmountFormatted - amountFillOrder
  const amountLimitOrderUsdt = takerAmountFormatted - amountFillOrderUsdt
  const percentages = {
    sign: numeral(amountFillOrder * 100 / makerAmountFormatted).format('0'),
    limit: numeral(amountLimitOrder * 100 / makerAmountFormatted).format('0'),
  }

  const flowSteps = {
    approval: true,
    fill_order: !!amountFillOrder,
    place_order: !!amountLimitOrder
  }

  const completedOrders = abilities.orders.filter(order => successOrders.find(o => o.args.orderHash === order.orderHash))

  const stats = completedOrders.reduce((acc, order) => ({
    spendedAmount: acc.spendedAmount + order.willSpendTakingAmountFormatted*1,
    tookAmount: acc.tookAmount + order.willTakeMakingAmountFormatted*1,
  }), {spendedAmount: 0, tookAmount: 0})

  stats.spendedAmount = numeral(stats.spendedAmount).format('0.[00000]')
  stats.tookAmount = numeral(stats.tookAmount).format('0.[00000]')

  const completePercentage = numeral(stats.tookAmount*100/abilities.willTakeAmount).format('0')
  
  const stepsInFlow = signSteps.filter(step => flowSteps[step.key]).map((step, i) => ({...step, index: i}))
  const currentSignStep = stepsInFlow.find(step => step.current)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (step === 'result' && currentTab === 'fill_order') {
      progress.current = new ProgressBar.SemiCircle(progressBarRef.current, {
        strokeWidth: 10,
        easing: 'easeInOut',
        duration: 1400,
        color: '#53F19C',
        trailColor: '#5E5C6B',
        trailWidth: 10,
        svgStyle: null
      })
    }
  }, [step, currentTab])

  useEffect(() => {
    if (completePercentage*1 && step === 'result' && currentTab === 'fill_order') {
      progress.current.animate(completePercentage/100)
    }
  }, [completePercentage, step, currentTab])

  const fetchOrders = async () => {
    const res = await Order.TOKEN.getOpenWithPriceLimitation({
      chainId: blockchain.id,
      makerAsset: makerAsset,
      takerAsset: takerAsset,
      amount: makerAmountFormatted,
      price: price,
      side: side,
    })
    setAbilities(res)
    setMatchingLoaded(true)
  }

  const handleDone = () => {
    if (fillOrderTransactionData?.data?.hash) {
      window.open(`${blockchain.scanUrl}/tx/${fillOrderTransactionData?.data?.hash}`, '_blank')
      return
    }
    onClose()
  }

  const handleConfirm = async () => {
    if (!matchingLoaded) {
      return
    }
    trackEvent('Confirm Order Submit', {
      'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
      'Quote Currency': 'USDT',
      'Side': side.toUpperCase(),
      'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
      'Price': numeral(price).format('0.[00000]'),
      'Total': numeral(takerAmountFormatted).format('0.[00000]'),
      'Network': blockchain.code.toUpperCase(),
      'Order Type': (flowSteps.fill_order && flowSteps.place_order) ? 'Hybrid' : (flowSteps.fill_order ? 'Taker' : 'Maker'),
      'Step': 'Confirm',
    })
    setStep('sign')
    const allowances = []
    if (flowSteps.fill_order) {
      allowances.push(() => {
        return Order.Order.checkAllowance(blockchain.id, TEGRO_FILL_ORDERS_CONTRACTS[blockchain.id], wallet, takerAsset.address, takerAmountFormatted*1)
      })
    }
    if (flowSteps.place_order) {
      allowances.push(() => {
        return Order.Order.checkAllowance(blockchain.id, INCH_CONTRACTS[blockchain.id], wallet, takerAsset.address, takerAmountFormatted*1)
      })
    }
    const allowanceResults = await Promise.all(allowances.map(fn => fn()))
    if (allowanceResults.every(res => res.success)) {
      trackEvent('Confirm Order Submit', {
        'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
        'Quote Currency': 'USDT',
        'Side': side.toUpperCase(),
        'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
        'Price': numeral(price).format('0.[00000]'),
        'Total': numeral(takerAmountFormatted).format('0.[00000]'),
        'Network': blockchain.code.toUpperCase(),
        'Order Type': (flowSteps.fill_order && flowSteps.place_order) ? 'Hybrid' : (flowSteps.fill_order ? 'Taker' : 'Maker'),
        'Step': 'Sign',
      })
      if (flowSteps.fill_order) {
        setSignSteps(state => state.map(step => ({...step, current: step.key === 'fill_order'})))
        const fillOrderResult = await Order.TOKEN.fulfill({
          // address: side === 'buy' ? makerAsset.address : takerAsset.address, //current.address,
          amount: amountFillOrder,
          price: price,
          side: side,
          makerAsset,
          takerAsset,
        }, eventHandler).catch(error => {
          return error
        })
        setResults(state => ({...state, fill_order: fillOrderResult}))
        if (!fillOrderResult.success) {
          setStep('error')
          return
        }
        trackEvent('Confirm Order Submit', {
          'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
          'Quote Currency': 'USDT',
          'Side': side.toUpperCase(),
          'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
          'Price': numeral(price).format('0.[00000]'),
          'Total': numeral(takerAmountFormatted).format('0.[00000]'),
          'Network': blockchain.code.toUpperCase(),
          'Order Type': (flowSteps.fill_order && flowSteps.place_order) ? 'Hybrid' : (flowSteps.fill_order ? 'Taker' : 'Maker'),
          'Step': 'Instant',
        })
        trackEvent('Create Taker Order Success', {
          'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
          'Quote Currency': 'USDT',
          'Side': side.toUpperCase(),
          'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
          'Price': numeral(price).format('0.[00000]'),
          'Total': numeral(takerAmountFormatted).format('0.[00000]'),
          'Network': blockchain.code.toUpperCase(),
          'Order Type': (flowSteps.fill_order && flowSteps.place_order) ? 'Hybrid' : (flowSteps.fill_order ? 'Taker' : 'Maker'),
          'Step': 'Confirm',
        })
      }
      if (flowSteps.place_order) {
        setSignSteps(state => state.map(step => ({...step, current: step.key === 'place_order'})))
        const placeOrderResult = await Order.TOKEN.place({
          type: side,
          makerAsset: takerAsset,
          takerAsset: makerAsset,
          price: price,
          amount: amountLimitOrder,
        }, eventHandler).catch(error => {
          return error
        })
        setResults(state => ({...state, place_order: placeOrderResult}))
        if (!placeOrderResult.success && !flowSteps.fill_order) {
          setStep('error')
          return
        }
        trackEvent('Confirm Order Submit', {
          'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
          'Quote Currency': 'USDT',
          'Side': side.toUpperCase(),
          'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
          'Price': numeral(price).format('0.[00000]'),
          'Total': numeral(takerAmountFormatted).format('0.[00000]'),
          'Network': blockchain.code.toUpperCase(),
          'Order Type': (flowSteps.fill_order && flowSteps.place_order) ? 'Hybrid' : (flowSteps.fill_order ? 'Taker' : 'Maker'),
          'Step': 'Orderbook Entry',
        })
        trackEvent('Create Maker Order Success', {
          'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
          'Quote Currency': 'USDT',
          'Side': side.toUpperCase(),
          'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
          'Price': numeral(price).format('0.[00000]'),
          'Total': numeral(takerAmountFormatted).format('0.[00000]'),
          'Network': blockchain.code.toUpperCase(),
          'Order Type': (flowSteps.fill_order && flowSteps.place_order) ? 'Hybrid' : (flowSteps.fill_order ? 'Taker' : 'Maker'),
          'Step': 'Confirm',
        })
      }
      setStep('result')
      trackEvent('Create Order Success', {
        'Base Currency': side === 'buy' ? makerAsset.symbol : takerAsset.symbol,
        'Quote Currency': 'USDT',
        'Side': side.toUpperCase(),
        'Quantity': numeral(makerAmountFormatted).format('0.[00000]'),
        'Price': numeral(price).format('0.[00000]'),
        'Total': numeral(takerAmountFormatted).format('0.[00000]'),
        'Network': blockchain.code.toUpperCase(),
        'Order Type': (flowSteps.fill_order && flowSteps.place_order) ? 'Hybrid' : (flowSteps.fill_order ? 'Taker' : 'Maker'),
        'Step': 'Confirm',
      })
      if (!flowSteps.fill_order || !flowSteps.place_order) {
        setCurrentTab(flowSteps.fill_order ? 'fill_order' : 'limit_order')
      }
      return
    }
    setResults(state => ({...state, approval: {success: false, type: 'balance'}}))
    setStep('error')
  }

  const eventHandler = (eventName, eventData) => {
    switch (eventName) {
      case 'transaction_completed':
        setFillOrderTransactionData(eventData)
        setSignSteps(state => {
          return state.map(step => ({...step, signed: step.current}))
        })
        break
      case 'contract_TradeSuccessful':
        setSuccessOrders(state => {
          return [...state, ...eventData]
        })
        break
      case 'contract_TradeFailed':
        setFailedOrders(state => {
          return [...state, ...eventData]
        })
        break
    }
  }

  const handleChangeTab = tabKey => {
    setCurrentTab(tabKey)
  }

  return (
    <App.Flex column className={cn(styles.container, {[styles[version]]: version})}>
      <App.Flex className={cn(styles.header, styles[side], {[styles.result]: step == 'result'})} align="center" justify={version == 'mobile' ? 'center' : 'space-between'}>
        <App.Text center weight={700} size={version == 'mobile' ? 16 : 14} capitalize>
          {version != 'mobile' || (version == 'mobile' && step != 'result') ? (
            `${side} ${side === 'buy' ? makerAsset.symbol : takerAsset.symbol} with ${side === 'sell' ? makerAsset.symbol : takerAsset.symbol}`
          ) : (
            step == 'result' ? (
              'Order Summary'
            ) : null
          )}
        </App.Text>

        {version != 'mobile' ? (
          <App.Flex align="center" justify="center" sx={{cursor: 'pointer'}} onClick={onClose}>
            <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
          </App.Flex>
        ) : (
          <>
            {step == 'preview' ? (
              <App.Flex align="center" justify="center" onClick={onBack} className={styles.backButton}>
                <App.Icon icon="arrow-right" color="#fff" width={24} height={24} />
              </App.Flex>
            ) : null}
          
            {step == 'error' || step == 'result' ? (
              <App.Flex align="center" justify="center" onClick={onClose} className={styles.closeButton}>
                <App.Icon icon="cross" color="#fff" width={16} height={16} />
              </App.Flex>
            ) : null}
          </>
        )}
      </App.Flex>
      {
        (stepKey => {
          switch (stepKey) {
            case 'preview':
              return (
                <App.Flex column>
                  <App.Flex column className={styles.content}>
                    <App.Text color="#B9B8C5" size={12} weight={600} sx={{marginBottom: 8}}>Order Information</App.Text>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Type</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Limit Order</App.Text>
                    </App.Flex>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>At Price</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>{ numeral(price).format('0.[00000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }</App.Text>
                    </App.Flex>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Amount</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>{ numeral(makerAmountFormatted).format('0.[00000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol }</App.Text>
                    </App.Flex>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Total</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>{ numeral(takerAmountFormatted).format('0.[00000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }</App.Text>
                    </App.Flex>
                    <div className={styles.line} />
                    <App.Text color="#B9B8C5" size={12} weight={600} sx={{marginBottom: 8}}>Transactions</App.Text>
                    {
                      flowSteps.fill_order
                        ? <App.Flex align="flex-start" justify="space-between" sx={{marginBottom: 4}}>
                            <App.Text color="#5E5C6B" size={10} weight={600}>Transaction 1 (Instant Settle⚡)</App.Text>
                            <App.Flex column>
                              <App.Text size={10} weight={600} right>
                                { numeral(amountFillOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.sign}%)
                              </App.Text>
                              <App.Text color="#5E5C6B" size={10} weight={600} right>
                                { numeral(amountFillOrderUsdt).format('0.0[0000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }
                              </App.Text>
                            </App.Flex>
                          </App.Flex>
                        : null
                    }
                    {
                      flowSteps.place_order
                        ? <App.Flex align="flex-start" justify="space-between" sx={{marginBottom: 4}}>
                            <App.Text color="#5E5C6B" size={10} weight={600}>Transaction {flowSteps.fill_order ? 2 : 1} (Placed in Orderbook⌛)</App.Text>
                            <App.Flex column>
                              <App.Text size={10} weight={600} right>
                                { numeral(amountLimitOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.limit}%)
                              </App.Text>
                              <App.Text color="#5E5C6B" size={10} weight={600} right>
                                { numeral(amountLimitOrderUsdt).format('0.0[0000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }
                              </App.Text>
                            </App.Flex>
                          </App.Flex>
                        : null
                    }
                    <div className={styles.line} />
                    <App.Text color="#B9B8C5" size={12} weight={600}>Overall Summary</App.Text>
                    <App.Flex justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={500}>You Pay</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={500}>You Get</App.Text>
                    </App.Flex>
                    <App.Flex justify="space-between" className={styles.row} sx={{marginBottom: 12}}>
                      <App.Flex align="center">
                        <Image width={25} height={25} src={takerAsset.image} alt="" style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ numeral(side === 'buy' ? takerAmountFormatted : makerAmountFormatted).format('0.[00000]') } {takerAsset.symbol}</App.Text>
                      </App.Flex>
                      <App.Icon icon="arrow-right" />
                      <App.Flex align="center">
                        <Image width={25} height={25} src={makerAsset.image} alt="" style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ numeral(side === 'buy' ? makerAmountFormatted : takerAmountFormatted).format('0.[00000]') } {makerAsset.symbol}</App.Text>
                      </App.Flex>
                    </App.Flex>

                    {version == 'mobile' ? (
                      <App.Button xl variant={side == 'buy' ? 'success' : 'danger'} fullWidth onClick={handleConfirm} disabled={!matchingLoaded}>
                        {matchingLoaded ? `CONFIRM ${side.toUpperCase()}` : <App.Loader color="#09051D" size={24} />}
                      </App.Button>
                    ) : (
                      <App.Flex align="center" justify="center" className={styles.button} onClick={handleConfirm} sx={{opacity: matchingLoaded ? 1 : 0.6}}>
                        {
                          matchingLoaded
                            ? <App.Text color="#09051D" size={15} weight={700} uppercase>CONFIRM { side }</App.Text>
                            : <App.Loader color="#09051D" />
                        }
                      </App.Flex>
                    )}
                  </App.Flex>

                  {version == 'mobile' ? (
                    <App.Flex center gap={4} sx={{ padding: 16 }}>
                      <App.Icon icon="info-i" />
                      <App.Text color="#53F19C" size={10} weight={500} height={1}>Actual quantity settled at time of block confirmation for <b>instant buy</b></App.Text>
                    </App.Flex>
                  ) : (
                    <App.Flex className={styles.banner} align="center">
                      <App.Icon icon="info-shape" style={{marginRight: 10}} />
                      <App.Text color="#53F19C" size={10} weight={500}>Actual quantity settled at time of block confirmation for instant buy</App.Text>
                    </App.Flex>
                  )}
                </App.Flex>
              )
            case 'sign':
              return (
                <App.Flex column className={cn(styles.content, styles.sign)}>
                  <App.Flex className={styles.steps}>
                    {
                      stepsInFlow.map((signStep, i) => {
                        const isActive = currentSignStep.index >= i
                        return (
                          <App.Flex flex={1} column justify="center" align="center" key={signStep.key} className={styles.step}>
                            <App.Text color={isActive ? '#53F19C' : '#5E5C6B'} size={10} weight={500}>{signStep.name.replace('{index}', i)}</App.Text>
                            <App.Flex className={cn(styles.stepLine, {[styles.active]: isActive})} />
                          </App.Flex>
                        )
                      })
                    }
                  </App.Flex>
                  <App.Flex column flex={1} center gap={24}>
                    <App.LoaderBlock size={100} height={100} color="#7204FF" />
                    {
                      currentSignStep.signed
                        ? <App.Text size={18} weight={700}>Waiting for Confirmation</App.Text>
                        : <App.Flex column center>
                            <App.Text color="#A965FF" size={14} weight={700} sx={{marginBottom: 4}}>STEP {currentSignStep.index+1} / {stepsInFlow.length}</App.Text>
                            <App.Text size={20} weight={700} sx={{marginBottom: 4}}>{currentSignStep.title}</App.Text>
                            <App.Text color="#9996B1" size={14} weight={500}>{currentSignStep.description.replace('$TOKEN', takerAsset.symbol)}</App.Text>
                          </App.Flex>
                    }
                    {
                      (step => {
                        switch (step.key) {
                          case 'fill_order':
                            return (
                              <App.Flex align="flex-start" justify="space-between" sx={{width: '100%', marginTop: 'auto'}}>
                                <App.Flex column>
                                  <App.Text color="#5E5C6B" size={10} weight={600}>Transaction 1 (Instant Settle⚡)</App.Text>
                                  {version == 'mobile' ? (
                                    <App.Text color="#5E5C6B" size={10}>Settled instantly with matching orders</App.Text>
                                  ) : null}
                                </App.Flex>

                                <App.Flex column>
                                  <App.Text size={10} weight={600} right>
                                    { numeral(amountFillOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.sign}%)
                                  </App.Text>
                                  <App.Text color="#5E5C6B" size={10} weight={600} right>
                                    { numeral(amountFillOrderUsdt).format('0.0[0000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }
                                  </App.Text>
                                </App.Flex>
                              </App.Flex>
                            )
                          case 'place_order':
                            return (
                              <App.Flex align="flex-start" justify="space-between" sx={{width: '100%', marginTop: 'auto'}}>
                                <App.Flex column flex={1}>
                                  <App.Text color="#5E5C6B" size={12} weight={600}>Transaction {flowSteps.fill_order ? 2 : 1} (Limit Order⌛)</App.Text>
                                  {version == 'mobile' ? (
                                    <App.Text color="#5E5C6B" size={10}>Places your active order in the orderbook until cancelled or matched</App.Text>
                                  ) : null}
                                </App.Flex>
                                <App.Flex column flex={1}>
                                  <App.Text size={12} weight={600} right>
                                    { numeral(amountLimitOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.limit}%)
                                  </App.Text>
                                  <App.Text color="#5E5C6B" size={10} weight={600} right>
                                    { numeral(amountLimitOrderUsdt).format('0.0[0000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }
                                  </App.Text>
                                </App.Flex>
                              </App.Flex>
                            )
                          default:
                            return null
                        }
                      })(currentSignStep)
                    }
                    <App.Text color="#5E5C6B" size={10} weight={500} sx={{marginTop: 'auto'}}>Please Proceed in Your Wallet</App.Text>
                  </App.Flex>
                </App.Flex>
              )
            case 'result':
              return (
                <App.Flex column className={cn(styles.content, styles.result)} gap={[0, 16]}>
                  {
                    Object.values(flowSteps).every(val => val)
                      ? <Tabs
                          options={TABS}
                          active={currentTab}
                          onChange={handleChangeTab} />
                      : null
                  }
                  {
                    (tab => {
                      switch (tab) {
                        case 'overall':
                          return (
                            <App.Flex column className={styles.tabContent}>
                              {
                                results.fill_order.success
                                  ? <div className={styles.badge} style={{backgroundColor: '#53F19C'}}>
                                      <App.Text color="#08051C" size={8} weight={700}>Completed</App.Text>
                                    </div>
                                  : <div className={styles.badge} style={{backgroundColor: '#FF1D61'}}>
                                      <App.Text color="#08051C" size={8} weight={700}>Rejected</App.Text>
                                    </div>
                              }
                              <App.Flex align="flex-start" justify="space-between" sx={{marginBottom: 12}}>
                                {version == 'mobile' ? (
                                  <App.Flex column>
                                    <App.Text color="#B9B8C5" size={12}>Instant Settle⚡</App.Text>
                                    <App.Text color="#5E5C6B" size={10}>Settled instantly with matching orders</App.Text>
                                  </App.Flex>
                                ) : (
                                  <App.Text color="#5E5C6B" size={10} weight={600}>Transaction 1 (Instant Settle⚡)</App.Text>
                                )}
                                <App.Flex column>
                                  <App.Text size={version == 'mobile' ? 12 : 10} weight={600} right>
                                    { numeral(amountFillOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.sign}%)
                                  </App.Text>
                                  <App.Text color="#5E5C6B" size={10} weight={600} right>
                                    { numeral(amountFillOrderUsdt).format('0.0[0000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }
                                  </App.Text>
                                </App.Flex>
                              </App.Flex>
                              {
                                results.place_order.success
                                  ? <div className={styles.badge} style={{backgroundColor: '#FFB800'}}>
                                      <App.Text color="#08051C" size={8} weight={700}>In Progress</App.Text>
                                    </div>
                                  : <div className={styles.badge} style={{backgroundColor: '#FF1D61'}}>
                                      <App.Text color="#08051C" size={8} weight={700}>Rejected</App.Text>
                                    </div>
                              }
                              <App.Flex align="flex-start" justify="space-between" sx={{marginBottom: 0}}>
                                {version == 'mobile' ? (
                                  <App.Flex column flex={1}>
                                    <App.Text color="#B9B8C5" size={12}>Limit Order⌛</App.Text>
                                    <App.Text color="#5E5C6B" size={10}>Places your active order in the orderbook until cancelled or matched</App.Text>
                                  </App.Flex>
                                ) : (
                                  <App.Text color="#5E5C6B" size={10} weight={600}>Transaction {flowSteps.fill_order ? 2 : 1} (Placed in Orderbook⌛)</App.Text>
                                )}
                                <App.Flex column flex={1}>
                                  <App.Text size={version == 'mobile' ? 12 : 10} weight={600} right>
                                    { numeral(amountLimitOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.limit}%)
                                  </App.Text>
                                  <App.Text color="#5E5C6B" size={10} weight={600} right>
                                    { numeral(amountLimitOrderUsdt).format('0.0[0000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }
                                  </App.Text>
                                </App.Flex>
                              </App.Flex>
                              <App.Flex column sx={{marginTop: 'auto'}}>
                                <div className={styles.line} />
                                <App.Flex justify="space-between" className={styles.row} >
                                  <App.Text color="#5E5C6B" size={10} weight={500}>You Pay</App.Text>
                                  <App.Text color="#5E5C6B" size={10} weight={500}>You Receive</App.Text>
                                </App.Flex>
                                <App.Flex justify="space-between" className={styles.row}>
                                  <App.Flex align="center">
                                    <Image width={25} height={25} src={takerAsset.image} alt="" style={{marginRight: 8}} />
                                    <App.Text size={12} weight={600}>{ numeral(side === 'buy' ? takerAmountFormatted : makerAmountFormatted).format('0.[00000]') } {takerAsset.symbol}</App.Text>
                                  </App.Flex>
                                  <App.Icon icon="arrow-right" />
                                  <App.Flex align="center">
                                    <Image width={25} height={25} src={makerAsset.image} alt="" style={{marginRight: 8}} />
                                    <App.Text size={12} weight={600}>{ numeral(side === 'buy' ? makerAmountFormatted : takerAmountFormatted).format('0.[00000]') } {makerAsset.symbol}</App.Text>
                                  </App.Flex>
                                </App.Flex>
                              </App.Flex>
                            </App.Flex>
                          )
                        case 'fill_order':
                          return (
                            <App.Flex column className={styles.tabContent}>
                              <App.Flex column align="center" sx={{position: 'relative', margin: '16px 0'}}>
                                <div ref={progressBarRef} style={{width: 141, height: 75}} />
                                <App.Flex column sx={{position: 'absolute', bottom: 0}}>
                                  <App.Text color="#53F19C" size={20} weight={600} center>{completePercentage}%</App.Text>
                                  <App.Text size={9} weight={700} center>Filled</App.Text>
                                </App.Flex>
                              </App.Flex>
                              <App.Flex justify="space-between">
                                <App.Text color="#5E5C6B" size={10} weight={600}>Amount / Filled</App.Text>
                                <App.Text color="#B9B8C5" size={10} weight={600}>
                                  { side === 'buy' ? stats.tookAmount : stats.spendedAmount } {  side === 'buy' ? makerAsset.symbol : takerAsset.symbol } / { side === 'buy' ? abilities.willTakeAmount : abilities.willSpendAmount } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol }
                                </App.Text>
                              </App.Flex>
                              <App.Flex column sx={{marginTop: 'auto'}}>
                                <div className={styles.line} />
                                <App.Flex justify="space-between" className={styles.row}>
                                  <App.Text color="#5E5C6B" size={10} weight={500}>You Pay</App.Text>
                                  <App.Text color="#5E5C6B" size={10} weight={500}>You Receive</App.Text>
                                </App.Flex>
                                <App.Flex justify="space-between" className={styles.row}>
                                  <App.Flex align="center">
                                    <Image width={25} height={25} src={takerAsset.image} alt="" style={{marginRight: 8}} />
                                    <App.Text size={12} weight={600}>{ stats.spendedAmount } {takerAsset.symbol}</App.Text>
                                  </App.Flex>
                                  <App.Icon icon="arrow-right" />
                                  <App.Flex align="center">
                                    <Image width={25} height={25} src={makerAsset.image} alt="" style={{marginRight: 8}} />
                                    <App.Text size={12} weight={600}>{ stats.tookAmount } {makerAsset.symbol}</App.Text>
                                  </App.Flex>
                                </App.Flex>
                              </App.Flex>
                            </App.Flex>
                          )
                        case 'limit_order':
                          return (
                            <App.Flex column className={styles.tabContent}>
                              {
                                results.place_order.success
                                  ? <App.Flex column align={version == 'mobile' ? 'flex-start' : 'center'}>
                                      <App.Flex justify="center" align="center" sx={{marginBottom: 8}}>
                                        <App.Text size={16} weight={700} sx={{marginRight: 4}}>Order In Progress</App.Text>
                                        {version != 'mobile' ?  <App.Icon icon="check-circle-fill" secondaryColor="#08051C" width={17} height={17} /> : null}
                                      </App.Flex>
                                      <App.Text color="#5E5C6B" size={10} weight={500} center={version == 'mobile' ? null : true}>We will inform you once the order is filled completely. Meanwhile you can keep track through the ongoing order list</App.Text>
                                    </App.Flex>
                                  : <App.Flex column align={version == 'mobile' ? 'flex-start' : 'center'}>
                                      <App.Text color="#FF1D61" size={16} weight={700} sx={{marginBottom: 8}}>Order Rejected</App.Text>
                                      <App.Text color="#5E5C6B" size={10} weight={500} center={version == 'mobile' ? null : true}>Your Order transaction request was rejected while signing it. Please try placing the order again to complete it.</App.Text>
                                    </App.Flex>
                              }
                              <div className={styles.line} />
                              <App.Flex column flex={1} justify="center">
                                <App.Flex align="center" justify="space-between" className={styles.row}>
                                  <App.Text color="#5E5C6B" size={12} weight={600}>At Price</App.Text>
                                  <App.Text size={12} weight={600}>{ price } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }</App.Text>
                                </App.Flex>
                                <App.Flex align="center" justify="space-between" className={styles.row}>
                                  <App.Text color="#5E5C6B" size={12} weight={600}>Amount</App.Text>
                                  <App.Text size={12} weight={600}>{ numeral(amountLimitOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol }</App.Text>
                                </App.Flex>
                                <App.Flex align="center" justify="space-between" className={styles.row}>
                                  <App.Text color="#5E5C6B" size={12} weight={600}>Total</App.Text>
                                  <App.Text size={12} weight={600}>{ numeral(amountLimitOrder*price).format('0.0[0000]') } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }</App.Text>
                                </App.Flex>
                              </App.Flex>
                              <App.Flex column sx={{marginTop: 'auto'}}>
                                <div className={styles.line} />
                                <App.Flex justify="space-between" className={styles.row}>
                                  <App.Text color="#5E5C6B" size={10} weight={500}>You Pay</App.Text>
                                  <App.Text color="#5E5C6B" size={10} weight={500}>You Receive</App.Text>
                                </App.Flex>
                                <App.Flex justify="space-between" className={styles.row}>
                                  <App.Flex align="center">
                                    <Image width={25} height={25} src={takerAsset.image} alt="" style={{marginRight: 8}} />
                                    <App.Text size={12} weight={600}>
                                      { numeral(side === 'buy' ? amountLimitOrder*price : amountLimitOrder).format('0.0[0000]') } {takerAsset.symbol}
                                    </App.Text>
                                  </App.Flex>
                                  <App.Icon icon="arrow-right" />
                                  <App.Flex align="center">
                                    <Image width={25} height={25} src={makerAsset.image} alt="" style={{marginRight: 8}} />
                                    <App.Text size={12} weight={600}>
                                      { numeral(side === 'buy' ? amountLimitOrder : amountLimitOrder*price).format('0.0[0000]') } {makerAsset.symbol}
                                    </App.Text>
                                  </App.Flex>
                                </App.Flex>
                              </App.Flex>
                            </App.Flex>
                          )
                      }
                    })(currentTab)
                  }

                  {version == 'mobile' ? (
                    <App.Button primary xl fullWidth onClick={handleDone}>{fillOrderTransactionData?.data?.hash ? 'GO TO EXPLORER' : 'DONE'}</App.Button>
                  ) : (
                    <App.Flex align="center" justify="center" className={styles.buttonResult} onClick={handleDone}>
                      <App.Text size={15} weight={700} uppercase>{fillOrderTransactionData?.data?.hash ? 'GO TO EXPLORER' : 'DONE'}</App.Text>
                    </App.Flex>
                  )}
                </App.Flex>
              )
            case 'error':
              return (
                <App.Flex column center gap={[0, 16]} className={cn(styles.content, styles.error)}>
                  <App.Flex column align="center" gap={16} sx={{marginTop: 'auto', marginBottom: 'auto'}}>
                    <App.Flex center className={styles.cross}>
                      <App.Icon icon="cross" color="#FF1C61" width={40} height={40} />
                    </App.Flex>
                    <App.Text color="#FF1D61" size={20} weight={700}>{ errors.title }</App.Text>
                    <App.Text color="#9996B1" size={14} weight={500} center>{ errors.description }</App.Text>
                  </App.Flex>

                  {version == 'mobile' ? (
                    <App.Button primary xl fullWidth uppercase onClick={onClose}>CLOSE</App.Button>
                  ) : (
                    <App.Flex align="center" justify="center" className={styles.buttonResult} onClick={onClose}>
                      <App.Text size={15} weight={700} uppercase>CLOSE</App.Text>
                    </App.Flex>
                  )}
                </App.Flex>
              )
          }
        })(step)
      }
    </App.Flex>
  )
}

export default OrderProceed
