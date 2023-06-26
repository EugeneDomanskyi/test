import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import cn from 'classnames'

import AlchemyLibrary from '@/libs/alchemy.lib'
import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import App from '@/components/App'
import MintModalSelect from '@/components/MintModal/MintModalSelect'
import MintModalApprove from '@/components/MintModal/MintModalApprove'
import MintModalWait from '@/components/MintModal/MintModalWait'
import MintModalConfirm from '@/components/MintModal/MintModalConfirm'
import MintModalComplete from '@/components/MintModal/MintModalComplete'

import styles from './styles.module.scss'

const MintModal = ({ token }) => {
  const { wallet, connect, network, scanUrl } = useWalletConnect()

  const dispatch = useDispatch()

  const [nfts, setNfts] = useState([])
  const [nftsLoading, setNftsLoading] = useState(true)
  const [approveLoading, setApproveLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [hash, setHash] = useState()
  const [preparedNfts, setPreparedNfts] = useState([])

  const alchemy = new AlchemyLibrary(network(token?.chain)?.alchemy)
  const contracts = new Contracts(network(token?.chain)?.gasLimit)

  useEffect(() => {
    if (wallet) {
      getNfts()
    } else {
      (async () => {
        await connect()
      })()
    }

    return () => {
      setNfts([])
    }
  }, [wallet])

  const getNfts = async () => {
    setNftsLoading(true)
    const nfts = await alchemy.getNftsForOwner(wallet, token.type)
    nfts.sort((a, b) => {
      if (a.collectionAddress == token.ognft && b.collectionAddress != token.ognft) {
        return -1
      }

      if (a.collectionAddress != token.ognft && b.collectionAddress == token.ognft) {
        return 1
      }

      return 0
    })
    setNfts(nfts)
    setNftsLoading(false)
  }

  const handleCloseModal = () => {
    dispatch($modal.set.close())
  }

  const componentStep = () => {
    switch (step) {
      case 0: return <MintModalSelect nfts={nfts} token={token} loading={nftsLoading} buttonLoading={approveLoading} onContinue={handleContinue} />
      case 1: return <MintModalApprove nfts={preparedNfts} token={token} onBack={handleBack} onApprove={handleApprove} />
      case 2: return <MintModalWait type="approve" nfts={preparedNfts} token={token} />
      case 3: return <MintModalConfirm nfts={preparedNfts} token={token} onMint={handleMint} />
      case 4: return <MintModalWait type="confirm" nfts={preparedNfts} token={token} />
      case 5: return <MintModalWait type="wait" nfts={preparedNfts} token={token} />
      case 6: return <MintModalComplete nfts={preparedNfts} token={token} onComplete={handleComplete} />
    }
  }

  const handleContinue = async (selectedNfts) => {
    setPreparedNfts(selectedNfts)

    setApproveLoading(true)
    const isApproved = await contracts.isApprovedForAll(token.ognft, wallet, token.nft20)
    if ( ! isApproved) {
      setStep(1)
    } else {
      setStep(3)
    }
    setApproveLoading(false)
  }

  const handleBack = () => {
    setStep(0)
  }

  const handleApprove = async () => {
    setStep(2)

    let txHash = await contracts.setApprovalForAll(token.ognft, token.nft20)
    if (txHash.error) {
      setStep(0)
      toast.error("Approve collection failed", { pauseOnFocusLoss: false })
      return
    }

    setHash(txHash)
    const approve = await contracts.waitForTransaction(txHash)
    if (approve.error) {
      setStep(0)
      toast.error("Approve collection failed", { pauseOnFocusLoss: false })
      return 
    }

    setStep(3)
  }

  const handleMint = async () => {
    setStep(4)

    let txHash = null
    if (preparedNfts.length > 1) {
      const ids = []
      for (const nft of preparedNfts) {
        ids.push(nft.id)
      }

      txHash = await contracts.depositNFTs(ids, token.nft20)
    } else {
      const nft = preparedNfts[0]
      txHash = await contracts.depositNFT(nft.id, token.nft20)
    }

    if (txHash.error) {
      setStep(0)
      toast.error("Mint NFTs failed", { pauseOnFocusLoss: false })
      return
    }

    setStep(5)
    setHash(txHash)
    const result = await contracts.waitForTransaction(txHash)
    if (result.error) {
      setStep(0)
      toast.error("Mint NFTs failed", { pauseOnFocusLoss: false })
      return 
    }

    setStep(6)
  }

  const handleComplete = () => {
    handleCloseModal()
  }

  return (
    <div className={styles.walletModal}>
      <div className={styles.header}>
        <div className={styles.closeButton} onClick={handleCloseModal}>
          <App.Icon icon="cross" color="#fff" />
        </div>

        <div className={styles.titleRow}>
          <div className={styles.title}>Mint {token.code} NFT20</div>
          <div className={styles.subtitle}>Convert {token.collection} NFT to {token.code} NFT20</div>

          <App.Flex row gap={8}>
            <App.Flex column flex={1} gap={2}>
              <App.Text size={10} center color="#53F19C">Pick NFTs</App.Text>
              <div className={cn(styles.progress, styles.active)} />
            </App.Flex>

            <App.Flex column flex={1} gap={2}>
              <App.Text size={10} center color={step >= 2 ? '#53F19C' : '#605884'}>Approve Transfer</App.Text>
              <div className={cn(styles.progress, {[styles.active]: step >= 2})} />
            </App.Flex>

            <App.Flex column flex={1} gap={2}>
              <App.Text size={10} center color={step == 6 ? '#53F19C' : '#605884'}>Mint NFT20</App.Text>
              <div className={cn(styles.progress, {[styles.active]: step == 6})} />
            </App.Flex>
          </App.Flex>
        </div>
      </div>

      <div className={styles.content}>
        {componentStep()}
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

export default MintModal