import { useSelector } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'

import AppButton from '@/components/AppButton'

import styles from './styles.module.scss'

const MintModalComplete = ({ nfts, token, txid, onComplete }) => {
  const { scanUrl } = useWalletConnect()

  const handleComplete = () => {
    onComplete()
  }

  const selectedNftsCount = () => {
    let count = 0
    for (const nft of nfts) {
      count += nft.amount * 1
    }

    return count
  }

  return (
    <div className={styles.content}>
      <div className={styles.title}>
        Congrats!
      </div>

      <div className={styles.text}>
        <div className={styles.topText}>
          {selectedNftsCount()} NFT{selectedNftsCount() > 1 ? 's' : ''} was succesfully minted!
        </div>

        <AppButton href={scanUrl(txid, 'tx', token.chain)}>
          Check transaction details
        </AppButton>
      </div>

      <AppButton primary onClick={handleComplete} style={{width: '50%'}}>
        Nice!
      </AppButton>
    </div>
  )
}

export default MintModalComplete