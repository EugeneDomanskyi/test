import { Box, Container, Stack } from '@mui/material'
import dynamic from 'next/dynamic'

import useWalletConnect from '@/myhooks/wallet-connect'
//const useWalletConnect = dynamic(() => import('@/myhooks/wallet-connect'), {ssr: false})

import AppIcon from '@/components/AppIcon'
import AppText from '@/components/AppText'
import AppButton from '@/components/AppButton'

import styles from './styles.module.scss'

const Header = () => {
  const { wallet, connect } = useWalletConnect()

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      await connect()
    }
  }

  const shorterAddress = () => {
    return wallet ? (wallet.slice(0, 6) + '...' + wallet.slice(wallet.length - 6)) : ''
  }

  return (
    <div className={styles.container}>
      <Container maxWidth="xl" sx={{ height: '100%' }}>
        <Stack direction="row" sx={{ height: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Stack sx={{ width: 32, height: 32, borderRadius: '50%', background: '#C8FD7C', alignItems: 'center', justifyContent: 'center' }}>
              <AppIcon icon="logo" />
            </Stack>

            <AppText size={16} weight={700}>nft-20.org</AppText>
          </Stack>

          {wallet ? (
            <AppButton primary large outlined rounded>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(91.77deg, #E792E4 2.92%, #B545BE 36.09%, #7931CB 70.47%, #4D42C9 100%)' }} />
                <span>{shorterAddress()}</span>
              </Stack>
            </AppButton>
          ) : (
            <AppButton primary large onClick={handleConnectWallet}>
              Connect Wallet
            </AppButton>
          )}
        </Stack>
      </Container>
    </div>
  )
}

export default Header