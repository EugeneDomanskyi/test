import Image from 'next/image'
import cn from 'classnames'

import AppFlex from '@/components/AppFlex'
import AppText from '@/components/AppText'
import AppIcon from '@/components/AppIcon'
import AppButton from '@/components/AppButton'

import styles from './styles.module.scss'

const MintModalApprove = ({ nfts, token, onBack, onApprove }) => {
  const handleApprove = () => {
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
    <AppFlex column>
      <AppFlex column gap={32} align="center" className={styles.content}>
        <AppFlex column gap={4}>
          <AppText center size={20} weight={600}>Grant Approval</AppText>
          <AppText center color="#B9B8C5">First, you need to grant approval to our contract</AppText>
        </AppFlex>

        <AppFlex row center gap={8}>
          <div className={styles.imgRound}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <AppText right size={16}>{nfts.length} {token.collection} NFT{nfts.length > 1 ? 's' : ''}</AppText>

          <AppIcon icon="arrow-right" />

          <div className={styles.imgSquare}>
            <Image src={token.image} width={25} height={25} alt="" />
          </div>

          <AppText right size={16}>{nfts.length} {token.code} NFT20</AppText>
        </AppFlex>
      </AppFlex>

      <AppFlex column center gap={32} className={cn(styles.box, styles.borderTop)}>
        <AppButton primary large onClick={handleApprove} sx={{ width: 200 }}>Approve</AppButton>

        <AppFlex row gap={8} onClick={handleBack} className={styles.link}>
          <AppIcon icon="chevron-left" />
          <AppText color="#B9B8C5">Go Back</AppText>
        </AppFlex>
      </AppFlex>
    </AppFlex>
  )
}

export default MintModalApprove