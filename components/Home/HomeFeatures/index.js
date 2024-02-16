import App from '@/components/App'

import styles from './styles.module.scss'

const HomeFeatures = () => {
  return (
    <App.Container maxWidth={1230} sx={[{ paddingTop: 32, paddingBottom: 32 }, { paddingTop: 48, paddingBottom: 32 }]}>
      <App.Flex column align="center" gap={32} fullWidth className={styles.container}>
        <div className={styles.background1} />
        <div className={styles.background2} />

        <App.Flex direction={['row', 'column']} center gap={[40, 20]}>
          <App.Flex row center flex={1}>
            <App.Text size={[80, 63]} weight={800} height={1}>Main <App.Text inline size={[80, 63]} weight={800} family="Playfair Display" height={1} color="#A6DC37">Features</App.Text></App.Text>
          </App.Flex>

          <div className={styles.sep} />

          <App.Flex column>
            <App.Text size={12} weight={400} color="rgba(255, 255, 255, .6)">
              CEX Speed, DEX Trust — Enjoy the Best of Both Worlds
            </App.Text>

            <App.Text size={12} weight={400} color="rgba(255, 255, 255, .6)">
              High-frequency Trading, Now On-chain
            </App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column width={[790, '100%']} gap={16}>
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-4.png" alt="" />

              <App.Flex column>
                <App.Text size={[16, 24]} weight={600}>Efficient</App.Text>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Orderbooks</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Real-time market depth at your fingertips, mirroring CEX precision.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-2.png" alt="" />

              <App.Flex column>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Gasless</App.Text>
                <App.Text size={[16, 24]} weight={600}>Quotes</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Order creation and cancellation without gas fees for seamless price discovery.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />
          
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-1.png" alt="" />

              <App.Flex column>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Lightning-fast</App.Text>
                <App.Text size={[16, 24]} weight={600}>Orders</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Your trades settled in seconds. Trade at scale!
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />
          
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-5.png" alt="" />

              <App.Flex column>
                <App.Text size={[16, 24]} weight={600}>Binance-like</App.Text>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">APIs Support</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Easily deploy bots and trading strategies with user-friendly API integration. Trade smarter on-chain!
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-3.png" alt="" />

              <App.Flex column>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Gas</App.Text>
                <App.Text size={[16, 24]} weight={600}>Efficiency</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Enjoy up to 60% savings on every transaction! Spend less & trade more.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-4.png" alt="" />

              <App.Flex column>
                <App.Text size={[16, 24]} weight={600}>MEV</App.Text>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Resistant</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Your trades are protected against bots or any predatory practices. Trade worry-free!
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />
          
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[300, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-5.png" alt="" />

              <App.Flex column>
                <App.Text size={[16, 24]} weight={600}>Custody-less</App.Text>
                <App.Text italic size={[16, 24]} weight={700} family="Playfair Display">Trading</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={14} weight={400} color="#9B99AE">
              Buy or sell your favorite tokens with 100% self-custody over your assets. Your keys, your crypto.
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeFeatures