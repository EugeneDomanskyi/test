import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import TelegramBot from '@/libs/TelegramBot'
import Amplitude from '@/libs/amplitude.lib'

import $bot from '@/store/bot'
import $auction from '@/store/auction'
import $gem from '@/store/gem'
import $alert from '@/store/alert'

import BotWrapper from '@/components/Bot/BotWrapper'
import BotAuctions from '@/components/Bot/BotAuctions'
import BotEarn from '@/components/Bot/BotEarn'
import BotShop from '@/components/Bot/BotShop'
import BotHistory from '@/components/Bot/BotHistory'
import BotMyEarnings from '@/components/Bot/BotMyEarnings'
import BotAuctionHistory from '@/components/Bot/BotAuctionHistory'

const Bot  = () => {
  const dispatch = useDispatch()
  const tab = useSelector(({ $bot }) => $bot.tab)

  const handleClaim = async (auction) => {
    if (!auction.txHash || auction.txHash == '') {
      const result = await $bot.api.generateWalletHash()
      if (result && !result.error && result?.hash) {
        const hash = result.hash
        TelegramBot.openLink(`https://${TelegramBot.host()}/bot/claim?id=${auction.id}&hash=${hash}`)
      }
    } else {
      const result = await $bot.api.generateWalletHash()
      if (result && !result.error && result?.hash) {
        const hash = result.hash
        if (auction.claimHash == '' && auction.claimTime.diff(moment()) > 0) {
          const result = await $gem.api.claimTelegram({
            auction_id: auction.id,
            external_user_hash: hash,
          })

          if (result && !result.error) {
            dispatch($alert.set.success({title: 'Claimed successfully', text: 'Your reward has been claimed successfully'}))

            const result = await $auction.api.earnings()
            if (result && !result?.error) {
              dispatch($auction.set.earnings(result))
            }
          } else {
            if (result?.error) {
              dispatch($alert.set.error({title: 'Something went wrong', text: result.error}))
            }
          }
        }
      }
    }
  }

  const getComponent = () => {
    if (typeof window != 'undefined') {
      const page = tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      Amplitude.event(`Page Visited`, {
        'Page': page,
        'Source': 'Telegram',
      })
    }

    switch (tab) {
      case 'auctions': return <BotAuctions onClaim={handleClaim} />
      case 'earn': return <BotEarn />
      case 'shop': return <BotShop />
      case 'history': return <BotHistory />
      case 'my-earnings': return <BotMyEarnings onClaim={handleClaim} />
      case 'auction-history': return <BotAuctionHistory />
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