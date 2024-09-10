import styles from './styles.module.scss'

import { useSelector } from 'react-redux'
import moment from 'moment'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import TelegramBot from '@/libs/TelegramBot'

import $auction from '@/store/auction'

import App from '@/components/App'
import Timer from '@/components/Bot/BotTimer'

const MyEarnings = () => {
  const { connection } = useWagmiHelper()

  const earnings = useSelector($auction.get.myClaimableEarnings)
  
  const handleClaim = (id) => {
    TelegramBot.openLink(`https://beta.tegro.com/bot/claim?id=${id}`)
  }

  return (
    <App.Flex sx={{padding: 16}}>
      {connection.loading ? (
        <App.Loader size={32} />
      ) : (
        <App.Flex column align="center" gap={16} className={styles.container}>
          <App.Flex fullWidth className={styles.header}>
            <App.Text className={styles.headerText}>Auction</App.Text>
            <App.Text className={styles.headerText}>Winning price</App.Text>
            <App.Text className={styles.headerText}>Expiry</App.Text>
          </App.Flex>

          {
            earnings?.length > 0
              ? earnings.map((item, index) => (
                <App.Flex key={index} className={styles.claimItem}>
                  <App.Flex row className={styles.claimItemHeader}>
                    <App.Flex column>
                      <App.Text className={styles.claimItemText}>{item.name}</App.Text>
                      <App.Text className={styles.claimItemSecondarytext}>{moment(item.startsIn).format('DD-MM-YYYY')}</App.Text>
                    </App.Flex>
                    <App.Text className={styles.claimItemText}>{item.currentPrice + ' ' + item.token.currency}</App.Text>
                    <App.Text className={styles.claimItemText}>
                      <Timer claimTime={item.claimTime} />
                    </App.Text>
                  </App.Flex>

                  <App.Button fullWidth primary2 onClick={() => handleClaim(item.id)}>
                    <App.Text>Claim</App.Text>
                  </App.Button>
                </App.Flex>
              ))
              : <App.Text>No earnings</App.Text>
          }
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default MyEarnings