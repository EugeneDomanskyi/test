import { useSelector } from 'react-redux'

import BotWrapper from '@/components/Bot/BotWrapper'
import BotAuctions from '@/components/Bot/BotAuctions'
import BotEarn from '@/components/Bot/BotEarn'
import BotShop from '@/components/Bot/BotShop'

const Bot  = () => {
  const tab = useSelector(({ $bot }) => $bot.tab)

  const getComponent = () => {
    switch (tab) {
      case 'auctions': return <BotAuctions />
      case 'earn': return <BotEarn />
      case 'shop': return <BotShop />
      default: return <BotAuctions />
    }
  }

  return (
    <BotWrapper>
      {getComponent()}
    </BotWrapper>
  )
}

export default Bot