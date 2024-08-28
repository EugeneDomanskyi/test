import { useRouter } from 'next/navigation'

import TelegramBot from '@/libs/TelegramBot'

import App from '@/components/App'

const BotWallet = () => {
  const router = useRouter()

  const handleConnect = () => {
    TelegramBot.showPopup('Connect Wallet', 'You will be redirect to Tegro website to connect Base wallet', [{ id: 'ok', type: 'ok', text: 'Ok' }])
    TelegramBot.on('popupClosed', (response) => {
      if (response.button_id === 'ok') {
        TelegramBot.openLink('https://beta.tegro.com/bot/wallet')
      }  
    })
  }

  const handleHistory = () => {
    router.push('/bot/history')
  }

  return (
    <App.Flex row align="center" gap={8}>
      <App.Button variant="bot" small onClick={handleConnect}><App.Icon icon="wallet-bot" /> Connect Wallet</App.Button>
      <App.Button variant="bot-default" small onClick={handleHistory}><App.Icon icon="clock-bot" /> History</App.Button>
    </App.Flex>
  )
}

export default BotWallet