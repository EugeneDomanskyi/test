import App from '@/components/App'
import TelegramBot from '@/libs/TelegramBot'

const BotWallet = () => {
  const handleConnect = () => {
    TelegramBot.showPopup('Connect Wallet', 'You will be redirect to Tegro website to connect Base wallet', [{ id: 'ok', type: 'ok', text: 'Ok' }])
    TelegramBot.on('popupClosed', (buttonId) => {
      console.log('First', buttonId)
      if (buttonId === 'ok') {
        TelegramBot.openLink('https://beta.tegro.com/bot/wallet')
      }  
    })

    TelegramBot.on('popup_closed', (buttonId) => {
      console.log('Second', buttonId)
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