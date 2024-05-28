import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

import $point from '@/store/point'

import App from '@/components/App'

import styles from './styles.module.scss'

const SidebarBrettBanner = () => {
  const router = useRouter()
  const utmSource = router.query.utm_source

  const dispatch = useDispatch()
  const showBrett = useSelector(({ $point }) => $point.showBrett)

  useEffect(() => {
    const hideBanner = localStorage.getItem('hideBrettBrawl')
    if (utmSource == 'brettbrawl') {
      if (!hideBanner) {
        localStorage.setItem('hideBrettBrawl', 1)
      }
    } else {
      if (!hideBanner) {
        dispatch($point.set.showBrett(true))
      }
    }
  }, [utmSource])

  const handleBrett = () => {
    router.push('/tournaments')
  }

  return showBrett ? (
    <App.Flex fullWidth column className={styles.container}>
      <App.Flex fullWidth column gap={20} className={styles.content}>
        <App.Flex center column gap={8}>
          <App.Text uppercase center size={24} weight={900} height={1} gradient="linear-gradient(180deg, #FFF 0%, #C7C7C7 100%)">BRETT Brawl</App.Text>
          <App.Text center size={16} weight={600} height={1} gradient="radial-gradient(193.17% 113.6% at 96.29% 4.49%, #FFF6A3 0%, #FFF066 34.61%, #FFCB45 68.83%, #FFBD13 100%)">2000 BRETT in rewards!</App.Text>
        </App.Flex>

        <App.Flex fullWidth column gap={[12, 8]}>
          <App.Flex gap={12} align="center" row>
            <App.Flex center width={30}>
              <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">1</App.Text>
            </App.Flex>

            <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
              <App.Text uppercase size={16} weight={900} height={1}>Connect</App.Text>
              <App.Text size={12} weight={500} height={1}>Wallet</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex gap={12} align="center" row>
            <App.Flex center width={30}>
              <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">2</App.Text>
            </App.Flex>

            <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
              <App.Text uppercase size={16} weight={900} height={1}>Trade</App.Text>
              <App.Text size={12} weight={500} height={1}>BRETT</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex gap={12} align="center" row>
            <App.Flex center width={30}>
              <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">3</App.Text>
            </App.Flex>

            <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
              <App.Text uppercase size={16} weight={900} height={1}>Climb</App.Text>
              <App.Text size={12} weight={500} height={1}>Leaderboard</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex gap={12} align="center" row>
            <App.Flex center width={30}>
              <App.Text size={[36, 24]} weight={900} height={1} color="#A6DC37">4</App.Text>
            </App.Flex>

            <App.Flex direction={['column', 'row']} align={['flex-start', 'center']} gap={[4, 8]}>
              <App.Text uppercase size={20} weight={900} height={1}>Profit</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Button primary2 onClick={handleBrett}>LFG 🚀</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  ) : null
}

export default SidebarBrettBanner