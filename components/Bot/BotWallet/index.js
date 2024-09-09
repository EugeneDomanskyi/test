import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

const BotWallet = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const user = useSelector(({ $bot }) => $bot.user)

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

  const handleHistory = () => {
    router.push('/bot/history')
  }

  const handleMyEarnings = () => {
    dispatch($bot.set.tab('my-earnings'))
  }

  const getShort = (address) => {
    const n = 4
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  const handleDisconnect = async () => {
    const result = await $bot.api.unassign()
    
    if (result) {
      dispatch($bot.set.user(result))
    }
  }

  return (
    <App.Flex column align="center" gap={8}>
      <App.Flex row align="center" gap={8}>
        {
          user?.user
            ? <App.Flex gap={8}>
                <App.Button variant="bot-default" small onClick={handleDisconnect}>
                  <App.Text size={12}>Disconnect</App.Text>
                </App.Button>

                <App.Button variant="bot-default" small onClick={handleMyEarnings}>
                  <App.Text>{ getShort(user.user.wallet_address) }</App.Text>
                </App.Button>
              </App.Flex>
            : <App.Button variant="bot" small onClick={handleConnect}><App.Icon icon="wallet-bot" /> Connect Wallet</App.Button>
        }
        
        <App.Button variant="bot-default" small onClick={handleHistory}><App.Icon icon="clock-bot" /> History</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default BotWallet