import { useState } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState()

  const questions = [
    {
      question: 'How to participate in the Tegro Gen2 DEX Testnet?',
      answer: `To enter the Tegro Gen2 DEX Testnet, participants need to visit <a href="/exchange">www.testnet.tegro.com/exchange</a> and connect their wallet to claim test tokens from the faucet, allowing them to begin trading on the DEX for FREE.`,
    }, {
      question: 'How does the Point System work?',
      answer: `It’s very simple. Participants collect a specified amount of points for each successful trade completed on the Tegro Testnet. Over time, these points accumulate, serving as a reflection of the participant's trading activity and success.`,
    }, {
      question: 'How do I unlock Point multipliers?',
      answer: `
        Point multipliers enable participants to earn additional points for every successful trade. They are unlocked based on the participant’s trading volumes in the tournament. The multipliers are categorized into tiers:
        <ul>
          <li>Cub Tier awards 1 point per trade for trading volumes less than 100K.</li>
          <li>Simba Tier increases this to 1.5 points per trade for volumes between 100K and 1M.</li>
          <li>Mufasa Tier offers the highest multiplier of 2 points per trade for volumes exceeding 1M.</li>
        </ul>
      `,
    }, {
      question: 'What are other ways I can collect additional Points?',
      answer: `Other ways of collecting additional points include achieving higher rankings on the leaderboard, where participants unlock point bonuses corresponding to their positions. Furthermore, those in possession of a whitelist NFT gain an extra 0.25 points on every trade they make.`,
    }, {
      question: 'How can I use the Points I’ve collected?',
      answer: `The points collected during the Testnet can be redeemed to unlock exciting rewards once the test phase concludes. Further details on how to utilize these points will be announced in the near future.`,
    },
  ]

  const handleToggle = (i) => () => {
    setOpenIndex(state => state == i ? null : i)
  }

  return (
      <App.Container maxWidth={990} sx={{ paddingTop: 58, paddingBottom: 24 }} className={styles.container}>
        <div className={styles.background1} />

        <App.Flex column align="center" gap={90} fullWidth>
          <App.Text tag="h2" size={[80, 64]} weight={800} height={1}>Frequently Asked <App.Text inline italic size={[80, 64]} weight={700} family="Playfair Display" color="#7364FF">Questions</App.Text></App.Text>

          <App.Flex column gap={32} width={[800, '100%']}>
            {questions.map((item, i) => {
              return (
                  <App.Flex key={i} column className={cn(styles.faqItem, {[styles.open]: openIndex == i})} onClick={handleToggle(i)}>
                    <App.Flex row align="center" justify="space-between" gap={16} sx={{ cursor: 'pointer' }}>
                      <App.Flex column gap={8}>
                        <App.Text italic size={14} weight={700} family="Playfair Display" color="#A6DC37">Question {i + 1}</App.Text>
                        <App.Text tag="h3" size={16} weight={700}>{item.question}</App.Text>
                      </App.Flex>

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
  )
}

export default FAQ