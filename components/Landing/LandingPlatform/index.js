import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const LandingPlatform = () => {
  const handleSocialClick = (social) => () => {
    let url = ''
    let page = null
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
      case 'facebook':
        community = 'Facebook'
        url = 'https://www.facebook.com/tegroexchange?utm_source=website'
        break
      case 'instagram':
        community = 'Instagram'
        url = 'https://www.instagram.com/tegro_exchange/?utm_source=website'
        break
      case 'substack':
        community = 'Substack'
        url = 'https://tegro.substack.com/?utm_source=website'
        break
      case 'youtube':
        community = 'Youtube'
        url = 'https://www.youtube.com/@tegrofi?utm_source=website'
        break
      case 'press':
        page = 'Press'
        url = 'https://press.tegro.com?utm_source=website'
        break
      default:
        url = 'https://tegro.com/'
        break
    }

    if (page) {
      trackEvent('Page Visited', {
        'Page Name': page,
      })
    }

    if (community) {
      trackEvent('Community Resources Visited', {
        'Community': community,
      })
    }

    window.open(url, '_blank')
  }

  return (
    <App.Flex className={styles.container}>
      <video autoPlay loop muted>
        <source src={'/images/landing/reveal.webm'} type="video/webm" />
      </video>

      <App.Container>
        <App.Flex column center gap={[36, 8]} sx={[{ padding: '70px 0' }, { padding: '50px 0' }]}>
          <App.Flex row center width="50%">
            <App.Text center size={[96, 24]} weight={300} height={1.2}>A Platform Built For Everyone</App.Text>
          </App.Flex>

          <App.Flex direction={['row', 'column']} gap={[48, 24]} fullWidth>
            <App.Flex className={styles.banner} flex={[1, null]}>
              <App.Flex className={styles.bannerInner} />

              <App.Flex column gap={[24, 8]} justify={['flex-start', 'space-between']} className={styles.bannerContent}>
                <App.Flex column gap={[8, 24]}>
                  <App.Text center size={[24, 18]} weight={700} height={1}>Our Community</App.Text>
                  <App.Text center size={[14, 12]} color="#B9B8C5" height={1.2}>Connect, Collaborate, Celebrate. Join the Tegro Tribe today!</App.Text>
                </App.Flex>

                <App.Flex row align="center" justify={['center', 'space-between']} gap={[32, 8]}>
                  <App.Flex center className={styles.socialBox} onClick={handleSocialClick('twitter')}>
                    <App.Icon icon="twitter" />
                  </App.Flex>

                  <App.Flex center className={styles.socialBox} onClick={handleSocialClick('discord')}>
                    <App.Icon icon="discord" />
                  </App.Flex>

                  <App.Flex center className={styles.socialBox} onClick={handleSocialClick('telegram')}>
                    <App.Icon icon="telegram" />
                  </App.Flex>

                  <App.Flex center className={styles.socialBox} onClick={handleSocialClick('linkedin')}>
                    <App.Icon icon="linkedin-frame" />
                  </App.Flex>

                  <App.Flex center className={styles.socialBox} onClick={handleSocialClick('substack')}>
                    <App.Icon icon="substack" />
                  </App.Flex>

                  <App.Flex center className={styles.socialBox} onClick={handleSocialClick('youtube')}>
                    <App.Icon icon="youtube" />
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>

            <App.Flex className={styles.banner} flex={[1, null]}>
              <App.Flex className={styles.bannerInner} />

              <App.Flex column gap={[24, 8]} justify={['flex-start', 'space-between']} className={styles.bannerContent}>
                <App.Flex column gap={8}>
                  <App.Text center size={[24, 18]} weight={700} height={1}>Press</App.Text>
                  <App.Text center size={[14, 12]} color="#B9B8C5" height={1.2}>Breaking news and latest updates. Dive into our story as it unfolds!</App.Text>
                </App.Flex>

                <App.Flex column gap={4}>
                  <App.Flex row center gap={[24, 4]} wrap>
                    <App.Flex center flex={[null, 1]}>
                      <a href="https://www.moneycontrol.com/news/business/web3-games-asset-marketplace-tegro-crosses-100k-signups-8951881.html" target="_blank" rel="noreferrer" className={styles.press}>
                        <Image src="/images/landing/press-1.png" width={107} height={25} alt="" />
                      </a>
                    </App.Flex>

                    <App.Flex center flex={[null, 1]}>
                      <a href="https://cointelegraph.com/press-releases/wazirx-co-founder-and-supergaming-announce-tegro-a-web3-games-marketplace" target="_blank" rel="noreferrer" className={styles.press}>
                        <Image src="/images/landing/press-2.png" width={116} height={27} alt="" />
                      </a>
                    </App.Flex>

                    <App.Flex center flex={[null, 1]}>
                      <a href="https://coinmarketcap.com/uk/currencies/tegro/" target="_blank" rel="noreferrer" className={styles.press}>
                        <Image src="/images/landing/press-3.png" width={113} height={32} alt="" />
                      </a>
                    </App.Flex>

                    <App.Flex center flex={[null, 1]}>
                      <a href="https://www.financialexpress.com/business/brandwagon-wazirx-co-founder-siddharth-menon-and-supergaming-launch-tegro-a-web3-games-ecosystem-marketplace-2435783/" target="_blank" rel="noreferrer" className={styles.press}>
                        <Image src="/images/landing/press-4.png" width={141} height={18} alt="" />
                      </a>
                    </App.Flex>
                  </App.Flex>

                  <App.Flex row center gap={16} sx={{ cursor: 'pointer' }} onClick={handleSocialClick('press')} className={styles.press}>
                    <App.Text style="italic" gradient="linear-gradient(90deg, rgba(255, 255, 255, 0.58) 0.16%, rgba(255, 255, 255, 0.29) 100%)">Press Kit</App.Text>
                    <Image src="/images/landing/button-with-arrow-2.png" width={70} height={23} alt="" />
                  </App.Flex>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default LandingPlatform