import { useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import Link from 'next/link'
import { useRouter } from 'next/router'

import App from '@/components/App'
import SwitchBlockchain from '@/components/Header/SwitchBlockchain'
import HeaderWallet2 from '@/components/Header/HeaderWallet2'

import styles from './styles.module.scss'

const Header = () => {
  const router = useRouter()
  const isHome = router.asPath == '/'
  const isExchange = router.asPath?.includes('/exchange')
  
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [mobileMenuShow, setMobileMenuShow] = useState(false)
  const [supportIsOpen, setSupportIsOpen] = useState(false)

  const handleMobileMenuClick = () => {
    if (mobileMenuShow) {
      document.body.classList.remove('modal-open')
    } else {
      document.body.classList.add('modal-open')
    }

    setMobileMenuShow(!mobileMenuShow)
  }

  const handleClickDiscord = () => {
    window.open("https://discord.com/channels/951018857533935627/1107789606612631602/1135635808087462009", '_blank')
  }

  return (
    <App.Flex column className={cn(styles.container)}>
      <App.Container fluid className={styles.containerHeader}>
        <App.Flex row full align="center" justify="space-between" gap={[0, 16]}>
          <App.Flex row fullHeight gap={24} align="center" justify={['flex-start', 'space-between']}>
            <App.Flex row fullHeight gap={[24, 8]} align="center">
              <Link href="/" style={{ lineHeight: 0 }}>
                <div className={styles.logo}>
                  <App.Icon icon="tegro" width={isMobile ? 75 : 117} height={isMobile ? 16 : 25} />
                </div>
              </Link>
            </App.Flex>
            
            {!isMobile ? (
              <App.Flex row fullHeight align="center">
                <Link href="/exchange" className={cn(styles.navItem, {[styles.active]: router.pathname.includes('/exchange')})}>
                  <App.Flex center fullHeight>
                    <App.Text size={14} weight={600}>Exchange</App.Text>
                  </App.Flex>
                </Link>

                <a href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL} target="_blank" rel="noreferrer" className={cn(styles.navItem)}>
                  <App.Flex center fullHeight>
                    <App.Text size={14} weight={600}>Earn</App.Text>
                  </App.Flex>
                </a>

                <Link href="/tournaments" className={cn(styles.navItem, {[styles.active]: router.pathname.includes('/tournaments')})}>
                  <App.Flex center fullHeight>
                    <App.Text size={14} weight={600}>Tournaments</App.Text>
                  </App.Flex>
                </Link>

                <Link href="/gems-dashboard" className={cn(styles.navItem, {[styles.active]: router.pathname.includes('/gems-dashboard')})}>
                  <App.Flex center fullHeight>
                    <App.Text size={14} weight={600}>Gems</App.Text>
                  </App.Flex>
                </Link>
              </App.Flex>
            ) : null}
          </App.Flex>

          <App.Flex row fullHeight gap={8} align="center">
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

            {isExchange ? <SwitchBlockchain /> : null}
            {!isHome ? <HeaderWallet2 /> : <App.Button primary small={isMobile} target="_self" href="/exchange">Launch app</App.Button>}

            {isMobile ? (
              <App.Flex row gap={10} center>
                <div className={styles.line} />
                
                <div className={cn(styles.mobileMenuButton, {[styles.show]: mobileMenuShow})} onClick={handleMobileMenuClick}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </App.Flex>
            ) : null}
         </App.Flex>

          <div className={cn(styles.mobileMenu, {[styles.show]: mobileMenuShow})}>
            <div className={styles.content}>
              <Link href="/exchange" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Text size={16} weight={600} color={router.pathname.includes('/exchange') ? '#A6DC37' : '#fff'}>Exchange</App.Text>
                </App.Flex>
              </Link>

              <a href={process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL} target="_blank" rel="noreferrer" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Text size={16} weight={600}>Earn</App.Text>
                </App.Flex>
              </a>

              <Link href="/tournaments" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Text size={16} weight={600} color={router.pathname.includes('/tournaments') ? '#A6DC37' : '#fff'}>Tournaments</App.Text>
                </App.Flex>
              </Link>

              <Link href="/gems-dashboard" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Text size={16} weight={600} color={router.pathname.includes('/gems-dashboard') ? '#A6DC37' : '#fff'}>Gems</App.Text>
                </App.Flex>
              </Link>

              <App.Flex className={cn(styles.link)} onClick={handleClickDiscord}>
                <App.Flex align="center" height="100%" gap={8}>
                  <App.Icon icon="question" />
                  <App.Text size={16} weight={600}>Discord Support</App.Text>
                </App.Flex>
              </App.Flex>
            </div>
          </div>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default Header