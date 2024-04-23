import { useEffect, useState } from 'react'
import { useAccount, useWalletClient, usePublicClient } from 'wagmi'
import { getChains, getChainId, switchChain, getAccount, watchAccount, signMessage, disconnect as wagmiDisconnect } from '@wagmi/core'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import { wagmiConfig } from '@/libs/Chains.lib'
import { useSelector } from 'react-redux'

class Callbacks {
  constructor() {
    this.success = null
    this.failed = null
  }

  set = (success, failed) => {
    this.success = success
    this.failed = failed
  }

  callSuccess = (address) => {
    if (this.success) {
      this.success(address.toLowerCase())
    }
  }

  callFailed = () => {
    if (this.failed) {
      this.failed()
    }
  }
}

const useWalletConnect = () => {
  const debugMode = process.env.NEXT_PUBLIC_APP_ENV != 'production'

  const { openConnectModal, connectModalOpen } = useConnectModal()
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const chains = useSelector(({ $app }) => $app.chains)

  const [wallet, setWallet] = useState(null)
  const [connection, setConnection] = useState({ loading: true, connected: false })

  const callbacks = new Callbacks()

  useEffect(() => {
    const unwatch = watchAccount(wagmiConfig, {
      onChange(data) {
        if (data.isConnected || data.isDisconnected) {
          const connected = data.isConnected
          if (connection.loading || connection.connected != connected) {
            setConnection({ loading: false, connected: connected })
          }
        }
      },
    })
    
    return unwatch
  }, [])

  useEffect(() => {
    if (connectModalOpen && isConnected) {
      callbacks.callSuccess(address)
    }
  }, [connectModalOpen, isConnected])

  useEffect(() => {
    setWallet(isConnected ? address.toLowerCase() : null)
  }, [address, isConnected])

  const connect = () => {
    return new Promise((resolve, reject) => {
      const account = getAccount(wagmiConfig)
      if (account.isConnected && account.address) {
        resolve(account.address.toLowerCase())
      }

      if (openConnectModal) {
        openConnectModal()
      }

      callbacks.set(resolve, reject)
    })
  }

  const disconnect = async () => {
    await wagmiDisconnect(wagmiConfig)
  }

  const changeNetwork = async (newChainCode) => {
    const wallet = await connect()
    if (wallet) {
      const currentChain = getCurrentChain()
      const newChain = getChainByCode(newChainCode)

      if (newChain) {
        if (currentChain?.id == newChain.id) {
          return true
        }

        try {
          const result = await switchChain(wagmiConfig, { chainId: newChain.id })
          return result.hasOwnProperty('id')
        } catch (error) {
          debugMessage('Change Network', error)
          return false
        }
      } else {
        debugMessage('Change Network', `Chain code ${newChainCode} does not support`)
        return false
      }
    } else {
      debugMessage('Change Network', 'Counld not get a wallet address')
      return false
    }
  }

  const scanUrl = (address, type = 'tx', chain) => {
    return `${chain?.scanUrl}/${type}/${address}`
  }

  const sign = async (message = address) => {
    const wallet = await connect()
    if (wallet) {
      try {
        const result = await signMessage(wagmiConfig, { message })
        return result
      } catch (error) {
        debugMessage('Error during sign a message', error)
        return false
      }
    }
    
    debugMessage('Sign', `Counld not get a wallet`)
    return false
  }

  const getConnectorInfo = () => {
    const defaultValue = {
      name: 'Unknown',
      logo: '/images/default-wallet-logo.png',
    }

    const account = getAccount(wagmiConfig)
    if (account?.connector) {
      defaultValue.name = account.connector?.id ?? ''

      switch (account.connector?.id) {
        case 'metaMask': return {name: 'MetaMask', logo: '/images/metamask-logo.png'}
        case 'walletConnect': return {name: 'WalletConnect', logo: '/images/walletconnect-logo.png'}
        case 'magic': return {name: 'Magic.Link', logo: '/images/magic-logo.png'}
        case 'rainbow': return {name: 'Rainbow', logo: '/images/rainbow-logo.png'}
        case 'coinbase': return {name: 'CoinBase', logo: '/images/coinbase-logo.png'}
        case 'brave': return {name: 'Brave', logo: '/images/brave-logo.png'}
        case 'safe': return {name: 'Safe', logo: '/images/safe-logo.png'}
        default: return defaultValue
      }
    }

    return defaultValue
  }

  const getChainByCode = (chainCode) => {
    return chains.find(item => item.code.toLowerCase() == chainCode.toLowerCase())
  }

  const getCurrentChain = () => {
    const currentChainId = getChainId(wagmiConfig)
    return chains.find(item => item.id == currentChainId)
  }

  const debugMessage = (key, msg) => {
    if (debugMode) {
      console.log(key, msg)
    }
  }

  return {
    wallet,
    connection,
    walletClient,
    publicClient,
    connect,
    disconnect,
    changeNetwork,
    scanUrl,
    sign,
    getConnectorInfo,
  }
}

export default useWalletConnect