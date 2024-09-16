import styles from './styles.module.scss'

import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import useWagmiHelper from '@/myhooks/useWagmiHelper'

import TelegramBot from '@/libs/TelegramBot'

import $auction from '@/store/auction'
import $bot from '@/store/bot'

import App from '@/components/App'
import Timer from '@/components/Bot/BotTimer'

const MyEarnings = () => {
  const dispatch = useDispatch()
  const { connection } = useWagmiHelper()

  const earnings = useSelector($auction.get.myClaimableEarnings)
  const user = useSelector(({ $bot }) => $bot.user)
  
  const handleClaim = (id) => {
    TelegramBot.openLink(`https://beta.tegro.com/bot/claim?id=${id}`)
  }

  const handleConnect = async () => {
    const hashRes = await $bot.api.generateWalletHash()
    const hash = hashRes?.hash || ''

    TelegramBot.showPopup('Connect Wallet', 'You will be redirect to Tegro website to connect Base wallet', [{ id: 'ok', type: 'ok', text: 'Ok' }])
    TelegramBot.on('popupClosed', (response) => {
      if (response.button_id === 'ok' && hash) {
        TelegramBot.openLink(`https://beta.tegro.com/bot/wallet?hash=${hash}`)
      }
    })
  }
  
  const handleBack = () => {
    dispatch($bot.set.tab('auctions'))
  }

  return (
    <App.Flex sx={{padding: 16, paddingTop: 8}}>
      {connection.loading ? (
        <App.Loader size={32} />
      ) : (
        <App.Flex column fullWidth gap={16}>
          <App.Flex row fullWidth align="center" gap={8} onClick={handleBack}>
            <App.Flex sx={{transform: 'rotate(180deg)'}}>
              <App.Icon icon='arrow-right' />
            </App.Flex>

            <App.Text>Auctions</App.Text>
          </App.Flex>

          <App.Flex column align="center" gap={16} className={styles.earningsWrapper}>
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

                    {
                      user?.user
                        ? <App.Button fullWidth primary2 onClick={() => handleClaim(item.id)}>
                            <App.Text>Claim</App.Text>
                          </App.Button>
                        : <App.Button fullWidth primary2 onClick={handleConnect}>
                            <App.Text>Connect wallet to Claim</App.Text>
                          </App.Button>
                    }
                  </App.Flex>
                ))
                : <App.Text>No earnings</App.Text>
            }
          </App.Flex>
        </App.Flex>
      )}
    </App.Flex>
  )
}

export default MyEarnings