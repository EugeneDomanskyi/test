import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/dist/CustomEase'
import cn from 'classnames'

import AppFlex from '@/components/App/AppFlex'
import AppText from '@/components/App/AppText'
import AppIcon from '@/components/App/AppIcon'

import styles from './styles.module.scss'

gsap.registerPlugin(CustomEase)

const AppDialog = ({ children, open, size, hideHeader, hideClose, title, visible, subtitle, toTop, full, fullBody, fromRight, width, onClose }) => {
  const [opened, setOpened] = useState(false)

  const layout = useRef(null)
  const content = useRef(null)

  CustomEase.create('customEaseOpen', 'M0,0 C0.9,0 0.9,1 1,1')

  useEffect(() => {
    if (open) {
      if (!opened) {
        document.body.classList.add('modal-open')
        const animation = fromRight ? [
          gsap.to(layout.current, {opacity: 1, duration: 0.2}),
          gsap.fromTo(content.current, {x: '100%'}, {x: 0, duration: 0.2, ease: 'customEaseOpen'}),
        ] : [
          gsap.to(layout.current, {opacity: 1, duration: 0.2}),
          gsap.fromTo(content.current, {y: 200}, {y: 0, duration: 0.2}),
        ]

        Promise.all(animation).then(() => {
          setOpened(true)
        })
      }
    } else {
      if (opened) {
        const animation = fromRight ? [
          gsap.to(layout.current, {opacity: 0, duration: 0.2}),
          gsap.fromTo(content.current, {x: 0}, {x: '100%', duration: 0.2, ease: 'customEaseOpen'}),
        ] : [
          gsap.to(layout.current, {opacity: 0, duration: 0.2}),
          gsap.fromTo(content.current, {y: 0}, {y: 200, duration: 0.2}),
        ]

        Promise.all(animation).then(() => {
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
    <div ref={layout} className={cn(styles.layout, {[styles.fullBody]: fullBody})}>
      <div ref={content} className={cn(styles.content, {[styles.toTop]: toTop}, {[styles.full]: full}, {[styles.fullBody]: fullBody})} onClick={handleClose}>
        <div onClick={e => e.stopPropagation()} style={full || fullBody ? { width: '100%', height: '100%' } : null}>
          <div className={cn(styles.wrapper, {[styles[size]]: size}, {[styles.visible]: visible}, {[styles.full]: full}, {[styles.fullBody]: fullBody})} style={{ width: width }}>
            {!hideHeader ? (
              <div className={styles.header}>
                {title ? (
                  <AppText weight={600} height={1}>{title}</AppText>
                ) : null}

                {!hideClose ? (
                  <div className={styles.closeButton} onClick={handleClose}>
                    <AppIcon icon="cross" width={18} height={18} color="#fff" />
                  </div>
                ) : null}
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