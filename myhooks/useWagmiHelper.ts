import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

import WagmiHelper from '@/libs/WagmiHelper'

const useWagmiHelper = () => {
  const { address, isConnected } = useAccount()
  const { openConnectModal, connectModalOpen } = useConnectModal()

  const [connection, setConnection] = useState({ loading: true, connected: false })
  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    const unwatch = WagmiHelper.watchConnection((result: { loading: boolean, connected: boolean }) => {
      if (result.loading != connection.loading || result.connected != connection.connected) {
        setConnection(result)
      }
    })
    
    return unwatch
  }, [])

  useEffect(() => {
    if (connectModalOpen && isConnected) {
      WagmiHelper.connectSuccess()
    }
  }, [connectModalOpen, isConnected])

  useEffect(() => {
    setWallet(isConnected ? address.toLowerCase() : null)
  }, [address, isConnected])

  const connect = () => {
    return new Promise((resolve, reject) => {
      const wallet = WagmiHelper.getWallet()
      if (wallet) {
        resolve(wallet)
      }

      if (openConnectModal) {
        openConnectModal()
      }

      WagmiHelper.setConnectCallbacks(resolve, reject)
    })
  }

  return {
    wallet,
    connection,
    connect,
  }
}

export default useWagmiHelper