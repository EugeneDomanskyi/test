import App from '@/components/App'

import styles from './styles.module.scss'

const HomeFeatures = () => {
  return (
    <App.Container maxWidth={1200}>
      <App.Flex fullWidth column gap={64}>
        <App.Flex center column gap={10}>
          <App.Text tag="h2" size={80} weight={800} height={1}>CEX Speed, <App.Text inline italic size={80} weight={700} family="Playfair Display" color="#A6DC37">DEX Trust</App.Text></App.Text>
          <App.Text size={16} color="#FFFFFF99" height={1}>Enjoy the best of both worlds!</App.Text>
        </App.Flex>

        <App.Flex column fullWidth gap={24}>
          <App.Flex row gap={24}>
            <App.Flex flex={1} className={styles.box}>
              <App.Flex fullWidth column className={cn(styles.inner, styles.inner1)}>
                <App.Text size={24} weight={600}>Efficient Orderbooks</App.Text>
                <App.Text size={16} weight={400} color="#FFFFFF99">Trade with tighter market spreads, rivaling a CEX.</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex column flex={1} gap={24}>
              <App.Flex flex={1} className={styles.box}>
                <App.Flex full className={cn(styles.inner, styles.inner2)}>
                  <App.Flex column width={182}>
                    <App.Text size={24} weight={600}>Gasless Quotes</App.Text>
                    <App.Text size={16} weight={400} color="#FFFFFF99">Actively manage trading positions without worrying about gas.</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>

              <App.Flex flex={1} className={cn(styles.box, styles.gradient)}>
                <App.Flex full className={cn(styles.inner, styles.inner3)}>
                  <App.Flex column width={190}>
                    <App.Text size={24} weight={600}>Lightning-fast Matching Engine</App.Text>
                    <App.Text size={16} weight={400} color="#FFFFFF99">Achieve peak trading performance with up to 500K trades settled in a second.</App.Text>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeFeatures