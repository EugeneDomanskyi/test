import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

import TelegramBot from '@/libs/TelegramBot'
import Amplitude from '@/libs/amplitude.lib'

import $bot from '@/store/bot'
import $alert from '@/store/alert'

import App from '@/components/App'
import BotProgress from '@/components/Bot/BotProgress'

import styles from './styles.module.scss'

const BotEarn = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)
  const tasks = useSelector(({ $bot }) => $bot.tasks)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const result = await $bot.api.tasks()
    if (result && !result.error) {
      dispatch($bot.set.tasks(result))
    }
  }

  const handleTelegram = () => {
    Amplitude.event(`Join Channel click`, {
      'Page': 'Earn',
      'Source': 'Telegram',
    })

    TelegramBot.openTelegramLink('https://t.me/TegroChat')
    setTelegram(true)
  }

  const handleX = () => {
    Amplitude.event(`Follow Twitter click`, {
      'Page': 'Earn',
      'Source': 'Telegram',
    })

    TelegramBot.openLink('https://twitter.com/TegroFi')
    setTwitter(true)
  }

  const handleDiscord = () => {
    Amplitude.event(`Join Discord click`, {
      'Page': 'Earn',
      'Source': 'Telegram',
    })

    TelegramBot.openLink('https://discord.com/invite/tegro')
  }

  const handleClaim = (task) => async () => {
    if (loading) {
      return
    }

    setLoading(true)
    const result = await $bot.api.taskClaim({type: task.key})
    if (result && !result.error) {
      Amplitude.event(task.title, {
        'Page': 'Earn',
        'Source': 'Telegram',
        'Result': 'Success',
      })

      dispatch($bot.set.tasks(result))
    } else {
      if (task.key == 'join_telegram_group') {
        Amplitude.event(`Join Channel result`, {
          'Page': 'Earn',
          'Source': 'Telegram',
          'Result': 'Failed',
        })

        const error = result.error == 'user_not_joined' ? 'You should join our Telegram channel first' : result.error
        dispatch($alert.set.error({text: error}))
      }

      if (task.key == 'twitter_follow') {
        Amplitude.event(`Follow twitter result`, {
          'Page': 'Earn',
          'Source': 'Telegram',
          'Result': 'Failed',
        })
      }
    }

    setLoading(false)
  }

  const handleShop = () => {
    Amplitude.event(`Buy Gems click`, {
      'Page': 'Earn',
      'Source': 'Telegram',
    })

    dispatch($bot.set.tab('shop'))
  }

  const handleAuctions = () => {
    dispatch($bot.set.tab('auctions'))
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

        {tasks.map((task) => (
          <App.Flex key={task.key} column fullWidth className={styles.taskContainer}>
            <App.Flex column fullWidth gap={8} className={styles.title}>
              <App.Flex fullWidth align="center" justify="space-between" gap={8}>
                <App.Text size={14} weight={700} height={1}>{task.title}</App.Text>

                <App.Flex row center gap={4}>
                  <App.Text color="#67C9F9" size={14} weight={700} height={1}>{task.reward.toLocaleString('en-US')}</App.Text>
                  <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                </App.Flex>
              </App.Flex>

              {task.progressive ? (
                <BotProgress currentValue={task.progress} maxValue={task.steps} steps={task.steps > 5 ? 5 : 0} />
              ) : null}
            </App.Flex>

            <App.Flex column fullWidth gap={16} className={styles.body}>
              {task.description !== '' ? (
                <App.Text size={14} weight={400}>{task.description}</App.Text>
              ) : null}

              {task.is_claimed ? (
                <App.Button variant="bot"><App.Icon icon="check-circle-fill2" /> Claimed</App.Button>
              ) : (
                task.is_can_claim ? (
                  <App.Button variant="bot" onClick={handleClaim(task)}>
                    Claim
                    <App.Flex row center gap={4}>
                      <App.Text size={14} weight={700} height={1}>{task.reward.toLocaleString('en-US')}</App.Text>
                      <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                    </App.Flex>
                  </App.Button>
                ) : (
                  task.key == 'join_telegram_group' ? (
                    <App.Button variant="telegram" onClick={handleTelegram}><App.Icon icon="telegram2" width={20} /> Join Now</App.Button>
                  ) : task.key == 'twitter_follow' ? (
                    <App.Button variant="twitter" onClick={handleX}><App.Icon icon="x" width={20} /> Follow us on X</App.Button>
                  ) : task.key == 'join_discord' ? (
                    <App.Button variant="twitter" onClick={handleDiscord}><App.Icon icon="discord2" width={20} /> Join us on Discord</App.Button>
                  ) : task.key == 'first_time_buy_gems' ? (
                    <App.Button variant="bot" onClick={handleShop}>Buy Now</App.Button>
                  ) : task.key.startsWith('invite') ? (
                    <App.Flex row gap={16}>
                      <App.Flex flex={8}>
                        <App.Button variant="bot" fullWidth onClick={handleShare}>Share on Telegram</App.Button>
                      </App.Flex>

                      <App.Flex flex={2}>
                        <App.Button variant="bot" fullWidth onClick={handleCopy}><App.Icon icon="copy3" /></App.Button>
                      </App.Flex>
                    </App.Flex>
                  ) : (
                    <App.Button variant="bot" onClick={handleAuctions}>Bid Now</App.Button>
                  )
                )
              )}
            </App.Flex>
          </App.Flex>
        ))}

        {/* <App.Flex column fullWidth className={styles.taskContainer}>
          <App.Flex fullWidth align="center" justify="space-between" gap={8} className={styles.title}>
            <App.Text size={14} weight={700} height={1}>Join Our Telegram Channel</App.Text>

            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={14} weight={700} height={1}>2,000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>

          <App.Flex column fullWidth gap={16} className={styles.body}>
            <App.Text size={14} weight={400}>Get latest updates on auctions, talk to fellow bidders, and win exciting rewards.</App.Text>

            {user.is_claimed_telegram ? (
              <App.Button variant="bot"><App.Icon icon="check-circle-fill2" /> Claimed</App.Button>
            ) : (
              telegram ? (
                <App.Button variant="bot" onClick={handleClaim('join_telegram_group')}>
                  Claim
                  <App.Flex row center gap={4}>
                    <App.Text size={14} weight={700} height={1}>2,000</App.Text>
                    <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                  </App.Flex>
                </App.Button>
              ) : (
                <App.Button variant="telegram" onClick={handleTelegram}><App.Icon icon="telegram2" width={20} /> Join Now</App.Button>
              )
            )}
          </App.Flex>
        </App.Flex>
        
        <App.Flex column fullWidth className={styles.taskContainer}>
          <App.Flex align="center" justify="space-between" gap={8} className={styles.title}>
            <App.Text size={14} weight={700} height={1}>Follow Us on Twitter</App.Text>
            
            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={14} weight={700} height={1}>2,000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>
          
          <App.Flex column fullWidth gap={16} className={styles.body}>
            <App.Text size={14} weight={400}>Get latest updates on auctions, get trading alpha, and win exciting rewards.</App.Text>

            {user.is_claimed_twitter ? (
              <App.Button variant="bot"><App.Icon icon="check-circle-fill2" /> Claimed</App.Button>
            ) : (
              twitter ? (
                <App.Button variant="bot" onClick={handleClaim('twitter_follow')}>
                  Claim
                  <App.Flex row center gap={4}>
                    <App.Text size={16} weight={600} height={1}>2,000</App.Text>
                    <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                  </App.Flex>
                </App.Button>
              ) : (
                <App.Button variant="twitter" onClick={handleX}><App.Icon icon="x" width={20} /> Follow us on Twitter</App.Button>
              )
            )}
          </App.Flex>
        </App.Flex>

        <App.Flex column fullWidth className={styles.taskContainer}>
          <App.Flex align="center" justify="space-between" gap={8} className={styles.title}>
            <App.Text size={14} weight={700} height={1}>Buy Stars from Shop</App.Text>
            
            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={14} weight={700} height={1}>5,000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>
          
          <App.Flex column fullWidth gap={16} className={styles.body}>
            {user.is_claimed_first_payment ? (
              <App.Button variant="bot"><App.Icon icon="check-circle-fill2" /> Claimed</App.Button>
            ) : (
              <App.Button variant="bot" onClick={handleShop}>Buy Stars</App.Button>
            )}
          </App.Flex>
        </App.Flex>

        <App.Flex column fullWidth className={styles.taskContainer}>
          <App.Flex align="center" justify="space-between" gap={8} className={styles.title}>
            <App.Text size={14} weight={700} height={1}>Invite Your Friends</App.Text>
            
            <App.Flex row center gap={4}>
              <App.Text color="#67C9F9" size={14} weight={700} height={1}>5,000-10,000</App.Text>
              <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
            </App.Flex>
          </App.Flex>
          
          <App.Flex column fullWidth gap={16} className={styles.body}>
            <App.Text size={14} weight={400}>Both you and your friends get gems when they place their first bid.</App.Text>
            
            <App.Flex row gap={8}>
              <App.Flex row align="center" gap={4}  flex={1}>
                <App.Text size={12} weight={700} height={1}>Normal User:</App.Text>

                <App.Flex row center gap={4}>
                  <App.Text color="#67C9F9" size={12} weight={700} height={1}>5,000</App.Text>
                  <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                </App.Flex>
              </App.Flex>

              <App.Flex row align="center" gap={4} flex={1}>
                <App.Text size={12} weight={700} height={1}>Premium User:</App.Text>

                <App.Flex row center gap={4}>
                  <App.Text color="#67C9F9" size={12} weight={700} height={1}>10,000</App.Text>
                  <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                </App.Flex>
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
        </App.Flex> */}
      </App.Flex>
    </App.Flex>
  )
}

export default BotEarn