import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import cn from 'classnames'
import { useNetwork } from 'wagmi'

import useWalletConnect from '@/myhooks/wallet-connect'
import { usePropsHelper } from '@/myhooks/props-helper'
import { trackEvent, getPageName } from '@/libs/analytics.lib'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import $modal from '@/store/modal'

import App from '@/components/App'
import SwitchBlockchain from '@/components/SwitchBlockchain'
import NavbarDropdown from '@/components/NavbarDropdown'
import HeaderWalletMobile from '@/components/Header/HeaderWalletMobile'

import styles from './styles.module.scss'

const Header = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { wallet, connect, disconnect, getBalance, getConnectorName } = useWalletConnect()
  const { isMobile } = usePropsHelper()
  const { chain } = useNetwork()

  const isEarn = router.pathname.includes('/earn')
  const isSticky = ! router.pathname.includes('/exchange')

  const balance = useSelector(({$raffle}) => $raffle.balance)

  const headerRef = useRef(null)

  const [menuShow, setMenuShow] = useState(false)
  const [mobileMenuShow, setMobileMenuShow] = useState(false)
  const [moreIsOpen, setMoreIsOpen] = useState(false)
  const [supportIsOpen, setSupportIsOpen] = useState(false)
  const [currentBalance, setCurrentBalance] = useState({amount: 0, symbol: ''})
  const [isBannerClosed, setIsBannerClosed] = useState(false)
  const [balanceLoading, setBalanceLoading] = useState(true)

  useEffect(() => {
    if (wallet && ! isEarn) {
      handleGetBalance()
    }
  }, [wallet, isEarn, chain?.id])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  useEffect(() => {
    if (isEarn && ! balance) {
      setBalanceLoading(true)
    } else if (isEarn) {
      setCurrentBalance({amount: balance, symbol: 'TKeys'})
      setBalanceLoading(false)
    }
  }, [balance, isEarn])

  const handleClickOutside = (event) => {
    if (! event.target.closest('#wallet')) {
      setMenuShow(false)
    }

    if (! event.target.closest('#menu-dropdown')) {
      setMoreIsOpen(false)
    }

    if (! event.target.closest('#support-dropdown')) {
      setSupportIsOpen(false)
    }
  }

  const handlePageEvent = (page) => () => {
    trackEvent('Page Visited', {
      'Page Name': page,
    })
  }

  const handleResourceEvent = (community) => () => {
    trackEvent('Community Resources Visited', {
      'Community': community,
    })
  }

  const handleConnectWallet = async () => {
    if ( ! wallet) {
      trackEvent('Wallet Connect Clicked', {
        'Source': getPageName(),
      })

      const result = await connect()
      if (result) {
        const walletName = await getConnectorName()
        trackEvent('Wallet Connect Success', {
          'Source': getPageName(),
          'Type': walletName,
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

  const handleDisconnect = async () => {
    const walletName = await getConnectorName()

    disconnect()
    setMenuShow(false)

    trackEvent('Wallet Disconnect Success', {
      'Source': getPageName(),
      'Type': walletName,
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

  const handleGetBalance = async () => {
    setBalanceLoading(true)
    if (! isEarn) {
      const balance = await getBalance('', true)
      if (balance.formatted) {
        const amount = balance.formatted*1
        setCurrentBalance({amount: amount.toFixed(4), symbol: balance.symbol})
      }
    }
    setBalanceLoading(false)
  }

  const handleClickDiscord = () => {
    // trackEvent('Click Support')
    window.open("https://discord.com/channels/951018857533935627/1107789606612631602/1135635808087462009", '_blank')
  }
  
  const handleBannerClick = (e) => {
    e.stopPropagation()
    e.preventDefault()

    handleConnectWallet()
  }

  const handleBannerCloseClick = (e) => {
    e.stopPropagation()
    e.preventDefault()

    setIsBannerClosed(true)
  }

  return (
    <App.Flex column className={cn(styles.container, {[styles.sticky]: isSticky})}>
      <div ref={headerRef}>
        {/* <App.Flex center gap={16} className={cn(styles.promoBanner, {[styles.hide]: ! showPromoBanner})}>
          <App.Flex center gap={4}>
            <Image src="/images/raffle/case-small.png" width={24} height={22} alt="" style={{marginTop: 3}} />
            <App.Text size={16} weight={600}>Psst! Here’s a $200 Case* For You!</App.Text>
          </App.Flex>

          <App.Text size={16} color="#FFCB04" weight={600} className={styles.promoLink}>OPEN FOR FREE!</App.Text>

          <App.Flex className={styles.promoCloseButton} onClick={handlePromoBannerCloseClick}>
            <App.Icon icon="cross" color="#fff" />
          </App.Flex>
        </App.Flex> */}

        <App.Container fluid className={styles.containerHeader}>
          <App.Flex row height="100%" align="center" justify="space-between" gap={[0, 16]}>
            <App.Flex row height="100%" align="center" className={styles.navbarLeftWrapper}>
              <Link href="/" style={{ lineHeight: 0 }}>
                {
                  isMobile
                    ? <App.Icon icon="tegro" width={91} height={20} />
                    : <div className={styles.logo}>
                        <div className={styles.badge}>
                          BETA
                        </div>
                        <App.Icon icon="tegro" width={117} height={25} />
                      </div>
                }
              </Link>

              <App.Flex row height="100%" align="center" className={styles.navItems}>
                <Link href="/exchange" className={cn(styles.navbarItem, {[styles.active]: router.pathname.includes('/exchange')})}>
                  <App.Flex center height="100%">
                    <App.Text size={16} weight={500}>Exchange</App.Text>
                  </App.Flex>
                </Link>

                <Link href="/earn" className={cn(styles.navbarItem, {[styles.active]: router.pathname.includes('/earn')})}>
                  <App.Flex center height="100%">
                    <App.Text size={16} weight={500}>Earn</App.Text>
                  </App.Flex>
                </Link>

                <App.Flex id="menu-dropdown" className={cn(styles.navbarItem, styles.navbarDropdown, {[styles.active]: moreIsOpen})} onMouseEnter={() => setMoreIsOpen(true)} onMouseLeave={() => setMoreIsOpen(false)}>
                  <App.Flex center height="100%" gap={8}>
                    <App.Text size={16} weight={500}>More</App.Text>
                    <App.Icon icon='caret-down' color="#fff" className={styles.carret} />
                  </App.Flex>

                  <NavbarDropdown isOpen={moreIsOpen} />
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex row align="center" className={styles.navbarRightWrapper}>
              { ! isMobile ? (
                <App.Flex id="support-dropdown" className={cn(styles.supportButton, {[styles.active]: supportIsOpen})} onClick={() => setSupportIsOpen(!supportIsOpen)}>
                  <App.Flex className={styles.linkWrapper}>
                    <App.Flex className={cn(styles.linkButton, {[styles.active]: supportIsOpen})}>
                      <App.Icon icon="question" />
                    </App.Flex>
                  </App.Flex>

                  <App.Flex column gap={32} className={cn(styles.dropdownMenu, {[styles.isOpen]: supportIsOpen})}>
                    <App.Flex column gap={16}>
                      <App.Flex column gap={4}>
                        <App.Text size={18} weight={600}>Get Instant Support</App.Text>
                        <App.Text size={10} color="#B9B8C5">Join our Discord for assistance.</App.Text>
                      </App.Flex>

                      <App.Flex row align="center" gap={6} className={styles.support} onClick={handleClickDiscord}>
                        <Image src="/images/discord-blue.png" width={24} height={24} alt="" />
                        <App.Text size={16} weight={600} height={1}>Discord</App.Text>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              ) : null}

              { ! isEarn ? <SwitchBlockchain onChangeNetwork={handleGetBalance} /> : <App.Flex />}
              
              <App.Flex row align="center" gap={16}>
                {wallet ? (
                  isMobile ? (
                    <HeaderWalletMobile />
                  ) : (
                    <App.Flex sx={{ position: 'relative' }} id="wallet">
                      <App.Flex row gap={16} className={styles.walletInfo}>
                        {! isMobile ? (
                          <App.Flex>
                            {balanceLoading ? (
                              <App.Flex center sx={{width: 90}}>
                                <App.Loader />
                              </App.Flex>
                            ) : (
                              <App.Flex center gap={4}>
                                {isEarn ? <Image src="/images/raffle/tkey-small.png" width={12} height={17} alt="" /> : null}
                                <App.Text size={16} weight={500}>{ currentBalance.amount + ' ' + currentBalance.symbol }</App.Text>
                              </App.Flex>
                            )}
                          </App.Flex>
                        ) : null}

                        <App.Flex className={styles.walletAddressWrapper} onClick={handleMenuToggle}>
                          <App.Text size={16} weight={500}>{shorterAddress(isMobile ? 4 : 6)}</App.Text>
                        </App.Flex>
                      </App.Flex>

                      <div className={cn(styles.menu, {[styles.active]: menuShow})}>
                        <App.Button primary fullWidth onClick={handleDisconnect}>
                        <App.Icon icon="logout" /> Disconnect
                        </App.Button>
                      </div>
                    </App.Flex>
                  )
                ) : (
                  <App.Button primary large={!isMobile} onClick={handleConnectWallet}>
                    Connect{!isMobile ? ' Wallet' : ''}
                  </App.Button>
                )}

                <div className={cn(styles.mobileMenuButton, {[styles.show]: mobileMenuShow})} onClick={handleMobileMenuClick}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </App.Flex>
            </App.Flex>

            <div className={cn(styles.mobileMenu, {[styles.show]: mobileMenuShow})}>
              <div className={styles.content}>
                <Link href="/exchange" className={cn(styles.link, {[styles.active]: router.pathname.includes('/exchange')})}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuExchange" />
                    <App.Text size={14} weight={700}>Exchange</App.Text>
                  </App.Flex>
                </Link>

                <Link href="/earn" className={cn(styles.link, {[styles.active]: router.pathname.includes('/earn')})}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuEarn" />
                    <App.Text size={14} weight={700}>Earn</App.Text>
                  </App.Flex>
                </Link>

                <App.Flex sx={{padding: '32px 16px'}}>
                  <App.Text size={14} weight={700}>MORE</App.Text>
                </App.Flex>

                <Link href="/nfts" className={cn(styles.link, {[styles.active]: router.pathname.includes('/nfts')})}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuNFT" />
                    <App.Text size={14} weight={700}>NFT</App.Text>
                  </App.Flex>
                </Link>

                <Link href="/swap" className={cn(styles.link, {[styles.active]: router.pathname.includes('/swap')})}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuSWAP" />
                    <App.Text size={14} weight={700}>NFT Swap</App.Text>
                  </App.Flex>
                </Link>

                <a href="https://classic.tegro.com" target="_blank" rel="noreferrer" className={styles.link}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuClassic" />
                    <App.Text size={14} weight={700}>Classic Tegro Withdraw</App.Text>
                  </App.Flex>
                </a>

                <App.Flex sx={{padding: '32px 16px'}}>
                  <App.Text size={14} weight={700}>RESOURCES</App.Text>
                </App.Flex>

                <a href="https://discord.com/channels/951018857533935627/1107789606612631602/1135635808087462009" target="_blank" rel="noreferrer" className={styles.link}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuSupport" />
                    <App.Text size={14} weight={700}>Support</App.Text>
                  </App.Flex>
                </a>

                <a href="https://blog.tegro.com" target="_blank" rel="noreferrer" className={styles.link}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuBlog" />
                    <App.Text size={14} weight={700}>Blog</App.Text>
                  </App.Flex>
                </a>

                <a href="https://x-by-tegro.gitbook.io/x-by-tegro/" target="_blank" rel="noreferrer" className={styles.link}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuGitbook" />
                    <App.Text size={14} weight={700}>Gitbook</App.Text>
                  </App.Flex>
                </a>

                <a href="https://press.tegro.com/" target="_blank" rel="noreferrer" className={styles.link}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuPress" />
                    <App.Text size={14} weight={700}>Press</App.Text>
                  </App.Flex>
                </a>

                <a href="mailto:partnerships@tegro.com" className={styles.link}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuContact" />
                    <App.Text size={14} weight={700}>Contact</App.Text>
                  </App.Flex>
                </a>

                <App.Flex sx={{padding: '32px 16px'}}>
                  <App.Text size={14} weight={700}>RESOURCES</App.Text>
                </App.Flex>

                <App.Flex sx={{padding: '0 16px', paddingBottom: 96}} justify="space-between">
                  <App.Flex column gap={12} sx={{width: 140}}>
                    <a href="https://twitter.com/tegrofi?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Flex gap={4}>
                        <App.Icon icon="twitter-filled" />
                        <App.Text size={10} weight={500}>Twitter</App.Text>
                      </App.Flex>
                    </a>
                    
                    <a href="https://discord.gg/tegro?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Flex gap={4}>
                        <App.Icon icon="discord-filled" />
                        <App.Text size={10} weight={500}>Discord</App.Text>
                      </App.Flex>
                    </a>
                    
                    <a href="https://t.me/tegrochat?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Flex gap={4}>
                        <App.Icon icon="telegram-filled" />
                        <App.Text size={10} weight={500}>Telegram</App.Text>
                      </App.Flex>
                    </a>
                  </App.Flex>
                  
                  <App.Flex column gap={12} sx={{width: 140}}>
                    <a href="https://www.linkedin.com/company/tegrofi?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Flex gap={4}>
                        <App.Icon icon="linkedin-filled" />
                        <App.Text size={10} weight={500}>LinkedIn</App.Text>
                      </App.Flex>
                    </a>
                    
                    <a href="https://tegro.substack.com/?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Flex gap={4}>
                        <App.Icon icon="substack-filled" />
                        <App.Text size={10} weight={500}>Substack</App.Text>
                      </App.Flex>
                    </a>
                    
                    <a href="https://www.youtube.com/@tegrofi?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Flex gap={4}>
                        <App.Icon icon="youtube-filled" />
                        <App.Text size={10} weight={500}>Youtube</App.Text>
                      </App.Flex>
                    </a>
                  </App.Flex>
                </App.Flex>
              </div>
            </div>
          </App.Flex>
        </App.Container>
      </div>
    </App.Flex>
  )
}

export default Header