import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const MintModalComplete = ({ nfts, token, onComplete }) => {
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

        <App.Text center size={20} weight={600}>NFT20 Mint Successful!</App.Text>

        <App.Flex row center gap={8} className={styles.container}>
          <div className={styles.imgRound}>
            <Image src={token.image} width={64} height={64} alt="" />
          </div>

          <App.Text color="#B9B8C5">You have minted {nfts.length} {token.code} NFT20 tokens</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex center className={cn(styles.box, styles.borderTop)}>
        <App.Button primary large onClick={handleComplete} sx={{ width: 200 }}>Got It</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default MintModalComplete