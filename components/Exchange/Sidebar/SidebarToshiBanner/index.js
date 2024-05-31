import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cn from 'classnames'

import Amplitude from '@/libs/amplitude.lib'

import App from '@/components/App'

import styles from './styles.module.scss'

const SidebartoshiPopup = () => {
  const router = useRouter()

  const isApp = useSelector(({ $app }) => $app.isApp)

  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeunload', handleUserSession);
    return () => {
      window.removeEventListener('beforeunload', handleUserSession)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      const bannerShown = localStorage.getItem('toshiPopup');
      
      if (! bannerShown) {
        setShowBanner(true)
      }
    }, 1000)
  }, [])

  const handleUserSession = () => {
    const currentTime = new Date().getTime();
    const popupTS = localStorage.getItem('toshiPopup');

    if (popupTS && (currentTime - popupTS) > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('toshiPopup');
    }
  }

  const handleClickButton = () => {
    Amplitude.event(`Exchange Pop-up`, {
      'Page': Amplitude.page(),
      'Source': isApp ? 'App' : 'Web',
      'Activity': 'Redirected'
    })
    const timestamp = new Date().getTime();
    localStorage.setItem('toshiPopup', timestamp);
    router.push('/tournaments')
  }

  const handleClose = () => {
    Amplitude.event(`Exchange Pop-up`, {
      'Page': Amplitude.page(),
      'Source': isApp ? 'App' : 'Web',
      'Activity': 'Closed'
    })
    const timestamp = new Date().getTime();
    localStorage.setItem('toshiPopup', timestamp);
    setShowBanner(!showBanner)
  }

  return (
    <App.Flex fullWidth column className={cn(styles.container, {[styles.show]: showBanner})}>
      <App.Flex fullWidth column align="center" gap={20}>
        <App.Flex center column gap={8} sx={{position: 'relative', maxWidth: 361}}>
          <App.Flex className={styles.closeButton} onClick={handleClose}>
            <App.Icon icon='cross' color="#fff" />
          </App.Flex>
          
          <Image src="/images/toshi-popup-bg.png" width={361} height={162} alt="" />
          
          <App.Flex center column gap={8} sx={{position: 'absolute'}}>
            <App.Text center size={24} weight={900} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">2,000,000 $TOSHI<br /> in rewards!</App.Text>
            <App.Flex gap={4}>
              <App.Icon icon="toshi-logo" />
              <App.Text center size={16} weight={600} height={1} sx={{marginTop: -1}} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">MANIA</App.Text>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        <App.Flex fullWidth column gap={24} align="center">
          <App.Flex column gap={[12, 8]}>
            <App.Flex gap={12} align="center" row>
              <App.Flex center width={30}>
                <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">1</App.Text>
              </App.Flex>

              <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
                {/* <App.Text uppercase size={16} weight={900} height={1}>Connect</App.Text> */}
                <App.Text size={20} weight={600} height={1}>Connect Your Wallet</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex gap={12} align="center" row>
              <App.Flex center width={30}>
                <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">2</App.Text>
              </App.Flex>

              <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
                {/* <App.Text uppercase size={16} weight={900} height={1}>Trade</App.Text> */}
                <App.Text size={20} weight={600} height={1}>Trade $TOSHI</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex gap={12} align="center" row>
              <App.Flex center width={30}>
                <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">3</App.Text>
              </App.Flex>

              <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
                {/* <App.Text uppercase size={16} weight={900} height={1}>Climb</App.Text> */}
                <App.Text size={20} weight={600} height={1}>Climb Leaderboard</App.Text>
              </App.Flex>
            </App.Flex>

            <App.Flex gap={12} align="center" row>
              <App.Flex center width={30}>
                <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">4</App.Text>
              </App.Flex>

              <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
                <App.Text uppercase size={20} weight={600} height={1}>GET TOSHI TOKENS!</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Button primary2 fullWidth onClick={handleClickButton}>LFG 🚀</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default SidebartoshiPopup