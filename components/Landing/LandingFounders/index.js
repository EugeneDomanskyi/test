import App from '@/components/App'

import styles from './styles.module.scss'
import Image from 'next/image'

const LandingFounders = () => {
  return (
    <App.Flex column gap={16} className={styles.container}>
      <App.Text center size={[48, 32]} weight={800} height={1}>Founders</App.Text>

      <App.Flex direction={['row', 'column']} center gap={28}>
        <App.Flex column align="center" gap={24} className={styles.box}>
          <App.Flex center className={styles.circle}>
            <Image src="/images/landing/sid.png" width={177} height={177} alt="" />
          </App.Flex>

          <App.Flex column gap={8}>
            <App.Text size={20} center uppercase height={1}>Siddharth Menon</App.Text>
            <App.Text size={13} center color="#B9B8C5" height={1}>Founder & CEO</App.Text>
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
            <Image src="/images/landing/ashish.png" width={177} height={177} alt="" />
          </App.Flex>

          <App.Flex column gap={8}>
            <App.Text size={20} center uppercase height={1}>ASHISH RAWAT</App.Text>
            <App.Text size={13} center color="#B9B8C5" height={1}>Co-Founder & COO</App.Text>
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