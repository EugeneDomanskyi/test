import { useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeFaq = () => {
  const [openIndex, setOpenIndex] = useState()

  const questions = [
    {
      question: 'What is a decentralized exchange?',
      answer: `A decentralized exchange or a DEX is a peer-to-peer marketplace that enables traders to buy and sell cryptocurrencies like <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">Ethereum</a>, <a href="https://tegro.com/exchange/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca">Chainlink</a>, <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce">Shiba Inu</a>, <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933">Pepecoin</a> and more. Unlike centralized exchanges (CEXs), DEX operate in a non-custodial manner, where traders retain control over their private keys during the transaction process.`,
    }, {
      question: 'What are the benefits of using a DEX like Tegro?',
      answer: `A <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">decentralized exchange like Tegro</a> offer a range of benefits for crypto trading, including transparency, as all transactions are visible on the blockchain; decentralization, which eliminates a central authority and allows users to participate in governance; anonymity, enabling trading without KYC/AML checks and protecting personal information; and enhanced security, with reduced risks of hacks, thefts, and fraud due to the absence of a single control point and the use of smart contracts to mitigate counterparty and settlement risks.`,
    }, {
      question: 'What are the features of Tegro decentralized exchange?',
      answer: `Tegro is an <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">orderbook-based decentralized exchange</a> that delivers the ease of centralized exchanges on-chain.
        
        Some core features of Tegro: The CEX-DEX are:

        - Permissionless Markets: Trade any token market on Tegro, simply search by keyword or contract address to begin!
        - Non-custodial Orders: Enjoy control over your assets through the entire transaction cycle. Your Keys, Your Assets!
        - Orderbook Trading: Understand and leverage token market depth in real-time!
        - Limit/Market Orders: Trade any token at the best price always!
        - Gasless Order Creation & Cancellation: Create and cancel orders without consequences and worrying about platform fees!
        - Multi-chain Support: Trade efficiently across chains. Networks like <a href="https://tegro.com/exchange/ethereum/">Ethereum</a>, <a href="https://tegro.com/exchange/polygon/0x/">Polygon</a>, <a href="https://tegro.com/exchange/avalanche/0x/">Avalanche</a>, <a href="https://tegro.com/exchange/arbitrum/0x/">Arbitrum</a> and <a href="https://tegro.com/exchange/bsc/0x/">BNB Smart Chain</a> supported, with many more on the way!
        - MEV Bot Resistant: With a unique First Come, First Serve algo in place, Tegro protects your trades against frontrunning and sandwich attacks!
      `,
    }, {
      question: 'How to trade ETH, LINK, SHIB, PEPE and other tokens on Tegro?',
      answer: `You can trade hundreds of tokens, including <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">Ethereum</a>, <a href="https://tegro.com/exchange/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca">Chainlink</a>, <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce">Shiba Inu</a>, <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933">Pepecoin</a> and more on Tegro. You simply have to connect your wallet to begin trading!`,
    }, {
      question: 'How to earn from token trading on Tegro?',
      answer: `You can earn rewards in tokens like USDT, <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce">SHIB</a>, <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933">PEPE</a> and more by visiting <a href="https://tegro.com/earn">Tegro Earn</a>. Prizes earned on Tegro Earn are deposited directly into your wallet!`,
    },
  ]

  const handleToggle = (i) => () => {
    setOpenIndex(state => state == i ? null : i)
  }

  return (
    <App.Container maxWidth={990} sx={{ paddingTop: 58, paddingBottom: 77 }} className={styles.container}>
      <div className={styles.background1} />

      <App.Flex column align="center" gap={90} fullWidth>
        <App.Text size={[80, 64]} weight={800} height={1}>Frequently Asked <App.Text inline italic size={[80, 64]} weight={700} family="Playfair Display" color="#7364FF">Questions</App.Text></App.Text>

        <App.Flex column gap={32} width={[800, '100%']}>
          {questions.map((item, i) => {
            return (
              <App.Flex key={i} column className={cn(styles.faqItem, {[styles.open]: openIndex == i})} onClick={handleToggle(i)}>
                <App.Flex row align="center" justify="space-between" gap={16} sx={{ cursor: 'pointer' }}>
                  <App.Flex column gap={8}>
                    <App.Text italic size={14} weight={700} family="Playfair Display" color="#A6DC37">Question {i + 1}</App.Text>
                    <App.Text size={16} weight={700}>{item.question}</App.Text>
                  </App.Flex>

                  <App.Frame padding={0} radius={32} width={32} height={32} gradient="linear-gradient(101.49deg, #749828 -1.14%, #674EFF 109.57%)">
                    <App.Flex full center>
                      <App.Icon icon="arrow-45" width={16} height={16} className={styles.arrow}/>
                    </App.Flex>
                  </App.Frame>
                </App.Flex>

                <App.Flex className={styles.answer}>
                  <App.Flex className={styles.answerInner}>
                    <App.Text size={14} weight={400} color="#9B99AE">
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