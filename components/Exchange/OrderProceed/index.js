import { useState, useEffect, Fragment } from 'react'
import styles from './styles.module.scss'
import numeral from 'numeral'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import Order from '@/libs/structs/Order'
import { INCH_CONTRACTS, TEGRO_FILL_ORDERS_CONTRACTS } from '@/config'

import App from '@/components/App'

const STEPS = [
  {
    key: 'preview',
    completed: false,
  }, {
    key: 'sign',
    completed: false,
  }, {
    key: 'result',
    completed: false,
  }
]

const SIGN_STEPS = [
  {
    name: `🔑 Sign`,
    key: 'approval',
    title: 'Spending Approval',
    description: 'Enable spending of $TOKEN on Tegro',
    current: true,
    index: 0,
  }, {
    name: `⚡ Approve Instant`,
    key: 'fill_order',
    title: 'Submit Taker Order',
    description: 'Sign and submit your taker order',
    current: false,
    signed: false,
    blockchain_confirmation: false,
    index: 1,
  }, {
    name: `⌛ Approve orderbook`,
    key: 'place_order',
    title: 'Submit Maker Order',
    description: 'Sign and submit your taker order',
    current: false,
    signed: false,
    blockchain_confirmation: false,
    index: 2,
  }
]

const OrderProceed = ({side, blockchain, makerAsset, takerAsset, makerAmountFormatted, takerAmountFormatted, price, onClose, ...props}) => {
  const [step, setStep] = useState(STEPS[0])
  const [signSteps, setSignSteps] = useState(SIGN_STEPS)
  const [abilities, setAbilities] = useState({willSpendAmount: 0, willTakeAmount: 0})

  const { wallet } = useWalletConnect()

  const amountFillOrder = side === 'buy' ? abilities.willTakeAmount : abilities.willSpendAmount
  const amountLimitOrder = makerAmountFormatted - amountFillOrder
  const percentages = {
    sign: numeral(amountFillOrder * 100 / makerAmountFormatted).format('0'),
    limit: numeral(amountLimitOrder * 100 / makerAmountFormatted).format('0'),
  }

  const currentSignStep = signSteps.find(step => step.current)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const res = await Order.TOKEN.getOpenWithPriceLimitation({
      chainId: blockchain.id,
      makerAsset: makerAsset.address,
      takerAsset: takerAsset.address,
      amount: makerAmountFormatted,
      price: price,
      side: side,
    })
    setAbilities(res)
  }

  const handleConfirm = async () => {
    setStep(STEPS[1])
    const allowances = []
    if (!!amountFillOrder) {
      allowances.push(() => {
        return Order.Order.checkAllowance(blockchain.id, TEGRO_FILL_ORDERS_CONTRACTS[blockchain.id], wallet, takerAsset.address, takerAmountFormatted*1)
      })
    }
    if (!!amountLimitOrder) {
      allowances.push(() => {
        return Order.Order.checkAllowance(blockchain.id, INCH_CONTRACTS[blockchain.id], wallet, takerAsset.address, takerAmountFormatted*1)
      })
    }
    const allowanceResults = await Promise.all(allowances.map(fn => fn()))
    if (allowanceResults.every(res => res.success)) {
      setSignSteps(state => state.map(step => ({...step, current: step.key === (!!amountFillOrder ? 'fill_order' : 'place_order')})))
      if (!!amountFillOrder) {
        Order.TOKEN.fulfill({
          address: side === 'buy' ? makerAsset.address : takerAsset.address, //current.address,
          amount: amountFillOrder,
          price: price,
          side: side,
        }, eventHandler)
      }
    }
  }

  const eventHandler = (eventName, eventData) => {
    switch (eventName) {
      case 'transaction_completed':
        break
      case 'contract_TradeSuccessful':
        break
    }
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex className={styles.header} align="center" justify="space-between">
        <App.Text weight={700} size={14} capitalize>
          {`${side} ${side === 'buy' ? makerAsset.symbol : takerAsset.symbol} with ${side === 'sell' ? makerAsset.symbol : takerAsset.symbol}`}
        </App.Text>
        <App.Flex align="center" justify="center" sx={{cursor: 'pointer'}} onClick={onClose}>
          <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
        </App.Flex>
      </App.Flex>
      {
        (stepKey => {
          switch (stepKey) {
            case 'preview':
              return (
                <App.Flex column>
                  <App.Flex column className={styles.content}>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Type</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Hybrid Limit Order</App.Text>
                    </App.Flex>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>At Price</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>{ price } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }</App.Text>
                    </App.Flex>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Amount</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>{ makerAmountFormatted } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol }</App.Text>
                    </App.Flex>
                    <App.Flex align="center" justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={600}>Total</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={600}>{ takerAmountFormatted } { side === 'buy' ? takerAsset.symbol : makerAsset.symbol }</App.Text>
                    </App.Flex>
                    <div className={styles.line} />
                    <App.Flex align="center" justify="space-between">
                      <App.Flex column>
                        <App.Text color="#5E5C6B" size={12} weight={600}>Instant Settle ⚡</App.Text>
                        <App.Text color="#5E5C6B" size={10} weight={600}>Settled instantly with matching orders</App.Text>
                      </App.Flex>
                      <App.Text size={12} weight={600}>
                        { numeral(amountFillOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.sign}%)
                      </App.Text>
                    </App.Flex>
                    <div className={styles.line} />
                    <App.Flex align="center" justify="space-between">
                      <App.Flex column>
                        <App.Text color="#5E5C6B" size={12} weight={600}>Limit Order ⌛</App.Text>
                        <App.Text color="#5E5C6B" size={10} weight={600}>Places your active order in the orderbook until cancelled or matched</App.Text>
                      </App.Flex>
                      <App.Text size={12} weight={600}>
                        { numeral(amountLimitOrder).format('0.0[0000]') } { side === 'buy' ? makerAsset.symbol : takerAsset.symbol } ({percentages.limit}%)
                      </App.Text>
                    </App.Flex>
                    <div className={styles.line} />
                    <App.Text color="#5E5C6B" size={12} weight={600}>Overall Summary</App.Text>
                    <App.Flex justify="space-between" className={styles.row}>
                      <App.Text color="#5E5C6B" size={10} weight={500}>You Pay</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={500}>You Receive</App.Text>
                    </App.Flex>
                    <App.Flex justify="space-between" className={styles.row}>
                      <App.Flex align="center">
                        <Image width={25} height={25} src={takerAsset.image} style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ numeral(side === 'buy' ? takerAmountFormatted : makerAmountFormatted).format('0.[00000]') } {takerAsset.symbol}</App.Text>
                      </App.Flex>
                      <App.Icon icon="arrow-right" />
                      <App.Flex align="center">
                        <Image width={25} height={25} src={makerAsset.image} style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ numeral(side === 'buy' ? makerAmountFormatted : takerAmountFormatted).format('0.[00000]') } {makerAsset.symbol}</App.Text>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex align="center" justify="center" className={styles.button} onClick={handleConfirm}>
                      <App.Text color="#09051D" size={15} weight={700} uppercase>CONFIRM { side }</App.Text>
                    </App.Flex>
                  </App.Flex>
                  <App.Flex className={styles.banner} align="center">
                    <App.Icon icon="info-shape" style={{marginRight: 10}} />
                    <App.Text color="#53F19C" size={10} weight={500}>Actual quantity settled at time of block confirmation for instant buy</App.Text>
                  </App.Flex>
                </App.Flex>
              )
            case 'sign':
              return (
                <App.Flex column className={styles.content}>
                  <App.Flex className={styles.steps}>
                    {
                      signSteps.map((signStep, i) => {
                        const isActive = currentSignStep.index >= i
                        return (
                          <App.Flex flex={1} column justify="center" align="center" key={signStep.key} className={styles.step}>
                            <App.Text color={isActive ? '#53F19C' : '#5E5C6B'} size={10} weight={500}>{signStep.name}</App.Text>
                            <App.Flex className={cn(styles.stepLine, {[styles.active]: isActive})} />
                          </App.Flex>
                        )
                      })
                    }
                  </App.Flex>
                  <App.Flex column flex={1} align="center" justify="center">
                    <App.Loader size={100} color="#7204FF" sx={{marginBottom: 4}} />
                    {
                      currentSignStep.signed
                        ? null
                        : <Fragment>
                            <App.Text color="#A965FF" size={14} weight={700} sx={{marginBottom: 4}}>STEP {currentSignStep.index+1} / {signSteps.length}</App.Text>
                            <App.Text size={20} weight={700} sx={{marginBottom: 4}}>{currentSignStep.title}</App.Text>
                            <App.Text color="#9996B1" size={14} weight={500}>{currentSignStep.description.replace('$TOKEN', takerAsset.symbol)}</App.Text>
                          </Fragment>
                    }
                    
                  </App.Flex>
                  <App.Text center color="#5E5C6B" size={10} weight={500} sx={{marginTop: 'auto'}}>Please Proceed in Your Wallet</App.Text>
                </App.Flex>
              )
            case 'result':
              break
          }
        })(step.key)
      }
    </App.Flex>
  )
}

export default OrderProceed
