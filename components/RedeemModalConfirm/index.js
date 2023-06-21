import Image from 'next/image'

import AppFlex from '@/components/AppFlex'
import AppText from '@/components/AppText'
import AppIcon from '@/components/AppIcon'

import styles from './styles.module.scss'

const RedeemModalConfirm = ({ token, amount }) => {
  return (
    <AppFlex column gap={32} align="center" className={styles.content}>
      <div className={styles.loader} />

      <AppFlex column gap={4}>
        <AppText center size={20} weight={600}>Confirm Redemption</AppText>
        <AppText center color="#B9B8C5">Proceed in your wallet</AppText>
      </AppFlex>

      <AppFlex row center gap={8}>
        <div className={styles.imgRound}>
          <Image src={token.image} width={25} height={25} alt="" />
        </div>

        <AppText right size={16}>{amount} {token.code} NFT20</AppText>

        <AppIcon icon="arrow-right" />

        <div className={styles.imgSquare}>
          <Image src={token.image} width={25} height={25} alt="" />
        </div>

        <AppText right size={16}>{amount} {token.collection} NFT</AppText>
      </AppFlex>
    </AppFlex>
  )
}

export default RedeemModalConfirm