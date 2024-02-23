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
            <App.Text tag="h2" size={[80, 63]} weight={800} height={1}>CEX Speed,<br /><App.Text inline size={[80, 63]} weight={800} family="Playfair Display" height={1} color="#A6DC37">DEX Trust</App.Text></App.Text>
          </App.Flex>

          <div className={styles.sep} />

          <App.Flex column>
            <App.Text size={16} weight={400} color="rgba(255, 255, 255, .6)">
              Enjoy the best of both worlds!
            </App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column width={[790, '100%']} gap={16}>
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[400, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-4.png" alt="" />

              <App.Flex column>
                <App.Text tag="h3" size={24} weight={600}>
                  Efficient<br />
                  <App.Text italic inline size={24} weight={700} family="Playfair Display">Orderbooks</App.Text>
                </App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={16} weight={400} color="#9B99AE">
              Trade with tighter market spreads, rivaling a CEX.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[400, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-2.png" alt="" />

              <App.Flex column>
                <App.Text tag="h3" italic size={24} weight={700} family="Playfair Display">
                  Gasless<br />
                  <App.Text inline size={24} weight={600}>Quotes</App.Text>
                </App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={16} weight={400} color="#9B99AE">
              Actively manage trading positions without worrying about gas.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />
          
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[400, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-1.png" alt="" />

              <App.Flex column>
                <App.Text tag="h3" italic size={24} weight={700} family="Playfair Display">
                  Lightning-fast<br />
                  <App.Text inline size={24} weight={600}>Matching Engine</App.Text>
                </App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={16} weight={400} color="#9B99AE">
              Achieve peak trading performance with up to 500K trades settled in a second.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />
          
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[400, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-5.png" alt="" />

              <App.Flex column>
                <App.Text tag="h3" size={24} weight={600}>
                  Binance-like<br />
                  <App.Text italic inline size={24} weight={700} family="Playfair Display">APIs</App.Text>
                </App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={16} weight={400} color="#9B99AE">
              Import CeFi algo strategies with simple plug & play API integration.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[400, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-3.png" alt="" />

              <App.Flex column>
                <App.Text tag="h3" italic size={24} weight={700} family="Playfair Display">
                  Gas<br />
                  <App.Text inline size={24} weight={600}>Efficiency</App.Text>
                </App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={16} weight={400} color="#9B99AE">
              Save up to 3X on gas with trade roll-ups, beating other DEXs.
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />

          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[400, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-8.png" alt="" />

              <App.Flex column>
                <App.Text tag="h3" size={24} weight={600}>
                  MEV<br />
                  <App.Text inline italic size={24} weight={700} family="Playfair Display">Resistant</App.Text>
                </App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={16} weight={400} color="#9B99AE">
              Your trades are protected against bots or any predatory practices. Trade worry-free!
            </App.Text>
          </App.Flex>

          <div className={styles.hr} />
          
          <App.Flex direction={['row', 'column']} align="center" fullWidth gap={[62, 0]}>
            <App.Flex row align="center" width={[400, '100%']} className={styles.name}>
              <div className={styles.ellipse} />
              <img src="/images/home/features-9.png" alt="" />

              <App.Flex column>
                <App.Text tag="h3" size={24} weight={600}>
                  Custody-less<br />
                  <App.Text inline italic size={24} weight={700} family="Playfair Display">Trading</App.Text>
                </App.Text>
              </App.Flex>
            </App.Flex>

            <App.Text center={[null, true]} size={16} weight={400} color="#9B99AE">
              Trade direct from wallet with 100% self-custody, no deposits required.
            </App.Text>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeFeatures