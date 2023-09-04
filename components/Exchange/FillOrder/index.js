import styles from './styles.module.scss'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import numeral from 'numeral'

import App from '@/components/App'
import Order from '@/libs/structs/Order'

const FillOrder = ({data, onClose}) => {

  const [currentStep, setCurrentStep] = useState('confirming')
  const [showDetails, setShgowDetails] = useState(false)
  const [abilities, setAbilities] = useState({totalAmountOnSell: 0, totalAmountToSell: 0, willSpendAmount: 0, willTakeAmount: 0, orders: []})

  useEffect(() => {
    fetchOrders()
  }, [])

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

  }
  return (
    <App.Flex column className={styles.container}>
      <App.Flex className={styles.header} align="center" justify="space-between">
        <App.Text weight={700} size={14}>{`Buy Water with USDT`}</App.Text>
        <App.Flex align="center" justify="center" onClick={onClose}>
          <App.Icon icon="cross" color="#B9B8C5" width={10} height={10} />
        </App.Flex>
      </App.Flex>
      {
        (step => {
          switch (step) {
            case 'confirming':
              return (
                <App.Flex column flex={1}>
                  <App.Flex column className={styles.content}>
                    <App.Flex className={styles.steps}>
                      <App.Flex flex={1} column align="center" justify="flex-end">
                        <App.Text color="#5E5C6B" size={10} weight={500}>Confirm</App.Text>
                        <App.Flex sx={{width: '100%'}}>
                          <App.Flex className={styles.line} flex={1} />
                        </App.Flex>
                      </App.Flex>
                      <App.Flex flex={1} column align="center" justify="flex-end">
                        <App.Text color="#5E5C6B" size={10} weight={500}>Approve</App.Text>
                        <App.Flex sx={{width: '100%'}}>
                          <App.Flex className={styles.line} flex={1} />
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>
                    <App.Flex column className={styles.border}>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>Type</App.Text>
                        <App.Text color="#B9B8C5" size={12} weight={600}>Taker</App.Text>
                      </App.Flex>
                      <App.Flex justify="space-between">
                        <App.Text color="#5E5C6B" size={12} weight={600}>Limit Price</App.Text>
                        <App.Text color="#B9B8C5" size={12} weight={600}>
                          { data.price } { data.side === 'buy' ? data.makerAsset.symbol : data.takerAsset.symbol }
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
                              <App.Text color="#5E5C6B" size={10} weight={600}>{ order.willTakeMakingAmountFormatted } { data.takerAsset.symbol }</App.Text>
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
          }
        })(currentStep)
      }
      
    </App.Flex>
  )
}

export default FillOrder
