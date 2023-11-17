import Image from 'next/image'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingFounders = () => {
  const { isMobile } = usePropsHelper()

  return (
    <App.Flex column align="center" gap={16} className={styles.container}>
      <h2>Founders</h2>

      {/* <App.Flex center width={['60%', '100%']}>
        <App.Text center size={[16, 10]} height={1.2} color="#B9B8C5">Our founding team introduced cryptocurrency trading to 10 million Indians with WazirX - India&#39;s largest crypto exchange with $40B+ volumes. With Tegro, we&#39;re shaping the next wave of decentralized trading for Tokens and NFTs, targeting the next 100 million traders globally!</App.Text>
      </App.Flex> */}

      <App.Flex row center gap={[28, 0]} fullWidth>
        <App.Flex column align="center" gap={24} className={styles.box}>
          <App.Flex center className={styles.circle}>
            <Image src="/images/landing/sid.png" width={isMobile ? 120 : 177} height={isMobile ? 120 : 177} alt="" />
          </App.Flex>

          <App.Flex column gap={8}>
            <App.Text size={[20, 16]} center uppercase height={1}>Siddharth Menon</App.Text>
            <App.Text size={[13, 12]} center color="#B9B8C5">
              Founder & CEO<br />
              {/* Talks about #wazirx, #blockchain, and #cryptocurrencies */}
            </App.Text>
          </App.Flex>

          <App.Flex row center gap={16}>
            <a href="https://www.linkedin.com/in/siddharthmenon" target="_blank" rel="noreferrer">
              <App.Flex center className={styles.social}>
                <App.Icon icon="linkedin" />
              </App.Flex>
            </a>

            <a href="https://twitter.com/BuddhaSource" target="_blank" rel="noreferrer">
              <App.Flex center className={styles.social}>
                <App.Icon icon="twitter" width={17} height={14} />
              </App.Flex>
            </a>
          </App.Flex>
        </App.Flex>

        <App.Flex column align="center" gap={24} className={styles.box}>
          <App.Flex center className={styles.circle}>
            <Image src="/images/landing/ashish.png" width={isMobile ? 120 : 177} height={isMobile ? 120 : 177} alt="" />
          </App.Flex>

          <App.Flex column gap={8}>
            <App.Text size={[20, 16]} center uppercase height={1}>ASHISH RAWAT</App.Text>
            <App.Text size={[13, 12]} center color="#B9B8C5">
              Co-Founder and COO<br />
            </App.Text>
          </App.Flex>

          <App.Flex row center gap={16}>
            <a href="https://www.linkedin.com/in/ashish-rawat-5a533697/" target="_blank" rel="noreferrer">
              <App.Flex center className={styles.social}>
                <App.Icon icon="linkedin" />
              </App.Flex>
            </a>

            <a href="https://twitter.com/ashish24rawat" target="_blank" rel="noreferrer">
              <App.Flex center className={styles.social}>
                <App.Icon icon="twitter" width={17} height={14} />
              </App.Flex>
            </a>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default LandingFounders