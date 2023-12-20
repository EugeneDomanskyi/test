import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetToken = ({ onComplete }) => {
  const handleClaim = () => {
    // Claim token

    if (onComplete) (
      onComplete()
    )
  }

  return (
    <App.Flex column align="center" justify="space-between" className={styles.container}>
      <App.Flex center column gap={[16, 8]}>
        <App.Text center size={24} weight={600} height={1}>Claim Token</App.Text>
        <App.Text center weight={400} color="#B9B8C5">Collect the tokens and start trading on Tegro testnet</App.Text>
      </App.Flex>

      <App.Flex direction={['row', 'column']} center fullWidth gap={16}>
        <App.Flex direction={['column', 'row']} center gap={32} className={cn(styles.box, styles.btc)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-btc.png" width={70} height={70} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>0.0023 BTC</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex direction={['column', 'row']} center gap={32} className={cn(styles.box, styles.eth)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-eth.png" width={70} height={70} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>0.044 ETH</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex direction={['column', 'row']} center gap={32} className={cn(styles.box, styles.usdt)}>
          <App.Flex center className={styles.logo}>
            <Image src="/images/circle-usdt.png" width={70} height={70} alt="" />
            <div className={styles.color} />
          </App.Flex>

          <App.Flex row className={styles.text}>
            <App.Text size={16} weight={600} height={1}>100 USDT</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={16}>
        <App.Button primary xl fitWidth center onClick={handleClaim}>Claim Token</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetToken