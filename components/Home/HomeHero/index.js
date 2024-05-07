import { useSelector } from 'react-redux'
import Link from 'next/link'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = () => {
  return (
    <App.Container maxWidth={1230} sx={[{ padding: '200px 0 96px' }, { padding: '138px 0 78px' }]}>
      <App.Flex fullWidth height={563} align="center">
        <App.Flex column gap={[48, 28]} className={styles.textWrapper}>
          <App.Flex column>
            <App.Text size={[82, 36]} weight={600}>The Gen2 DEX</App.Text>
            <App.Text size={[41, 28]} weight={600} height={1}>
              for <App.Text inline size={[41, 28]} weight={600} height={1} color="#A6DC37">High-Frequency Trading</App.Text>
            </App.Text>
          </App.Flex>

          <App.Text size={[20, 16]} weight={600} color="#a69fb4">Order books. API-access. Lightning-fast.</App.Text>

          <App.Button rounded primary xl sx={{width: 253, background: '#0052FF', alignSelf: 'auto'}} href="https://tegro.com/exchange/base/0x4200000000000000000000000000000000000006?utm_source=homepage&utm_medium=hero&utm_campaign=exchange">
            <App.Text size={16}>Trade on BASE</App.Text>
            <App.Icon icon="base-icon" />
          </App.Button>
        </App.Flex>

        <App.Flex justify="flex-end" fullWidth className={styles.heroImg}>
          <Image src={`/images/landing/hero-img.png`} width={709} height={560} alt="" />
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeTop