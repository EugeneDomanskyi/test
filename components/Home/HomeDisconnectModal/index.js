import App from '@/components/App'

import useWalletConnect from '@/myhooks/wallet-connect'

import styles from './styles.module.scss'

const HomeDisconnectModal = ({ onClose }) => {
  const { wallet, disconnect } = useWalletConnect()

  const handleDisconnect = () => {
    disconnect()
    onClose()
  }

  const shorterAddress = (size = 6) => {
    return wallet ? (wallet.slice(0, size) + '...' + wallet.slice(wallet.length - size)) : ''
  }

  return (
    <App.Flex column>
      <App.Flex row center className={styles.box}>
        <App.Button primary large outlined rounded>
          <App.Flex row gap={8} align="center">
            <App.Flex width={28} height={28} sx={{ borderRadius: '50%', background: 'linear-gradient(91.77deg, #E792E4 2.92%, #B545BE 36.09%, #7931CB 70.47%, #4D42C9 100%)' }} />
            <span>{shorterAddress(15)}</span>
          </App.Flex>
        </App.Button>
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