import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent } from '@/libs/analytics.lib'

import Link from 'next/link'
import { useRouter } from 'next/router'

import $modal from '@/store/modal'

import App from '@/components/App'
import HomeBalance from '@/components/Home/HomeBalance'

import styles from './styles.module.scss'

const Header = () => {
  const router = useRouter()
  const { wallet, connect, disconnect } = useWalletConnect()
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()

  const [menuShow, setMenuShow] = useState(false)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (! event.target.closest('#wallet')) {
      setMenuShow(false)
    }
  }

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      trackEvent('Dex Wallet Connect Clicked')
      const result = await connect()
      if (result) {
        trackEvent('Dex Wallet Connected Successfully')
      }
    }
  }

  const shorterAddress = () => {
    return wallet ? (wallet.slice(0, 6) + '...' + wallet.slice(wallet.length - 6)) : ''
  }

  const handleMenuToggle = () => {
    if (isMobile) {
      dispatch($modal.set.show({modal: 'Home/HomeDisconnectModal'}))
    } else {
      setMenuShow( ! menuShow)
    }
  }

  const handleDisconnect = () => {
    trackEvent('Dex Wallet Disconnect Clicked')
    disconnect()
    setMenuShow(false)
    trackEvent('Dex Wallet Disconnect successfully')
  }

  return (
    <div className={styles.container}>
      <App.Flex row height="100%" align="center" justify="space-between">
        <App.Flex row height="100%" align="center" gap={64}>
          <Link href="/">
            <div className={styles.logo}>
              <div className={styles.badge}>
                BETA
              </div>
              <App.Icon icon="tegro" width={117} height={25} />
            </div>
          </Link>

          <App.Flex row height="100%" align="center">
            <Link href="/exchange" className={cn(styles.navbarItem, {[styles.active]: router.pathname.includes('/exchange')})}>
              <App.Flex center height="100%">
                <App.Text size={18} weight={700}>EXCHANGE</App.Text>
              </App.Flex>
            </Link>

            <Link href="/" className={cn(styles.navbarItem, {[styles.active]: router.pathname == '/'})}>
              <App.Flex center  height="100%">
                <App.Text size={18} weight={700}>SWAP</App.Text>
              </App.Flex>
            </Link>
          </App.Flex>
        </App.Flex>

        <App.Flex row gap={24} align="center">
          {!isMobile ? <HomeBalance /> : null}
          
          {wallet ? (
            <App.Flex sx={{ position: 'relative' }} id="wallet">
              <App.Button primary large outlined rounded onClick={handleMenuToggle} sx={{ minWidth: 'auto' }}>
                <App.Flex row gap={8} align="center">
                  <App.Flex width={28} height={28} sx={{ borderRadius: '50%', background: 'linear-gradient(91.77deg, #E792E4 2.92%, #B545BE 36.09%, #7931CB 70.47%, #4D42C9 100%)' }} />
                  {isMobile ? (
                    <App.Icon icon="caret-down" />
                  ) : (
                    <span>{shorterAddress()}</span>
                  )}
                </App.Flex>
              </App.Button>

              <div className={cn(styles.menu, {[styles.active]: menuShow})}>
                <App.Button primary fullWidth onClick={handleDisconnect}>
                <App.Icon icon="logout" /> Disconnect
                </App.Button>
              </div>
            </App.Flex>
          ) : (
            <App.Button primary large onClick={handleConnectWallet}>
              Connect Wallet
            </App.Button>
          )}
        </App.Flex>
      </App.Flex>
    </div>
  )
}

export default Header