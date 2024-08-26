import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = () => {
  return (
    <App.Flex className={styles.mwebBack}>
      <App.Container maxWidth={1230}>
        <App.Flex column gap={32} align="center" className={styles.container}>
          <App.Flex column align="center" gap={24} width={[570, 'auto']}>
            <App.Text tag="h1" center size={[56, 32]} weight={800} height={1.2}>Earn More With Every Trade On Tegro</App.Text>
            <App.Text tag="h4" center size={[28, 20]} weight={500} height={1.2} color="#FFFFFF99">Earn Gems, Win Auctions, and Get Tokens at Steal Prices <App.Text inline size={[28, 20]} weight={500} height={1.2} color="#A6DC37">Up to 95% Off</App.Text>!</App.Text>
            <App.Button primary2 rounded target="_self" href="https://tegro.com/exchange/base/0x4200000000000000000000000000000000000006?utm_source=homepage&utm_medium=hero&utm_campaign=exchange">Get Started Now</App.Button>
          </App.Flex>

          <App.Flex className={styles.border}>
            <Image src="/images/hero-image.png" width={960} height={583} alt="" style={{borderRadius: 10, background: '#08051C'}} />
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default HomeTop