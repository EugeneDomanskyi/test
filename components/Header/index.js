import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import cn from 'classnames'

import Link from 'next/link'
import { useRouter } from 'next/router'

import $tournament from '@/store/tournament'

import App from '@/components/App'
import SwitchBlockchain from '@/components/Header/SwitchBlockchain'
import HeaderWallet from '@/components/Header/HeaderWallet'

import styles from './styles.module.scss'

const Header = () => {
  const router = useRouter()
  
  const dispatch = useDispatch()
  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

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
                <App.Flex row gap={8} center>
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
                  <App.Icon icon="tegro" width={117} height={25} />
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
              </App.Flex>
            ) : null}
          </App.Flex>

          <App.Flex row fullHeight gap={8} align="center">
            {
              isExchange
                ? <SwitchBlockchain />
                : null
            }
            <HeaderWallet />
         </App.Flex>

          <div className={cn(styles.mobileMenu, {[styles.show]: mobileMenuShow})}>
            <div className={styles.content}>
              <Link href="/exchange" className={cn(styles.link)}>
                <App.Flex align="center" height="100%" gap={8} onClick={handleMobileMenuClick}>
                  <App.Icon icon="menuExchange" />
                  <App.Text size={14} weight={700} color={router.pathname.includes('/exchange') ? '#A6DC37' : '#fff'}>Exchange</App.Text>
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