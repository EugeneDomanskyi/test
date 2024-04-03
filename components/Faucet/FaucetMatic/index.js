import { useDispatch } from 'react-redux'

import useWalletConnect from '@/myhooks/wallet-connect'

import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetMatic = ({ onComplete }) => {
  const { wallet } = useWalletConnect()

  const dispatch = useDispatch()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(wallet)
    dispatch($alert.set.success({ title: 'Address copied to clipboard', text: 'The address has been successfully copied to clipboard' }))
  }

  const handleContinue = () => {
    if (onComplete) (
      onComplete()
    )
  }

  return (
    <App.Flex column full gap={32} justify={['flx-start', 'space-between']} className={styles.container}>
      <App.Flex center column gap={[16, 8]}>
        <App.Text center size={24} weight={600} height={1}>Claim Matic</App.Text>
        <App.Text center weight={400} color="#B9B8C5">Unlock Free Matic Tokens: A Step-by-Step Guide to Faucet Redemption</App.Text>
      </App.Flex>

      <App.Flex column fullWidth gap={16}>
        <App.Flex column gap={[16, 8]} className={styles.stepBox}>
          <App.Text size={[14, 12]} weight={400} color="#B9B8C5" height={1}>Step 1</App.Text>
          <App.Text size={[16, 14]} weight={600} height={1}>Go to <a href="https://mumbaifaucet.com/" target="_blank" rel="noreferrer" className={styles.link}>mumbaifaucet.com</a> <a href="https://mumbaifaucet.com/" target="_blank" rel="noreferrer"><App.Icon icon="external-link" width={12} height={12} /></a></App.Text>
        </App.Flex>

        <App.Flex column gap={[16, 8]} className={styles.stepBox}>
          <App.Text size={[14, 12]} weight={400} color="#B9B8C5" height={1}>Step 2</App.Text>
          <App.Flex column gap={8}>
            <App.Text size={[16, 14]} weight={600} height={1.2}>Copy and paste your wallet address in the input field</App.Text>
            <App.Flex row align="center" justify={['flex-start', 'space-between']} gap={32} className={styles.address}>
              <App.Text size={[16, 14]} weight={400} height={1} color="#B9B8C5" className={styles.full}>{wallet}</App.Text>
              <App.Text size={[16, 14]} weight={400} height={1} color="#B9B8C5" className={styles.short}>{`${(wallet ?? '').slice(0, 14)}...${(wallet ?? '').slice(-14)}`}</App.Text>
              <App.Flex center className={styles.copy} onClick={handleCopy}>
                <App.Icon icon="copy3" width={24} height={24} color="#5E5C6B" />
              </App.Flex>
            </App.Flex>
            <App.Text size={12} weight={400} height={1.2} color="#B9B8C5">Double-check your wallet selection, especially if you have multiple.</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column gap={[16, 8]} className={styles.stepBox}>
          <App.Text size={[14, 12]} weight={400} color="#B9B8C5" height={1}>Step 3</App.Text>
          <App.Text size={[16, 14]} weight={600} height={1}>Tap on the &apos;Send me MATIC&apos; button</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={16}>
        <App.Text center size={16} weight={400} height={1.2} color="#B9B8C5">After finishing Step 3, return to this page to proceed further</App.Text>
        <App.Button primary xl fitWidth center onClick={handleContinue}>Refresh Page</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetMatic