import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetMatic = () => {
  const { wallet } = useWalletConnect()

  return (
    <App.Flex column fullWidth gap={32} sx={{ padding: 32 }}>
      <App.Flex center column gap={16}>
        <App.Text center size={24} weight={600} height={1}>Claim Matic</App.Text>
        <App.Text center weight={400} color="#B9B8C5">Unlock Free Matic Tokens: A Step-by-Step Guide to Faucet Redemption</App.Text>
      </App.Flex>

      <App.Flex column fullWidth gap={16}>
        <App.Flex column gap={16} className={styles.stepBox}>
          <App.Text weight={400} color="#B9B8C5" height={1}>Step 1</App.Text>
          <App.Text size={16} weight={600} height={1}>Go to <a href="https://mumbaifaucet.com/" target="_blank" rel="noreferrer" className={styles.link}>mumbaifaucet.com</a></App.Text>
        </App.Flex>

        <App.Flex column gap={16} className={styles.stepBox}>
          <App.Text weight={400} color="#B9B8C5" height={1}>Step 2</App.Text>

          <App.Flex column gap={8}>
            <App.Text size={16} weight={600} height={1}>Copy and paste your wallet address in the input field</App.Text>
            <App.Flex row center gap={32} className={styles.address}>
              <App.Text size={16} weight={400} height={1} color="#B9B8C5">{wallet}</App.Text>
              <App.Icon icon="copy2" width={32} height={32} />
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetMatic