import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const MintModalConfirm = ({ nfts, token, onMint }) => {
  const handleMint = () => {
    if (onMint) {
      onMint()
    }
  }

  return (
    <App.Flex column>
      <App.Flex column gap={32} align="center" className={styles.content}>
        <App.Flex column gap={4}>
          <App.Text center size={20} weight={600}>Mint NFT20 Tokens</App.Text>
          <App.Text center color="#B9B8C5">Your NFTs are being converted into NFT20 tokens</App.Text>
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

      <App.Flex column center gap={32} className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large onClick={handleMint} sx={{ width: 200 }}>Mint</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default MintModalConfirm