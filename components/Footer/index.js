import { Fragment, useEffect, useRef } from 'react' 
import { useSelector } from 'react-redux'
import Link from 'next/link'
import moment from 'moment'

import App from '@/components/App'

import styles from './styles.module.scss'

const Footer = () => {
  const footerRef = useRef(null)

  // this is for embed Footer in other websites, like press.tegro.com
  useEffect(() => {
    if (footerRef.current) {
      const height = footerRef.current.getBoundingClientRect().height
      window.parent.postMessage({ height }, '*')
    }
  }, [footerRef])

  return (
    <div ref={footerRef}>
      <App.Container fluid className={styles.footer}>
        <App.Flex column>
          <App.Flex direction={['row', 'column']} fullWidth align="flex-start" justify="space-between" gap={[60, 40]} className={styles.container}>
            <App.Flex column justify={['flex-start', 'space-between']} gap={32} width={['auto', '100%']}>
              <Link href="/" style={{ lineHeight: 0 }}>
                <App.Icon icon="tegro" />
              </Link>

              <App.Flex column>
                <App.Text size={27} weight={600}>The Gen2 DEX</App.Text>
                <App.Text inline size={14} weight={600} color="#A6DC37">for High-Frequency Trading</App.Text>
              </App.Flex>

              <App.Button rounded primary xl sx={{width: 253, background: '#0052FF', alignSelf: 'auto'}} href="https://tegro.com/exchange/base/0x4200000000000000000000000000000000000006?utm_source=homepage&utm_medium=hero&utm_campaign=exchange">
                <App.Text size={16}>Trade on BASE</App.Text>
                <App.Icon icon="base-icon" />
              </App.Button>
            </App.Flex>

            <App.Flex column gap={40}>
              <App.Flex direction={['row', 'column']} gap={[20, 40]}>
                <App.Flex column gap={16} flex={1} sx={{width: 180}}>
                  <App.Text size={16} weight={700} color="#7364FF">Explore</App.Text>

                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={400}>
                      <a href="https://www.notion.so/Tegro-Help-Center-fd988c0a96a04939a5abad30ee5d22e9?pvs=4" target="_blank" rel="noreferrer" className={styles.link}>Support</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/privacy-policy?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Privacy Policy</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/terms?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Terms & Conditions</a>
                    </App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex column gap={16} flex={1} sx={{width: 180}}>
                  <App.Text  size={16} weight={700} color="#7364FF">Contact</App.Text>

                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={400}>
                      <a href="mailto:anmol@tegro.com" className={styles.link}>Partnerships</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="mailto:kevin@tegro.com" className={styles.link}>Marketing Collaboration</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="mailto:anmol@tegro.com" className={styles.link}>General Enquiry</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="mailto:support@tegro.com" className={styles.link}>Support</a>
                    </App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex column gap={16} flex={1} sx={{width: 180}}>
                  <App.Text  size={16} weight={700} color="#7364FF">Trade on Tegro</App.Text>

                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/exchange/base/0x4200000000000000000000000000000000000006?utm_source=homepage&utm_medium=footer&utm_campaign=exchange" className={styles.link}>WETH USDC</a>
                    </App.Text>
                    
                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/exchange/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed?utm_source=homepage&utm_medium=footer&utm_campaign=exchange" className={styles.link}>DEGEN USDC</a>
                    </App.Text>
                    
                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/exchange/base/0x532f27101965dd16442e59d40670faf5ebb142e4?utm_source=homepage&utm_medium=footer&utm_campaign=exchange" className={styles.link}>BRETT USDC</a>
                    </App.Text>
                    
                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/exchange/base/0x4ed4e862860bed51a9570b96d89af5e1b0efefed?utm_source=homepage&utm_medium=footer&utm_campaign=exchange" className={styles.link}>DEGEN USDC</a>
                    </App.Text>
                    
                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/exchange/base/0xac1bd2486aaf3b5c0fc3fd868558b082a531b2b4?utm_source=homepage&utm_medium=footer&utm_campaign=exchange" className={styles.link}>TOSHI USDC</a>
                    </App.Text>
                    
                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/exchange/base/0x7ed613ab8b2b4c6a781ddc97ea98a666c6437511?utm_source=homepage&utm_medium=footer&utm_campaign=exchange" className={styles.link}>AYB USDC</a>
                    </App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            
              <App.Flex direction={['row', 'column']} flex={1} gap={[20, 40]}>
                <App.Flex column gap={16} sx={{width: 180}}>
                  <App.Text  size={16} weight={700} color="#7364FF">Ecosystem</App.Text>

                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.com/exchange" rel="noreferrer" className={styles.link}>Exchange</a>
                    </App.Text>
                  </App.Flex>
                </App.Flex>
                
                <App.Flex column gap={16} sx={{width: 180}}>
                  <App.Text  size={16} weight={700} color="#7364FF">Resources</App.Text>

                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={400}>
                      <a href="https://medium.com/@TegroFi" target="_blank" rel="noreferrer" className={styles.link}>Blog</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://press.tegro.com/?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>News Room</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://press.tegro.com/press-kit/logo?utm_source=homepage&utm_medium=footer&utm_campaign=testnet" target="_blank" rel="noreferrer" className={styles.link}>Press Kit</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.readme.io/reference/introduction-1" target="_blank" rel="noreferrer" className={styles.link}>Documentation</a>
                    </App.Text>
                  </App.Flex>
                </App.Flex>

                <App.Flex column gap={16} flex={1} sx={{width: 180}}>
                  <App.Text  size={16} weight={700} color="#7364FF">Social</App.Text>

                  <App.Flex column gap={8}>
                    <App.Text size={14} weight={400}>
                      <a href="https://twitter.com/TegroFi" target="_blank" rel="noreferrer" className={styles.link}>X</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://discord.com/invite/tegro" target="_blank" rel="noreferrer" className={styles.link}>Discord</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://t.me/TegroChat" target="_blank" rel="noreferrer" className={styles.link}>Telegram</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://www.youtube.com/@tegrofi" target="_blank" rel="noreferrer" className={styles.link}>YouTube</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://www.linkedin.com/company/tegrofi" target="_blank" rel="noreferrer" className={styles.link}>LinkedIn</a>
                    </App.Text>

                    <App.Text size={14} weight={400}>
                      <a href="https://tegro.substack.com/" target="_blank" rel="noreferrer" className={styles.link}>Substack</a>
                    </App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
          
          <App.Flex center className={styles.bottom}>
            <App.Text size={14} weight={400}>© { moment().format('YYYY') } — Tegro</App.Text>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default Footer