import styles from './styles.module.scss'
import { useState } from 'react'
import cn from 'classnames'
import Image from 'next/image'

import App from '@/components/App'
import Order from '@/libs/structs/Order'
import useOrders from '@/myhooks/useOrders'

const PlaceOrder = ({data, onClose}) => {
  const { updateOrders } = useOrders({tokenAddress: data.side === 'buy' ? data.takerAsset.address : data.makerAsset.address, type: 'tokens'})

  const [currentStep, setCurrentStep] = useState('confirming')
  const [signSteps, setSignSteps] = useState({
    allowance: {
      complete: false,
      title: 'Spending Approval',
      description: `Enable spending of ${data.makerAsset.symbol} on Tegro`,
    },
    transaction: {
      complete: false,
      title: 'Submit Order',
      description: 'Sign and submit your limit order'
    },
  })

  const currentSignStep = Object.values(signSteps).find(step => !step.complete)

  const handleConfirm = () => {
    setCurrentStep('signing')
    Order.TOKEN.place({
      type: data.side,
      makerAsset: data.makerAsset,
      takerAsset: data.takerAsset,
      price: data.price,
      amount: data.amount,
    }, eventHandler).then(res => {
      setCurrentStep('result')
      updateOrders()
    }).catch(() => {
      onClose()
    })
  }

  const eventHandler = (event, data) => {
    console.log(event, data)
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
    }
  }

  return (
    <App.Flex column className={styles.container}>
      <App.Flex className={styles.header} align="center" justify="space-between">
        <App.Text weight={700} size={14} capitalize>
          {`${data.side} ${ data.side === 'buy' ? data.takerAsset.symbol : data.makerAsset.symbol } with ${ data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol }`}
        </App.Text>
        <App.Flex align="center" justify="center" sx={{cursor: 'pointer'}} onClick={onClose}>
          <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
        </App.Flex>
      </App.Flex>
      {
        currentStep !== 'result'
          ? <App.Flex className={styles.steps}>
              <App.Flex flex={1} column align="center" justify="flex-end">
                <App.Text color={['signing', 'blockchain_confirmation', 'sign_error'].includes(currentStep) ? '#53F19C' : '#5E5C6B'} size={10} weight={500}>Confirm</App.Text>
                <App.Flex sx={{width: '100%'}}>
                  <App.Flex className={cn(styles.line, {[styles.active]: ['signing', 'blockchain_confirmation', 'sign_error'].includes(currentStep)})} flex={1} />
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
                        <App.Text color="#B9B8C5" size={12} weight={600} capitalize>Place Order</App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>At Price</App.Text>
                        <App.Text color="#5E5C6B" size={12} weight={600}>
                          { data.price } { data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol }
                        </App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>Amount</App.Text>
                        <App.Text color="#5E5C6B" size={12} weight={600}>
                          { data.amount } { data.side === 'buy' ? data.takerAsset.symbol : data.makerAsset.symbol }
                        </App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>Total</App.Text>
                        <App.Text color="#5E5C6B" size={12} weight={600}>
                          { data.price * data.amount } { data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol }
                        </App.Text>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex column className={styles.border}>
                      <App.Flex justify="space-between" sx={{marginBottom: 8}}>
                        <App.Text color="#5E5C6B" size={10} weight={500}>You Pay</App.Text>
                        <App.Text color="#5E5C6B" size={10} weight={500}>You Receive</App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between" direction={data.side === 'buy' ? 'row' : 'row-reverse'}>
                        <App.Flex align="center">
                          <Image width={25} height={25} src={data.makerAsset.image} style={{marginRight: 8}} />
                          <App.Text size={12} weight={600}>{ data.price * data.amount } {data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol}</App.Text>
                        </App.Flex>
                        <App.Icon icon="arrow-right" />
                        <App.Flex align="center">
                          <Image width={25} height={25} src={data.takerAsset.image} style={{marginRight: 8}} />
                          <App.Text size={12} weight={600}>{ data.amount } {data.side === 'buy' ? data.takerAsset.symbol : data.makerAsset.symbol }</App.Text>
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex align="center" justify="center" className={styles.button} onClick={handleConfirm}>
                      <App.Text color="#09051D" size={15} weight={700} uppercase>CONFIRM { data.side }</App.Text>
                    </App.Flex>
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
            case 'result':
              return (
                <App.Flex column align="center" sx={{paddingTop: 40, paddingBottom: 40}} gap={16} className={styles.content}>
                  <App.Icon icon="check-circle-fill" />
                  <App.Text size={20} weight={700} center>Order In Progress</App.Text>
                  <App.Text size={14} weight={500} center>We will inform you once the order is filled completely. Meanwhile you can keep track through the ongoing order list</App.Text>
                  <App.Flex column className={styles.border} sx={{width: '100%'}}>
                    <App.Flex justify="space-between" direction={data.side === 'buy' ? 'row' : 'row-reverse'}>
                      <App.Flex align="center">
                        <Image width={25} height={25} src={data.makerAsset.image} style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ data.price * data.amount } {data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol}</App.Text>
                      </App.Flex>
                      <App.Icon icon="arrow-right" />
                      <App.Flex align="center">
                        <Image width={25} height={25} src={data.takerAsset.image} style={{marginRight: 8}} />
                        <App.Text size={12} weight={600}>{ data.amount } {data.side === 'buy' ? data.takerAsset.symbol : data.makerAsset.symbol }</App.Text>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                  <App.Button primary sx={{width: '100%', height: 56}} onClick={onClose}>
                    DONE
                  </App.Button>
                </App.Flex>
              )
          }
        })(currentStep)
      }
    </App.Flex>
  )
}

export default PlaceOrder
