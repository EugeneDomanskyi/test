import { useEffect, useRef, useState } from 'react'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const HomeTop = () => {
  const [wordsIndex, setWordsIndex] = useState(0)

  const intervalRef = useRef(null)

  const words = [
    'Like ERC-20 Tokens',
    'At Scale',
    'In A Click',
    'In Fractions',
    'In High Volume',
    'For Just $0.01',
    'Like A Pro',
  ]

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setWordsIndex(state => {
        const next = state + 1 >= (words.length - 1) ? 0 : (state + 1)
        return next
      })
    }, 3500)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const handleVisibilityChange = () => {
    if (document.hidden) {
      clearInterval(intervalRef.current)
    } else {
      intervalRef.current = setInterval(() => {
        setWordsIndex(state => {
          const next = state + 1 >= (words.length - 1) ? 0 : (state + 1)
          return next
        })
      }, 3500)
    }
  }

  return (
    <div className={styles.container}>
      <App.Container className={styles.content}>
        <div className={styles.rectangle} />

        <App.Flex column gap={[24, 16]} align="center" sx={{ position: 'relative', zIndex: 1 }}>
          <App.Text center size={[64, 48]} weight={700} height={1}>
            Trade NFTs
          </App.Text>

          <App.Flex center align="center" width="100%" height={[70, 52]} sx={{ position: 'relative', zIndex: 0 }}>
            {words.map((item, index) => (
              <App.Text key={index} center size={[64, 48]} weight={700} height={1.2} gradient="linear-gradient(90deg, #E792E4, #B545BE, #7931CB, #4D42C9)" className={cn(styles.text, {[styles.active]: index == wordsIndex})}>
                {item}
              </App.Text>
            ))}
          </App.Flex>
        </App.Flex>
      </App.Container>
    </div>
  )
}

export default HomeTop