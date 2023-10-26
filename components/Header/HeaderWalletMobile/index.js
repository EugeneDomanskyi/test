import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'

import useWalletConnect from '@/myhooks/wallet-connect'

import $orders from '@/store/orders'

import App from '@/components/App'

import styles from './styles.module.scss'

const HeaderWalletMobile = () => {
  const dispatch = useDispatch()
  const { wallet, connectorId, disconnect } = useWalletConnect()

  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false)

  const getConnectorLogo = () => {
    switch (connectorId) {
      case 'metaMask': return '/images/metamask-logo.png'
      case 'walletConnect': return '/images/walletconnect-logo.png'
      case 'magic': return '/images/magic-logo.png'
      case 'rainbow': return '/images/rainbow-logo.png'
      case 'coinbase': return '/images/coinbase-logo.png'
      case 'brave': return '/images/brave-logo.png'
      case 'safe': return '/images/safe-logo.png'
      default: return '/images/default-wallet-logo.png'
    }
  }

  const handleDisconnectDialogOpen = () => {
    setIsDisconnectOpen(true)
  }

  const handleDisconnect = () => {
    disconnect()
    setIsDisconnectOpen(false)
  }

  const handleOrdersDialogOpen = () => {
    dispatch($orders.set.myOrdersDialogOpen(true))
  }

  const shorterAddress = (size = 6) => {
    return wallet ? (wallet.slice(0, size) + '...' + wallet.slice(wallet.length - size)) : ''
  }

  return (
    <>
      <App.Flex row center gap={8}>
        <App.Flex center className={styles.ordersButton} onClick={handleOrdersDialogOpen}>
          <App.Icon icon="orders-mobile" />
        </App.Flex>

        <App.Flex center className={styles.ordersButton} onClick={handleDisconnectDialogOpen}>
          <App.Icon icon="wallet2" />
        </App.Flex>
      </App.Flex>

      <App.Dialog open={isDisconnectOpen} hideClose onClose={() => setIsDisconnectOpen(false)}>
        <App.Flex column>
          <App.Flex row center className={styles.box}>
            <App.Button primary large outlined rounded>
              <App.Flex row gap={8} align="center">
                <App.Flex width={28} height={28} sx={{ borderRadius: '50%', background: 'linear-gradient(91.77deg, #E792E4 2.92%, #B545BE 36.09%, #7931CB 70.47%, #4D42C9 100%)' }} />
                <span>{shorterAddress(15)}</span>
              </App.Flex>
            </App.Button>
          </App.Flex>

          <App.Flex center className={styles.boxDark}>
            <App.Button large primary onClick={handleDisconnect}>
              <App.Icon icon="logout" />
              Disconnect
            </App.Button>
          </App.Flex>
        </App.Flex>
      </App.Dialog>
    </>
  )
}

export default HeaderWalletMobile