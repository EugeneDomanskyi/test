import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = () => {
  const getLinkAndText = () => {
    const host = typeof window != 'undefined' ? window.location.hostname : null
    if (host == 'tegro.com') {
      return {
        link: '/exchange/base/0x4200000000000000000000000000000000000006',
        text: 'Trade on BASE',
        icon: 'base-icon',
      }
    } else if (host == 'testnet.tegro.com') {
      return {
        link: '/exchange/optimism/0xcf9eb56c69ddd4f9cfdef880c828de7ab06b4614',
        text: 'Trade on Optimism Sepolia',
        icon: 'optimism-icon',
      }
    } else {
      return {
        link: '/exchange/optimism/0xcf9eb56c69ddd4f9cfdef880c828de7ab06b4614',
        text: 'Trade on Optimism Sepolia',
        icon: 'optimism-icon',
      }
    }
  }

  return (
    <App.Flex className={styles.mwebBack}>
      <App.Container maxWidth={1230}>
        <App.Flex column gap={32} align="center" className={styles.container}>
          <App.Flex column align="center" gap={24} width={[640, 'auto']}>
            <App.Text tag="h1" center size={[56, 32]} weight={800} height={1.2}>The Gen2 DEX for <App.Text tag="h1" inline nowrap center size={[56, 32]} weight={800} height={1.2} color="#A6DC37">High-Frequency Trading</App.Text></App.Text>
            <App.Text tag="h4" center size={[28, 20]} weight={500} height={1.2} color="#FFFFFF99">Order books. API-access. Lightning-fast.</App.Text>
            <App.Button primary rounded target="_self" href={`${getLinkAndText().link}?utm_source=homepage&utm_medium=hero&utm_campaign=exchange`}>{getLinkAndText().text} <App.Icon icon={getLinkAndText().icon} /></App.Button>
          </App.Flex>

          <App.Flex className={styles.border}>
            <Image src="/images/hero-image2.png" width={960} height={551} alt="" style={{borderRadius: 10, background: '#08051C'}} />
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default HomeTop