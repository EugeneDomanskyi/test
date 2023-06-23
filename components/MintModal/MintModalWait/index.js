import Image from 'next/image'

import App from '@/components/App'

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
    <App.Flex column gap={32} align="center" className={styles.content}>
      <div className={styles.loader} />

      <App.Flex column gap={4}>
        <App.Text center size={20} weight={600}>{getTexts().title}</App.Text>
        <App.Text center color="#B9B8C5">{getTexts().subtitle}</App.Text>
      </App.Flex>

      <App.Flex row center gap={8}>
        <div className={styles.imgRound}>
          <Image src={token.image} width={25} height={25} alt="" />
        </div>

        <App.Text right size={16}>{nfts.length} {token.collection} NFT{nfts.length > 1 ? 's' : ''}</App.Text>

        <App.Icon icon="arrow-right" />

        <div className={styles.imgSquare}>
          <Image src={token.image} width={25} height={25} alt="" />
        </div>

        <App.Text right size={16}>{nfts.length} {token.code} NFT20</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default MintModalWait