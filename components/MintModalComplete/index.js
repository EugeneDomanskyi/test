import Image from 'next/image'
import cn from 'classnames'

import AppFlex from '@/components/AppFlex'
import AppIcon from '@/components/AppIcon'
import AppText from '@/components/AppText'
import AppButton from '@/components/AppButton'

import styles from './styles.module.scss'

const MintModalComplete = ({ nfts, token, onComplete }) => {
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

        <AppText center size={20} weight={600}>NFT20 Mint Successful!</AppText>

        <AppFlex row center gap={8} className={styles.container}>
          <div className={styles.imgRound}>
            <Image src={token.image} width={64} height={64} alt="" />
          </div>

          <AppText color="#B9B8C5">You have minted {nfts.length} {token.code} NFT20 tokens</AppText>
        </AppFlex>
      </AppFlex>

      <AppFlex center className={cn(styles.box, styles.borderTop)}>
        <AppButton primary large onClick={handleComplete} sx={{ width: 200 }}>Got It</AppButton>
      </AppFlex>
    </AppFlex>
  )
}

export default MintModalComplete