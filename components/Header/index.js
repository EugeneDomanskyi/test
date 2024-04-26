import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import cn from 'classnames'

import App from '@/components/App'
import SwitchBlockchain from '@/components/Header/SwitchBlockchain'
import HeaderWallet2 from '@/components/Header/HeaderWallet2'

import styles from './styles.module.scss'

const Header = () => {
  const router = useRouter()
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
          <App.Flex row full gap={24} align="center" justify={['flex-start', 'space-between']}>
            <App.Flex row fullHeight gap={[24, 8]} align="center">
              {isMobile ? (
                <App.Flex row gap={8} center sx={{ paddingTop: 12 }}>
                  <div className={cn(styles.mobileMenuButton, {[styles.show]: mobileMenuShow})} onClick={handleMobileMenuClick}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className={styles.line} />
                </App.Flex>
              ) : null}

              <Link href="/" style={{ lineHeight: 0 }}>
                <div className={styles.logo}>
                  <App.Flex center row className={styles.badge}>
                    <App.Text center italic size={8.7} weight={700} color="#08051C" height={1}>TESTNET</App.Text>
                  </App.Flex>
                  <App.Icon icon="tegro" width={117} height={25} />
                </div>
              </Link>
            </App.Flex>
            
            {!isMobile ? (
              <App.Flex row fullHeight align="center">
                <Link href="/exchange" className={cn(styles.navItem, {[styles.active]: router.pathname.includes('/exchange')})}>
                  <App.Flex center fullHeight>
                    <App.Text size={16} weight={600}>Exchange</App.Text>
                  </App.Flex>
                </Link>

                <Link href="/points-dashboard" className={cn(styles.navItem, {[styles.active]: router.pathname.includes('/points-dashboard')})}>
                  <App.Flex center fullHeight>
                    <App.Text size={16} weight={600}>Points Dashboard</App.Text>
                  </App.Flex>
                </Link>
              </App.Flex>
            ) : null}
          </App.Flex>

          <App.Flex row fullHeight gap={24} align="center">
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
            <HeaderWallet2 />
         </App.Flex>

          <div className={cn(styles.mobileMenu, {[styles.show]: mobileMenuShow})}>
            <div className={styles.content}>
              <Link href="/exchange" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Icon icon="menuExchange" />
                  <App.Text size={14} weight={700} color={router.pathname.includes('/exchange') ? '#A6DC37' : '#fff'}>Exchange</App.Text>
                </App.Flex>
              </Link>

              <Link href="/points-dashboard" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Icon icon="menuExchange" />
                  <App.Text size={14} weight={700} color={router.pathname.includes('/points-dashboard') ? '#A6DC37' : '#fff'}>Points Dashboard</App.Text>
                </App.Flex>
              </Link>
              
              <div className={styles.line} />

              <App.Flex sx={{padding: 16}} justify="space-between">
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
    </App.Flex>
  )
}

export default Header