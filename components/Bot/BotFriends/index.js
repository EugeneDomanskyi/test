import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import cn from 'classnames'

import TelegramBot from '@/libs/TelegramBot'

import $alert from '@/store/alert'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotFriends = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)

  const hasReferrals = null

  useEffect(() => {
    fetchReferrals()
  }, [])

  const fetchReferrals = async () => {
    // const result = await $bot.api.tasks()
    // if (result && !result.error) {
    //   dispatch($bot.set.tasks(result))
    // }
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

  const getStats = () => {
    const totalGems = 0
    const totalReferrals = 0

    return (
      <App.Flex row fullWidth gap={16} className={cn(styles.stats, {[styles.top]: hasReferrals === true})}>
        <App.Flex column center gap={4} flex={1}>
          <App.Flex row center gap={4}>
            <App.Text size={20} weight={700} height={1}>{totalGems}</App.Text>

            <App.Flex center className={styles.i}>
              <App.Text size={13} weight={700} height={1}>i</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Text size={12} weight={400} height={1}>Gems earned</App.Text>
        </App.Flex>

        <App.Flex column center gap={4} width={100}>
          <App.Flex row center gap={4}>
            <App.Text size={20} weight={700} height={1}>{totalReferrals}</App.Text>

            <App.Flex center className={styles.i}>
              <App.Text size={13} weight={700} height={1}>i</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Text size={12} weight={400} height={1}>Referrals</App.Text>
        </App.Flex>

        <Image src="/images/bot/friends-gems.png" width={64} height={64} />
      </App.Flex>
    )
  }

  const getColor = (position) => {
    switch (position) {
      case 1: return '#E3A951'
      case 2: return '#D3D3D3'
      case 3: return '#DC7225'
      default: return '#7364FF'
    }
  }

  return (
    <App.Flex column gap={24} className={styles.container}>
      <App.Flex fullWidth column className={cn(styles.box, {[styles.empty]: hasReferrals === false})}>
        {hasReferrals === false ? (
          <App.Flex className={styles.image} />
        ) : null}

        {hasReferrals === true ? getStats() : null}

        <App.Flex column fullWidth gap={16} className={styles.body}>
          <App.Text size={16} weight={700}>You win 10% of all the gems your friend purchases plus 5000 gems.</App.Text>
          <App.Text size={14} weight={400}>Both you and your friends get gems when they place their first bid. </App.Text>

          <App.Flex row gap={16}>
            <App.Flex flex={8}>
              <App.Button variant="bot" fullWidth onClick={handleShare}>Invite Friends</App.Button>
            </App.Flex>

            <App.Flex flex={2}>
              <App.Button variant="bot" fullWidth onClick={handleCopy}><App.Icon icon="copy3" /></App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>

        {hasReferrals === false ? getStats() : null}
      </App.Flex>

      <App.Flex column fullWidth gap={16} className={styles.bottom}>
        <App.Flex center className={styles.title}>
          <Image src="/images/bot/shop-title-2.png" width={358} height={43} alt="" />

          <App.Flex center className={styles.text}>
            <App.Text size={16} weight={700} height={1} color="#FFBB01">Referral History</App.Text>
          </App.Flex>
        </App.Flex>

        <App.Flex column fullWidth className={styles.tableBox}>
          <App.Flex fullWidth align="center" justify="space-between" gap={16} className={styles.header}>
            <App.Text size={14} weight={400} height={1}>username</App.Text>
            <App.Text right size={14} weight={400} height={1}>gems earned</App.Text>
          </App.Flex>

          <App.Flex column fullWidth className={styles.table}>
            {hasReferrals === true ? (
              Array.from({ length: 4 }).map((_, index) => (
                <App.Flex key={index} fullWidth align="center" justify="space-between" gap={16} className={styles.row}>
                  <App.Flex row align="center" gap={8}>
                    <App.Flex center className={styles.position}>
                      <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill={getColor(index + 1)} d="M9.953 1.521a1.27 1.27 0 0 1 2.094 0 1.27 1.27 0 0 0 1.762.33 1.27 1.27 0 0 1 1.953.756 1.27 1.27 0 0 0 1.524.944 1.27 1.27 0 0 1 1.547 1.41 1.27 1.27 0 0 0 1.08 1.431 1.27 1.27 0 0 1 .934 1.874 1.27 1.27 0 0 0 .49 1.725 1.27 1.27 0 0 1 .194 2.084 1.27 1.27 0 0 0-.166 1.786 1.27 1.27 0 0 1-.573 2.013 1.27 1.27 0 0 0-.799 1.606 1.27 1.27 0 0 1-1.261 1.67 1.27 1.27 0 0 0-1.326 1.208 1.27 1.27 0 0 1-1.78 1.102 1.27 1.27 0 0 0-1.672.648 1.27 1.27 0 0 1-2.057.385 1.27 1.27 0 0 0-1.794 0 1.27 1.27 0 0 1-2.057-.385 1.27 1.27 0 0 0-1.672-.648 1.27 1.27 0 0 1-1.78-1.102 1.27 1.27 0 0 0-1.326-1.208 1.27 1.27 0 0 1-1.261-1.67 1.27 1.27 0 0 0-.8-1.606 1.27 1.27 0 0 1-.572-2.013 1.27 1.27 0 0 0-.166-1.786 1.27 1.27 0 0 1 .193-2.084 1.27 1.27 0 0 0 .491-1.725 1.27 1.27 0 0 1 .933-1.874 1.27 1.27 0 0 0 1.08-1.43A1.27 1.27 0 0 1 4.715 3.55a1.27 1.27 0 0 0 1.525-.944A1.27 1.27 0 0 1 8.19 1.85a1.27 1.27 0 0 0 1.762-.33" />
                      </svg>
                      <App.Flex center className={styles.text}>
                        <App.Text size={14} weight={600} height={0}>{index + 1}</App.Text>
                      </App.Flex>
                    </App.Flex>
                    <App.Text size={14} weight={400} height={1}>@username</App.Text>
                  </App.Flex>

                  <App.Text right size={14} weight={400} height={1}>1000</App.Text>
                </App.Flex>
              ))
            ) : (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <App.Flex key={index} fullWidth align="center" justify="space-between" gap={16} className={cn(styles.row, styles.empty)}>
                    <App.Flex row align="center" gap={8}>
                      <App.Flex center className={styles.position}>
                        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill={getColor(index + 1)} d="M9.953 1.521a1.27 1.27 0 0 1 2.094 0 1.27 1.27 0 0 0 1.762.33 1.27 1.27 0 0 1 1.953.756 1.27 1.27 0 0 0 1.524.944 1.27 1.27 0 0 1 1.547 1.41 1.27 1.27 0 0 0 1.08 1.431 1.27 1.27 0 0 1 .934 1.874 1.27 1.27 0 0 0 .49 1.725 1.27 1.27 0 0 1 .194 2.084 1.27 1.27 0 0 0-.166 1.786 1.27 1.27 0 0 1-.573 2.013 1.27 1.27 0 0 0-.799 1.606 1.27 1.27 0 0 1-1.261 1.67 1.27 1.27 0 0 0-1.326 1.208 1.27 1.27 0 0 1-1.78 1.102 1.27 1.27 0 0 0-1.672.648 1.27 1.27 0 0 1-2.057.385 1.27 1.27 0 0 0-1.794 0 1.27 1.27 0 0 1-2.057-.385 1.27 1.27 0 0 0-1.672-.648 1.27 1.27 0 0 1-1.78-1.102 1.27 1.27 0 0 0-1.326-1.208 1.27 1.27 0 0 1-1.261-1.67 1.27 1.27 0 0 0-.8-1.606 1.27 1.27 0 0 1-.572-2.013 1.27 1.27 0 0 0-.166-1.786 1.27 1.27 0 0 1 .193-2.084 1.27 1.27 0 0 0 .491-1.725 1.27 1.27 0 0 1 .933-1.874 1.27 1.27 0 0 0 1.08-1.43A1.27 1.27 0 0 1 4.715 3.55a1.27 1.27 0 0 0 1.525-.944A1.27 1.27 0 0 1 8.19 1.85a1.27 1.27 0 0 0 1.762-.33" />
                        </svg>
                        <App.Flex center className={styles.text}>
                          <App.Text size={14} weight={600} height={0}>{index + 1}</App.Text>
                        </App.Flex>
                      </App.Flex>
                    </App.Flex>
                  </App.Flex>
                ))}

                <App.Flex className={styles.message}>
                  <App.Flex className={styles.tiger}/>

                  <App.Flex center className={styles.bubble}>
                    <App.Text size={13} weight={600}>Hey, looks like you’ve not invited your friends yet. Invite them so that both of you win $s🤑</App.Text>
                  </App.Flex>
                </App.Flex>
              </>
            )}
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Flex>
  )
}

export default BotFriends