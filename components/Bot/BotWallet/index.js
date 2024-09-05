import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'

import App from '@/components/App'

const BotWallet = () => {
  const router = useRouter()

  const user = useSelector(({ $bot }) => $bot.user)

  console.log('user', user);
  

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

  const getShort = (address) => {
    const n = 4
    return `${address.substring(0, n)}...${address.substring(address.length - n)}`
  }

  return (
    <App.Flex row align="center" gap={8}>
      {
        user?.user
          ? <App.Text>{ getShort(user.user.wallet_address) }</App.Text>
          : <App.Button variant="bot" small onClick={handleConnect}><App.Icon icon="wallet-bot" /> Connect Wallet</App.Button>
      }
      
      <App.Button variant="bot-default" small onClick={handleHistory}><App.Icon icon="clock-bot" /> History</App.Button>
    </App.Flex>
  )
}

export default BotWallet