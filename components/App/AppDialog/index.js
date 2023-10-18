import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import cn from 'classnames'

import AppFlex from '@/components/App/AppFlex'
import AppText from '@/components/App/AppText'
import AppIcon from '@/components/App/AppIcon'

import styles from './styles.module.scss'

const AppDialog = ({ children, open, size, hideHeader, title, subtitle, toTop, onClose }) => {
  const [opened, setOpened] = useState(false)

  const layout = useRef(null)
  const content = useRef(null)

  useEffect(() => {
    if (open) {
      if (!opened) {
        document.body.classList.add('modal-open')
        Promise.all([
          gsap.to(layout.current, {opacity: 1, duration: 0.2}),
          gsap.fromTo(content.current, {y: 200}, {y: 0, duration: 0.2}),
        ]).then(() => {
          setOpened(true)
        })
      }
    } else {
      if (opened) {
        Promise.all([
          gsap.to(layout.current, {opacity: 0, duration: 0.2}),
          gsap.fromTo(content.current, {y: 0}, {y: 200, duration: 0.2}),
        ]).then(() => {
          document.body.classList.remove('modal-open')
          setOpened(false)
        })
      }
    }
  }, [open])

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }
  
  return open || opened ? (
    <div ref={layout} className={styles.layout}>
      <div ref={content} className={cn(styles.content, {[styles.toTop]: toTop})} onClick={handleClose}>
        <div onClick={e => e.stopPropagation()}>
          <div className={cn(styles.wrapper, {[styles[size]]: size})}>
            {!hideHeader ? (
              <div className={styles.header}>
                <div className={styles.closeButton} onClick={handleClose}>
                  <AppIcon icon="cross" color="#fff" />
                </div>

                <AppFlex column gap={[16, 32]} className={styles.headerContent}>
                  <AppFlex column align={['center', 'flex-start']} gap={[16, 8]}>
                    {title ? (
                      <AppText center size={20} weight={700} height={1}>{title}</AppText>
                    ) : null}

                    {subtitle ? (
                      <AppText center size={12} weight={400} height={1} color="#9996B1">{subtitle}</AppText>
                    ) : null}
                  </AppFlex>
                </AppFlex>
              </div>
            ) : null}

            {children}
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default AppDialog