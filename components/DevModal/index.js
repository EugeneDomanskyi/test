import { useSelector } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'
import useApp from '@/myhooks/useApp'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const DevModal = () => {
  const { appPost } = useApp()
  const { wallet, getConnectorInfo, disconnect } = useWalletConnect()

  const blockchain = useSelector($app.get.blockchain)

  const handleDisonnect = () => {
    disconnect()
  }

  const handleReload = () => {
    appPost({ reload: true })
  }

  const handleClearCache = () => {
    appPost({ clear: true })
  }

  return (
    <App.Flex column className={styles.container} gap={16}>
      <App.Flex column>
        <App.Text size={12} color="#B9B8C5">Connected Wallet</App.Text>
        <App.Text>{wallet ?? 'Disconnected'}</App.Text>
      </App.Flex>

      <App.Flex column>
        <App.Text size={12} color="#B9B8C5">Blockchain</App.Text>
        <App.Text>{`${blockchain.name} (${blockchain.id})`}</App.Text>
      </App.Flex>

      <App.Flex column>
        <App.Text size={12} color="#B9B8C5">Connector</App.Text>
        <App.Text>{(getConnectorInfo().name != '' ? getConnectorInfo().name : null) ?? 'Disconnected'}</App.Text>
      </App.Flex>

      <App.Button primary outlined onClick={handleDisonnect}>{wallet ? 'Reconnect Wallet' : 'Connecting...'}</App.Button>
      <App.Button primary outlined onClick={handleReload}>Reload WebView</App.Button>
      <App.Button primary outlined onClick={handleClearCache}>Clear Cache</App.Button>
    </App.Flex>
  )
}

export default DevModal