import useWagmiHelper from '@/myhooks/useWagmiHelper'

import WagmiHelper from '@/libs/WagmiHelper'

import App from '@/components/App'
import { useEffect } from 'react'

const Wallet = () => {
  const { wallet, connection, connect } = useWagmiHelper()

  useEffect(() => {
    if (!connection.loading) {
      if (!connection.connected) {
        handleConnect()
      }
    }
  }, [connection])

  const handleConnect = async () => {
    const wallet = await connect()
    if (!wallet) {
      return
    }

    handleCloseWindow()
  }

  const getShortWallet = () => {
    if (wallet) {
      const n = 4
      return wallet.substr(0, n) + '...' + wallet.substr(wallet.length - n)
    }

    return ''
  }

  const handleDisconnect = () => {
    WagmiHelper.disconnect()
    handleCloseWindow()
  }

  const handleCloseWindow = () => {
    window.close()
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
          </App.Flex>
        ) : (
          <App.Button primary2 onClick={handleConnect}>Connect Wallet</App.Button>
        )
      )}
    </App.Flex>
  )
}

export default Wallet