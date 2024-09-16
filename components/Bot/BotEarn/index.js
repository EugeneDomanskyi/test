import styles from './styles.module.scss'

import App from '@/components/App'

const BotEarn = () => {
  return (
    <App.Flex center>
      <App.Flex className={styles.container} center column>
        <App.Flex gap={4}>
          <App.Text size={16} weight={600}>Complete These Tasks <App.Text color="#A6DC37" size={16} weight={600} inline>To Earn Tokens:</App.Text></App.Text>
        </App.Flex>

        <App.Flex fullWidth className={styles.taskContainer} column gap={16}>
          <App.Flex fullWidth justify="space-between" gap={8}>
            <App.Text size={16} weight={600}>1. Tweet about Tegro Auctions</App.Text>
            <App.Text color="#A6DC37" size={16} weight={600} inline>50 Gems</App.Text>
          </App.Flex>

          <App.Text className={styles.taskDescription}>Let your friends know about this steal, and win gems in return.</App.Text>
          <App.Button primary2>Tweet Now</App.Button>
        </App.Flex>
        
        <App.Flex fullWidth className={styles.taskContainer} column gap={16}>
          <App.Flex fullWidth justify="space-between" gap={8}>
            <App.Text size={16} weight={600}>2. Invite your Telegram Friends</App.Text>
            <App.Text color="#A6DC37" size={16} weight={600} inline>50 Gems</App.Text>
          </App.Flex>

          <App.Text className={styles.taskDescription}>Let your friends know about this steal, and win gems in return.</App.Text>
          <App.Button primary2>Share Now</App.Button>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default BotEarn