import App from '@/components/App'
import BotWallet from '@/components/Bot/BotWallet'
import BotBalance from '@/components/Bot/BotBalance'
import BotHeaderTimer from '@/components/Bot/BotHeaderTimer'

import styles from './styles.module.scss'

const BotHeader = () => {
  return (
    <App.Flex column align="center" gap={8} className={styles.container}>
      <App.Flex row align="center" justify="space-between" gap={8} className={styles.container}>
        <BotWallet />
        <BotBalance />
      </App.Flex>

      <BotHeaderTimer />
    </App.Flex>
  )
}

export default BotHeader