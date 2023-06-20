import { useEffect, useState } from 'react'
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
import AppText from '../AppText'
import AppLoader from '../AppLoader'

const RedeemModal = ({ token }) => {
  const { wallet, network } = useWalletConnect()

  const dispatch = useDispatch()

  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(0)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState()

  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  useEffect(() => {
    if (wallet && token && token?.nft20) {
      (async () => {
        const result = await contracts.balanceOf(wallet, token.nft20)
        setBalance(Math.floor(result))
        setBalanceLoading(false)
      })()
    }
  }, [wallet, token])

  const handleCloseModal = () => {
    dispatch($modal.set.close())
  }

  const handleRedeem = async () => {
    setLoading(true)

    if (amount > balance) {
      setError('Transfer amount exceeds balance')
      return
    }

    const isApproved = await contracts.isApprovedForAll(token.ognft, wallet, token.nft20)
    if ( ! isApproved) {
      let hash = await contracts.setApprovalForAll(token.ognft, token.nft20)
      if (hash.error) {
        setLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return
      }

      const approve = await contracts.waitForTransaction(hash)
      if (approve.error) {
        setLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return 
      }
    }

    const txHash = await contracts.withdrawNFTs(amount, token.nft20)
    if (txHash.error) {
      setLoading(false)
      toast.error("Redeem NFTs failed", { pauseOnFocusLoss: false })
      return
    }

    setTransactionHash(txHash)
    const result = await contracts.waitForTransaction(txHash)
    if (result.error) {
      setLoading(false)
      toast.error("Redeem NFTs failed", { pauseOnFocusLoss: false })
      return 
    }

    toast.success("Your Redemption Was Successful!", { pauseOnFocusLoss: false })
    setLoading(false)
    handleCloseModal()
  }

  const handleAmountSet = (val) => {
    setError('')
    setAmount(val)
  }

  return (
    <div className={styles.walletModal}>
      <div className={styles.header}>
        <div className={styles.closeButton} onClick={handleCloseModal}>
          <AppIcon icon="cross" color="#fff" />
        </div>

        <div className={styles.titleRow}>
          <div className={styles.title}>Redeem</div>
          <div className={styles.subtitle}>Convert {token.code} NFT20 into {token.collection} NFTs</div>
        </div>
      </div>

      <div className={styles.content}>
        <Stack spacing={2}>
          <AppTextField
            type="number"
            value={amount}
            label="Enter the amount you would like to withdraw"
            labelFixed
            error={error}
            int
            placeholder="0"
            onChange={handleAmountSet}
            onSubmit={handleRedeem}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <AppText>Current balance:</AppText>
            {balanceLoading ? <AppLoader size={14} /> : <AppText>{balance} {token.code}</AppText>}
          </Stack>

          <AppButton primary large fullWidth onClick={handleRedeem} disabled={amount * 1 <= 0 || loading} loading={loading}>Redeem</AppButton>
        </Stack>
      </div>
    </div>
  )
}

export default RedeemModal