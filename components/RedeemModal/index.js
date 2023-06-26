import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import cn from 'classnames'

import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import App from '@/components/App'
import RedeemModalInput from '@/components/RedeemModal/RedeemModalInput'
import RedeemModalApprove from '@/components/RedeemModal/RedeemModalApprove'
import RedeemModalConfirm from '@/components/RedeemModal/RedeemModalConfirm'
import RedeemModalComplete from '@/components/RedeemModal/RedeemModalComplete'

import styles from './styles.module.scss'

const RedeemModal = ({ token }) => {
  const { wallet, network, scanUrl } = useWalletConnect()

  const dispatch = useDispatch()

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState(0)
  const [hash, setHash] = useState()

  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  const handleCloseModal = () => {
    dispatch($modal.set.close())
  }

  const handleApprove = async () => {
    setStep(2)

    /* const isApproved = await contracts.isApprovedForAll(token.ognft, wallet, token.nft20)
    if ( ! isApproved) {
      let hash = await contracts.setApprovalForAll(token.ognft, token.nft20)
      if (hash.error) {
        setStep(0)
        setLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return
      }

      const approve = await contracts.waitForTransaction(hash)
      if (approve.error) {
        setStep(0)
        setLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return 
      }
    } */

    const txHash = await contracts.withdrawNFTs(amount, token.nft20)
    if (txHash.error) {
      setStep(0)
      toast.error("Redeem NFTs failed", { pauseOnFocusLoss: false })
      return
    }

    setHash(txHash)
    const result = await contracts.waitForTransaction(txHash)
    if (result.error) {
      setStep(0)
      toast.error("Redeem NFTs failed", { pauseOnFocusLoss: false })
      return 
    }

    toast.success("Your Redemption Was Successful!", { pauseOnFocusLoss: false })
    setStep(3)
  }

  const handleRedeem = () => {
    setStep(1)
  }

  const handleBack = () => {
    setStep(0)
  }

  const handleAmountChange = (val) => {
    setAmount(val)
  }

  const contentComponent = () => {
    switch (step) {
      case 0: return <RedeemModalInput token={token} amount={amount} onAmountChange={handleAmountChange} onRedeem={handleRedeem} />
      case 1: return <RedeemModalApprove token={token} amount={amount} onBack={handleBack} onApprove={handleApprove} />
      case 2: return <RedeemModalConfirm token={token} amount={amount} />
      case 3: return <RedeemModalComplete token={token} amount={amount} onComplete={handleCloseModal} />
    }
  }

  return (
    <div className={styles.walletModal}>
      <div className={styles.header}>
        <div className={styles.closeButton} onClick={handleCloseModal}>
          <App.Icon icon="cross" color="#fff" />
        </div>

        <div className={styles.titleRow}>
          <div className={styles.title}>Redeem</div>
          <div className={styles.subtitle}>Convert {token.code} NFT20 into {token.collection} NFTs</div>

          <App.Flex row gap={8}>
            <App.Flex column flex={1} gap={2}>
              <App.Text size={10} center color="#53F19C">Redeem NFT20</App.Text>
              <div className={cn(styles.progress, styles.active)} />
            </App.Flex>

            <App.Flex column flex={1} gap={2}>
              <App.Text size={10} center color={step == 3 ? '#53F19C' : '#605884'}>Successful</App.Text>
              <div className={cn(styles.progress, {[styles.active]: step == 3})} />
            </App.Flex>
          </App.Flex>
        </div>
      </div>

      <div className={styles.content}>
        {contentComponent()}
      </div>

      <div className={styles.footer}>
        <App.Flex row gap={8} align="center">
          <App.Icon icon="lock-star-fill" />
          <App.Flex column >
            <App.Text>1 NFT = 1 NFT20</App.Text>
            <App.Text>ALL NFT20 tokens are backed 1:1 by NFTs</App.Text>
            <App.Text>Check our verified contracts <a href={scanUrl(token.nft20, 'address', token.chain)} target="_blank" rel="noreferrer" className={styles.link}>here</a></App.Text>
          </App.Flex>
        </App.Flex>
      </div>
    </div>
  )
}

export default RedeemModal