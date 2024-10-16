import App from '@/components/App'

import styles from './styles.module.scss'

const BotOnboarding = () => {
  return (
    <App.Flex column className={styles.container}>
      <App.Flex flex={1} className={styles.content}>
      </App.Flex>

      <App.Flex column className={styles.bottom}>
        <App.Button variant="bot">Continue</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default BotOnboarding