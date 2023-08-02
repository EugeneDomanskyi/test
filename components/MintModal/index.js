import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import AlchemyLibrary from '@/libs/alchemy.lib'
import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import MintModalSelect from '@/components/MintModal/MintModalSelect'
import MintModalApprove from '@/components/MintModal/MintModalApprove'
import MintModalWait from '@/components/MintModal/MintModalWait'
import MintModalConfirm from '@/components/MintModal/MintModalConfirm'
import MintModalComplete from '@/components/MintModal/MintModalComplete'

const MintModal = ({ token, onClose, onStep }) => {
  const { wallet, connect, network } = useWalletConnect()

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

  useEffect(() => {
    onStep(step)
  }, [step])

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
    if (onClose) {
      onClose()
    }
  }

  const componentStep = () => {
    switch (step) {
      case 0: return <MintModalSelect nfts={nfts} token={token} loading={nftsLoading} buttonLoading={approveLoading} onContinue={handleContinue} />
      case 1: return <MintModalApprove nfts={preparedNfts} token={token} onBack={handleBack} onApprove={handleApprove} />
      case 2: return <MintModalWait type="approve" nfts={preparedNfts} token={token} />
      case 3: return <MintModalConfirm nfts={preparedNfts} token={token} onMint={handleMint} />
      case 4: return <MintModalWait type="confirm" nfts={preparedNfts} token={token} />
      case 5: return <MintModalWait type="wait" nfts={preparedNfts} token={token} />
      case 6: return <MintModalComplete nfts={preparedNfts} token={token} onComplete={handleCloseModal} />
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

    trackEvent('Mint Successful', {
      'Token': token.collection,
      'Quantity': preparedNfts.length,
    })

    setStep(6)
  }

  return componentStep()
}

export default MintModal