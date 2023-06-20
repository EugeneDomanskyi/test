import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { signMessage, disconnect, getNetwork, getAccount, switchNetwork } from '@wagmi/core'
import { useConnectModal } from '@rainbow-me/rainbowkit'

const useWalletConnect = () => {
  const debugMode = process.env.NEXT_PUBLIC_APP_ENV != 'production'

  const { openConnectModal, connectModalOpen } = useConnectModal()
  const { address, isConnected } = useAccount()

  const [modalOpen, setModalOpen] = useState(false)
  const [wallet, setWallet] = useState(null)
  const [callback, setCallback] = useState({ success: null, failed: null })

  const connect = () => {
    return new Promise((resolve, reject) => {
      const account = getAccount()
      if (account.isConnected && account.address) {
        resolve(account.address.toLowerCase())
      }

      if (openConnectModal) {
        setModalOpen(true)
        openConnectModal()
      }

      setCallback({
        success: (address) => {
          resolve(address)
        },

        failed: () => {
          reject()
        },
      })
    })
  }

  useEffect(() => {
    if (modalOpen && isConnected) {
      setModalOpen(false)

      if (callback.success) {
        callback.success(address.toLowerCase())
      }
    }

    setWallet(isConnected ? address.toLowerCase() : null)
  }, [modalOpen, isConnected])

  const network = (currentChain) => {
    switch (currentChain) {
      case 'goerli': return {
        name: 'Goerli',
        server: 'eth-goerli',
        connect: 'goerli',
        alchemy: 'ETH_GOERLI',
        currency: 'ETH',
        gasLimit: 60000,
        scanDomain: 'https://goerli.etherscan.io/',
        color: '#617DEA',
        chainId: 5,
      }
      case 'ethereum': return {
        name: 'Ethereum',
        server: 'eth-mainet',
        connect: 'homestead',
        alchemy: 'ETH_MAINNET',
        currency: 'ETH',
        gasLimit: 60000,
        scanDomain: 'https://etherscan.io/',
        color: '#617DEA',
        chainId: 1,
      }
      case 'mumbai': return {
        name: 'Mumbai',
        server: 'polygon-testnet',
        connect: 'maticmum',
        alchemy: 'MATIC_MUMBAI',
        currency: 'MATIC',
        gasLimit: 250000,
        scanDomain: 'https://mumbai.polygonscan.com/',
        color: '#8247e5',
        chainId: 80001,
      }
      case 'polygon': return {
        name: 'Polygon',
        server: 'matic-mainet',
        connect: 'matic',
        alchemy: 'MATIC_MAINNET',
        currency: 'MATIC',
        gasLimit: 250000,
        scanDomain: 'https://polygonscan.com/',
        color: '#8247e5',
        chainId: 137,
      }
      case 'bnb': return {
        name: 'BNB',
        server: 'bnb',
        connect: 'bnb',
        alchemy: 'BNB',
        currency: 'BNB',
        gasLimit: 250000,
        scanDomain: 'https://bscscan.com/',
        color: '#FBDA3C',
        chainId: 56,
      }
      default: return null
    }
  }

  const scanUrl = (address, type = 'tx', chain) => {
    switch (chain.toLowerCase()) {
      case 'goerli': return `https://goerli.etherscan.io/${type}/${address}`
      case 'ethereum': return `https://etherscan.io/${type}/${address}`
      case 'mumbai': return `https://mumbai.polygonscan.com/${type}/${address}`
      case 'polygon': return `https://polygonscan.com/${type}/${address}`
      default: return null
    }
  }

  const changeNetwork = async (newChain) => {
    const wallet = await connect()
    if (wallet) {
      const { chain, chains } = getNetwork()
      const chainData = network(newChain)
      if (chain.network == chainData.connect) {
        return true
      }

      if ( ! chains.some(ch => ch.network == chainData.connect)) {
        debugMessage('Change Network', `The Network ${newChain} does not support`)
        return false
      }

      try {
        const chainId = chains.find(ch => ch.network == chainData.connect)?.id
        const result = await switchNetwork({ chainId })
        console.log('result is', result)
        return result.hasOwnProperty('id')
      } catch (error) {
        debugMessage('Change Network', error)
        return false
      }
    }

    debugMessage('Change Network', 'Counld not get a wallet address')
    return false
  }

  const sign = async (message = address) => {
    const wallet = await connect()

    if (wallet) {
      try {
        const result = await signMessage({
          message,
        })
        return result
      } catch (error) {
        debugMessage('Error during sign a message', error)
        return false
      }
    }
    
    debugMessage('Sign', `Counld not get a wallet`)
    return false
  }

  const debugMessage = (key, msg) => {
    if (debugMode) {
      console.log(key, msg)
    }
  }

  return { wallet, connect, network, changeNetwork, scanUrl }
}

export default useWalletConnect