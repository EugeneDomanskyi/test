import App from '@/components/App'
import BotWallet from '@/components/Bot/BotWallet'
import BotBalance from '@/components/Bot/BotBalance'

import styles from './styles.module.scss'

const BotHeader = () => {
  return (
    <App.Flex row align="center" justify="space-between" gap={8} className={styles.container}>
      <BotWallet />
      <BotBalance />
    </App.Flex>
  )
}

export default BotHeader