import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent } from '@/libs/analytics.lib'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import $modal from '@/store/modal'

import App from '@/components/App'
import SwitchBlockchain from '@/components/SwitchBlockchain'

import styles from './styles.module.scss'

const Header = () => {
  const router = useRouter()
  const { wallet, connect, disconnect, getBalance } = useWalletConnect()
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()

  const [menuShow, setMenuShow] = useState(false)
  const [mobileMenuShow, setMobileMenuShow] = useState(false)
  const [moreIsOpen, setMoreIsOpen] = useState(false)
  const [currentBalance, setCurrentBalance] = useState({})

  const code = useSelector(({$app}) => $app)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  useEffect(() => {
    console.log('code', code);
    (async () => {
      const balance = await getBalance('', true)
      console.log('balance', balance);
      if (balance.formatted) {
        const amount = balance.formatted*1
        setCurrentBalance({amount: amount.toFixed(4), symbol: balance.symbol})
      }
    })()
  }, [code])

  const handleClickOutside = (event) => {
    if (! event.target.closest('#wallet')) {
      setMenuShow(false)
    }
  }

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      trackEvent('Wallet Connect Clicked', {
        'Wallet connected Status': 'Not Connected'
      })
      const result = await connect()
      if (result) {
        trackEvent('Wallet Connected Successfully', {
          'Wallet connected Status': 'Connected',
          'Wallet Address': result,
        })
      }
    }
  }

  const shorterAddress = (size = 6) => {
    return wallet ? (wallet.slice(0, size) + '...' + wallet.slice(wallet.length - size)) : ''
  }

  const handleMenuToggle = () => {
    if (isMobile) {
      dispatch($modal.set.show({modal: 'Home/HomeDisconnectModal'}))
    } else {
      setMenuShow( ! menuShow)
    }
  }

  const handleDisconnect = () => {
    trackEvent('Wallet Disconnect Clicked', {
      'Wallet connected Status': wallet ? 'Connected' : 'Not Connected',
      'Wallet Address': wallet || null,
    })
    disconnect()
    setMenuShow(false)
    trackEvent('Wallet Disconnect successfully', {
      'Wallet connected Status': 'Not Connected'
    })
  }

  const handleMobileMenuClick = () => {
    if (mobileMenuShow) {
      document.body.classList.remove('modal-open')
    } else {
      document.body.classList.add('modal-open')
    }

    setMobileMenuShow(!mobileMenuShow)
  }

  return (
    <App.Container fluid className={styles.container}>
      <App.Flex row height="100%" align="center" justify="space-between">
        <App.Flex row height="100%" align="center" gap={64}>
          <Link href="/">
            {/* <Image src="/images/x-logo.png" width={159} height={48} alt="" /> */}
            <div className={styles.logo}>
              <div className={styles.badge}>
                BETA
              </div>
              <App.Icon icon="tegro" width={117} height={25} />
            </div>
          </Link>

          <App.Flex row height="100%" align="center" className={styles.navItems}>
            <Link href="/tokens" className={cn(styles.navbarItem, {[styles.active]: router.pathname.includes('/tokens')})}>
              <App.Flex center height="100%">
                <App.Text size={16} weight={500}>Exchange</App.Text>
              </App.Flex>
            </Link>

            <Link href="/nfts" className={cn(styles.navbarItem, {[styles.active]: router.pathname.includes('/nfts')})}>
              <App.Flex center height="100%">
                <App.Text size={16} weight={500}>Earn</App.Text>
              </App.Flex>
            </Link>

            <App.Flex className={cn(styles.navbarItem, styles.navbarDropdown, {[styles.active]: moreIsOpen})} onClick={() => setMoreIsOpen(!moreIsOpen)}>
              <App.Flex center height="100%" gap={8}>
                <App.Text size={16} weight={500}>More</App.Text>
                <App.Icon icon='caret-down' color="#fff" />
              </App.Flex>
            </App.Flex>

            {/* <Link href="/swap" className={cn(styles.navbarItem, {[styles.active]: router.pathname == '/swap'})}>
              <App.Flex center  height="100%">
                <App.Text size={18} weight={700}>SWAP</App.Text>
              </App.Flex>
            </Link> */}
          </App.Flex>
        </App.Flex>

        <App.Flex row gap={[24, 16]} align="center">
          <App.Flex className={styles.linkWrapper}>
            <App.Flex className={styles.linkButton}>
              <App.Icon icon="question" />
            </App.Flex>
          </App.Flex>
          {!isMobile ? <SwitchBlockchain /> : null}
          
          {wallet ? (
            <App.Flex sx={{ position: 'relative' }} id="wallet">
              <App.Flex row gap={16} className={styles.walletInfo}>
                <App.Flex>
                  <App.Text size={16} weight={500}>{ currentBalance.amount + ' ' + currentBalance.symbol }</App.Text>
                </App.Flex>

                <App.Flex className={styles.walletAddressWrapper} onClick={handleMenuToggle}>
                  {/* <App.Flex width={28} height={28} sx={{ borderRadius: '50%', background: 'linear-gradient(91.77deg, #E792E4 2.92%, #B545BE 36.09%, #7931CB 70.47%, #4D42C9 100%)' }} /> */}
                  <App.Text size={16} weight={500}>{shorterAddress(isMobile ? 4 : 6)}</App.Text>
                  {isMobile ? (
                    <App.Icon icon="caret-down" color="#fff" />
                  ) : null}
                </App.Flex>
              </App.Flex>

              <div className={cn(styles.menu, {[styles.active]: menuShow})}>
                <App.Button primary fullWidth onClick={handleDisconnect}>
                <App.Icon icon="logout" /> Disconnect
                </App.Button>
              </div>
            </App.Flex>
          ) : (
            <App.Button primary large={!isMobile} onClick={handleConnectWallet}>
              Connect Wallet
            </App.Button>
          )}

          <div className={cn(styles.mobileMenuButton, {[styles.show]: mobileMenuShow})} onClick={handleMobileMenuClick}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={cn(styles.mobileMenu, {[styles.show]: mobileMenuShow})}>
            <div className={styles.content}>
              <App.Flex row sx={{ padding: 16 }}>
                <SwitchBlockchain onMobileMenuClose={handleMobileMenuClick} />
              </App.Flex>

              <div className={styles.line} />

              <Link href="/tokens" className={cn(styles.link, {[styles.active]: router.pathname.includes('/tokens')})}>
                <App.Flex align="center" height="100%" gap={16} onClick={handleMobileMenuClick}>
                  <App.Flex center width={29}>
                    <App.Icon icon="trade" color="#fff" />
                  </App.Flex>
                  <App.Text size={18} weight={700}>TOKENS</App.Text>
                </App.Flex>
              </Link>

              <Link href="/nfts" className={cn(styles.link, {[styles.active]: router.pathname.includes('/nfts')})}>
                <App.Flex align="center" height="100%" gap={16} onClick={handleMobileMenuClick}>
                  <App.Flex center width={29}>
                    <App.Icon icon="exchange" color="#fff" />
                  </App.Flex>
                  <App.Text size={18} weight={700}>NFTS</App.Text>
                </App.Flex>
              </Link>

              <Link href="/" className={cn(styles.link, {[styles.active]: router.pathname == '/'})}>
                <App.Flex align="center" height="100%" gap={16} onClick={handleMobileMenuClick}>
                  <App.Flex center width={29}>
                    <App.Icon icon="arrow-refresh" width={24} height={24} color="#fff" />
                  </App.Flex>
                  <App.Text size={18} weight={700}>SWAP</App.Text>
                </App.Flex>
              </Link>
            </div>
          </div>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default Header