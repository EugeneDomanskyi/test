import { useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const OnboardingBanner = () => {
  const [showBanner, setShowBanner] = useState(true)

  return (
    <App.Flex className={styles.container}>
      <App.Flex className={styles.buttonBox}>
      </App.Flex>

      <App.Flex className={cn(styles.bannerBox, {[styles.show]: showBanner})}>
        <App.Flex column gap={16} className={styles.banner}>
          <App.Flex row justify="space-between" sx={{ cursor: 'pointer' }}>
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

          <App.Button primary2>Connect Wallet</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default OnboardingBanner