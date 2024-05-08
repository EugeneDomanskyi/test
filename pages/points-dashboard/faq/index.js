import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import cn from 'classnames'

import App from '@/components/App'
import SwitchLanguage from '@/components/SwitchLanguage'

import styles from './styles.module.scss'

const Faq = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const handleDashboard = () => {
    router.push(`/points-dashboard`)
  }

  const [openIndex, setOpenIndex] = useState()

  const questions = [
    {
      question: t('What activities can I do to earn points on the Points Dashboard?'),
      answer: t('Earn points by participating in trading tournaments, referring friends, completing various community engagement tasks, and taking on quests through third-party platforms like Galxe, QuestN etc.'),
    }, {
      question: t('How do I redeem points for rewards on Tegro?'),
      answer: t('Accumulate points and head to the \"Redeem\" section. There, you can exchange your points for loot boxes containing SHM Airdrops, TGR Airdrops, fee rebates, exclusive NFTs, and more.'),
    }, {
      question: t('Are points from the Points Dashboard transferrable to another user?'),
      answer: t('No, points earned on the Points Dashboard are tied to your account and are not transferrable to ensure fairness in the rewards system.'),
    }, {
      question: t('What is a third-party quest, and how do I participate?'),
      answer: t('Third-party quests are unique challenges hosted on platforms like Galxe and QuestN. Participate by following the instructions on the quest page, which will link directly from the Points Dashboard.'),
    }, {
      question: t('How can I track the points Iʼve earned from referrals?'),
      answer: t('You can monitor your referral points in the \"Referral History\" section of the Points Dashboard, which details points earned from each friendʼs activities.'),
    }, {
      question: t('Can I use points to get discounts on trading fees?'),
      answer: t('Yes! You can redeem points for fee rebates, which reduce trading fees, among other exciting rewards.'),
    }, {
      question: t('What happens to my points if I donʼt redeem them?'),
      answer: t('Your points remain in your account until you decide to redeem them. They donʼt expire, so you can save up for the biggest rewards!'),
    }, {
      question: t('How are points awarded in trading tournaments based on tiers?'),
      answer: t('In our trading tournaments, your points depend on your tier: As a \"Cub\", you earn 1 point per trade. Achieve a \"Simba\" status by surpassing $100k in trading volume to earn 1.5 points per trade. Reach \"Mufasa\" level with a trading volume of over $1 million and earn 2 points per trade.'),
    }, {
      question: t('How can I advance to higher tiers like \"Simba\" and \"Mufasa\" in tournaments?'),
      answer: t('Your tier is determined by your total trading volume in a tournament. Trade more than $100k to ascend to \"Simba\" and over $1 million to rise to \"Mufasa\", unlocking higher point multipliers for each trade you make.'),
    }, {
      question: t('What strategies should I adopt to earn more points in trading tournaments?'),
      answer: t('To maximize points, aim to increase your trading volume while maintaining profitability. Advancing to higher tiers like \"Simba\" and \"Mufasa\" will multiply the points earned per trade, making each of your trades more valuable.'),
    }, {
      question: t('How are points calculated for referrals?'),
      answer: t('Simple and straightforward: You earn 1 point for each trade made by a person youʼve referred. Thereʼs no limit, so the more they trade, the more you earn.'),
    }, {
      question: t('Is there a maximum number of referral points I can earn?'),
      answer: t('Thereʼs no cap on the points you can earn through referrals. Each trade your referral makes continues to add points to your balance, one point at a time.'),
    }, {
      question: t('Can I increase the points I earn from referrals?'),
      answer: t('Currently, each trade your referral makes earns you a flat rate of 1 point. Keep referring to expand your network and multiply your earnings!'),
    }, {
      question: t('What should I do to ensure my referral points are properly tracked?'),
      answer: t('Make sure your friends sign up using your unique referral link. Keep track of your referral points on the dashboard, and if you notice any discrepancies, contact us at support@tegro.com or through Discord/Telegram for assistance.'),
    }, {
      question: t('What should I do if I have a dispute or discrepancy in my points?'),
      answer: t('For any concerns regarding point discrepancies, reach out to us at support@tegro.com. Our dedicated team will investigate and resolve your issues promptly. For quick queries, you can also message us on Discord or Telegram for real-time support.'),
    },
  ]

  const handleToggle = (i) => () => {
    setOpenIndex(state => state == i ? null : i)
  }

  return (
    <App.Flex column fullWidth className={styles.container}>
      <App.Container maxWidth={1230}>
        <App.Flex column fullWidth gap={32}>
          <App.Flex fullWidth row align="center" justify="space-between" sx={{ padding: '16px 0 0' }}>
            <App.Flex row sx={{ cursor: 'pointer' }} onClick={handleDashboard}>
              <App.Text weight={600}>&lt; Back</App.Text>
            </App.Flex>

            <App.Flex center gap={[20, 10]}>
              <Link href="/points-dashboard/faq">
                <App.Icon icon="question-circle" />
              </Link>

              <SwitchLanguage />
            </App.Flex>
          </App.Flex>

          <App.Flex direction={['row', 'column']} gap={16} align={['flex-end', 'flex-start']} justify="space-between">
            <App.Flex column width={[700, 'auto']} gap={16}>
              <App.Text size={24} weight={800}>{t('Frequently asked questions')}</App.Text>
              <App.Text color="#FFFFFF99">{t('Have questions about how the Points Dashboard works? Weʼve got answers! Browse through our FAQs to get detailed insights and start maximizing your rewards.')}</App.Text>
            </App.Flex>
          </App.Flex>

          <App.Flex column gap={32}>
            {questions.map((item, i) => {
              return (
                <App.Flex key={i} column className={cn(styles.faqItem, {[styles.open]: openIndex == i})} onClick={handleToggle(i)}>
                  <App.Flex row align="center" justify="space-between" gap={16} sx={{ cursor: 'pointer' }}>
                    <App.Text tag="h3" size={16} weight={700}>{item.question}</App.Text>

                    <App.Frame padding={0} radius={32} width={32} height={32} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                      <App.Flex full center>
                        <App.Icon icon="chevron-down" width={16} height={16} className={styles.arrow}/>
                      </App.Flex>
                    </App.Frame>
                  </App.Flex>

                  <App.Flex className={styles.answer}>
                    <App.Flex className={styles.answerInner}>
                      <App.Text tag="div" size={14} weight={400} color="#9B99AE">
                        <div dangerouslySetInnerHTML={{__html: item.answer}} />
                      </App.Text>
                    </App.Flex>
                  </App.Flex>
                </App.Flex>
              )
            })}
          </App.Flex>
        </App.Flex>
      </App.Container>
    </App.Flex>
  )
}

export default Faq