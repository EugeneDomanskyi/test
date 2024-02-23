import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTeam = () => {
  return (
    <App.Container maxWidth={1230} className={styles.container}>
      <div className={styles.background1} />
      <div className={styles.background2} />

      <App.Flex fullWidth column gap={64}>
        <App.Flex column gap={12} sx={[{ paddingLeft: 550 }, { paddingTop: 300 }]}>
          <App.Flex column>
            <App.Text tag="h2" size={[64, 48]} weight={800} height={1}>
              Powered by Expertise that Empowered<br />
              <App.Text inline italic size={[64, 48]} weight={700} height={1} family="Playfair Display" color="#7364FF">15 Million Traders</App.Text>
            </App.Text>
          </App.Flex>

          <App.Text size={16} weight={400} color="#9B99AE">
            Our founding team introduced cryptocurrency trading to 15 million Indians with WazirX — India&apos;s largest crypto exchange with $40B+ volumes. Now, with Tegro, we&apos;re shaping the future of decentralized finance, targeting the next 100 million traders globally!
          </App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} justify="center" gap={32}>
          <App.Flex column width={[482, '100%']} gap={20}>
            <img src="/images/home/team-2.png" alt="" className={styles.img} />

            <App.Flex row align="center" justify="space-between">
              <App.Flex column>
                <App.Text size={16} weight={600}>SIDDHARTH MENON</App.Text>
                <App.Text italic size={16} weight={700} family="Playfair Display">Founder & CEO</App.Text>
              </App.Flex>

              <App.Flex row gap={8}>
                <a href="https://www.linkedin.com/in/siddharthmenon" tragte="_blank" rel="noreferrer" className={styles.soc}>
                  <img src="/images/home/community-linkedin.png" alt="LinkedIn" width={40} height={40} />
                </a>

                <a href="https://twitter.com/BuddhaSource" tragte="_blank" rel="noreferrer" className={styles.soc}>
                  <img src="/images/home/community-x.png" alt="X" width={40} height={40} />
                </a>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex column width={[482, '100%']} gap={20}>
            <img src="/images/home/team-3.png" alt="" className={styles.img} />

            <App.Flex row align="center" justify="space-between">
              <App.Flex column>
                <App.Text size={16} weight={600}>ASHISH RAWAT</App.Text>
                <App.Text italic size={16} weight={700} family="Playfair Display">Co-Founder and COO</App.Text>
              </App.Flex>

              <App.Flex row gap={8}>
                <a href="https://www.linkedin.com/in/ashish-rawat-5a533697/" tragte="_blank" rel="noreferrer" className={styles.soc}>
                  <img src="/images/home/community-linkedin.png" alt="LinkedIn" width={40} height={40} />
                </a>

                <a href="https://twitter.com/ashish24rawat" tragte="_blank" rel="noreferrer" className={styles.soc}>
                  <img src="/images/home/community-x.png" alt="X" width={40} height={40} />
                </a>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeTeam