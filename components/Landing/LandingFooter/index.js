import { usePropsHelper } from '@/myhooks/props-helper'

import Amplitude from '@/libs/amplitude.lib'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingFooter = () => {
  const { isMobile } = usePropsHelper()

  const handlePageEvent = (page) => () => {
    Amplitude.event('Page Visited', {
      'Page Name': page,
    })
  }

  return (
    <App.Flex className={styles.container}>
      <App.Container>
        <App.Flex column gap={32} className={styles.parent}>
          <video autoPlay loop muted className={styles.video}>
            <source src={'/images/landing/protocol.webm'} type="video/webm" />
          </video>

          <App.Flex direction={['row', 'column']} justify="space-between" gap={16}>
            <App.Icon icon="tegro" width={isMobile ? 82 : 198} height={isMobile ? 17 : 42} />

            <App.Flex column width={['60%', '100%']} gap={32}>
              <App.Flex row gap={[0, 12]}>
                <App.Flex column gap={[16, 8]} flex={1}>
                  <App.Text size={[20, 16]} weight={700}>General</App.Text>

                  <App.Flex column gap={8}>
                    <a href="https://blog.tegro.com/career" target="_blank" rel="noreferrer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Careers</App.Text>
                    </a>

                    <a href="https://tegro.com/files/Privacy_Policy.pdf" target="_blank" rel="noreferrer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Privacy Policy</App.Text>
                    </a>

                    <a href="https://tegro.com/files/User_Agreement.pdf" target="_blank" rel="noreferrer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Terms & Conditions</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>

                <App.Flex column gap={[16, 8]} flex={1}>
                  <App.Text size={[20, 16]} weight={700}>Resources</App.Text>

                  <App.Flex column gap={8}>
                    <a href="https://blog.tegro.com/" target="_blank" rel="noreferrer" onClick={handlePageEvent('Blog')}>
                      <App.Text inline size={[16, 12]} color="#4C69FF">Blog</App.Text>
                    </a>

                    <a href="https://blog.tegro.com/tegronomics" target="_blank" rel="noreferrer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Tegronomics</App.Text>
                    </a>

                    <a href="https://press.tegro.com/?utm_source=website" target="_blank" rel="noreferrer" onClick={handlePageEvent('Press')}>
                      <App.Text inline size={[16, 12]} color="#4C69FF">Press Kit</App.Text>
                    </a>

                    <a href="https://x-by-tegro.gitbook.io/x-by-tegro/" target="_blank" rel="noreferrer" onClick={handlePageEvent('Gitbook')}>
                      <App.Text inline size={[16, 12]} color="#4C69FF">Gitbook</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>

                <App.Flex column gap={[16, 8]} flex={1}>
                  <App.Text size={[20, 16]} weight={700}>Contact</App.Text>

                  <App.Flex column gap={8}>
                    <a href="mailto:partnerships@tegro.com" target="_blank" rel="noreferrer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">General Contact</App.Text>
                    </a>

                    <a href="mailto:aditi@tegro.com" target="_blank" rel="noreferrer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Marketing Collaboration</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
              
              <App.Flex row gap={[0, 12]}>
                <App.Flex column gap={[16, 8]} flex={1}>
                  <App.Text size={[20, 16]} weight={700}>Buy Token</App.Text>

                  <App.Flex column gap={8}>
                    <a href="https://tegro.com/exchange/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Buy USDT</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Buy USDC</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Buy wEthereum</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Buy MATIC</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Buy Shiba Inu</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Buy Pepecoin</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">Buy Chainlink</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>

                <App.Flex column gap={[16, 8]} flex={1}>
                  <App.Text size={[20, 16]} weight={700}>Trade</App.Text>

                  <App.Flex column gap={8}>
                    <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">wETH USDT </App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">MATIC USDT</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">USDC USDT</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">SHIB USDT</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">PEPE USDT</App.Text>
                    </a>

                    <a href="https://tegro.com/exchange/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca?utm_source=footer">
                      <App.Text inline size={[16, 12]} color="#4C69FF">LINK USDT</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>

                <App.Flex flex={1} />
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <div className={styles.hr} />

          <App.Text center size={12} color="#9996B1">Tegro © {(new Date()).getFullYear()}</App.Text>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default LandingFooter