import cn from 'classnames'

import { trackEvent } from '@/libs/analytics.lib'

import App from '@/components/App'

import styles from './styles.module.scss'

const NavbarDropdown = ({isOpen, onClose}) => {
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
  
  return (
    <App.Flex column gap={32} className={cn(styles.dropdownMenu, {[styles.isOpen]: isOpen})} onMouseLeave={onClose}>
      <App.Flex gap={24}>
        <App.Flex column gap={24}>
          <App.Text size={14} weight={700} color="#B9B8C5">EXCHANGE</App.Text>

          <App.Flex column gap={8}>
            <a href="https://classic.tegro.com/" target="_blank" rel="noreferrer" onClick={handlePageEvent('Classic')}>
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
            <a href="https://blog.tegro.com/" target="_blank" rel="noreferrer" onClick={handlePageEvent('Blog')}>
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
            
            <a href="https://x-by-tegro.gitbook.io/x-by-tegro/" target="_blank" rel="noreferrer" onClick={handlePageEvent('Gitbook')}>
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
            
            <a href="https://press.tegro.com/" target="_blank" rel="noreferrer" onClick={handlePageEvent('Press')}>
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
          <a href="https://twitter.com/tegrofi?utm_source=website" target="_blank" rel="noreferrer" onClick={handleResourceEvent('Twitter')}>
            <App.Flex center gap={4} className={styles.socialLink}>
              <App.Icon icon="twitter-filled" />
              <App.Text size={10} weight={500}>Twitter</App.Text>
            </App.Flex>
          </a>
          
          <a href="https://discord.gg/tegro?utm_source=website" target="_blank" rel="noreferrer" onClick={handleResourceEvent('Discord')}>
            <App.Flex center gap={4} className={styles.socialLink}>
              <App.Icon icon="discord-filled" />
              <App.Text size={10} weight={500}>Discord</App.Text>
            </App.Flex>
          </a>
          
          <a href="https://t.me/tegrochat?utm_source=website" target="_blank" rel="noreferrer" onClick={handleResourceEvent('Telegram')}>
            <App.Flex center gap={4} className={styles.socialLink}>
              <App.Icon icon="telegram-filled" />
              <App.Text size={10} weight={500}>Telegram</App.Text>
            </App.Flex>
          </a>
          
          <a href="https://www.linkedin.com/company/tegrofi?utm_source=website" target="_blank" rel="noreferrer" onClick={handleResourceEvent('LinkedIn')}>
            <App.Flex center gap={4} className={styles.socialLink}>
              <App.Icon icon="linkedin-filled" />
              <App.Text size={10} weight={500}>LinkedIn</App.Text>
            </App.Flex>
          </a>
          
          <a href="https://tegro.substack.com/?utm_source=website" target="_blank" rel="noreferrer" onClick={handleResourceEvent('Substack')}>
            <App.Flex center gap={4} className={styles.socialLink}>
              <App.Icon icon="substack-filled" />
              <App.Text size={10} weight={500}>Substack</App.Text>
            </App.Flex>
          </a>
          
          <a href="https://www.youtube.com/@tegrofi?utm_source=website" target="_blank" rel="noreferrer" onClick={handleResourceEvent('Youtube')}>
            <App.Flex center gap={4} className={styles.socialLink}>
              <App.Icon icon="youtube-filled" />
              <App.Text size={10} weight={500}>Youtube</App.Text>
            </App.Flex>
          </a>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default NavbarDropdown