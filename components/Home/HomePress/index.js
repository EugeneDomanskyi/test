import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomePress = () => {
  return (
    <App.Container maxWidth={1230}>
      <App.Flex direction={['row', 'column']} fullWidth align={['center', 'flex-start']} gap={[16, 48]} className={styles.container}>
        <App.Flex column>
          <App.Text size={32} weight={600}>Tegro <App.Text inline italic size={32} weight={700} family="Playfair Display">in Press:</App.Text></App.Text>
          <a href="https://press.tegro.com/" target="_blank" rel="noreferrer" className={styles.link}>Press Kit &gt;</a>
        </App.Flex>

        <App.Flex row wrap={[null, true]} flex={1} gap={[0, 16]} align="center">
          <App.Flex center flex={1}>
            <a href="https://www.financialexpress.com/business/brandwagon-wazirx-co-founder-siddharth-menon-and-supergaming-launch-tegro-a-web3-games-ecosystem-marketplace-2435783/" target="_blank" rel="noreferrer" className={styles.press}>
              <Image src="/images/home/press-4.png" width={141} height={18} alt="" />
            </a>
          </App.Flex>

          <App.Flex center flex={1}>
            <a href="https://coinmarketcap.com/uk/currencies/tegro/" target="_blank" rel="noreferrer" className={styles.press}>
              <Image src="/images/landing/press-3.png" width={113} height={32} alt="" />
            </a>
          </App.Flex>

          <App.Flex center flex={1}>
            <a href="https://www.moneycontrol.com/news/business/web3-games-asset-marketplace-tegro-crosses-100k-signups-8951881.html" target="_blank" rel="noreferrer" className={styles.press}>
              <Image src="/images/landing/press-1.png" width={107} height={25} alt="" />
            </a>
          </App.Flex>

          <App.Flex center flex={1}>
            <a href="https://cointelegraph.com/press-releases/wazirx-co-founder-and-supergaming-announce-tegro-a-web3-games-marketplace" target="_blank" rel="noreferrer" className={styles.press}>
              <Image src="/images/landing/press-2.png" width={116} height={27} alt="" />
            </a>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomePress