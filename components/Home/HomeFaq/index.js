import { useState } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeFaq = () => {
  const tournament = useSelector(({ $tournament }) => $tournament.current)

  const [openIndex, setOpenIndex] = useState()

  const questions = [
    {
      question: 'What is Tegro Gen2 Decentralized Exchange?',
      answer: `Tegro Gen2 Decentralized Exchange is reshaping DeFi with its cutting-edge orderbook system, offering gasless quotes, swift trades, MEV protection, and custody-less transfers. Ideal for both retail and high-frequency traders seeking speed and security on-chain. Experience the future of decentralized trading with Tegro Gen2 DEX.`,
    }, {
      question: 'What are the benefits of using a Gen2 Decentralized Exchange like Tegro?',
      answer: `
      <ul>
        The Tegro Gen2 Decentralized Exchange is packed with power features, such as:
        <li><b>Efficient Orderbooks:</b> Real-time buy/sell prices for optimal execution without slippage.</li>
        <li><b>Gasless Quotes:</b> Free trade placement and adjustment, enabling true price discovery without gas fees.</li>
        <li><b>Lightning-fast Orders:</b> Immediate trade execution, comparable to centralized exchanges.</li>
        <li><b>Binance-like APIs Support:</b> Facilitates complex strategies with easy integration, enhancing trading efficiency.</li>
        <li><b>Optimized Gas Efficiency:</b> Batches orders to minimize gas costs, maximizing your trading potential.</li>
        <li><b>Robust MEV Protection:</b> Safeguards against predatory practices, ensuring fair trade execution.</li>
        <li><b>Uncompromised Self-custody:</b> Full control over your assets with custody-less fund transfers.</li>
        <li><b>Intuitive User Interface:</b> Easy transition from centralized to decentralized trading, designed for simplicity and efficiency.</li>
      </ul>
      `,
    }, {
      question: 'How do I begin trading on Tegro Gen2 DEX Testnet?',
      answer: `It&apos;s super simple. Visit the <a href="https://testnet.tegro.com/exchange/mumbai/0x6464e14854d58feb60e130873329d77fcd2d8eb7?utm_source=homepage&utm_medium=faqs&utm_campaign=testnet">Testnet Exchange</a> page and connect your wallet to claim FREE test tokens. You can then begin trading on the Testnet Exchange for FREE.`,
    }, {
      question: 'Do I need to pay any fees when trading on the Tegro Testnet?',
      answer: `NO. You can trade for FREE on the Tegro Testnet. Please note that the tokens traded on the Testnet are not real.`,
    }, {
      question: 'Can I earn rewards when trading tokens on Tegro Gen2 DEX?',
      answer: `YES! You can earn rewards in tokens like USDT, USDC, and more by trading on the Tegro Gen2 Testnet. Visit the <a href="/tournament/${tournament?.alias}">Tegro Earn</a> page to discover ongoing and upcoming contests and events! Prizes earned on Tegro are deposited directly into your wallet!`,
    },
  ]

  const handleToggle = (i) => () => {
    setOpenIndex(state => state == i ? null : i)
  }

  return (
    <App.Container maxWidth={990} sx={{ paddingTop: 58, paddingBottom: 77 }} className={styles.container}>
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

export default HomeFaq