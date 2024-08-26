import App from '@/components/App'
import TelegramBot from '@/libs/TelegramBot'

const BotWallet = () => {
  const handleConnect = () => {
    TelegramBot.showPopup('Connect Wallet', 'You will be redirect to Tegro websigte to connect Base wallet', [{ id: '1', type: 'ok', text: 'Ok' }])
  }

  return (
    <App.Flex>
      <App.Button primary2 slamm onClick={handleConnect}>Connect Wallet</App.Button>
    </App.Flex>
  )
}

export default BotWallet