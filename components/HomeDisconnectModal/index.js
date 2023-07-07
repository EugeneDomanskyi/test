import App from '@/components/App'
import HomeBalance from '@/components/HomeBalance'

import useWalletConnect from '@/myhooks/wallet-connect'

import styles from './styles.module.scss'

const HomeDisconnectModal = ({ onClose }) => {
  const { disconnect } = useWalletConnect()

  const handleDisconnect = () => {
    disconnect()
    onClose()
  }

  return (
    <App.Flex column>
      <App.Flex row justify="flex-start" className={styles.box}>
        <HomeBalance />
      </App.Flex>

      <App.Flex center className={styles.boxDark}>
        <App.Button large primary onClick={handleDisconnect}>
          <App.Icon icon="logout" />
          Disconnect
        </App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default HomeDisconnectModal