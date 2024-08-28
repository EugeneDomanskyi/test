import App from '@/components/App'
import BotWrapper from '@/components/Bot/BotWrapper'
import TelegramBot from '@/libs/TelegramBot'
import { useEffect } from 'react'

const Earn = () => {
  useEffect(() => {
    TelegramBot.backButton(true, () => {
      alert('Back')
    })
  }, [])

  return (
    <BotWrapper>
      <App.Text>Earn</App.Text>
    </BotWrapper>
  )
}

export default Earn