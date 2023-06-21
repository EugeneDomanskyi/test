import Image from 'next/image'
import cn from 'classnames'

import AppFlex from '@/components/AppFlex'
import AppText from '@/components/AppText'
import AppIcon from '@/components/AppIcon'
import AppButton from '@/components/AppButton'

import styles from './styles.module.scss'

const RedeemModalComplete = ({ token, amount, onComplete }) => {
  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <AppFlex column>
      <AppFlex column gap={8} align="center" className={styles.content}>
        <AppFlex center className={styles.success}>
          <AppIcon icon="check-circle-fill" />
        </AppFlex>

        <AppText center size={20} weight={600}>Your Redemption Was Successful!</AppText>

        <AppFlex row center gap={8} className={styles.container}>
          <div className={styles.imgSquare}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <AppText color="#B9B8C5">You have redeemed {amount} {token.collection} NFTs</AppText>
        </AppFlex>
      </AppFlex>

      <AppFlex center className={cn(styles.box, styles.borderTop)}>
        <AppButton primary large onClick={handleComplete} sx={{ width: 200 }}>Got It</AppButton>
      </AppFlex>
    </AppFlex>
  )
}

export default RedeemModalComplete