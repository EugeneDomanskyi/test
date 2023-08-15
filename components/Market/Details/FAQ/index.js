import styles from './styles.module.scss'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import cn from 'classnames'
import Container from '@mui/material/Container'

import App from '@/components/App'

const FAQ = [
  {
    question: 'What is the TGR Quest?',
    answer: 'The TGR Quest is a series of three missions that users need to complete in order to activate the TGR tokens they earned by signing up & referring on Tegro.',
  }, {
    question: 'What are the three missions?',
    answer: 'The three missions are: depositing USDT on Tegro, trading on Tegro, and spinning the wheel of fortune.',
  }, {
    question: "What happens if I don't complete the TGR Quest?",
    answer: "If you don't complete the TGR Quest within the given time frame, the TGR tokens you have earned will be deactivated and you will lose access to them."
  }, {
    question: 'What do I get if I complete the TGR Quest?',
    answer: 'If you complete the TGR Quest, you get to activate the TGR tokens you earned by signing up with Tegro and also earn a mystery box containing even more TGR tokens.'
  }, {
    question: 'I received TGR for referring my friends to Tegro. Can I access it now or do I need to complete the quest?',
    answer: 'The TGR you received for referring your friends will be activated once your friend completes their TGR Quest. So, make sure to urge your friends to complete their quests so you can activate your referral TGR.',
  }, {
    question: 'How much time do I have to complete the TGR Quest?',
    answer: 'The time frame for completing the TGR Quest will be mentioned on the website and in the promotional materials. Be sure to check and complete the quest before the time runs out.',
  }, {
    question: 'Do I have to pay anything to complete the TGR Quest?',
    answer: `No, you don't have to pay anything to complete the TGR Quest. All you need to do is follow the instructions and complete the three missions within the given time frame.`
  }, {
    question: 'Can I complete the TGR Quest on mobile?',
    answer: 'Yes, the TGR Quest can be completed on both desktop and mobile devices.'
  }, {
    question: "Can I participate in the TGR Quest if I haven't signed up with Tegro?",
    answer: "No, the TGR Quest is only available for users who have signed up with Tegro and earned TGR tokens. If you haven't signed up yet, you can sign up on the Tegro website to be eligible to participate in future quests and promotions."
  }
]

const QuestFAQ = () => {
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

  return (
    <App.Flex column sx={{width: '100%'}} gap={8}>
      <App.Text size={28} weight={700}>FAQs</App.Text>
      
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
                  <div className={styles.title}>{ item.question }</div>
                </div>
                <div className={styles.answer} ref={ref => answers.current[i] = ref}>
                  <div>
                    <div style={{width: 44, marginRight: 16}} />
                  </div>
                  <div dangerouslySetInnerHTML={{__html: item.answer}} />
                </div>
              </div>
            )
          })
        }
      </div>
    </App.Flex>
  )
}

export default QuestFAQ
