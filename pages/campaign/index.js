import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'

import { trackEvent, getPageName } from '@/libs/analytics.lib'
import useWalletConnect from '@/myhooks/wallet-connect'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingPage = () => {
  const router = useRouter()
  const { wallet, connect, getConnectorName } = useWalletConnect()

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      trackEvent('Wallet Connect Clicked', {
        'Source': getPageName(),
      })

      const result = await connect()
      if (result) {
        router.push('/earn')
        const walletName = await getConnectorName()
        trackEvent('Wallet Connect Success', {
          'Source': getPageName(),
          'Type': walletName,
        })
      }
    }
  }

  return (
    <App.Flex className={styles.container}>
      <Link href="/" style={{ lineHeight: 0 }}>
        <App.Flex column gap={4} className={styles.logoWrapper}>
          <div className={styles.logo}>
            <div className={styles.badge}>
              BETA
            </div>
            <App.Icon icon="tegro" width={117} height={25} />
          </div>

          <App.Text size={10} weight={500}>Trade Efficiently On-Chain</App.Text>
        </App.Flex>
      </Link>

      <App.Flex column className={styles.leftSide}>
        <App.Flex column className={styles.contentWrapper} gap={32}>
          <App.Flex column align="flex-start">
            <App.Text size={[55, 36]} weight={800}>
              Trade on Tegro &<br />
              Share Rewards worth
            </App.Text>
            
            <App.Text size={64} weight={800} className={styles.rewardText}>
              $10,000

              <App.Text size={64} weight={800} className={styles.rewardTextShadow}>
                $10,000
              </App.Text>
            </App.Text>
            
            <App.Text size={16} weight={500} color="#B9B8C5" className={styles.subText}>
              Connect your wallet and trade your favorite tokens on Tegro. Collect TKeys and open Mystery Boxes containing USDT, PEPE, SHIB, and other token rewards.
            </App.Text>
          </App.Flex>

          <App.Flex align="center" className={styles.stepsWrapper}>
            <App.Flex className={styles.stepBlock} gap={16}>
              <App.Flex center className={styles.stepCircle}>1</App.Flex>
              <App.Text size={14} weight={600}>Connect Wallet</App.Text>
            </App.Flex>

            <App.Flex className={styles.stepLine} />

            <App.Flex className={styles.stepBlock} gap={16}>
              <App.Flex center className={styles.stepCircle}>2</App.Flex>
              <App.Text size={14} weight={600}>Trade Tokens</App.Text>
            </App.Flex>

            <App.Flex className={styles.stepLine} />

            <App.Flex className={styles.stepBlock} gap={16}>
              <App.Flex center className={styles.stepCircle}>3</App.Flex>
              <App.Text size={14} weight={600}>Earn Rewards</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex align="center" className={styles.buttonsWrapper} gap={32}>
            <App.Button rounded primary sx={{paddingLeft: 32, paddingRight: 32}} onClick={handleConnectWallet}>
              Connect Wallet Now
              <App.Icon icon="stars" />
            </App.Button>
            
            <App.Text className={styles.link}>
              Don't have a wallet?
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>

      <App.Flex center className={styles.rightSide}>
        <Image src="/animations/campaign.gif" width={448} height={448} alt="" />

        <App.Flex className={styles.bottomSection}>
          <App.Flex center gap={8}>
            <App.Flex className={styles.circle} />
            <App.Flex gap={4}>
              <App.Text color="#B9B8C5" size={12} weight={700}>1,46,654</App.Text>
              <App.Text color="#B9B8C5" size={12}>wallets connected so far</App.Text>
            </App.Flex>
          </App.Flex>
          
          <App.Flex center gap={8}>
            <App.Flex className={styles.circle} />
            <App.Flex gap={4}>
              <App.Text color="#B9B8C5" size={12} weight={700}>$2,13,463</App.Text>
              <App.Text color="#B9B8C5" size={12}>rewards distributed so far</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default LandingPage