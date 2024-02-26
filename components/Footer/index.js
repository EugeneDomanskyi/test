import { useSelector } from 'react-redux'
import Link from 'next/link'

import App from '@/components/App'

import styles from './styles.module.scss'

const Footer = () => {
  const tournament = useSelector(({ $tournament }) => $tournament.current)

  return (
    <App.Container fluid className={styles.footer}>
      <App.Flex column>
        <App.Flex direction={['row', 'column']} fullWidth align="flex-start" gap={[60, 40]} className={styles.container}>
          <App.Flex row align="center" justify={['flex-start', 'space-between']} gap={24} width={['auto', '100%']}>
            <Link href="/" style={{ lineHeight: 0 }}>
              <App.Icon icon="logo" />
            </Link>

            {/* <div className={styles.line} />

            <Link href="https://tegro.com">
              <App.ButtonGradient icon="arrow-45">tegro.com</App.ButtonGradient>
            </Link> */}
          </App.Flex>

          <App.Flex column flex={1} gap={40}>
            <App.Flex direction={['row', 'column']} gap={[20, 40]}>
              <App.Flex column gap={16} flex={1}>
                <App.Text italic size={18} weight={700} family="Playfair Display" color="#7364FF">Ecosystem</App.Text>

                <App.Flex column gap={8}>
                  <App.Text size={16} weight={400} height={1}>
                    <Link href="/exchange" className={styles.link}>Testnet Exchange</Link>
                  </App.Text>

                  {tournament?.alias ? (
                    <App.Text size={16} weight={400} height={1}>
                      <Link href={`/tournament/${tournament?.alias}`} className={styles.link}>Earn</Link>
                    </App.Text>
                  ) : null}

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://tegro.readme.io/" target="_blank" rel="noreferrer" className={styles.link}>API Docs</a>
                  </App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={16} flex={1}>
                <App.Text italic size={18} weight={700} family="Playfair Display" color="#7364FF">Contact</App.Text>

                <App.Flex column gap={8}>
                  <App.Text size={16} weight={400} height={1}>
                    <a href="mailto:partnerships@tegro.com" className={styles.link}>General Contact</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="mailto:kevin@tegro.com" className={styles.link}>Marketing Collaboration</a>
                  </App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={16} flex={1}>
                <App.Text italic size={18} weight={700} family="Playfair Display" color="#7364FF">Trade on Tegro Testnet</App.Text>

                <App.Flex column gap={8}>
                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://testnet.tegro.com/exchange/mumbai/0xec8e3f97af8d451e9d15ae09428cbd2a6931e0ba?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" className={styles.link}>POKEBALLS USDT</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://testnet.tegro.com/exchange/mumbai/0x6464e14854d58feb60e130873329d77fcd2d8eb7?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" className={styles.link}>KRYPTONITE USDT</a>
                  </App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          
            <App.Flex direction={['row', 'column']} flex={1} gap={[20, 40]}>
              <App.Flex column gap={16} flex={1}>
                <App.Text italic size={18} weight={700} family="Playfair Display" color="#7364FF">Explore</App.Text>

                <App.Flex column gap={8}>
                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://blog.tegro.com/career?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Careers</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://www.notion.so/Tegro-Help-Center-fd988c0a96a04939a5abad30ee5d22e9?pvs=4" target="_blank" rel="noreferrer" className={styles.link}>Support</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://tegro.com/privacy-policy?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Privacy Policy</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://tegro.com/terms?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Terms & Conditions</a>
                  </App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={16} flex={1}>
                <App.Text italic size={18} weight={700} family="Playfair Display" color="#7364FF">Resources</App.Text>

                <App.Flex column gap={8}>
                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://tegro.com/blog?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Blog</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://press.tegro.com/?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>News Room</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://press.tegro.com/press-kit/logo?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Press Kit</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://tegro.readme.io/" target="_blank" rel="noreferrer" className={styles.link}>Docs</a>
                  </App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex column gap={16} flex={1}>
                <App.Text italic size={18} weight={700} family="Playfair Display" color="#7364FF">Social</App.Text>

                <App.Flex column gap={8}>
                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://twitter.com/TegroFi" target="_blank" rel="noreferrer" className={styles.link}>X</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://discord.com/invite/tegro" target="_blank" rel="noreferrer" className={styles.link}>Discord</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://t.me/TegroChat" target="_blank" rel="noreferrer" className={styles.link}>Telegram</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://www.youtube.com/@tegrofi" target="_blank" rel="noreferrer" className={styles.link}>YouTube</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://www.linkedin.com/company/tegrofi" target="_blank" rel="noreferrer" className={styles.link}>LinkedIn</a>
                  </App.Text>

                  <App.Text size={16} weight={400} height={1}>
                    <a href="https://tegro.substack.com/" target="_blank" rel="noreferrer" className={styles.link}>Substack</a>
                  </App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
        
        <App.Flex center className={styles.bottom}>
          <App.Text size={14} weight={400}>All Rights Reserved</App.Text>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default Footer