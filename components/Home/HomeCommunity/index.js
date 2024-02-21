import { useState } from 'react'
import Amplitude from '@/libs/amplitude.lib'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useSelector } from 'react-redux'

const HomeCommunity = () => {
  const [email, setEmail] = useState()

  const isMobile = useSelector(({ $app }) => $app.size.isMobile)

  const [isSubscribeModalVisible, setIsSubscribeModalVisible] = useState(false)

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

  const handleSubscribeModal = () => {
    setIsSubscribeModalVisible(true)
  }

  const handleSubscribeModalClose = () => {
    setIsSubscribeModalVisible(false)
  }

  return (
    <div className={styles.glow}>
      <App.Container maxWidth={1230} className={styles.container}>
        <div className={styles.background1} />

        <App.Flex fullWidth className={styles.inner}>
          <App.Flex fullWidth column gap={32}>
            <App.Flex column>
              <App.Text tag="h2" size={40} weight={600} height={1}>
                Building Tomorrow&apos;s DEX,<br />
                <App.Text inline italic size={40} weight={700} color="#A6DC37" family="Playfair Display" height={1}>Today – With You, For You</App.Text>
              </App.Text>
            </App.Flex>

            <App.Flex wrap gap={20}>
              <App.Flex flex={1} onClick={handleSocialClick('twitter')} className={styles.item}>
                <App.Frame padding="12px 16px" width="100%" radius={12} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                  <App.Flex column fullWidth gap={12}>
                    <img src="/images/home/community-x.png" alt="X" />
                    <App.Text size={20} weight={600} height={1}>X (Twitter)</App.Text>
                  </App.Flex>
                </App.Frame>

                <App.Icon icon="arrow-45" width={12} height={12} color="#FFFFFF99" className={styles.arrow} />
              </App.Flex>

              <App.Flex flex={1} onClick={handleSocialClick('discord')} className={styles.item}>
                <App.Frame padding="12px 16px" width="100%" radius={12} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                  <App.Flex column fullWidth gap={12}>
                    <img src="/images/home/community-discord.png" alt="Discord" />
                    <App.Text size={20} weight={600} height={1}>Discord</App.Text>
                  </App.Flex>
                </App.Frame>

                <App.Icon icon="arrow-45" width={12} height={12} color="#FFFFFF99" className={styles.arrow} />
              </App.Flex>

              <App.Flex flex={1} onClick={handleSocialClick('telegram')} className={styles.item}>
                <App.Frame padding="12px 16px" width="100%" radius={12} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                  <App.Flex column fullWidth gap={12}>
                    <img src="/images/home/community-telegram.png" alt="Telegram" />
                    <App.Text size={20} weight={600} height={1}>Telegram</App.Text>
                  </App.Flex>
                </App.Frame>

                <App.Icon icon="arrow-45" width={12} height={12} color="#FFFFFF99" className={styles.arrow} />
              </App.Flex>

              <App.Flex flex={1} onClick={handleSocialClick('youtube')} className={styles.item}>
                <App.Frame padding="12px 16px" width="100%" radius={12} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                  <App.Flex column fullWidth gap={12}>
                    <img src="/images/home/community-youtube.png" alt="YouTube" />
                    <App.Text size={20} weight={600} height={1}>YouTube</App.Text>
                  </App.Flex>
                </App.Frame>

                <App.Icon icon="arrow-45" width={12} height={12} color="#FFFFFF99" className={styles.arrow} />
              </App.Flex>

              <App.Flex flex={1} onClick={handleSocialClick('linkedin')} className={styles.item}>
                <App.Frame padding="12px 16px" width="100%" radius={12} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                  <App.Flex column fullWidth gap={12}>
                    <img src="/images/home/community-linkedin.png" alt="LinkedIn" />
                    <App.Text size={20} weight={600} height={1}>LinkedIn</App.Text>
                  </App.Flex>
                </App.Frame>

                <App.Icon icon="arrow-45" width={12} height={12} color="#FFFFFF99" className={styles.arrow} />
              </App.Flex>
            </App.Flex>

            <div className={styles.line} />

            <App.Flex direction={['row', 'column']} align={['center', 'flex-start']} fullWidth gap={12}>
              <App.Flex column width={[430, '100%']}>
                <App.Text capitalize size={20} weight={600}>
                  Never miss <App.Text inline italic size={20} weight={700} family="Playfair Display" color="#7364FF">an update</App.Text>
                </App.Text>

                <App.Text capitalize size={14} weight={500} color="#9B99BD">
                  Subscribe to our weekly newsletter and stay informed!
                </App.Text>
              </App.Flex>

              <App.Flex row align="center" flex={[1, 0]} gap={12} width={['auto', '100%']}>
                {/* <App.TextField
                  value={email}
                  placeholder="Email"
                  variant="subscribe"
                  onChange={(value) => setEmail(value)}
                /> */}

                <App.ButtonGradient onClick={handleSubscribeModal}>Subscribe</App.ButtonGradient>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Dialog width={480} open={isSubscribeModalVisible} title="Subscribe" onClose={handleSubscribeModalClose}>
          <iframe src="https://tegro.substack.com/embed"
            width={480}
            height={150}
            style={{border: '1px solid #08051C', backgroundColor: '#08051C'}}
          ></iframe>
        </App.Dialog>
      </App.Container>
    </div>
  )
}

export default HomeCommunity