import App from '@/components/App'
import TelegramBot from '@/libs/TelegramBot'

const BotWallet = () => {
  const handleConnect = () => {
    TelegramBot.showPopup('Connect Wallet', 'You will be redirect to Tegro website to connect Base wallet', [{ id: 'ok', type: 'ok', text: 'Ok' }])
    TelegramBot.on('popupClosed', (response) => {
      if (response.button_id === 'ok') {
        TelegramBot.openLink('https://beta.tegro.com/bot/wallet')
      }  
    })
  }

  return (
    <App.Flex>
      <App.Button primary2 slamm onClick={handleConnect}>Connect Wallet</App.Button>
    </App.Flex>
  )
}

export default BotWallet