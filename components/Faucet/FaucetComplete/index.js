import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import lottie from 'lottie-web'
import animationData from '@/public/animations/confetti_new.json'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const FaucetComplete = () => {
  const router = useRouter()

  const [showConfetti, setShowConfetti] = useState(true)
  const [iconAnimation, setIconAmimation] = useState(false)

  useEffect(() => {
    setIconAmimation(true)
    setTimeout(() => {
      setIconAmimation(false)
    }, 300)

    const anim = lottie.loadAnimation({
      container: document.getElementById('lottie-container'),
      animationData: animationData,
      renderer: 'svg',
      loop: false,
      autoplay: true,
    })

    anim.onComplete = () => {
      setShowConfetti(false)
    }

    return () => {
      anim.destroy()
    }
  }, [])

  const handleTrade = () => {
    router.push('/exchange')
  }

  return (
    <App.Flex column align="center" justify="space-between" className={styles.container}>
      <div className={styles.circle} />

      <App.Flex center column gap={[16, 8]}>
        <App.Text center size={24} weight={600} height={1}>Congratulations</App.Text>
        <App.Text center weight={400} color="#B9B8C5">You've just received your drip! You can start trading now!</App.Text>
      </App.Flex>

      <App.Flex row center gap={16}>
        {showConfetti ? <App.Flex id="lottie-container" className={styles.confetti} /> : null}

        <App.Flex row center className={styles.iconBox}>
          <App.Text height={1} className={cn(styles.icon, {[styles.animate]: iconAnimation})}>🎉</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Flex column center gap={16}>
        <App.Text center weight={400} color="#B9B8C5">Want more test tokens? <a href="mailto:aditi@tegro.com" className={styles.link}>Contact Us</a></App.Text>
        <App.Button primary xl fitWidth center onClick={handleTrade}>Trade Now</App.Button>
      </App.Flex>
    </App.Flex>
  )
}

export default FaucetComplete