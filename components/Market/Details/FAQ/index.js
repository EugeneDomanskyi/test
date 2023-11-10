import styles from './styles.module.scss'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { gsap } from 'gsap'
import cn from 'classnames'
import moment from 'moment'

import App from '@/components/App'
import SectionTitle from '@/components/Market/SectionTitle'

const MarketFAQ = ({type, marketInfo}) => {
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

  const priceText = type === 'tokens' ? 'current price' : 'floor price'
  const price = marketInfo?.price
  const volume = type === 'tokens' ? marketInfo?.tokenCount : marketInfo?.tvl
  const launchDate = moment(marketInfo.createdAt).format('MMMM DD, YYYY')

  const FAQ = [
    {
      question: `What is ${ marketInfo.name }?`,
      answer: marketInfo.description,
    },
    ...(
      marketInfo.price
        ? [{
            question: `What is the ${priceText} of ${marketInfo.name}?`,
            answer: `The ${priceText} of ${marketInfo.name} is $${marketInfo.price}.`,
          }]
      : []
    ),
    ...(
      volume
        ? [{
            question: `What is the total supply of ${ marketInfo.name }`,
            answer: `${ marketInfo.name } has a total circulating supply of ${ volume }.`,
          }]
        : []
    ),
    ...(
      marketInfo.marketCap || marketInfo.tvl
        ? [{
            question: `What is the the total market cap of ${ marketInfo.name }?`,
            answer: `${ marketInfo.name } has a total market cap of ${ marketInfo.marketCap ?? marketInfo.tvl }.`
          }]
        : []
    ),
    ...(
      marketInfo.onSaleCount && marketInfo.volume
        ? [{
            question: `What is the 24 hour global trading volume of ${ marketInfo.name }?`,
            answer: `In the past 24 hours, the total trading volume of ${ marketInfo.name } is ${ marketInfo.volume + (marketInfo.onSaleCount ? ` with ${ marketInfo.onSaleCount } sales` : '') }.`,
          }]
        : []
    ),
    {
      question: `Where can I buy, sell, and trade ${ marketInfo.name }?`,
      answer: `The best place to buy, sell, and trade ${ marketInfo.name } is Tegro: The CEX-DEX. Use orderbooks, limit orders, and more on Tegro: The CEX-DEX to trade ${ marketInfo.name } at the best prices.`,
    },
  ]

  if (marketInfo.createdAt) {
    FAQ.push(
      {
        question: `When was ${ marketInfo.name } launched?`,
        answer: `${ marketInfo.name } was first created on ${ launchDate }.`
      }
    )
  }

  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <SectionTitle>FAQs</SectionTitle>
      <h2 style={{marginTop: 0,fontSize: 18}}>Everything you need to know about { marketInfo.name }</h2>
      
      <div className={styles.container}>
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
                  <h3 className={styles.title}>{ item.question }</h3>
                </div>
                <div className={styles.answer} ref={ref => answers.current[i] = ref}>
                  <div>
                    <div style={{width: 44, marginRight: 16}} />
                  </div>
                  <div style={{ whiteSpace: 'pre-line' }} dangerouslySetInnerHTML={{__html: item.answer}} />
                </div>
              </div>
            )
          })
        }
      </div>
    </App.Flex>
  )
}

export default MarketFAQ
