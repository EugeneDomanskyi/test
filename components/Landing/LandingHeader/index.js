import { useEffect, useState } from 'react'
import Image from 'next/image'
import cn from 'classnames'

import Link from 'next/link'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingHeader = () => {
  const [menuShow, setMenuShow] = useState({
    product: false,
    resources: false,
    earn: false,
    partner: false,
  })
  const [mobileMenuShow, setMobileMenuShow] = useState(false)

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false)

    return () => {
      document.removeEventListener('click', handleClickOutside, false)
    }
  }, [])

  const handleClickOutside = (event) => {
    setMenuShow(state => {
      const result = {...state}
      for (const type in state) {
        if (state[type] && ! event.target.closest(`#${[type]}`)) {
          result[type] = false
        }
      }

      return result
    })
  }

  const handleMenuToggle = (type) => () => {
    setMenuShow(state => ({
      product: false,
      resources: false,
      earn: false,
      partner: false,
      [type]: ! menuShow[type],
    }))
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
              <App.Flex className={styles.navbarItem} onClick={handleMenuToggle('product')}>
                <App.Flex center height="100%">
                  <App.Text size={[18, 14]} weight={700}>PRODUCTS</App.Text>
                </App.Flex>
              </App.Flex>

              <div className={cn(styles.menu, styles.menuLong, {[styles.active]: menuShow.product})}>
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

            <App.Flex sx={{ position: 'relative' }} fullHeight id="resources">
              <App.Flex className={styles.navbarItem} onClick={handleMenuToggle('resources')}>
                <App.Flex center height="100%">
                  <App.Text size={[18, 14]} weight={700}>RESOURCES</App.Text>
                </App.Flex>
              </App.Flex>

              <div className={cn(styles.menu, styles.menuLong, {[styles.active]: menuShow.resources})}>
                <App.Flex row gap={24} fullWidth>
                  <App.Flex column gap={16} flex={1}>
                    <a href="https://blog.tegro.com/" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Blog</App.Text>
                    </a>

                    <div className={styles.hr} />

                    <a href="https://x-by-tegro.gitbook.io/x-by-tegro/" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Gitbook</App.Text>
                    </a>

                    <div className={styles.hr} />

                    <a href="https://press.tegro.com/" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Press Kit</App.Text>
                    </a>

                    <div className={styles.hr} />

                    <a href="https://twitter.com/tegrofi?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Twitter</App.Text>
                    </a>
                  </App.Flex>
  
                  <App.Flex column gap={16} flex={1}>
                    <a href="https://discord.gg/tegro?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Discord</App.Text>
                    </a>

                    <div className={styles.hr} />

                    <a href="https://www.facebook.com/tegroexchange?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Facebook</App.Text>
                    </a>

                    <div className={styles.hr} />

                    <a href="https://www.instagram.com/tegro_exchange/?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Instagram</App.Text>
                    </a>

                    <div className={styles.hr} />

                    <a href="https://tegro.substack.com/?utm_source=website" target="_blank" rel="noreferrer">
                      <App.Text inline size={[18, 14]} weight={600}>Substack</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>
              </div>
            </App.Flex>

            <App.Flex sx={{ position: 'relative' }} fullHeight id="earn">
              <App.Flex className={styles.navbarItem} onClick={handleMenuToggle('earn')}>
                <App.Flex center height="100%">
                  <App.Text size={[18, 14]} weight={700}>EARN</App.Text>
                </App.Flex>
              </App.Flex>

              <div className={cn(styles.menu, {[styles.active]: menuShow.earn})}>
                <App.Flex column gap={16} flex={1}>
                  <a href="https://galxe.com/tegro" target="_blank" rel="noreferrer">
                    <App.Text inline size={[18, 14]} weight={600}>Galxe</App.Text>
                  </a>

                  <div className={styles.hr} />

                  <a href="https://tegro.com/airdrops" target="_blank" rel="noreferrer">
                    <App.Text inline size={[18, 14]} weight={600}>Airdrops</App.Text>
                  </a>
                </App.Flex>
              </div>
            </App.Flex>

            <App.Flex sx={{ position: 'relative' }} fullHeight id="partner">
              <App.Flex className={styles.navbarItem} onClick={handleMenuToggle('partner')}>
                <App.Flex center height="100%">
                  <App.Text size={[18, 14]} weight={700}>PARTNER</App.Text>
                </App.Flex>
              </App.Flex>

              <div className={cn(styles.menu, {[styles.active]: menuShow.partner})}>
                <App.Flex column gap={16} flex={1}>
                  <a href="http://champions.tegro.com/" target="_blank" rel="noreferrer">
                    <App.Text nowrap inline size={[18, 14]} weight={600}>Champions Program</App.Text>
                  </a>

                  <div className={styles.hr} />

                  <a href="javascript:;" target="_blank" rel="noreferrer">
                    <App.Text inline size={[18, 14]} weight={600}>Earn Partners</App.Text>
                  </a>

                  <div className={styles.hr} />

                  <a href="https://calendly.com/anmol-tegro/30min" target="_blank" rel="noreferrer">
                    <App.Text inline size={[18, 14]} weight={600}>Contact</App.Text>
                  </a>
                </App.Flex>
              </div>
            </App.Flex>
          </App.Flex>

          <div className={cn(styles.mobileMenuButton, {[styles.show]: mobileMenuShow})} onClick={handleMobileMenuClick}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={cn(styles.mobileMenu, {[styles.show]: mobileMenuShow})}>
            <div className={styles.content}>
              <App.Flex column gap={16} sx={{padding: 16}}>
                <App.Flex column gap={8}>
                  <App.Text size={18} weight={700}>PRODUCT</App.Text>

                  <App.Flex column gap={8}>
                    <App.Flex row align="center" gap={8} onClick={handleProductClick('x')} sx={{ cursor: 'pointer' }}>
                      <App.Flex column gap={[8, 0]} flex={1}>
                        <App.Text size={[18, 14]} weight={600}>X</App.Text>
                        <App.Text size={[14, 12]} color="#9f9dad">Tegro X is a tool to access all dex based trading from NFTs to Tokens</App.Text>
                      </App.Flex>
                    </App.Flex>

                    <App.Flex row align="center" gap={8} onClick={handleProductClick('classic')} sx={{ cursor: 'pointer' }}>
                      <App.Flex column gap={[8, 0]} flex={1}>
                        <App.Text size={[18, 14]} weight={600}>Classic</App.Text>
                        <App.Text size={[14, 12]} color="#9f9dad">Tegro classic mode lets you trade and invest in a centralized exchange for tokens</App.Text>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>

                <div className={styles.line} />

                <App.Flex column gap={8}>
                  <App.Text size={18} weight={700}>RESOURCES</App.Text>

                  <App.Flex row gap={24} fullWidth>
                    <App.Flex column gap={8} flex={1}>
                      <a href="https://blog.tegro.com/" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Blog</App.Text>
                      </a>

                      <a href="https://x-by-tegro.gitbook.io/x-by-tegro/" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Gitbook</App.Text>
                      </a>

                      <a href="https://press.tegro.com/" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Press Kit</App.Text>
                      </a>

                      <a href="https://twitter.com/tegrofi?utm_source=website" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Twitter</App.Text>
                      </a>
                    </App.Flex>
    
                    <App.Flex column gap={8} flex={1}>
                      <a href="https://discord.gg/tegro?utm_source=website" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Discord</App.Text>
                      </a>

                      <a href="https://www.facebook.com/tegroexchange?utm_source=website" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Facebook</App.Text>
                      </a>

                      <a href="https://www.instagram.com/tegro_exchange/?utm_source=website" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Instagram</App.Text>
                      </a>

                      <a href="https://tegro.substack.com/?utm_source=website" target="_blank" rel="noreferrer">
                        <App.Text inline size={14} weight={600}>Substack</App.Text>
                      </a>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>

                <div className={styles.line} />

                <App.Flex column gap={8}>
                  <App.Text size={18} weight={700}>EARN</App.Text>

                  <App.Flex column gap={8}>
                    <a href="https://galxe.com/tegro" target="_blank" rel="noreferrer">
                      <App.Text inline size={14} weight={600}>Galxe</App.Text>
                    </a>

                    <a href="https://tegro.com/airdrops" target="_blank" rel="noreferrer">
                      <App.Text inline size={14} weight={600}>Airdrops</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>

                <div className={styles.line} />

                <App.Flex column gap={8}>
                  <App.Text size={18} weight={700}>PARTNER</App.Text>

                  <App.Flex column gap={8}>
                    <a href="http://champions.tegro.com/" target="_blank" rel="noreferrer">
                      <App.Text nowrap inline size={14} weight={600}>Champions Program</App.Text>
                    </a>

                    <a href="javascript:;" target="_blank" rel="noreferrer">
                      <App.Text inline size={14} weight={600}>Earn Partners</App.Text>
                    </a>

                    <a href="https://calendly.com/anmol-tegro/30min" target="_blank" rel="noreferrer">
                      <App.Text inline size={14} weight={600}>Contact</App.Text>
                    </a>
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </div>
          </div>
        </App.Flex>
      </App.Flex>
    </App.Container>
  )
}

export default LandingHeader