import Image from 'next/image'

import AppFlex from '@/components/AppFlex'
import AppText from '@/components/AppText'
import AppIcon from '@/components/AppIcon'

import styles from './styles.module.scss'

const MintModalWait = ({ type, nfts, token }) => {
  const getTexts = () => {
    switch (type) {
      case 'approve': return {title: 'Confirm Approval for All', subtitle: 'Proceed in your wallet'}
      case 'confirm': return {title: 'Confirm Mint of NFT20 Tokens', subtitle: 'Proceed in your wallet'}
      case 'wait': return {title: 'Confirming Mint', subtitle: 'Please wait while we confirm mint of your NFT20 Tokens'}
      default: return {title: 'Wait...', subtitle: 'Operation in progress'}
    }
  }

  return (
    <AppFlex column gap={32} align="center" className={styles.content}>
      <div className={styles.loader} />

      <AppFlex column gap={4}>
        <AppText center size={20} weight={600}>{getTexts().title}</AppText>
        <AppText center color="#B9B8C5">{getTexts().subtitle}</AppText>
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
  )
}

export default MintModalWait