import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetTimer = ({ time, onComplete }) => {
  const router = useRouter()

  const [localTime, setLocalTime] = useState(time)

  const timer = useRef()

  useEffect(() => {
    timer.current = setInterval(() => {
      setLocalTime(time => time - 1)
    }, 1000)

    return () => {
      clearInterval(timer.current)
    }
  }, [])

  useEffect(() => {
    if (localTime <= 0) {
      clearInterval(timer.current)

      if (onComplete) {
        onComplete()
      }
    }
  }, [localTime])

  const formatTimer = () => {
    const hours = Math.floor(localTime / 3600)
    const minutes = Math.floor((localTime - (hours * 3600)) / 60)
    const seconds = localTime - (hours * 3600) - (minutes * 60)

    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleTrade = () => {
    router.push('/exchange')
  }

  return (
    <App.Flex column align="center" justify="space-between" className={styles.container}>
      <div className={styles.circle} />
      
      <App.Flex center column gap={[16, 8]}>
        <App.Text center size={[24, 20]} weight={600} height={1}>Sit Tight, Your Drip is on the Way!</App.Text>
        <App.Text center weight={400} color="#B9B8C5">Please wait until the timer expires before proceeding</App.Text>
      </App.Flex>

      <App.Flex column center gap={8}>
        <App.Text center size={64} weight={600} height={1}>{formatTimer()}</App.Text>
        <App.Text center size={14} weight={400} color="#B9B8C5">Until the next drip</App.Text>
      </App.Flex>

      <App.Flex column center gap={16}>
        <App.Text center weight={400} color="#B9B8C5">Want more test tokens? <a href="mailto:aditi@tegro.com" className={styles.link}>Contact Us</a></App.Text>
        <App.Button primary xl fitWidth center onClick={handleTrade}>Trade Now</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetTimer