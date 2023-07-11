import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useWalletClient } from 'wagmi'
import { Magic } from 'magic-sdk'

import { getClient } from '@reservoir0x/reservoir-sdk'

import Contracts from '@/libs/contracts.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import BuyModalInput from '@/components/BuyModal/BuyModalInput'
/* import RedeemModalApprove from '@/components/RedeemModal/RedeemModalApprove'
import RedeemModalConfirm from '@/components/RedeemModal/RedeemModalConfirm'
import RedeemModalComplete from '@/components/RedeemModal/RedeemModalComplete' */

const getMagic = (chains) => {
  const [initialChain] = chains.map((chain) => {
    const [rpcUrl] = chain.rpcUrls.public.http
    return {
      rpcUrl: rpcUrl,
      chainId: chain.id,
    }
  })
  return new Magic(process.env.NEXT_PUBLIC_MAGIC_LINK_API_KEY, {
    network: initialChain
  })
}

const BuyModal = ({ token, onClose, onStep }) => {
  const { data: walletClient } = useWalletClient()
  const { network, getBalance, chains } = useWalletConnect()

  const [amount, setAmount] = useState('')
  const [step, setStep] = useState(0)
  const [hash, setHash] = useState()

  const contracts = new Contracts(network(token?.chain)?.gasLimit)
  const chainId = network(token.chain)?.chainId

  useEffect(() => {
    onStep(step)
  }, [step])

  const handleCloseModal = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleApprove = async () => {
    setStep(2)

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

  const handleBuy = async (nfts) => {
    // setStep(1)
    const totalPrice = nfts.reduce((acc, nft) => acc+nft.price, 0)
    const balance = await getBalance()
    if (totalPrice > balance) {
      const magic = getMagic(chains)
      const isMagicConnected = await magic.wallet.getInfo().catch(() => null)
      if (isMagicConnected) {
        await magic.wallet.showUI()
      }
    }

    const items = nfts.map(item => {
      return {
        token: `${token.ognft}:${item.id}`,
        quantity: 1,
      }
    })
    getClient()?.actions.buyToken({
      items,
      chainId,
      wallet: walletClient,
      onProgress: (steps) => {
        console.log(steps)
      }
    })
  }

  const handleBack = () => {
    setStep(0)
  }

  const handleAmountChange = (val) => {
    setAmount(val)
  }

  const contentComponent = () => {
    switch (step) {
      case 0: return <BuyModalInput token={token} amount={amount} onAmountChange={handleAmountChange} onBuy={handleBuy} />
      // case 1: return <RedeemModalApprove token={token} amount={amount} onBack={handleBack} onApprove={handleApprove} />
      // case 2: return <RedeemModalConfirm token={token} amount={amount} />
      // case 3: return <RedeemModalComplete token={token} amount={amount} onComplete={handleCloseModal} />
    }
  }

  return contentComponent()
}

export default BuyModal