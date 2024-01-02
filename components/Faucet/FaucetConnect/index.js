import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetConnect = ({ onComplete }) => {
  const {connect} = useWalletConnect()

  const handleConnect = async () => {
    const result = await connect()

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
          {/* <App.Flex column center gap={8} width={[104, 80]}>
            <a href="https://rainbow.me/" target="_blank" rel="noreferrer">
              <Image src="/images/icon-rainbow.png" width={60} height={60} alt="" />
            </a>
            <App.Text weight={700}>Rainbow</App.Text>
          </App.Flex>

          <App.Flex column center gap={8} width={[104, 80]}>
            <a href="https://metamask.io/" target="_blank" rel="noreferrer">
              <Image src="/images/icon-metamask.png" width={60} height={60} alt="" />
            </a>
            <App.Text weight={700}>MetaMask</App.Text>
          </App.Flex>

          <App.Flex column center gap={8} width={[104, 80]}>
            <a href="https://www.coinbase.com/" target="_blank" rel="noreferrer">
              <Image src="/images/icon-coinbase.png" width={60} height={60} alt="" />
            </a>
            <App.Text weight={700}>Coinbase</App.Text>
          </App.Flex>

          <App.Flex column center gap={8} width={[104, 80]}>
            <a href="https://walletconnect.com/" target="_blank" rel="noreferrer">
              <Image src="/images/icon-walletconnect.png" width={60} height={60} alt="" />
            </a>
            <App.Text nowrap weight={700}>WalletConnect</App.Text>
          </App.Flex> */}
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