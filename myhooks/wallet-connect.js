import { useEffect, useState } from 'react'
import { useAccount, useNetwork, useWalletClient } from 'wagmi'
import { signMessage, disconnect as wagmiDisconnect, getNetwork, getAccount, switchNetwork, fetchBalance, fetchToken } from '@wagmi/core'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { CHAINS } from '@/config'

const useWalletConnect = () => {
  const debugMode = process.env.NEXT_PUBLIC_APP_ENV != 'production'

  const { openConnectModal, connectModalOpen } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { chain, chains } = useNetwork()
  const { data: walletClient } = useWalletClient()

  const [modalOpen, setModalOpen] = useState(false)
  const [wallet, setWallet] = useState(null)
  const [blockchain, setBlockchain] = useState('')
  const [blockchains, setBlockchains] = useState([])
  const [callback, setCallback] = useState({ success: null, failed: null })

  const usdt = {
    polygon: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    ethereum: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    goerli: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    arbitrum: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    bnb: '0x55d398326f99059fF775485246999027B3197955',
  }

  const jsonRpcEndpoints = {
    1: [
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ],
    56: [
      `https://bnbsmartchain-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ],
    137: [
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
    ],
  }

  const isContractAddress = (str) => {
    const contractAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
    return contractAddressRegExp.test(str)
  }

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
  }, [modalOpen, isConnected])

  useEffect(() => {
    setWallet(isConnected ? address.toLowerCase() : null)
  }, [address, isConnected])

  useEffect(() => {
    setBlockchain(isConnected ? chain.name : null)
  }, [chain, isConnected])

  useEffect(() => {
    setBlockchains(isConnected ? chains.map(item => {
      return {
        id: item.id,
        name: item.name,
        code: item.name.toLowerCase(),
        currency: item.nativeCurrency.symbol,
        decimals: item.nativeCurrency.decimals,
      }
    }) : [])
  }, [chains, isConnected])

  const disconnect = () => {
    wagmiDisconnect()
  }

  const network = (currentChain) => {
    return CHAINS.find(chain => chain.code === currentChain)
  }

  const getBalance = async (token, full = false) => {
    const wallet = await connect()
    if (wallet) {
      try {
        const balance = await fetchBalance({
          address: wallet,
          token,
        })

        return full ? balance : balance.formatted
      } catch (error) {
        return 0
      }
    }

    return 0
  }

  const getPrice = async (from, to) => {
    const result = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${from}&vs_currencies=${to}`)
    if (result && result.status == 200) {
      const json = await result.json()
      return json[from][to]
    }

    return 0
  }

  const scanUrl = (address, type = 'tx', chain) => {
    return `${chain.scanUrl}/${type}/${address}`
  }

  const changeNetwork = async (newChain) => {
    const wallet = await connect()
    if (wallet) {
      const { chain, chains } = getNetwork()
      const chainData = network(newChain)
      if (chain.network == chainData.network) {
        return true
      }

      // if ( ! chains.some(ch => ch.network == chainData.connect)) {
      //   debugMessage('Change Network', `The Network ${newChain} does not support`)
      //   return false
      // }

      try {
        // const chainId = chains.find(ch => ch.network == chainData.connect)?.id
        const result = await switchNetwork({ chainId: chainData.id })
        // console.log('result is', result)
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

  const getBasicInfo = async (address, chainId) => {
    try {
      const result = await fetchToken({ address, chainId })
      return result
    } catch (error) {
      return null
    }
  }

  const debugMessage = (key, msg) => {
    if (debugMode) {
      console.log(key, msg)
    }
  }

  return {
    wallet,
    blockchain,
    blockchains,
    walletClient,
    isContractAddress,
    connect,
    disconnect,
    network,
    changeNetwork,
    getBalance,
    getPrice,
    scanUrl,
    usdt,
    jsonRpcEndpoints,
    getBasicInfo,
  }
}

export default useWalletConnect