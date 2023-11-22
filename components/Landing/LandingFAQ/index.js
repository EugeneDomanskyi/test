import styles from './styles.module.scss'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import cn from 'classnames'
import moment from 'moment'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

const LandingFAQ = ({}) => {
  const itemRefs = useRef([])
  const answers = useRef([])

  const [openItem, setOpenItem] = useState(null)

  const handleClickQuestion = num => () => {
    const isOpen = answers.current[num].getBoundingClientRect().height
    if (isOpen) {
      gsap.to(itemRefs.current[num], {background: 'transparent', paddingBottom: 0, paddingTop: 16, duration: 0.3})
      gsap.to(answers.current[num], {height: 0, duration: 0.3})
      setOpenItem(null)
    } else {
      gsap.to(answers.current.filter((_, i) => i !== num), {height: 0, duration: 0.3})
      gsap.to(itemRefs.current.filter((_, i) => i !== num), {background: 'transparent',  paddingBottom: 0, paddingTop: 16, duration: 0.3})
      gsap.to(itemRefs.current[num], {
        background: 'radial-gradient(131.67% 133.33% at 3.42% 0,rgba(230,231,255,.2) 0,rgba(231,223,255,0) 100%)',
        paddingBottom: 32,
        paddingTop: 32,
        duration: 0.3,
      })
      gsap.to(answers.current[num], {height: 'auto', duration: 0.3})
      setOpenItem(num)
    }
  }

  const FAQ = [
    {
      question: 'What is a decentralized exchange?',
      answer: `A decentralized exchange or a DEX is a peer-to-peer marketplace that enables traders to buy and sell cryptocurrencies like <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">Ethereum</a>, <a href="https://tegro.com/exchange/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca">Chainlink</a>, <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce">Shiba Inu</a>, <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933">Pepecoin</a> and more. Unlike centralized exchanges (CEXs), DEX operate in a non-custodial manner, where traders retain control over their private keys during the transaction process.`,
    },
    {
      question: 'What are the benefits of using a DEX like Tegro?',
      answer: `A <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">decentralized exchange like Tegro</a> offer a range of benefits for crypto trading, including transparency, as all transactions are visible on the blockchain; decentralization, which eliminates a central authority and allows users to participate in governance; anonymity, enabling trading without KYC/AML checks and protecting personal information; and enhanced security, with reduced risks of hacks, thefts, and fraud due to the absence of a single control point and the use of smart contracts to mitigate counterparty and settlement risks.`,
    },
    {
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
    },
    {
      question: 'How to trade ETH, LINK, SHIB, PEPE, and other tokens on Tegro?',
      answer: `You can trade hundreds of tokens, including <a href="https://tegro.com/exchange/ethereum/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2">Ethereum</a>, <a href="https://tegro.com/exchange/ethereum/0x514910771af9ca656af840dff83e8264ecf986ca">Chainlink</a>, <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce">Shiba Inu</a>, <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933">Pepecoin</a> and more on Tegro. You simply have to connect your wallet to begin trading!`,
    },
    {
      question: 'How to earn from token trading on Tegro?',
      answer: `You can earn rewards in tokens like USDT, <a href="https://tegro.com/exchange/ethereum/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce">SHIB</a>, <a href="https://tegro.com/exchange/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933">PEPE</a> and more by visiting <a href="https://tegro.com/earn">Tegro Earn</a>. Prizes earned on Tegro Earn are deposited directly into your wallet!`,
    },
  ]

  return (
    <App.Container sx={{zIndex: 1}}>
      <App.Flex column gap={8} className={styles.container}>
        <h1>FAQs</h1>
        {/* <h2 style={{marginTop: 0,fontSize: 18}}>Everything you need to know about</h2> */}
        
        <div className={styles.faqContainer}>
          {
            FAQ.map((item, i) => {
              return (
                <div key={i} className={styles.item} ref={ref => itemRefs.current[i] = ref}>
                  <div className={styles.question} onClick={handleClickQuestion(i)}>
                    <div>
                      <div className={styles.button}>
                        <div className={cn(styles.plus, {[styles.open]: openItem === i})} />
                      </div>
                    </div>
                    <h2 className={styles.title}>{ item.question }</h2>
                  </div>
                  <div className={styles.answer} ref={ref => answers.current[i] = ref}>
                    <div>
                      <div style={{width: 44, marginRight: 16}} />
                    </div>
                    <h3 style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: item.answer}} />
                  </div>
                </div>
              )
            })
          }
        </div>
      </App.Flex>
    </App.Container>
  )
}

export default LandingFAQ