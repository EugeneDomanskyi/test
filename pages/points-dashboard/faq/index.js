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
      question: t('What are points?'),
      answer: t('Points are a fun way to get rewarded for engaging with the Tegro ecosystem. The points you earn can be used in future events or exchanged for some really cool rewards. Weʼll be unveiling more details soon, so stay tuned!'),
    }, {
      question: t('How can I earn points?'),
      answer: t('Itʼs super easy! You stack points on Tegro by getting involved in all sorts of activities. Whether it’s completing tasks, making trades, referring friends, or jumping into side quest campaigns, each action adds points to your total. Get active and watch those points pile up!'),
    }, {
      question: t('What is liquidity mining? How does it work?'),
      answer: t('Liquidity mining on Tegro lets you earn points by placing open orders. The longer your order stays active, the more points you collect per minute. You can maximize your points collection by placing larger orders or by pricing your orders closer to the market’s mid-price. For instance, the mid-price of the WETH USDC trading pair is $3000 and two traders - Alice places a $50 buy order for WETH at $2990, while Bob places a $75 buy order at $2995. Since Bobʼs order is larger and closer to the mid-price, he earns more points than Alice.'),
    }, {
      question: t('What is deviation?'),
      answer: t('Deviation measures the difference between the price of your active order and the current marketʼs mid-price. The closer your order price is to this mid-price, the more points youʼll accumulate.'),
    }, {
      question: t('Will I collect points on completed orders?'),
      answer: t('No, once an order is fulfilled, it stops accumulating points. To keep earning points, youʼll need to place new orders.'),
    }, {
      question: t('How do referrals work?'),
      answer: t('Referrals are a fantastic way to earn extra points. Just share your unique referral code with your friends. When a friend uses your code to join Tegro and starts placing their orders, youʼll begin earning 25% of the points they collect from all of their orders.'),
    }, {
      question: t('What are side quests?'),
      answer: t('Side quests are unique campaigns that provide an extra avenue for traders to earn points. Participate in these mini-campaigns on platforms like Galxe, TaskOn, and QuestN to earn additional points.'),
    }, {
      question: t('Can I transfer points to another user?'),
      answer: t('No, the points you earn on Tegro are linked to your connected wallet address and cannot be transferred. This policy helps maintain fairness in the rewards system.'),
    }, {
      question: t('What should I do if I have a dispute or discrepancy in my points?'),
      answer: t('If you notice any discrepancies with your points, please contact us at <a href="mailto:support@tegro.com">support@tegro.com</a>. Our dedicated team will look into your issue and resolve it promptly. For quicker responses, you can also reach out to us on <a href="https://discord.com/invite/tegro" target="_blank" rel="noreferrer">Discord</a> for real-time support.'),
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
              <App.Text color="#FFFFFF99">{t('Hey there! Curious about points and how they work? We’ve got you covered! Browse through the FAQs to learn more.')}</App.Text>
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