import styles from './styles.module.scss'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import numeral from 'numeral'
import ProgressBar from 'progressbar.js'
import cn from 'classnames'

import App from '@/components/App'
import Order from '@/libs/structs/Order'
import useOrders from '@/myhooks/useOrders'

const getErrorMessage = (message) => {
  switch (message) {
    case 'User rejected the request.':
      return 'Looks like you have rejected signing through your wallet. Please restart the process'
    default:
      return 'Something went wrong. Please restart the process'
  }
}

const FillOrder = ({data, onClose}) => {
  const { updateOrders } = useOrders({tokenAddress: data.side === 'buy' ? data.makerAsset.address : data.takerAsset.address, type: 'tokens'})
  
  const [currentStep, setCurrentStep] = useState('confirming')
  const [errorMessage, setErrorMessage] = useState('')
  const [signSteps, setSignSteps] = useState({
    allowance: {
      complete: false,
      title: 'Spending Approval',
      description: `Enable spending of ${data.takerAsset.symbol} on Tegro`,
    },
    transaction: {
      complete: false,
      title: 'Submit Order',
      description: 'Sign and submit your taker order'
    },
  })
  const [showDetails, setShgowDetails] = useState(false)
  const [abilities, setAbilities] = useState({totalAmountOnSell: 0, totalAmountToSell: 0, willSpendAmount: 0, willTakeAmount: 0, orders: []})
  const [successOrders, setSuccessOrders] = useState([])

  const progressBarRef = useRef(null)
  const progress = useRef(null)

  const currentSignStep = Object.values(signSteps).find(step => !step.complete)
  const isCompleteTransaction = Object.values(signSteps).every(step => step.complete)

  const completedOrders = abilities.orders.filter(order => successOrders.find(o => o.args.orderHash === order.orderHash))

  const stats = completedOrders.reduce((acc, order) => {
    return {
      spendedAmount: acc.spendedAmount + order.willSpendTakingAmountFormatted*1,
      tookAmount: acc.tookAmount + order.willTakeMakingAmountFormatted*1,
    }
  }, {spendedAmount: 0, tookAmount: 0})

  const avgPrice = data.side === 'buy' ? abilities.willSpendAmount / data.amount : abilities.willTakeAmount / data.amount

  const completePercentage = numeral(stats.tookAmount*100/abilities.willTakeAmount).format('0')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (isCompleteTransaction) {
      setCurrentStep('blockchain_confirmation')
    }
  }, [isCompleteTransaction])

  useEffect(() => {
    if (currentStep === 'result') {
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
  }, [currentStep])

  useEffect(() => {
    if (completePercentage*1 && currentStep === 'result') {
      progress.current.animate(completePercentage/100)
    }
  }, [completePercentage, currentStep])

  const fetchOrders = async () => {
    const res = await Order.TOKEN.getOpenWithPriceLimitation({
      chainId: data.blockchain.id,
      makerAsset: data.makerAsset.address,
      takerAsset: data.takerAsset.address,
      amount: data.amount,
      price: data.price,
      side: data.side,
    })
    setAbilities(res)
  }

  const handleClickDetails = () => {
    setShgowDetails(!showDetails)
  }

  const handleConfirm = () => {
    setCurrentStep('signing')
    Order.TOKEN.fulfill({
      address: data.side === 'buy' ? data.makerAsset.address : data.takerAsset.address, //current.address,
      amount: data.amount,
      price: data.price,
      side: data.side,
    }, eventHandler).catch(error => {
      console.log('error -> ', error)
      setCurrentStep('error')
      setErrorMessage(error?.shortMessage)
    }).then(() => {
      updateOrders()
    })
  }

  const eventHandler = (event, data) => {
    switch (event) {
      case 'allowance':
      case 'transaction':
        setSignSteps(state => {
          return {
            ...state,
            [event]: {
              ...state[event],
              complete: data.success
            }
          }
        })
        break
      case 'blockchain':
        setCurrentStep('result')
        break
      case 'contract_TradeSuccessful':
        setSuccessOrders(state => {
          return [...state, ...data]
        })
        break
    }
  }
  
  return (
    <App.Flex column className={styles.container}>
      <App.Flex className={styles.header} align="center" justify="space-between">
        <App.Text weight={700} size={14} capitalize>
          {`${data.side} ${data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol} with ${data.side === 'sell' ? data.makerAsset.symbol : data.takerAsset.symbol}`}
        </App.Text>
        <App.Flex align="center" justify="center" sx={{cursor: 'pointer'}} onClick={onClose}>
          <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
        </App.Flex>
      </App.Flex>
      {
        currentStep !== 'result'
          ? <App.Flex className={styles.steps}>
              <App.Flex flex={1} column align="center" justify="flex-end">
                <App.Text color={['signing', 'blockchain_confirmation', 'error'].includes(currentStep) ? '#53F19C' : '#5E5C6B'} size={10} weight={500}>Confirm</App.Text>
                <App.Flex sx={{width: '100%'}}>
                  <App.Flex className={cn(styles.line, {[styles.active]: ['signing', 'blockchain_confirmation', 'error'].includes(currentStep)})} flex={1} />
                </App.Flex>
              </App.Flex>
              <App.Flex flex={1} column align="center" justify="flex-end">
                <App.Text color={['blockchain_confirmation'].includes(currentStep) ? '#53F19C' : '#5E5C6B'} size={10} weight={500}>Approve</App.Text>
                <App.Flex sx={{width: '100%'}}>
                  <App.Flex className={cn(styles.line, {[styles.active]: ['blockchain_confirmation'].includes(currentStep)})} flex={1} />
                </App.Flex>
              </App.Flex>
            </App.Flex>
          : null
      }
      {
        (step => {
          switch (step) {
            case 'confirming':
              return (
                <App.Flex column>
                  <App.Flex column className={styles.content}>
                    <App.Flex column className={styles.border} gap={8}>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>Type</App.Text>
                        <App.Text color="#B9B8C5" size={12} weight={600} capitalize>{data.side} now</App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>At Price</App.Text>
                        <App.Text color="#5E5C6B" size={12} weight={600}>
                          { avgPrice } { data.side === 'buy' ? data.takerAsset.symbol : data.makerAsset.symbol }
                        </App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>Amount</App.Text>
                        <App.Text color="#5E5C6B" size={12} weight={600}>
                          { data.amount } { data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol }
                        </App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>Total</App.Text>
                        <App.Text color="#5E5C6B" size={12} weight={600}>
                          { data.side === 'buy' ? abilities.willSpendAmount : abilities.willTakeAmount } { data.side === 'buy' ? data.takerAsset.symbol : data.makerAsset.symbol }
                        </App.Text>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex column className={styles.border}>
                      <App.Flex justify="space-between" sx={{marginBottom: 8}}>
                        <App.Text color="#5E5C6B" size={10} weight={500}>You Pay</App.Text>
                        <App.Text color="#5E5C6B" size={10} weight={500}>You Receive</App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Flex align="center">
                          <Image width={25} height={25} src={data.takerAsset.image} style={{marginRight: 8}} />
                          <App.Text size={12} weight={600}>{ abilities.willSpendAmount } {data.takerAsset.symbol}</App.Text>
                        </App.Flex>
                        <App.Icon icon="arrow-right" />
                        <App.Flex align="center">
                          <Image width={25} height={25} src={data.makerAsset.image} style={{marginRight: 8}} />
                          <App.Text size={12} weight={600}>{ numeral(abilities.willTakeAmount).format('0.[00000]') } {data.makerAsset.symbol}</App.Text>
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex align="center" justify="space-between" sx={{marginBottom: 8, cursor: 'pointer'}} onClick={handleClickDetails}>
                      <App.Text color="#5E5C6B" size={12} weight={600}>Order Details</App.Text>
                      <App.Icon icon="chevron-left" className={styles.detailsIcon} style={{transform: showDetails ? 'rotate(90deg)' : 'rotate(-90deg)'}} />
                    </App.Flex>
                    <App.Flex column className={styles.details} sx={{maxHeight: showDetails ? 300 : 0}}>
                      {
                        abilities.orders.map((order, i) => {
                          return (
                            <App.Flex key={i} justify="space-between" align="center" sx={{padding: '4px 0'}}>
                              <App.Text color="#5E5C6B" size={10} weight={500}>Order {i+1}</App.Text>
                              <App.Text color="#5E5C6B" size={10} weight={600}>{ order.willTakeMakingAmountFormatted } { data.makerAsset.symbol }</App.Text>
                            </App.Flex>
                          )
                        })
                      }
                    </App.Flex>
                    <App.Flex align="center" justify="center" className={styles.button} onClick={handleConfirm}>
                      <App.Text color="#09051D" size={15} weight={700} uppercase>CONFIRM { data.side }</App.Text>
                    </App.Flex>
                  </App.Flex>
                  <App.Flex className={styles.banner} align="center">
                    <App.Icon icon="info-shape" style={{marginRight: 10}} />
                    <App.Text size={12} weight={500}>Actual quantity settled at time of block confirmation.</App.Text>
                  </App.Flex>
                </App.Flex>
              )
            case 'signing':
              return (
                <App.Flex justify="center" align="center" gap={8} column sx={{paddingTop: 40, paddingBottom: 40}} className={styles.content}>
                  <App.Loader size={100} color="#7204FF" />
                  <App.Text color="#8176B8" size={14} weight={700}>
                    { Object.values(signSteps).filter(prop => prop.complete).length+1 } / { Object.keys(signSteps).length }
                  </App.Text>
                  <App.Text size={20} weight={700}>{ currentSignStep?.title }</App.Text>
                  <App.Text color="#9996B1" size={14} weight={500}>{ currentSignStep?.description }</App.Text>
                </App.Flex>
              )
            case 'blockchain_confirmation':
              return (
                <App.Flex justify="center" align="center" gap={8} column sx={{paddingTop: 40, paddingBottom: 40}} className={styles.content}>
                  <App.Loader size={100} color="#7204FF" />
                  <App.Text size={18} weight={700}>Waiting for Blockchain Confirmation</App.Text>
                  {/* <App.Button primary sx={{width: '100%', height: 56}}>
                    DONE
                  </App.Button> */}
                </App.Flex>
              )
            case 'result':
              return (
                <App.Flex column className={styles.content}>
                  <App.Flex column align="center" sx={{position: 'relative', margin: '16px 0'}}>
                    <div ref={progressBarRef} style={{width: 225, height: 120}} />
                    <App.Flex column sx={{position: 'absolute', bottom: 0}}>
                      <App.Text color="#53F19C" size={32} weight={600} center>{completePercentage}%</App.Text>
                      <App.Text size={14} weight={700} center>
                        {
                          completePercentage*1 >= 100
                            ? 'Completely filled'
                            : completePercentage*1 <= 0
                              ? 'Not filled'
                              : 'Partially Filled'
                        }
                      </App.Text>
                    </App.Flex>
                  </App.Flex>
                  <App.Flex column className={styles.border} gap={8}>
                    <App.Flex justify="space-between" sx={{marginBottom: 8}}>
                      <App.Text color="#5E5C6B" size={10} weight={500}>You Paid</App.Text>
                      <App.Text color="#5E5C6B" size={10} weight={500}>You Got</App.Text>
                    </App.Flex>
                    <App.Flex justify="space-between">
                      <App.Flex align="center">
                        <Image width={25} height={25} src={data.takerAsset.image} style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ numeral(stats.spendedAmount).format('0.[00000]') } {data.takerAsset.symbol}</App.Text>
                      </App.Flex>
                      <App.Icon icon="arrow-right" />
                      <App.Flex align="center">
                        <Image width={25} height={25} src={data.makerAsset.image} style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ numeral(stats.tookAmount).format('0.[00000]') } {data.makerAsset.symbol}</App.Text>
                      </App.Flex>
                    </App.Flex>
                    <App.Text color="#5E5C6B" size={12} weight={600}>Order Details</App.Text>
                    <App.Flex justify="space-between">
                      <App.Text color="#5E5C6B" size={10} weight={600}>Amount / Filled</App.Text>
                      <App.Text color="#B9B8C5" size={10} weight={600}>
                        { data.side === 'buy' ? stats.tookAmount : stats.spendedAmount } { data.makerAsset.symbol } / { data.side === 'buy' ? abilities.willTakeAmount : abilities.willSpendAmount } { data.makerAsset.symbol }
                      </App.Text>
                    </App.Flex>
                  </App.Flex>
                  <App.Button primary sx={{width: '100%', height: 56}} onClick={onClose}>
                    DONE
                  </App.Button>
                </App.Flex>
              )
            case 'error':
              return (
                <App.Flex column align="center" gap={8} className={styles.content}>
                  <App.Text size={132}>😕</App.Text>
                  <App.Text color="#FF1D61" size={20} center weight={700}>Oops! Transaction Error</App.Text>
                  <App.Text color="#9996B1" size={14} center weight={500}>{ getErrorMessage(errorMessage) }</App.Text>
                </App.Flex>
              )
          }
        })(currentStep)
      }
      
    </App.Flex>
  )
}

export default FillOrder
