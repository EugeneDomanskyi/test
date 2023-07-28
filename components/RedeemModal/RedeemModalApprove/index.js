import Image from 'next/image'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'

import styles from './styles.module.scss'

const RedeemModalApprove = ({ token, amount, onBack, onApprove }) => {
  const { isMobile } = usePropsHelper()

  const handleApprove = () => {
    trackEvent('Dex Confirm Redeem Clicked', {
      'Token': token.collection,
      'Quantity': amount,
    })

    if (onApprove) {
      onApprove()
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

  return (
    <App.Flex column>
      <App.Flex column gap={32} align="center" className={styles.content}>
        <App.Flex column gap={4}>
          <App.Text center size={20} weight={600}>Confirm Redemption Details</App.Text>
          <App.Text center color="#B9B8C5">Review the details before confirming the redemption</App.Text>
        </App.Flex>

        <App.Flex row center gap={8}>
          <div className={styles.imgRound}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={16}>{amount} {token.code} NFT20</App.Text>

          <App.Icon icon="arrow-right" />

          <div className={styles.imgSquare}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <App.Text right size={16}>{amount} {token.collection} NFT</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={32} className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large onClick={handleApprove} sx={{ width: isMobile ? '100%' : 200 }}>Redeem</App.Button>

        <App.Flex row gap={8} onClick={handleBack} className={styles.link}>
          <App.Icon icon="chevron-left" />
          <App.Text color="#B9B8C5">Go Back</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default RedeemModalApprove