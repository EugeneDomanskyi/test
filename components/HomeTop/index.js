import { Container } from '@mui/material'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = ({ tokens }) => {
  return (
    <div className={styles.container}>
      <App.Container className={styles.content}>
        <div className={styles.rectangle} />

        <App.Flex column gap={16} align="center" sx={{ position: 'relative', zIndex: 1, padding: '32px 0 16px' }}>
          <App.Text center uppercase size={40} weight={700}>
            Trade, Mint & Redeem your nft-20 tokens
          </App.Text>

          <App.Text center size={16} color="rgba(255, 255, 255, 0.8)">
            The Future of NFT Trading is here
          </App.Text>

          <App.Flex gap={16}>
            <App.Frame radius={12} gradient="linear-gradient(101.9deg, #631DFF 0%, #A91DFF 100%)" background="#0E0B23">
              <App.Flex column width={173}>
                <App.Text center weight={400} color="#B9B8C5">
                  Total Markets
                </App.Text>

                <App.Text center size={32} weight={700}>
                  {tokens.length}
                </App.Text>
              </App.Flex>
            </App.Frame>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default HomeTop