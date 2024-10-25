import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Image from 'next/image'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotLoading = ({ open }) => {
  const [opened, setOpened] = useState(true)

  const container = useRef(null)

  useEffect(() => {
    if (!open) {
      if (opened) {
        Promise.all([
          gsap.to(container.current, {opacity: 0, duration: 0.3}),
        ]).then(() => {
          setOpened(false)
        })
      }
    }
  }, [open])

  return opened ? (
    <div ref={container} className={styles.container}>
      <Image src="/images/logo-head.png" width={80} height={80} alt="" />
    </div>
  ) : null
}

export default BotLoading