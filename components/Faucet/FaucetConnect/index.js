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
        <App.Text center size={24} weight={600} height={1}>Welcome to Tegro Testnet</App.Text>
        <App.Text center size={16} weight={600} color="rgba(255, 255, 255, 0.60)">Connect Wallet to Grab FREE Testnet Tokens!</App.Text>
      </App.Flex>

      <App.Flex column gap={32}>
        <App.Flex row justify="center" gap={4}>
        </App.Flex>
      </App.Flex>

      <App.Flex column center fullWidth gap={8}>
        <App.Text center weight={400} color="rgba(255, 255, 255, 0.60)">Trade Tokens For FREE on the Testnet and Collect Points towards the Leaderboard!</App.Text>
        <App.Button primary large fitWidth center onClick={handleConnect}>Connect Wallet</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetConnect