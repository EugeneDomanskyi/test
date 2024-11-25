import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const AuctionFaq = () => {
  const { t } = useTranslation()

  const [openIndex, setOpenIndex] = useState()

  const questions = [
    {
      question: t('What are Tegro Auctions?'),
      answer: t('Auctions are an incentive for you to use the Tegro exchange while acquiring cryptocurrencies like Ethereum, Bitcoin, and more at huge discounts.'),
    }, {
      question: t('How to participate in auctions?'),
      answer: t('You can trade on the Tegro exchange to acquire Gems. These gems can be used to bid on any ongoing auction.'),
    }, {
      question: t('How do auctions work?'),
      answer: t('<ol type="a" style="list-style: lower-alpha; padding-inline-start: 20px;"><li>You need gems to bid. 100 gems equate to 1 bid.</li><li>Each bid raises the price by $1.</li><li>The auction countdown restarts from 24 hours every time someone bids. The time will reduce as the auction progresses.</li><li>If no new bids are placed before the countdown runs out, the last bidder wins.</li><li>The winner can then purchase the cryptocurrency at the final auction price.</li></ol>'),
    }, {
      question: t('How to collect gems for auctions?'),
      answer: t('<ol type="a" style="list-style: lower-alpha; padding-inline-start: 20px;"><li>When you connect your wallet and place complete first trade on Tegro, you earn 150 gems.</li><li>You can earn another 50 gems by tweeting about Tegro.</li><li>You can earn an unlimited number of gems by trading on Tegro or placing open limit orders on the Tegro Orderbook.</li></ol>'),
    }, {
      question: t('What Happens When I Win?'),
      answer: t('You celebrate! Next, you buy the cryptocurrency by paying the final auction price. For example, if Alice wins the auction for 1 ETH at a final price of $500, they can purchase the 1 ETH for that amount.'),
    }, {
      question: t('What are gems?'),
      answer: t('Gems are a fun way to get rewarded for trading and engaging with the Tegro ecosystem.'),
    }, {
      question: t('How many gems do I earn for completing a trade?'),
      answer: t('You get 1 Gem for every $1 traded on Tegro. For example, if Alice buys $100 worth of WETH using USDC on the Tegro exchange, she will receive 100 Gems.'),
    }, {
      question: t('How do I earn gems for keeping open orders?'),
      answer: t('Liquidity mining on Tegro lets you earn gems by placing open limit orders. The longer your order stays active, the more gems you collect per hour. You can maximize your gems collection by placing larger orders or by pricing your orders closer to the market’s last traded price.<br /><br />For instance, the mid-price of the WETH USDC trading pair is $3000 and two traders - Alice places a $50 buy order for WETH at $2990, while Bob places a $50 buy order at $2995. Since Bobʼs order is larger and closer to the last traded price, he earns more gems than Alice.'),
    },
  ]

  const handleToggle = (i) => () => {
    setOpenIndex(state => state == i ? null : i)
  }

  return (
    <App.Flex column gap={32}>
      <App.Flex column center>
        <App.Text center size={[32, 24]} weight={700}>{t('Frequently Asked Questions')}</App.Text>
        <App.Text center size={16} weight={400} color="#9B99AE">{t('Hey there! Curious about how the auctions work? We’ve got you covered! Read on to learn more.')}</App.Text>
      </App.Flex>

      <App.Flex column gap={[32, 16]}>
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
                  <App.Text tag="div" size={16} weight={400} color="#9B99AE">
                    <div dangerouslySetInnerHTML={{__html: item.answer}} />
                  </App.Text>
                </App.Flex>
              </App.Flex>
            </App.Flex>
          )
        })}
      </App.Flex>
    </App.Flex>
  )
}

export default AuctionFaq