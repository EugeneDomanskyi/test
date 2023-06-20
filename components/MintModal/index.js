import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import AlchemyLibrary from '@/libs/alchemy.lib'
import Contracts, { defaultOperator, defaultContract } from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'
import $modal from '@/store/modal'

import AppIcon from '@/components/AppIcon'
import AppAddress from '@/components/AppAddress'
import TokenIcon from '@/components/TokenIcon'
import MintModalSelect from '@/components/MintModalSelect'
import MintModalConfirm from '@/components/MintModalConfirm'
import MintModalComplete from '@/components/MintModalComplete'

import styles from './styles.module.scss'

const MintModal = ({ token }) => {
  const { wallet, connect, network, scanUrl } = useWalletConnect()

  const dispatch = useDispatch()

  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(true)
  const [depositLoading, setDepositLoading] = useState(false)
  const [showStep, setShowStep] = useState(false)
  const [depositStep, setDepositStep] = useState(0)
  const [transactionHash, setTransactionHash] = useState()
  const [preparedNfts, setPreparedNfts] = useState([])

  const alchemy = new AlchemyLibrary(network(token?.chain)?.alchemy)
  const contracts = new Contracts(network(token?.chain)?.gasLimit)
  let nextStep = 1

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
    setLoading(true)
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
    setLoading(false)
  }

  const handleCloseModal = () => {
    dispatch($modal.set.close())
  }

  const componentStep = () => {
    switch (depositStep) {
      case 0: return <MintModalSelect nfts={nfts} token={token} loading={loading} buttonLoading={depositLoading} onSubmit={handleSubmit} />
      case 1: return <MintModalConfirm step={depositStep} token={token} txid={transactionHash} showStep={showStep} nfts={preparedNfts} onCancel={handleCancel} />
      case 2: return <MintModalConfirm step={depositStep} token={token} showStep={showStep} nfts={preparedNfts} onCancel={handleCancel} />
      case 3: return <MintModalComplete nfts={preparedNfts} token={token} txid={transactionHash} onComplete={handleComplete} />
    }
  }

  const handleSubmit = async (selectedNfts = preparedNfts) => {
    setPreparedNfts(selectedNfts)
    setDepositLoading(true)

    const isApproved = await contracts.isApprovedForAll(token.ognft, wallet, token.nft20)
    if ( ! isApproved) {
      setDepositStep(1)
      setShowStep(true)
      nextStep = 2

      let hash = await contracts.setApprovalForAll(token.ognft, token.nft20)
      if (hash.error) {
        setDepositStep(0)
        setShowStep(false)
        nextStep = 1
        setDepositLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return
      }

      setTransactionHash(hash)
      const approve = await contracts.waitForTransaction(hash)
      if (approve.error) {
        setDepositStep(0)
        setShowStep(false)
        nextStep = 1
        setDepositLoading(false)
        toast.error("Approve collection failed", { pauseOnFocusLoss: false })
        return 
      }
    } else {
      nextStep = 2
    }
    
    if (nextStep == 2) {
      setDepositStep(2)
      nextStep = 3

      if (token.type == 'erc1155') {
        let txHash = null
        if (selectedNfts.length > 1) {
          const ids = []
          const amounts = []

          for (const nft of selectedNfts) {
            ids.push(nft.id)
            amounts.push(nft.amount)
          }

          txHash = await contracts.depositNFTs(ids, token.nft20)
        } else {
          const nft = selectedNfts[0]
          txHash = await contracts.depositNFT(nft.id, token.nft20)
        }

        if (txHash.error) {
          setDepositStep(0)
          setShowStep(false)
          nextStep = 1
          setDepositLoading(false)
          toast.error("Mint NFTs failed", { pauseOnFocusLoss: false })
          return
        }

        setTransactionHash(txHash)
      } else {
        let txHash = null
        if (selectedNfts.length > 1) {
          const ids = []
          for (const nft of selectedNfts) {
            ids.push(nft.id)
          }

          txHash = await contracts.depositNFTs(ids, token.nft20)
        } else {
          const nft = selectedNfts[0]
          txHash = await contracts.depositNFT(nft.id, token.nft20)
        }
        console.log(txHash)
        if (txHash.error) {
          setDepositStep(0)
          setShowStep(false)
          nextStep = 1
          setDepositLoading(false)
          toast.error("Mint NFTs failed", { pauseOnFocusLoss: false })
          return
        }

        setTransactionHash(txHash)
      }
      
      if (nextStep == 3) {
        setDepositStep(3)
      }
    }

    setDepositLoading(false)
  }

  const handleCancel = () => {
    setDepositStep(0)
    setShowStep(false)
    nextStep = 1
  }

  const handleComplete = () => {
    handleCloseModal()
  }

  return (
    <div className={styles.walletModal}>
      <div className={styles.header}>
        <div className={styles.closeButton} onClick={handleCloseModal}>
          <AppIcon icon="cross" color="#fff" />
        </div>

        {depositStep < 3 ? (
          <div className={styles.titleRow}>
            <div className={styles.title}>Mint {token.collection} NFT</div>
            <div className={styles.wallet}>
              <AppAddress short={8} muted noCopy address={token.ognft} />
              <a href={scanUrl(token.ognft, 'address', token.chain)} target="_blank" rel="noreferrer">(Check contract details)</a>
            </div>
          </div>
        ) : (
          <div className={styles.collectionHeader}>
            <div className={styles.collectionIcon}>
              <TokenIcon icon={token.image} fit />
            </div>
          </div>
        )}
      </div>

      <div className={styles.content}>
        {componentStep()}
      </div>
      
      {depositStep < 3 ? (
        <div className={styles.openSea}>
          <div className={styles.openSeaSubTitle}>
            Our contracts are verified and you can view them <a href={scanUrl(defaultContract, 'address', token.chain)} target="_blank" rel="noreferrer">here</a>.
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default MintModal