import { useDispatch } from 'react-redux'
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

const NavbarDropdown = ({isOpen, onClose}) => {
  const handleClickOutside = () => {
    console.log('handleClickOutside');
    onClose()
  }

  return (
    <>
      <App.Flex sx={{position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 10, display: isOpen ? 'flex' : 'none', cursor: 'defaul'}} onClick={handleClickOutside} />

      <App.Flex column gap={32} className={cn(styles.dropdownMenu, {[styles.isOpen]: isOpen})}>
        <App.Flex gap={24}>
          <App.Flex column gap={24}>
            <App.Text size={14} weight={700} color="#B9B8C5">EXCHANGE</App.Text>

            <App.Flex column gap={8}>
              <Link href="/nfts">
                <App.Flex gap={8} className={styles.menuItem}>
                  <App.Flex>
                    <App.Icon icon="menuNFT" />
                  </App.Flex>

                  <App.Flex column sx={{width: 160}}>
                    <App.Text size={14} weight={500}>NFT {`->`}</App.Text>
                    <App.Text size={10} weight={500}>Trade NFTs as easy as ERC-20 Tokens</App.Text>
                  </App.Flex>
                </App.Flex>
              </Link>
              
              <Link href="/swap">
                <App.Flex gap={8} className={styles.menuItem}>
                  <App.Flex>
                    <App.Icon icon="menuSWAP" />
                  </App.Flex>

                  <App.Flex column sx={{width: 160}}>
                    <App.Text size={14} weight={500}>NFT Swap</App.Text>
                    <App.Text size={10} weight={500}>Buy & Sell NFTs in bulk at the best prices</App.Text>
                  </App.Flex>
                </App.Flex>
              </Link>
              
              <a href="https://classic.tegro.com/" target="_blank" rel="noreferrer" className={styles.menuItem}>
                <App.Flex gap={8} className={styles.menuItem}>
                  <App.Flex>
                    <App.Icon icon="menuClassic" />
                  </App.Flex>

                  <App.Flex column sx={{width: 160}}>
                    <App.Text size={14} weight={500}>Classic Tegro Withdraw</App.Text>
                    <App.Text size={10} weight={500}>Classic Tegro user? Withdraw your funds now</App.Text>
                  </App.Flex>
                </App.Flex>
              </a>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={24}>
            <App.Text size={14} weight={700} color="#B9B8C5">RESOURCES</App.Text>

            <App.Flex column gap={8}>
              <a href="https://blog.tegro.com/" target="_blank" rel="noreferrer">
                <App.Flex gap={8} className={styles.menuItem}>
                  <App.Flex>
                    <App.Icon icon="menuBlog" />
                  </App.Flex>

                  <App.Flex column sx={{width: 160}}>
                    <App.Text size={14} weight={500}>Blog</App.Text>
                    <App.Text size={10} weight={500}>Discover insights, stories, and updates</App.Text>
                  </App.Flex>
                </App.Flex>
              </a>
              
              <a href="https://x-by-tegro.gitbook.io/x-by-tegro/" target="_blank" rel="noreferrer">
                <App.Flex gap={8} className={styles.menuItem}>
                  <App.Flex>
                    <App.Icon icon="menuGitbook" />
                  </App.Flex>

                  <App.Flex column sx={{width: 160}}>
                    <App.Text size={14} weight={500}>Gitbook</App.Text>
                    <App.Text size={10} weight={500}>Read product documentation and guides</App.Text>
                  </App.Flex>
                </App.Flex>
              </a>
              
              <a href="https://press.tegro.com/" target="_blank" rel="noreferrer">
                <App.Flex gap={8} className={styles.menuItem}>
                  <App.Flex>
                    <App.Icon icon="menuPress" />
                  </App.Flex>

                  <App.Flex column sx={{width: 160}}>
                    <App.Text size={14} weight={500}>Press</App.Text>
                    <App.Text size={10} weight={500}>Explore latest news and media mentions</App.Text>
                  </App.Flex>
                </App.Flex>
              </a>
              
              <a href="mailto:partnerships@tegro.com">
                <App.Flex gap={8} className={styles.menuItem}>
                  <App.Flex>
                    <App.Icon icon="menuContact" />
                  </App.Flex>

                  <App.Flex column sx={{width: 160}}>
                    <App.Text size={14} weight={500}>Contact</App.Text>
                    <App.Text size={10} weight={500}>Reach out for inquiries or collaborations</App.Text>
                  </App.Flex>
                </App.Flex>
              </a>
            </App.Flex>
          </App.Flex>
        </App.Flex>
        
        <App.Flex column gap={16}>
          <App.Text>JOIN OUR COMMUNITY</App.Text>
          
          <App.Flex gap={16}>
            <a href="https://twitter.com/tegrofi?utm_source=website" target="_blank" rel="noreferrer">
              <App.Flex center gap={4} className={styles.socialLink}>
                <App.Icon icon="twitter-filled" />
                <App.Text size={10} weight={500}>Twitter</App.Text>
              </App.Flex>
            </a>
            
            <a href="https://discord.gg/tegro?utm_source=website" target="_blank" rel="noreferrer">
              <App.Flex center gap={4} className={styles.socialLink}>
                <App.Icon icon="discord-filled" />
                <App.Text size={10} weight={500}>Discord</App.Text>
              </App.Flex>
            </a>
            
            <a href="https://t.me/tegrochat?utm_source=website" target="_blank" rel="noreferrer">
              <App.Flex center gap={4} className={styles.socialLink}>
                <App.Icon icon="telegram-filled" />
                <App.Text size={10} weight={500}>Telegram</App.Text>
              </App.Flex>
            </a>
            
            <a href="https://www.linkedin.com/company/tegrofi?utm_source=website" target="_blank" rel="noreferrer">
              <App.Flex center gap={4} className={styles.socialLink}>
                <App.Icon icon="linkedin-filled" />
                <App.Text size={10} weight={500}>Linkdein</App.Text>
              </App.Flex>
            </a>
            
            <a href="https://tegro.substack.com/?utm_source=website" target="_blank" rel="noreferrer">
              <App.Flex center gap={4} className={styles.socialLink}>
                <App.Icon icon="substack-filled" />
                <App.Text size={10} weight={500}>Substack</App.Text>
              </App.Flex>
            </a>
            
            <a href="https://www.youtube.com/@tegrofi?utm_source=website" target="_blank" rel="noreferrer">
              <App.Flex center gap={4} className={styles.socialLink}>
                <App.Icon icon="youtube-filled" />
                <App.Text size={10} weight={500}>Youtube</App.Text>
              </App.Flex>
            </a>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </>
  )
}

export default NavbarDropdown