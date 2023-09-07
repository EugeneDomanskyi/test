import Image from 'next/image'
import cn from 'classnames'

import { usePropsHelper } from '@/myhooks/props-helper'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingHead = () => {
  const { isMobile } = usePropsHelper()

  const handleXClick = () => {
    window.open('https://x.tegro.com', '_blank')
  }

  return (
    <App.Container className={styles.container}>
      <App.Flex column align="center" gap={24} fullWidth>
        <video autoPlay loop muted className={styles.video}>
          <source src="/images/landing/header.webm" type="video/webm" />
        </video>

        <App.Flex column gap={6}>
          <App.Text center size={[48, 24]} weight={800} height={1}>One Protocol to Rule Them All</App.Text>
          <App.Text center size={[16, 10]} height={1.2} color="#B9B8C5">Limit orders | Orderbook | Aggregated liquidity | Real-time Token & NFT Data</App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} center gap={[40, 24]}>
          <App.Flex className={cn(styles.banner, styles.long)} onClick={handleXClick}>
            <App.Flex className={styles.bannerInner} />

            <App.Flex align="center" justify="space-between" gap={16} className={styles.bannerContent} sx={{ paddingLeft: 0 }}>
              <App.Flex align="center">
                <Image src="/images/landing/logo-x1.png" width={isMobile ? 73 : 108} height={isMobile ? 75 : 110} alt="" />

                <App.Flex column gap={8}>
                  <App.Text size={[14, 12]} weight={600} color="#B9B8C5" height={1}>FOR TRADERS</App.Text>
                  <App.Text size={[18, 12]} height={1.2}>Tegro X : A decentralized exchange place for tokens and assets.</App.Text>
                </App.Flex>
              </App.Flex>

              <Image src="/images/landing/button-with-arrow.png" width={isMobile ? 30 : 58} height={isMobile ? 30 : 58} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Flex className={cn(styles.banner, styles.short)}>
            <App.Flex className={styles.bannerInner} />

            <App.Flex column center gap={8} className={styles.bannerContent}>
              <App.Text center size={[14, 12]} weight={600} color="#B9B8C5" height={1}>ALL TIME TRADING VOLUME</App.Text>
              <App.Text center size={[40, 24]} weight={600} height={1}>$123.96B</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default LandingHead