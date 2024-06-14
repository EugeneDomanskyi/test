import { useEffect, useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'
import useWagmiHelper from '@/myhooks/useWagmiHelper'
import { useSelector } from 'react-redux'

const OnboardingBanner = () => {
  const { connection, connect } = useWagmiHelper()

  const stats = useSelector(({ $point }) => $point.stats)

  const [showBanner, setShowBanner] = useState(false)
  const [stepBanner, setStepBanner] = useState(0)

  useEffect(() => {
    if (!connection.loading) {
      getBannerVisibility()
    }
  }, [connection.loading, connection.connected, stats])

  const getBannerVisibility = () => {
    const onboardingStep = localStorage.getItem('onboardingStep')
    const onboardingExpand = localStorage.getItem('onboardingExpand') ?? true
    setShowBanner(onboardingExpand == 'false' ? false : true)

    if (!connection.connected) {
      if (!onboardingStep) {
        setStepBanner(1)
      }
    } else {
      console.log(stats)
    }
  }

  const handleConnect = () => {
    connect()
  }

  const handleToggle = () => {
    const value = !showBanner
    setShowBanner(value)
    localStorage.setItem('onboardingExpand', value)
  }

  return stepBanner <= 2 ? (
    <App.Flex column className={styles.container}>
      <App.Flex className={cn(styles.buttonBox, {[styles.show]: !showBanner})}>
      {stepBanner == 1 ? (
        <App.Flex row center gap={8} className={styles.expandButton} onClick={handleToggle}>
          <App.Text uppercase size={14} weight={700} height={1}>GET 600 GEMS</App.Text>
          <App.Icon icon="chevron-down" width={24} height={24} style={{ transform: 'rotate(180deg)' }}/>
        </App.Flex>
      ) : null}
      </App.Flex>

      <App.Flex className={cn(styles.bannerBox, {[styles.show]: showBanner}, styles[`bannerBox${stepBanner}`])}>
        {stepBanner == 1 ? (
          <App.Flex column gap={16} className={styles.banner}>
            <App.Flex row justify="space-between" sx={{ cursor: 'pointer' }} onClick={handleToggle}>
              <App.Flex column gap={4}>
                <App.Text size={16} weight={700} height={1}>Hey, want to get 600 gems?</App.Text>
                <App.Text size={14} weight={400} height={1} color="#FFFFFF99">Start your earnings journey now!</App.Text>
              </App.Flex>

              <App.Icon icon="chevron-down" width={24} height={24} />
            </App.Flex>

            <App.Flex column gap={8} className={styles.content}>
              <App.Text size={12} weight={400} height={1} color="#FFFFFF99">Step 1/2</App.Text>
              <App.Text size={16} weight={600} height={1}>Get <App.Text inline size={16} weight={600} height={1} color="#A6DC37">100</App.Text> gems</App.Text>
              <App.Text size={14} weight={400} height={1}>Connect your wallet to get 100 gems</App.Text>
            </App.Flex>

            <App.Button primary2 onClick={handleConnect}>Connect Wallet</App.Button>
          </App.Flex>
        ) : null}
      </App.Flex>
    </App.Flex>
  ) : null
}

export default OnboardingBanner