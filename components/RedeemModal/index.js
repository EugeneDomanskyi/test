import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import AppIcon from '@/components/AppIcon'
import AppTextField from '@/components/AppTextField'
import AppButton from '@/components/AppButton'

import styles from './styles.module.scss'
import { Stack } from '@mui/material'

const RedeemModal = ({ token }) => {
  const { wallet, network } = useWalletConnect()

  const dispatch = useDispatch()

  const [amount, setAmount] = useState('')
  const [depositLoading, setDepositLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState()

  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  const handleCloseModal = () => {
    dispatch($modal.set.close())
  }

  const handleRedeem = async () => {
    setDepositLoading(true)

    const isApproved = await contracts.isApprovedForAll(token.ognft, wallet, token.nft20)
    if ( ! isApproved) {
      let hash = await contracts.setApprovalForAll(token.ognft, token.nft20)
      if (hash.error) {
        setDepositLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return
      }

      const approve = await contracts.waitForTransaction(hash)
      if (approve.error) {
        setDepositLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return 
      }
    }

    const txHash = await contracts.withdrawNFTs(amount, token.nft20)
    if (txHash.error) {
      setDepositLoading(false)
      toast.error("Mint NFTs failed", { pauseOnFocusLoss: false })
      return
    }

    setTransactionHash(txHash)
    setDepositLoading(false)
  }

  const handleAmountSet = (val) => {
    setAmount(val)
  }

  return (
    <div className={styles.walletModal}>
      <div className={styles.header}>
        <div className={styles.closeButton} onClick={handleCloseModal}>
          <AppIcon icon="cross" color="#fff" />
        </div>

        <div className={styles.titleRow}>
          <div className={styles.title}>Redeem {token.collection} NFT</div>
        </div>
      </div>

      <div className={styles.content}>
        <Stack spacing={2}>
          <AppTextField
            type="number"
            value={amount}
            label="Amount"
            labelFixed
            placeholder={0}
            onChange={handleAmountSet}
          />
          <AppButton primary large fullWidth onClick={handleRedeem} disabled={amount * 1 <= 0}>Redeem</AppButton>
        </Stack>
      </div>
    </div>
  )
}

export default RedeemModal