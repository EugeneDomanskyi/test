import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import Amplitude from '@/libs/amplitude.lib'

import $app from '@/store/app'
import $orders from '@/store/orders'
import $portfolio from '@/store/portfolio'

import App from '@/components/App'
import Portfolio from '@/components/Header/Portfolio'

import styles from './styles.module.scss'

const HeaderWallet = () => {
  const router = useRouter()
  const isEarn = router.pathname.includes('/earn')
  const isPoints = router.pathname.includes('/points-dashboard')

  const { wallet, connectorId, connect, disconnect, blockchain: chain, getBalance, getConnectorName } = useWalletConnect()

  const dispatch = useDispatch()
  const blockchain = useSelector($app.get.blockchain)
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  const nativeBalance = useSelector(({ $portfolio }) => $portfolio.native)
  const portfolioUsd = useSelector(({ $portfolio }) => $portfolio.usd)
  const portfolioList = useSelector(({ $portfolio }) => $portfolio.list)
  const raffleLoading = useSelector(({ $raffle }) => $raffle.loadingUser)
  const raffleBalance = useSelector(({ $raffle }) => $raffle.balance)
  const referral = useSelector(({ $point }) => $point.referral)

  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(true)
  const [isPortfolioVisible, setIsPortfolioVisible] = useState(false)
  const [isShortPortfolioVisible, setIsShortPortfolioVisible] = useState(false)

  useEffect(() => {
    if (wallet && blockchain?.id) {
      if (isEarn) {
        setBalanceLoading(raffleLoading)
      }

      getPortfolio(!isEarn)
    }
  }, [wallet, blockchain?.id, chain?.id, isEarn, raffleLoading])

  const getBalanceString = () => {
    if (isEarn) {
      return `${raffleBalance} TKeys`
    } else {
      return `${nativeBalance.value} ${nativeBalance.symbol ?? blockchain.currency}`
    }
  }

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
    if (controlLoading) {
      setBalanceLoading(true)
    }

    const result = await $portfolio.api.details({ wallet, blockchain })
    if (result.success) {
      dispatch($portfolio.set.details({...result, blockchain}))
    }

    if (controlLoading) {
      setBalanceLoading(false)
    }
  }

  const handleTransactions = () => {
    router.push('/points-dashboard/transactions')
  }

  const handleOrdersDialogOpen = () => {
    router.push('/exchange')
    dispatch($orders.set.myOrdersDialogOpen(true))
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
        <App.Flex row align="center" gap={16}>
          {isPoints ? (
            <>
              <App.Flex row center gap={12}>
                <App.Text nowrap weight={600}>{referral.points} points</App.Text>

                <App.Frame padding={0} radius={24} width={24} height={24} sx={{ cursor: 'pointer' }} onClick={handleTransactions} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                  <App.Flex full center>
                    <App.Icon icon="arrow-45" width={10} height={10} />
                  </App.Flex>
                </App.Frame>
              </App.Flex>

              <div className={styles.line} />
            </>
          ): null}

          <App.Flex row center gap={16} className={styles.walletInfo} onClick={handlePortfolioToggle} onMouseEnter={handleShortPortfolioVisible(true)} onMouseLeave={handleShortPortfolioVisible(false)}>
            <App.Flex>
              <App.Flex center gap={8}>
                {isEarn ? (
                  <App.Flex row center width={24} height={24} className={styles.tkeysBox}>
                    <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" />
                  </App.Flex>
                ) : (
                  <Image src={getConnectorLogo()} width={24} height={24} alt="" />
                )}
                
                {balanceLoading ? (
                  <App.Flex center width={95}>
                    <App.Loader size={16} />
                  </App.Flex>
                ) : (
                  <App.Text nowrap size={16} height={1}>{getBalanceString()}</App.Text>
                )}
              </App.Flex>
            </App.Flex>

            <App.Flex className={styles.walletAddressWrapper}>
              <App.Text size={16} height={1}>{shorterAddress(5)}</App.Text>
            </App.Flex>

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
    // <App.Button primary large={!isMobile} onClick={handleConnectWallet}>
    //   Connect{!isMobile ? ' Wallet' : ''}
    // </App.Button>

    <App.ButtonGradient onClick={handleConnectWallet}>Connect Wallet</App.ButtonGradient>
  )
}

export default HeaderWallet