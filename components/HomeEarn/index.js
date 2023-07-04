import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeEarn = () => {
  return (
    <App.Container>
      <App.Flex column align="center" gap={64}>
        <App.Flex column align="center" gap={24}>
          <App.Text center size={[40, 28]} weight={700} height={1}>Earn With NFT-20</App.Text>
          <App.Text center size={[20, 16]} weight={700} height={[1, 1.4]} color="#B9B8C5">Start making money passively with a few clicks. Sit back & enjoy</App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} center gap={22}>
          <App.Frame width={186} height={186} radius={24} padding={0} background="linear-gradient(180deg, #171036 0%, rgba(23, 16, 54, 0.00) 100%), #0E0B23" gradient="linear-gradient(#401698, #29015B)">
            <App.Flex center width="100%" height="100%">
              <App.Text center size={16}>Mint</App.Text>
            </App.Flex>
          </App.Frame>

          <App.Flex center width={118} height={118} className={styles.arrow}>
            <Image src="/images/arrow.png" width={118} height={23} alt="" />
          </App.Flex>

          <App.Frame width={186} height={186} radius={24} padding={0} background="linear-gradient(180deg, #171036 0%, rgba(23, 16, 54, 0.00) 100%), #0E0B23" gradient="linear-gradient(#401698, #29015B)">
            <App.Flex center width="100%" height="100%">
              <App.Text center size={16}>Adding to the<br />Liquidity pool</App.Text>
            </App.Flex>
          </App.Frame>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeEarn