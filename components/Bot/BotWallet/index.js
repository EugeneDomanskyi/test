import App from '@/components/App'
import TelegramBot from '@/libs/TelegramBot'

const BotWallet = () => {
  const handleConnect = () => {
    TelegramBot.showPopup('Connect Wallet', 'You will be redirect to Tegro websigte to connect Base wallet', [{ id: 'ok', type: 'ok', text: 'Ok' }])
    TelegramBot.on('popupClosed', (buttonId) => {
      if (buttonId === 'ok') {
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