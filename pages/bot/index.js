import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'
import $auction from '@/store/auction'
import $gem from '@/store/gem'
import $alert from '@/store/alert'

import BotWrapper from '@/components/Bot/BotWrapper'
import BotAuctions from '@/components/Bot/BotAuctions'
import BotEarn from '@/components/Bot/BotEarn'
import BotShop from '@/components/Bot/BotShop'
import BotMyEarnings from '@/components/Bot/BotMyEarnings'

const Bot  = () => {
  const dispatch = useDispatch()
  const tab = useSelector(({ $bot }) => $bot.tab)

  const handleClaim = async (auction) => {
    if (auction.txHash == '') {
      // window.open(`http://localhost:3000/bot/claim?id=${auction.id}&hash=${hash}`)
      TelegramBot.showPopup('Claim reward', `You will be redirect to Tegro website to connect Base wallet and claim reward`, [{ id: 'ok', type: 'ok', text: 'Ok' }])
      TelegramBot.on('popupClosed', async (response) => {
        const result = await $bot.api.generateWalletHash()
        if (result && !result.error && result?.hash) {
          const hash = result.hash
          if (response.button_id === 'ok' && hash) {
            TelegramBot.openLink(`https://${TelegramBot.host()}/bot/claim?id=${auction.id}&hash=${hash}`)
          }
        }
      })
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
            dispatch($alert.set.error({title: 'Something went wrong', text: result.error}))
          }
        }
      }
    }
  }

  const getComponent = () => {
    switch (tab) {
      case 'auctions': return <BotAuctions onClaim={handleClaim} />
      case 'earn': return <BotEarn />
      case 'shop': return <BotShop />
      case 'my-earnings': return <BotMyEarnings onClaim={handleClaim} />
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