import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import WagmiHelper from '@/libs/WagmiHelper'

import App from '@/components/App'
import { useSelector } from 'react-redux'

const Wallet = () => {
  const { query } = useRouter()
  const hash = query.hash

  const { wallet, connection, connect } = useWagmiHelper()

  const [disconnected, setDisconnected] = useState(false)

  const userRegistered = useSelector(({ $app }) => $app.userRegistered)

  useEffect(() => {
    if (!connection.loading) {
      if (!connection.connected && !disconnected) {
        handleConnect()
      }
    }
  }, [connection, disconnected])

  useEffect(() => {
    if (userRegistered && hash) {
      handleAssignWallet()
    }
  }, [userRegistered])

  const handleAssignWallet = async () => {
    const assignRes = await $bot.api.assignWalletToUser({wallet_address: wallet, hash})
    console.log('assignRes', assignRes);
    handleBackToMiniApp()
  }

  const handleConnect = async () => {
    const wallet = await connect()
    if (!wallet) {
      return
    }
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
    window.location.href = 'tg://resolve?domain=local_tegro_bot&start=returning'
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