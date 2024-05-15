import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = () => {
  return (
    <App.Container sx={[{ padding: '200px 0 96px', zIndex: -1 }, { padding: '138px 0 78px', zIndex: -1 }]}>
      <App.Flex gap={128} align="center" className={styles.heroWrapper}>
        <App.Flex column gap={[48, 28]} width={[540, '100%']} className={styles.textWrapper}>
          <App.Flex column>
            <App.Text size={[82, 36]} weight={600}>The Gen2 DEX</App.Text>
            <App.Text size={[41, 24]} weight={600} height={1}>
              for <App.Text inline size={[41, 24]} weight={600} height={1} color="#A6DC37">High-Frequency Trading</App.Text>
            </App.Text>
          </App.Flex>

          <App.Text size={[20, 16]} weight={600} color="#a69fb4">Order books. API-access. Lightning-fast.</App.Text>

          <App.Button rounded primary xl sx={{width: 253, background: '#0052FF', alignSelf: 'auto'}} href="https://tegro.com/exchange/base/0x4200000000000000000000000000000000000006?utm_source=homepage&utm_medium=hero&utm_campaign=exchange">
            <App.Text size={16}>Trade on BASE</App.Text>
            <App.Icon icon="base-icon" />
          </App.Button>
        </App.Flex>

        <App.Flex flex={1} justify="flex-end" className={styles.heroImg}>
          {/* <Image src={`/images/landing/hero-image.png`} width={709} height={560} alt="" /> */}
          {/* <Image src={`/images/landing/hero-image.png`} width={2946} height={1758} alt="" /> */}
          {/* <Image src={`/images/landing/hero-image.png`} width={1473} height={878} alt="" /> */}
          {/* <Image src={`/images/landing/hero-image.png`} width={736} height={439} alt="" /> */}
          <img src={`/images/landing/hero-image.png`} alt="" />
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeTop