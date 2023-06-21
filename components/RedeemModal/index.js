import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import cn from 'classnames'

import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import AppIcon from '@/components/AppIcon'
import AppText from '@/components/AppText'
import AppFlex from '@/components/AppFlex'
import RedeemModalInput from '@/components/RedeemModalInput'

import styles from './styles.module.scss'

const RedeemModal = ({ token }) => {
  const { wallet, network, scanUrl } = useWalletConnect()

  const dispatch = useDispatch()

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState(0)

  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  const handleCloseModal = () => {
    dispatch($modal.set.close())
  }

  const handleApprove = async () => {
    setDepositLoading(true)

    if (amount > balance) {
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

  const handleRedeem = () => {
    
  }

  const handleBack = () => {

  }

  const handleComplete = () => {

  }

  const handleAmountChange = (val) => {
    setAmount(val)
  }

  const contentComponent = () => {
    switch (step) {
      case 0: return <RedeemModalInput token={token} amount={amount} onAmountChange={handleAmountChange} onRedeem={handleRedeem} />
      // case 1: return <RedeemModalApprove token={token} amount={amount} onBack={handleBack} onApprove={handleApprove} />
      // case 2: return <RedeemModalConfirm token={token} amount={amount} />
      // case 3: return <RedeemModalComplete token={token} amount={amount} onComplete={handleComplete} />
    }
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

          <AppFlex row gap={8}>
            <AppFlex column flex={1} gap={2}>
              <AppText size={10} center color="#53F19C">Redeem NFT20</AppText>
              <div className={cn(styles.progress, styles.active)} />
            </AppFlex>

            <AppFlex column flex={1} gap={2}>
              <AppText size={10} center color={step == 3 ? '#53F19C' : '#605884'}>Successful</AppText>
              <div className={cn(styles.progress, {[styles.active]: step == 3})} />
            </AppFlex>
          </AppFlex>
        </div>
      </div>

      <div className={styles.content}>
        {contentComponent()}
      </div>

      <div className={styles.footer}>
        <AppFlex row gap={8} align="center">
          <AppIcon icon="lock-star-fill" />
          <AppFlex column >
            <AppText>1 NFT = 1 NFT20</AppText>
            <AppText>ALL NFT20 tokens are backed 1:1 by NFTs</AppText>
            <AppText>Check our verified contracts <a href={scanUrl(token.nft20, 'address', token.chain)} target="_blank" rel="noreferrer" className={styles.link}>here</a></AppText>
          </AppFlex>
        </AppFlex>
      </div>
    </div>
  )
}

export default RedeemModal