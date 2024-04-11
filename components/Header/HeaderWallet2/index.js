import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'
import $orders from '@/store/orders'
import $portfolio from '@/store/portfolio'

import App from '@/components/App'
import Portfolio from '@/components/Header/Portfolio'

import styles from './styles.module.scss'

const HeaderWallet2 = () => {
  const router = useRouter()

  const { wallet, connectorId, connect, disconnect, blockchain: chain, getBalance, getConnectorName } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const portfolioUsd = useSelector(({ $portfolio }) => $portfolio.usd)
  const portfolioList = useSelector(({ $portfolio }) => $portfolio.list)

  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false)
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(false)
  const [isShortPortfolioVisible, setIsShortPortfolioVisible] = useState(false)

  useEffect(() => {
    if (wallet && blockchain?.id) {
      getPortfolio()
    }
  }, [wallet, blockchain?.id])

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

  const shorterAddress = (size = 6) => {
    return wallet ? (wallet.slice(0, size) + '...' + wallet.slice(wallet.length - size)) : ''
  }

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      Amplitude.event('Wallet Connect Clicked', {
        'Source': Amplitude.page(),
      })

      const result = await connect()
      if (result) {
        const walletName = await getConnectorName()
        Amplitude.event('Wallet Connect Success', {
          'Source': Amplitude.event(),
          'Type': walletName,
        })
      }
    }
  }

  const handleDisconnect = async () => {
    const walletName = await getConnectorName()

    disconnect()
    handleDisconnectDialogToggle(false)()
    handlePortfolioToggle(false)

    Amplitude.event('Wallet Disconnect Success', {
      'Source': Amplitude.page(),
      'Type': walletName,
    })
  }

  const handleDisconnectDialogToggle = (open) => () => {
    setIsDisconnectDialogOpen(open)
  }

  const getPortfolio = async (controlLoading) => {
    const result = await $portfolio.api.details({ wallet, blockchain })
    if (result?.success) {
      dispatch($portfolio.set.details({...result, blockchain}))
    }
  }

  const handleOrdersDialogOpen = () => {
    router.push('/exchange')
    dispatch($orders.set.myOrdersDialogOpen(true))
  }

  const handleEarnings = () => {
    router.push('/earnings')
  }

  const handleShortPortfolioVisible = (value) => () => {
    setIsShortPortfolioVisible(value)
  }

  const handlePortfolioToggle = (value = true) => {
    setIsPortfolioVisible(value)
  }

  return wallet ? (
    <>
      {isMobile ? (
        <App.Flex row center gap={16}>
          <App.Flex center className={styles.ordersButton} onClick={handlePortfolioToggle}>
            <App.Icon icon="wallet2" />
          </App.Flex>

          <App.Flex center className={styles.ordersButton} onClick={handleOrdersDialogOpen}>
            <App.Icon icon="orders-mobile" />
          </App.Flex>
        </App.Flex>
      ) : (
        <App.Flex gap={24}>
          <App.Button default2 outlined onClick={handleEarnings}>
            My Earnings
          </App.Button>

          <App.Flex className={styles.relative}>
            <App.Button primary2 onClick={handlePortfolioToggle} onMouseEnter={handleShortPortfolioVisible(true)} onMouseLeave={handleShortPortfolioVisible(false)}>
              {shorterAddress(6)}
            </App.Button>

            <App.Flex column className={cn(styles.walletPortfolioPopup, {[styles.active]: isShortPortfolioVisible})}>
              <App.Flex row align="center" justify="space-between" className={styles.top}>
                <App.Text size={16} weight={700} height={1}>Portfolio Value</App.Text>
                <App.Text size={16} weight={700} height={1}>${portfolioUsd}</App.Text>
              </App.Flex>

              {portfolioList.map(item => (
                <App.Flex key={item.address} row align="center" justify="space-between" className={styles.row}>
                  <App.Text size={12} height={1} color="#B9B8C5">{item.name}</App.Text>
                  <App.Text size={12} height={1} color="#B9B8C5">{item.balance} {item.symbol}</App.Text>
                </App.Flex>
              ))}
            </App.Flex>
          </App.Flex>
        </App.Flex>
      )}

      <Portfolio open={isPortfolioVisible} address={shorterAddress(5)} logo={getConnectorLogo()} onClose={handlePortfolioToggle} onDisconnect={handleDisconnectDialogToggle(true)} />

      <App.Dialog open={isDisconnectDialogOpen} width={420} onClose={handleDisconnectDialogToggle(false)} title="Disconnect Wallet">
        <App.Flex column>
          <App.Flex row sx={{padding: 24}}>
            <App.Text size={16} color="#B9B8C5">Are you sure you want to disconnect your wallet? You may lose some site functionalities.</App.Text>
          </App.Flex>

          <App.Flex row gap={16} sx={{padding: 16}}>
            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding outlined onClick={handleDisconnectDialogToggle(false)}>Cancel</App.Button>
            </App.Flex>

            <App.Flex flex={1}>
              <App.Button xl fullWidth primary noPadding onClick={handleDisconnect}>Disconnect</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Dialog>
    </>
  ) : (
    <App.Button primary2 onClick={handleConnectWallet}>
      Connect{!isMobile ? ' Wallet' : ''}
    </App.Button>
  )
}

export default HeaderWallet2