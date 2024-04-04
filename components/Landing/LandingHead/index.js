import { useRouter } from 'next/router'
import cn from 'classnames'

import App from '@/components/App'
import Landing from '@/components/Landing'

import styles from './styles.module.scss'

const LandingHead = () => {
  const router = useRouter()

  const handleClickTrading = () => {
    router.push(`/exchange`)
  }

  return (
    <App.Container className={styles.container}>
      <App.Flex column align="center" gap={24} fullWidth>
        <App.Flex width={['40%', '100%']} sx={{ paddingBottom: 32 }}>
          <h1 className={styles.title}>The Ease of CEX, Now in a DEX</h1>
        </App.Flex>

        <App.Flex width={['40%', '60%']} center gap={16} className={styles.hideOnMobile}>
          <App.Button primary sx={{ paddingLeft: 32, paddingRight: 32, height: 50 }} onClick={handleClickTrading}>
            <App.Text center size={16} weight={600}>Start Trading</App.Text>
            <App.Icon icon="chevron-circle" />
          </App.Button>
        </App.Flex>

        <App.Flex row center gap={16} className={cn(styles.buttons, styles.showOnMobile)}>
          <App.Flex flex={1}>
            <App.Button primary xl fullWidth onClick={handleClickTrading}>
              Start Trading
            </App.Button>
          </App.Flex>
        </App.Flex>

        <Landing.Slides />
      </App.Flex>
    </App.Container>
  )
}

export default LandingHead