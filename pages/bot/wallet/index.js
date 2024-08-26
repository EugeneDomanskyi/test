import useWagmiHelper from '@/myhooks/useWagmiHelper'

import WagmiHelper from '@/libs/WagmiHelper'

import App from '@/components/App'
import { useEffect, useState } from 'react'

const Wallet = () => {
  const { wallet, connection, connect } = useWagmiHelper()

  const [disconnected, setDisconnected] = useState(false)

  useEffect(() => {
    if (!connection.loading) {
      if (!connection.connected && !disconnected) {
        handleConnect()
      }
    }
  }, [connection, disconnected])

  const handleConnect = async () => {
    const wallet = await connect()
    if (!wallet) {
      return
    }

    handleBackToMiniApp()
  }

  const getShortWallet = () => {
    if (wallet) {
      const n = 4
      return wallet.substr(0, n) + '...' + wallet.substr(wallet.length - n)
    }

    return ''
  }

  const handleDisconnect = () => {
    setDisconnected(true)
    WagmiHelper.disconnect()
  }

  const handleBackToMiniApp = () => {
    window.location.href = 'tg://resolve?domain=local_tegro_bot'
  }

  return (
    <App.Flex full center>
      {connection.loading ? (
        <App.Loader size={32} />
      ) : (
        connection.connected ? (
          <App.Flex column center gap={16}>
            <App.Text size={16} weight={600}>{getShortWallet()}</App.Text>
            <App.Button primary2 onClick={handleDisconnect}>Disconnect</App.Button>
            <App.Button primary2 outlined onClick={handleBackToMiniApp}>Back to MiniApp</App.Button>
          </App.Flex>
        ) : (
          <App.Flex column center gap={16}>
            <App.Button primary2 onClick={handleConnect}>Connect Wallet</App.Button>
            <App.Button primary2 outlined onClick={handleBackToMiniApp}>Back to MiniApp</App.Button>
          </App.Flex>
        )
      )}
    </App.Flex>
  )
}

export default Wallet