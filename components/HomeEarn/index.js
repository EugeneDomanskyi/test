import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeEarn = () => {
  return (
    <App.Container className={styles.container}>
      <App.Flex column align="center" gap={64}>
        <App.Flex column align="center" gap={24}>
          <App.Text center size={[40, 28]} weight={700} height={1}>Earn With NFT-20</App.Text>
          <App.Text center size={[20, 16]} weight={700} height={[1, 1.4]} color="#B9B8C5">Start making money passively with a few clicks. Sit back & enjoy</App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} center gap={22}>
          <App.Flex column gap={32} width={300}>
            <App.Frame width={300} height={180} radius={24} padding={1} background="url('/images/earn-1.png') center/cover" gradient="linear-gradient(#FFD600, #DB880C)">
            </App.Frame>

            <App.Text center size={20} weight={700} gradient="linear-gradient(#FFD600, #DB880C)">
              Transform NFTs into NFT-20 tokens for a dazzling upgrade!
            </App.Text>
          </App.Flex>

          <App.Flex center width={118} height={118} className={styles.arrow}>
            <Image src="/images/arrow-gold.png" width={118} height={23} alt="" />
          </App.Flex>

          <App.Flex column gap={32} width={300}>
            <App.Frame width={300} height={180} radius={24} padding={1} background="url('/images/earn-2.gif') center/cover" gradient="linear-gradient(#FFD600, #DB880C)">
            </App.Frame>

            <App.Text center size={20} weight={700} gradient="linear-gradient(#FFD600, #DB880C)">
              Stake NFT-20 tokens in liquidity pools and earn fees on trades!
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeEarn