import Image from 'next/image'

import { useSelector } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'

import $app from '@/store/app'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetConnect = ({ onComplete }) => {
  const blockchain = useSelector($app.get.blockchain)

  const { connect, changeNetwork } = useWalletConnect()

  const handleConnect = async () => {
    const result = await connect()

    const network = await changeNetwork(blockchain.code)
    if (!network) {
      return
    }

    if (result && onComplete) (
      onComplete()
    )
  }

  return (
    <App.Flex column align="center" justify="space-between" className={styles.container}>
      <App.Flex column center gap={[16, 8]} className={styles.headerMain}>
        <App.Text center size={24} weight={600} height={1}>Connect a Wallet</App.Text>
        <App.Text center weight={400} color="#B9B8C5">Please connect your wallet in order to continue</App.Text>
      </App.Flex>

      <App.Flex column center gap={8} className={styles.header}>
        <App.Text center size={24} weight={700} height={1}>Claim $100 worth mock BTC, ETH & USDT</App.Text>
        <App.Text center weight={400} color="gba(255, 255, 255, 0.50)">Every Four Hours. Explore the Crypto World Risk-Free!</App.Text>
      </App.Flex>

      <App.Flex column gap={32}>
        

        <App.Flex row justify="center" gap={4}>
        </App.Flex>
      </App.Flex>

      <App.Flex column center fullWidth gap={16}>
        <App.Flex column center gap={[16, 8]} className={styles.header}>
          <App.Text center size={24} weight={600} height={1}>Connect a Wallet</App.Text>
          <App.Text center weight={400} color="#B9B8C5">Please connect your wallet in order to continue</App.Text>
        </App.Flex>

        <App.Button primary xl fitWidth center onClick={handleConnect}>Connect Wallet</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetConnect