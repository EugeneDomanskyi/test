import useWalletConnect from '@/myhooks/wallet-connect'

import TokenIcon from '@/components/TokenIcon'
import AppButton from '@/components//AppButton'
import AppIcon from '@/components/AppIcon'

import styles from './styles.module.scss'

const MintModalConfirm = ({ step, showStep, nfts, txid, token, onCancel }) => {
  const { scanUrl } = useWalletConnect()

  const handleCancel = () => {
    onCancel()
  }

  const selectedNftsCount = () => {
    let count = 0
    for (const nft of nfts) {
      count += nft.amount * 1
    }

    return count
  }

  return (
    <>
      <div className={styles.infoRow}>
        <div className={styles.infoCollection}>
          <TokenIcon currency={token.code} />

          <div className={styles.infoCollectionRight}>
            <div className={styles.infoCollectionName}>{token.collection}</div>
            <div className={styles.infoCollectionId}>Id: {token.code}</div>
          </div>
        </div>

        {nfts.length > 0 ? (
          <div className={styles.selectedCount}>{selectedNftsCount()} Selected</div>
        ) : null}
      </div>

      <div className={styles.content}>
        <div className={styles.walletLogo}>
          <AppIcon icon="wallet" width={32} height={32} color="#fff" />
        </div>
        
        {showStep ? (<div className={styles.step}>Step {step}/2</div>) : null}

        <div className={styles.message}>
          {step == 1 ? (
            'You Need to Approve this Mint in your Wallet'
          ) : step == 2 ? (
            'Actual Mint Approval'
          ) : null}
        </div>

        <div className={styles.bottomText}>
          {step == 1 ? (
            <>
              {txid ? (
                <AppButton href={scanUrl(txid, 'tx', token.chain)} loading>
                  Check transaction details
                </AppButton>
              ) : null}
            </>
          ) : step == 2 ? (
            <>
              Minting {selectedNftsCount()} {token.code} NFT{selectedNftsCount() > 1 ? 's' : ''}
            </>
          ) : null}
        </div>
      </div>

      <div className={styles.bottom}>
        <AppButton primary disabled loading fullWidth>
          {step == 1 ? (
            'Wallet Approval'
          ) : step == 2 ? (
            'Actual Mint Approval'
          ) : null}
        </AppButton>

        <div className={styles.backLink} onClick={handleCancel}>
          &lt; Cancel & Back to Selection
        </div>
      </div>
    </>
  )
}

export default MintModalConfirm