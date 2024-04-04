import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import cn from 'classnames'

import Link from 'next/link'
// import Image from 'next/image'
import { useRouter } from 'next/router'

// import { CHAINS } from '@/config'
import $tournament from '@/store/tournament'

import App from '@/components/App'
import SwitchBlockchain from '@/components/Header/SwitchBlockchain'
// import NavbarDropdown from '@/components/Header/NavbarDropdown'
import HeaderWallet from '@/components/Header/HeaderWallet'
// import StoriesButton from '@/components/Header/StoriesButton'

import styles from './styles.module.scss'

const Header = () => {
  const router = useRouter()
  
  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)
  // const tournament = useSelector(({ $tournament }) => $tournament.current)

  const [mobileMenuShow, setMobileMenuShow] = useState(false)

  const isExchange = router.asPath?.includes('/exchange')

  useEffect(() => {
    dispatch($tournament.set.loading(true))
    $tournament.api.current().then(res => {
      dispatch($tournament.set.current(res?.data ? res.data : {}))
      dispatch($tournament.set.loading(false))

    })
  }, [])

  const handleMobileMenuClick = () => {
    if (mobileMenuShow) {
      document.body.classList.remove('modal-open')
    } else {
      document.body.classList.add('modal-open')
    }

    setMobileMenuShow(!mobileMenuShow)
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
            
            {/* {!isMobile ? (
              <>
                <div className={styles.line} />

                <Link href="https://tegro.com">
                  <App.ButtonGradient icon="arrow-45">tegro.com</App.ButtonGradient>
                </Link>
              </>
            ) : null} */}
          </App.Flex>

          <App.Flex row fullHeight gap={8} align="center">
            {!isMobile ? (
                <App.Flex row fullHeight align="center">
                  <Link href="/exchange" className={cn(styles.navItem, {[styles.active]: router.pathname.includes('/exchange')})}>
                    <App.Flex center fullHeight>
                      <App.Text size={14} weight={600}>Exchange</App.Text>
                    </App.Flex>
                  </Link>
{/* 
                  <div className={styles.navLine} />

                  {tournament?.alias ? (
                    <Link href={`/tournament/${tournament.alias}`} className={cn(styles.navItem, {[styles.active]: router.pathname.includes('/tournament')})}>
                      <App.Flex center fullHeight>
                        <App.Text size={14} weight={600}>Earn</App.Text>
                      </App.Flex>
                    </Link>
                  ) : (
                    <App.Flex className={cn(styles.navItem, styles.disabled)}>
                      <App.Flex center fullHeight>
                        <App.Text size={14} weight={600}>Earn</App.Text>
                      </App.Flex>
                    </App.Flex>
                  )} */}
                </App.Flex>
            ) : null}
            {
              isExchange
                  ? <SwitchBlockchain />
                  : null
            }
            <HeaderWallet />
         </App.Flex>

          <div className={cn(styles.mobileMenu, {[styles.show]: mobileMenuShow})}>
            <div className={styles.content}>
              {/* <App.Flex sx={{ padding: 16 }}>
                <Link href="https://tegro.com">
                  <App.ButtonGradient icon="arrow-45">tegro.com</App.ButtonGradient>
                </Link>
              </App.Flex>

              <div className={styles.line} /> */}

              <Link href="/exchange" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Icon icon="menuExchange" />
                  <App.Text size={14} weight={700} color={router.pathname.includes('/exchange') ? '#A6DC37' : '#fff'}>Exchange</App.Text>
                </App.Flex>
              </Link>
              
              {/* {tournament?.alias ? (
                <Link href={`/tournament/${tournament.alias}`} className={cn(styles.link)}>
                  <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                    <App.Icon icon="menuEarn" />
                    <App.Text size={14} weight={700} color={router.pathname.includes('/tournament') ? '#A6DC37' : '#fff'}>Earn</App.Text>
                  </App.Flex>
                </Link>
              ) : (
                <div className={cn(styles.link, styles.disabled)}>
                  <App.Flex align="center" height="100%" gap={8}>
                    <App.Icon icon="menuEarn" />
                    <App.Text size={14} weight={700}>Earn</App.Text>
                  </App.Flex>
                </div>
              )} */}

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

          {/* <App.Flex row align="center" className={styles.navbarRightWrapper}>
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

            <StoriesButton />

            { ! isEarn && ! isLanding && ! isMarket ? <SwitchBlockchain /> : <App.Flex />}
            
            <App.Flex row align="center" gap={16}>
              <HeaderWallet />

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
            </div>*/}
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default Header