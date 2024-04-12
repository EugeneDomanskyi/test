import { useSelector } from 'react-redux'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingFounders = () => {
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  return (
    <App.Flex column align="center" gap={16} className={styles.container}>
      <h2>Founders</h2>

      <App.Flex row center gap={[28, 0]} fullWidth>
        <App.Flex column align="center" gap={24} className={styles.box}>
          <App.Flex center className={styles.circle}>
            <Image src="/images/landing/sid.png" width={isMobile ? 120 : 177} height={isMobile ? 120 : 177} alt="" />
          </App.Flex>

          <App.Flex column gap={8}>
            <App.Text size={[20, 16]} center uppercase height={1}>Siddharth Menon</App.Text>
            <App.Text size={[13, 12]} center color="#B9B8C5">
              Founder & CEO<br />
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