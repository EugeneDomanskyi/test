import { Container, Stack } from '@mui/material'

import AppText from '@/components/AppText'
import AppFrame from '@/components/AppFrame'

import styles from './styles.module.scss'

const HomeTop = ({ tokens }) => {
  return (
    <div className={styles.container}>
      <Container maxWidth="xl" className={styles.content}>
        <div className={styles.rectangle} />

        <Stack spacing={2} sx={{ position: 'relative', zIndex: 1, alignItems: 'center', padding: '32px 0 16px' }}>
          <AppText center uppercase size={40} weight={700}>
            Trade, Mint & Redeem your nft-20 tokens
          </AppText>

          <AppText center size={16} color="rgba(255, 255, 255, 0.8)">
            The Future of NFT Trading is here
          </AppText>

          <Stack direction="row" spacing={2}>
            <AppFrame radius={12} gradient="linear-gradient(101.9deg, #631DFF 0%, #A91DFF 100%)" background="#0E0B23">
              <Stack sx={{ width: 173 }} >
                <AppText center weight={400} color="#B9B8C5">
                  Total Tokens
                </AppText>

                <AppText center size={32} weight={700}>
                  {tokens.length}
                </AppText>
              </Stack>
            </AppFrame>

            <AppFrame radius={12} gradient="linear-gradient(101.9deg, #631DFF 0%, #A91DFF 100%)" background="#0E0B23">
              <Stack sx={{ width: 173 }} >
                <AppText center weight={400} color="#B9B8C5">
                  Market Cap
                </AppText>

                <AppText center size={32} weight={700}>
                  $272M
                </AppText>
              </Stack>
            </AppFrame>

            <AppFrame radius={12} gradient="linear-gradient(101.9deg, #631DFF 0%, #A91DFF 100%)" background="#0E0B23">
              <Stack sx={{ width: 173 }} >
                <AppText center weight={400} color="#B9B8C5">
                  Trading Volume
                </AppText>

                <AppText center size={32} weight={700}>
                  $773M
                </AppText>
              </Stack>
            </AppFrame>
          </Stack>
        </Stack>
      </Container>
    </div>
  )
}

export default HomeTop