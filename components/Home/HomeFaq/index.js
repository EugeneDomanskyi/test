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
      answer: `Tegro Gen2 DEX unlocks the future of on-chain trading with unmatched gas efficiency and market tools. Experience CEX-like trading on Tegro with gasless bids and asks—a feat not achievable with AMM platforms—resulting in tighter spreads and real-time price discovery. With up to a 3x reduction in gas fees and simple API integration akin to Binance or Coinbase, Tegro is perfect for retail and high-frequency traders who prioritize speed and security on-chain.`,
    }, {
      question: 'What are the benefits of using a Gen2 Decentralized Exchange like Tegro?',
      answer: `
      <ul>
        The Tegro Gen2 Decentralized Exchange is packed with power features, such as:
        <li><b>Efficient Orderbooks:</b> Trade with tighter market spreads, rivaling a CEX.</li>
        <li><b>Gasless Quotes:</b> Actively manage trading positions without worrying about gas.</li>
        <li><b>Lightning-fast Matching Engine:</b> Achieve peak trading performance with up to 500K trades settled in a second.</li>
        <li><b>Binance-like APIs:</b> Import CeFi algo strategies with simple plug & play API integration.</li>
        <li><b>Gas Efficiency:</b> Save up to 3X on gas with trade roll-ups, beating other DEXs.</li>
        <li><b>MEV Resistant:</b> Your trades are protected against bots or any predatory practices. Trade worry-free!</li>
        <li><b>Custody-less Trading:</b> Trade direct from wallet with 100% self-custody, no deposits required.</li>
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
  )
}

export default HomeFaq