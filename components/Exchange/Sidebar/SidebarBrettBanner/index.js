import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import cn from 'classnames'

import $gem from '@/store/gem'

import App from '@/components/App'

import styles from './styles.module.scss'

const SidebarBrettBanner = () => {
  const router = useRouter()
  const utmSource = router.query.utm_source

  const dispatch = useDispatch()
  const showBrett = useSelector(({ $gem }) => $gem.showBrett)

  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    const hideBanner = localStorage.getItem('hideBrettBrawl')
    if (utmSource == 'brettbrawl') {
      if (!hideBanner) {
        localStorage.setItem('hideBrettBrawl', 1)
      }
    } else {
      if (!hideBanner) {
        dispatch($gem.set.showBrett(true))
      }
    }
  }, [utmSource])

  const handleBrett = () => {
    router.push('/tournaments')
  }

  return showBrett ? (
    <App.Flex fullWidth column className={cn(styles.container, {[styles.show]: showBanner})}>
      <App.Flex className={styles.closeButton} onClick={() => setShowBanner(!showBanner)}>
        <App.Icon icon='cross' color="#fff" />
      </App.Flex>

      <App.Flex fullWidth column gap={20} className={styles.content}>
        <App.Flex center column gap={8}>
          <App.Text uppercase center size={24} weight={900} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">BRETT Brawl</App.Text>
          <App.Text center size={16} weight={600} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">2000 BRETT in rewards!</App.Text>
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
                <App.Text size={20} weight={600} height={1}>Trade BRETT</App.Text>
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
                <App.Text uppercase size={20} weight={600} height={1}>GET BRETT TOKENS!</App.Text>
              </App.Flex>
            </App.Flex>
          </App.Flex>

          <App.Button primary2 fullWidth onClick={handleBrett}>LFG 🚀</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  ) : null
}

export default SidebarBrettBanner