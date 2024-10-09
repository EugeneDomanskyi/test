import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

import TelegramBot from '@/libs/TelegramBot'

import $bot from '@/store/bot'
import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotEarn = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)

  const [twitter, setTwitter] = useState(false)
  const [telegram, setTelegram] = useState(false)

  const handleTelegram = () => {
    TelegramBot.openTelegramLink('https://t.me/TegroChat')
    setTelegram(true)
  }

  const handleX = () => {
    TelegramBot.openLink('https://twitter.com/TegroFi')
    setTwitter(true)
  }

  const handleClaim = (type) => async () => {
    const result = await $bot.api.claim({type})
    if (result && !result.error) {
      dispatch($bot.set.user(result))
    } else {
      if (type == 'join_telegram_group') {
        setTelegram(false)
        dispatch($alert.set.error({text: 'You should join our Telegram channel first'}))
      }

      if (type == 'twitter_follow') {
        setTwitter(false)
      }
    }
  }

  const handleShop = () => {
    dispatch($bot.set.tab('shop'))
  }

  const handleShare = () => {
    const referralLink = `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}?startapp=${user.referral_code}`
    const referralText = `Join Tegro and get 5000 gems for free!`
    const link = `https://t.me/share/url?url=${referralLink}&text=${referralText}`
    TelegramBot.openTelegramLink(link)
  }

  const handleCopy = () => {
    const referralLink = `${process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL}?startapp=${user.referral_code}`
    navigator.clipboard.writeText(referralLink)
    dispatch($alert.set.success({ title: 'Link copied to clipboard' }))
  }

  return (
    <App.Flex center sx={{ padding: 8 }}>
      <App.Flex className={styles.container} column>
        <App.Flex justify="flex-start" gap={4}>
          <App.Text size={16} weight={600}><App.Text color="#A6DC37" size={16} weight={600} inline>Earn Gems</App.Text> On Finishing These Tasks:</App.Text>
        </App.Flex>

        <App.Flex fullWidth className={styles.taskContainer} column gap={16}>
          <App.Flex fullWidth justify="space-between" gap={8}>
            <App.Text size={16} weight={600}>1. Join Our Telegram Channel</App.Text>

            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={16} weight={600} inline>2000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Text className={styles.taskDescription}>Get latest updates on auctions, talk to fellow bidders, and win exciting rewards.</App.Text>

          {user.is_claimed_telegram ? (
            <App.Flex center gap={8} className={styles.claimed}>
              <App.Icon icon="check-circle" />
              <App.Text color="#A6DC37">Claimed</App.Text>
            </App.Flex>
          ) : (
            telegram ? (
              <App.Button variant="bot" onClick={handleClaim('join_telegram_group')}>
                Verify & Claim
                <App.Flex row center gap={4}>
                  <App.Text size={16} weight={600} inline>2000</App.Text>
                  <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                </App.Flex>
              </App.Button>
            ) : (
              <App.Button variant="telegram" onClick={handleTelegram}><App.Icon icon="telegram2" width={20} /> Join Now</App.Button>
            )
          )}
        </App.Flex>
        
        <App.Flex fullWidth className={styles.taskContainer} column gap={16}>
          <App.Flex fullWidth justify="space-between" gap={8}>
            <App.Text size={16} weight={600}>2. Follow Us on Twitter</App.Text>
            
            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={16} weight={600} inline>2000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Text className={styles.taskDescription}>Get latest updates on auctions, get trading alpha, and win exciting rewards.</App.Text>

          {user.is_claimed_twitter ? (
            <App.Flex center gap={8} className={styles.claimed}>
              <App.Icon icon="check-circle" />
              <App.Text color="#A6DC37">Claimed</App.Text>
            </App.Flex>
          ) : (
            twitter ? (
              <App.Button variant="bot" onClick={handleClaim('twitter_follow')}>
                Verify & Claim
                <App.Flex row center gap={4}>
                  <App.Text size={16} weight={600} inline>2000</App.Text>
                  <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                </App.Flex>
              </App.Button>
            ) : (
              <App.Button variant="twitter" onClick={handleX}><App.Icon icon="x" width={20} /> Follow us on Twitter</App.Button>
            )
          )}
        </App.Flex>

        <App.Flex fullWidth className={styles.taskContainer} column gap={16}>
          <App.Flex fullWidth justify="space-between" gap={8}>
            <App.Text size={16} weight={600}>3. Buy Stars from Shop</App.Text>
            
            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={16} weight={600} inline>5000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>

          {user.is_claimed_first_payment ? (
            <App.Flex center gap={8} className={styles.claimed}>
              <App.Icon icon="check-circle" />
              <App.Text color="#A6DC37">Claimed</App.Text>
            </App.Flex>
          ) : (
            <App.Button variant="bot" onClick={handleShop}>
              Buy Stars
            </App.Button>
          )}
        </App.Flex>

        <App.Flex fullWidth className={styles.taskContainer} column gap={16}>
          <App.Flex fullWidth justify="space-between" gap={8}>
            <App.Text size={16} weight={600}>4. Invite your friends</App.Text>
            
            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={16} weight={600} inline>5000-10000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Text size={14} weight={400} color="#FFFFFF99">Both you and your friends get gems.</App.Text>
          
          <App.Flex row gap={8}>
            <App.Flex flex={1}>
              <App.Text className={styles.taskDescription}>Normal User: 5000 gems</App.Text>
            </App.Flex>

            <App.Flex flex={1}>
              <App.Text className={styles.taskDescription}>Premium User: 10000 gems</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex row gap={16}>
            <App.Flex flex={8}>
              <App.Button variant="bot" fullWidth onClick={handleShare}>Share on Telegram</App.Button>
            </App.Flex>

            <App.Flex flex={2}>
              <App.Button variant="bot" fullWidth onClick={handleCopy}><App.Icon icon="copy3" /></App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default BotEarn