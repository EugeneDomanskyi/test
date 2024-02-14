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
            <App.Text size={64} weight={800} height={1}>Sed Morbi</App.Text>
            <App.Text size={64} weight={800} height={1}>Blandit Pharetra</App.Text>
            <App.Text italic size={64} weight={700} height={1} family="Playfair Display" color="#7364FF">Our Team</App.Text>
          </App.Flex>

          <App.Text size={12} weight={400} color="#9B99AE">
            Rutrum faucibus donec quisque nisi eget adipiscing vel nullam metus. Semper in elementum curabitur nibh urna. Ut ut nec ultricies ac eget euismod at. Nec faucibus in sagittis ultricies imperdiet. Vivamus in euismod egestas pellentesque semper quisque ut risus. Donec a mattis condimentum etiam proin. Aliquam porttitor et id amet suspendisse sapien interdum. Sed.
          </App.Text>
        </App.Flex>

        <App.Flex direction={['row', 'column']} justify="center" gap={32}>
          <App.Flex column width={[482, '100%']} gap={20}>
            <img src="/images/home/team-2.png" alt="" className={styles.img} />

            <App.Flex column>
              <App.Text size={16} weight={600}>SIDDHARTH MENON</App.Text>
              <App.Text italic size={16} weight={700} family="Playfair Display">Founder & CEO</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column width={[482, '100%']} gap={20}>
            <img src="/images/home/team-3.png" alt="" className={styles.img} />

            <App.Flex column>
              <App.Text size={16} weight={600}>ASHISH RAWAT</App.Text>
              <App.Text italic size={16} weight={700} family="Playfair Display">Co-Founder and COO</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default HomeTeam