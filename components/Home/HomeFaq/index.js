import { useState } from 'react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeFaq = () => {
  const [openIndex, setOpenIndex] = useState()

  const questions = [
    {
      question: 'What is Tegro?',
      answer: `Tegro is a Gen2 orderbook DEX that enables high-frequency trading directly on-chain. With order books, lightning-fast orders, gasless bids and asks, and up to a 3x reduction in gas fees, along with API bot access similar to that of Binance or Coinbase, Tegro merges the performance of a CEX with the trust of a DEX. This makes it an ideal option for traders who prioritize speed and security on-chain.`,
    }, {
      question: 'What is Base chain?',
      answer: `Base is a Layer 2 chain on the Ethereum blockchain. It employs Optimism's OP Stack technology, which enhances the system's security, scalability, and interoperability. Base is designed to facilitate a more efficient transaction process while maintaining a high level of security and the ability to work seamlessly with other systems and applications.`,
    }, {
      question: 'What are the benefits of trading on Tegro?',
      answer: `The Tegro DEX is built for traders, by traders. The exchange combines the performance and convenience of a centralized exchange with the trust and flexibility of decentralized exchanges. With order books, traders get exposure to tighter market spreads similar. They can also actively manage their positions, without incurring additional costs through gasless bids and asks. Trades on the exchange are settled at lightning speeds thanks to the powerful order matching engine. Additionally, Tegro’s trade roll-ups help reduce gas fee costs by up to 3x when compared to other decentralized exchanges. The Tegro DEX also offers plug-and-play API bot access, enabling traders to automate their trading and deploy HFT strategies directly on-chain!`,
      // answer: `It&apos;s super simple. Visit the <a href="https://testnet.tegro.com/exchange/mumbai/0x6464e14854d58feb60e130873329d77fcd2d8eb7?utm_source=homepage&utm_medium=faqs&utm_campaign=testnet">Testnet Exchange</a> page and connect your wallet to claim FREE test tokens. You can then begin trading on the Testnet Exchange for FREE.`,
    }, {
      question: 'How do I begin trading on Tegro?',
      answer: `To start trading, connect your wallet to the platform and navigate to <a href="http://www.tegro.com/exchange">Tegro Exchange</a>. Select a trading pair from those available on the Base L2 chain and begin your trading activities. Tegro plans to expand its support to more chains and trading pairs in the future.`,
    }, {
      question: 'Can I earn rewards when I trade on Tegro?',
      answer: `Yes, trading on Tegro lets you earn rewards in USDC, and other tokens. Visit <a href="https://tegro.com/tournaments?utm_source=homepage&utm_medium=faq&utm_campaign=exchange">Tegro Earn</a> to discover ongoing and upcoming contests and events. Any rewards you earn on Tegro are deposited directly into your wallet.`,
    },
  ]

  const handleToggle = (i) => () => {
    setOpenIndex(state => state == i ? null : i)
  }

  return (
    <App.Container maxWidth={990} sx={{ paddingTop: 58, paddingBottom: 77 }} className={styles.container}>
      <div className={styles.background1} />

      <App.Flex column align="center" gap={90} fullWidth>
        <App.Text tag="h2" size={[80, 64]} weight={800} height={1}>Frequently Asked <App.Text inline size={[80, 64]} weight={700} color="#7364FF">Questions</App.Text></App.Text>

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