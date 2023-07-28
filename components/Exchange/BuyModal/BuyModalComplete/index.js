import Image from 'next/image'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const BuyModalComplete = ({type, currentCollection, amount, price, blockchain, onComplete}) => {
  console.log(type)
  const { isMobile } = usePropsHelper()

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <App.Flex column>
      <App.Flex column gap={8} align="center" className={styles.content}>
        <App.Flex center className={styles.success}>
          <App.Icon icon="check-circle-fill" />
        </App.Flex>

        <App.Text center size={20} weight={600}>{type === 'place' ? 'Order Placed Successfully!' : 'Buy Successfully!'}</App.Text>

        <App.Flex row center gap={8} className={styles.container}>
          <div className={styles.imgRound}>
            <Image src={currentCollection.image} width={64} height={64} alt="" />
          </div>
          {
            type === 'place'
              ? <App.Text color="#B9B8C5">{amount} {currentCollection.name} for {price} {blockchain.wrapped.shortName} each</App.Text>
              : <App.Text color="#B9B8C5">You have buy {amount} {currentCollection.name} {`NFT${amount > 1 ? `s` : ''}`}</App.Text>
          }
        </App.Flex>
      </App.Flex>

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large onClick={handleComplete} sx={{ width: isMobile ? '100%' : 200 }}>Got It</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default BuyModalComplete