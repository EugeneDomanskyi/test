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
import SwitchBlockchain from '@/components/SwitchBlockchain'

import styles from './styles.module.scss'
import Image from 'next/image'

const LandingHeader = () => {
  const router = useRouter()
  const { wallet, connect, disconnect } = useWalletConnect()
  const { isMobile } = usePropsHelper()

  const dispatch = useDispatch()

  const [menuShow, setMenuShow] = useState(false)
  const [mobileMenuShow, setMobileMenuShow] = useState(false)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleClickOutside = (event) => {
    if (! event.target.closest('#product')) {
      setMenuShow(false)
    }
  }

  const handleMenuToggle = () => {
    setMenuShow( ! menuShow)
  }

  const handleMobileMenuClick = () => {
    if (mobileMenuShow) {
      document.body.classList.remove('modal-open')
    } else {
      document.body.classList.add('modal-open')
    }

    setMobileMenuShow(!mobileMenuShow)
  }

  const handleProductClick = (site) => () => {
    let url = ''

    switch (site) {
      case 'x':
        url = 'https://x.tegro.com'
        break
      case 'classic':
        url = 'https://tegro.com'
        break
      default:
        url = 'https://tegro.com'
        break
    }

    window.open(url, '_blank')
  }

  return (
    <App.Container fluid className={styles.container}>
      <App.Flex row full align="center">
        <App.Flex row full align="center" gap={[64, 16]} justify={['flex-start', 'space-between']}>
          <Link href="/">
            <div className={styles.logo}>
              <div className={styles.badge}>
                BETA
              </div>
              <App.Icon icon="tegro" width={117} height={25} />
            </div>
          </Link>

          <App.Flex row height="100%" align="center" className={styles.navItems}>
            <App.Flex sx={{ position: 'relative' }} fullHeight id="product">
              <App.Flex className={styles.navbarItem} onClick={handleMenuToggle}>
                <App.Flex center height="100%">
                  <App.Text size={[18, 14]} weight={700}>PRODUCTS</App.Text>
                </App.Flex>
              </App.Flex>

              <div className={cn(styles.menu, {[styles.active]: menuShow})}>
                <App.Flex column gap={16}>
                  <App.Flex row align="center" gap={8} onClick={handleProductClick('x')} sx={{ cursor: 'pointer' }}>
                    <App.Flex center width={60} height={61}>
                      <Image src="/images/landing/logo-x1.png" width={60} height={61} alt="" />
                    </App.Flex>

                    <App.Flex column gap={[8, 0]} flex={1}>
                      <App.Text size={[18, 14]} weight={600}>X</App.Text>
                      <App.Text size={[14, 12]} color="#9f9dad">Tegro X is a tool to access all dex based trading from NFTs to Tokens</App.Text>
                    </App.Flex>
                  </App.Flex>

                  <div className={styles.hr} />

                  <App.Flex row align="center" gap={8} onClick={handleProductClick('classic')} sx={{ cursor: 'pointer' }}>
                    <App.Flex center width={60} height={60}>
                      <Image src="/images/landing/logo-classic.png" width={40} height={40} alt="" />
                    </App.Flex>

                    <App.Flex column gap={[8, 0]} flex={1}>
                      <App.Text size={[18, 14]} weight={600}>Classic</App.Text>
                      <App.Text size={[14, 12]} color="#9f9dad">Tegro classic mode lets you trade and invest in a centralized exchange for tokens</App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              </div>
            </App.Flex>

            <a href="/" target="_blank" rel="noreferrer" className={styles.navbarItem}>
              <App.Flex center gap={8} height="100%">
                <App.Text size={[18, 14]} weight={700}>DOCS</App.Text>
                <App.Icon icon="arrow-45" className={styles.hiddenOnMobile}/>
              </App.Flex>
            </a>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default LandingHeader