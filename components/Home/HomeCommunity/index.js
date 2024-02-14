import { useState } from 'react'
import Amplitude from '@/libs/amplitude.lib'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useSelector } from 'react-redux'

const HomeCommunity = () => {
  const [email, setEmail] = useState()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const handleSocialClick = (social) => () => {
    let url = ''
    let community = null

    switch (social) {
      case 'twitter':
        community = 'Twitter'
        url = 'https://twitter.com/tegrofi?utm_source=website'
        break
      case 'discord':
        community = 'Discord'
        url = 'https://discord.gg/tegro?utm_source=website'
        break
      case 'telegram':
        community = 'Telegram'
        url = 'https://t.me/tegrochat?utm_source=website'
        break
      case 'linkedin':
        community = 'LinkedIn'
        url = 'https://www.linkedin.com/company/tegrofi?utm_source=website'
        break
      case 'youtube':
        community = 'Youtube'
        url = 'https://www.youtube.com/@tegrofi?utm_source=website'
        break
      default:
        url = 'https://tegro.com/'
        break
    }

    if (community) {
      Amplitude.event('Community Resources Visited', {
        'Community': community,
      })
    }

    window.open(url, '_blank')
  }

  return (
    <div className={styles.glow}>
      <App.Container maxWidth={1230} className={styles.container}>
        <div className={styles.background1} />

        <App.Flex fullWidth className={styles.inner}>
          <App.Flex fullWidth column gap={32}>
            <App.Text size={40} weight={600}>Join Our <App.Text inline italic size={40} weight={700} color="#A6DC37" family="Playfair Display">Community</App.Text></App.Text>

            <App.Flex wrap gap={[40, 0]} justify="space-between">
              <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} gap={12} width={[190, '50%']} sx={{ cursor: 'pointer' }} onClick={handleSocialClick('twitter')} className={styles.item}>
                <img src="/images/home/community-x.png" alt="X" />

                <App.Flex column>
                  <App.Text size={20} weight={700}>Twitter (X)</App.Text>
                  <App.Text size={14} weight={600}>Join &gt;</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} gap={12} width={[190, '50%']} sx={{ cursor: 'pointer' }} onClick={handleSocialClick('discord')} className={styles.item}>
                <img src="/images/home/community-discord.png" alt="Discord" />

                <App.Flex column>
                  <App.Text size={20} weight={700}>Discord</App.Text>
                  <App.Text size={14} weight={600}>Join &gt;</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} gap={12} width={[190, '50%']} sx={{ cursor: 'pointer' }} onClick={handleSocialClick('telegram')} className={styles.item}>
                <img src="/images/home/community-telegram.png" alt="Telegram" />

                <App.Flex column>
                  <App.Text size={20} weight={700}>Telegram</App.Text>
                  <App.Text size={14} weight={600}>Join &gt;</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} gap={12} width={[190, '50%']} sx={{ cursor: 'pointer' }} onClick={handleSocialClick('youtube')} className={styles.item}>
                <img src="/images/home/community-youtube.png" alt="YouTube" />

                <App.Flex column>
                  <App.Text size={20} weight={700}>YouTube</App.Text>
                  <App.Text size={14} weight={600}>Join &gt;</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} gap={12} width={[190, '50%']} sx={{ cursor: 'pointer' }} onClick={handleSocialClick('linkedin')} className={styles.item}>
                <img src="/images/home/community-linkedin.png" alt="LinkedIn" />

                <App.Flex column>
                  <App.Text size={20} weight={700}>LinkedIn</App.Text>
                  <App.Text size={14} weight={600}>Join &gt;</App.Text>
                </App.Flex>
              </App.Flex>

              <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} gap={12} width={[190, '50%']} className={styles.item}>
              </App.Flex>
            </App.Flex>

            <div className={styles.line} />

            <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} fullWidth gap={12}>
              <App.Flex width={[210, '100%']}>
                <App.Text capitalize size={[16, 20]} weight={600}>
                  Do not forget <App.Text inline italic size={[16, 20]} weight={700} family="Playfair Display" color="#7364FF">to subscribe</App.Text> to our Newsletters:
                </App.Text>
              </App.Flex>

              <App.Flex row align="center" flex={[1, 0]} gap={12} width={['auto', '100%']}>
                <App.TextField
                  value={email}
                  placeholder="Email"
                  variant="subscribe"
                  onChange={(value) => setEmail(value)}
                />

                <App.Frame padding="10px 24px" radius={50} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)" sx={{ cursor: 'pointer' }}>
                  <App.Flex row center gap={16}>
                    <App.Text>{!isMobile ? 'Subscribe' : '>'}</App.Text>
                  </App.Flex>
                </App.Frame>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default HomeCommunity