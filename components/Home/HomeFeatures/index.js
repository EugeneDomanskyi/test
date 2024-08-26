import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeFeatures = () => {
  return (
    <App.Container maxWidth={1200} sx={{ paddingTop: 60, paddingBottom: 90 }}>
      <App.Flex fullWidth column gap={[64, 24]}>
        <App.Flex align={['center', 'flex-start']} column gap={10}>
          <App.Text tag="h2" size={[48, 32]} weight={800} height={1}>CEX Speed, <App.Text inline size={[48, 32]} weight={700} color="#A6DC37">DEX Trust</App.Text></App.Text>
          <App.Text size={16} color="#FFFFFF99" height={1}>Enjoy the best of both worlds!</App.Text>
        </App.Flex>

        <App.Flex column fullWidth gap={24}>
          <App.Flex direction={['row', 'column']} gap={24}>
            <App.Flex flex={1} className={styles.box}>
              <App.Flex fullWidth column className={cn(styles.inner, styles.inner1)}>
                <App.Text tag="h3" size={[24, 20]} weight={600}>Efficient Order Books</App.Text>
                <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">Trade with tighter market spreads, rivaling a CEX.</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column flex={1} gap={24}>
              <App.Flex flex={[1, null]} className={styles.box}>
                <App.Flex fullWidth className={cn(styles.inner, styles.inner2)}>
                  <App.Flex column width={[182, '100%']}>
                    <App.Text tag="h3" size={[24, 20]} weight={600}>Gasless Quotes</App.Text>
                    <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">Actively manage trading positions without worrying about gas.</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>

              <App.Flex flex={[1, null]} className={cn(styles.box, styles.gradient)}>
                <App.Flex fullWidth className={cn(styles.inner, styles.inner3)}>
                  <App.Flex column width={[190, '100%']}>
                    <App.Text tag="h3" size={[24, 20]} weight={600}>Lightning-fast Matching Engine</App.Text>
                    <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">Achieve peak trading performance with up to 500K trades settled in a second.</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex direction={['row', 'column']} gap={24}>
            <App.Flex flex={[1, null]} className={styles.box}>
              <App.Flex fullWidth className={cn(styles.inner, styles.inner4)}>
                <App.Flex column>
                  <App.Text tag="h3" size={[24, 20]} weight={600}>Binance-like APIs</App.Text>
                  <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">Import CeFi algo strategies with simple plug & play API integration.</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={[1, null]} className={styles.box}>
              <App.Flex fullWidth className={cn(styles.inner, styles.inner5)}>
                <App.Flex column>
                  <App.Text tag="h3" size={[24, 20]} weight={600}>Gas Efficiency</App.Text>
                  <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">Save up to 3X on gas with trade roll-ups, beating other DEXs.</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex flex={[1, null]} className={styles.box}>
              <App.Flex fullWidth className={cn(styles.inner, styles.inner6)}>
                <App.Flex column>
                  <App.Text tag="h3" size={[24, 20]} weight={600}>MEV Resistant</App.Text>
                  <App.Text size={[16, 14]} weight={400} color="#FFFFFF99">Your trades are protected against bots or any predatory practices. Trade worry-free!</App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Flex fullWidth className={styles.box}>
            <App.Flex fullWidth className={cn(styles.inner, styles.inner7)}>
              <App.Flex column width={244}>
                <App.Text tag="h3" size={24} weight={600}>Custody-less Trading</App.Text>
                <App.Text size={16} weight={400} color="#FFFFFF99">Trade direct from wallet with 100% self-custody, no deposits required.</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeFeatures