import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'

import $modal from '@/store/modal'

import styles from './styles.module.scss'

const AppModal = () => {
  const dispatch = useDispatch()
  const { show, modal, props } = useSelector((state) => state.$modal)

  const layout = useRef(null)
  const content = useRef(null)

  const [Component, setComponent] = useState(null)

  useEffect(() => {
    if (modal && ! Component) {
      (async () => {
        try {
          const temp = dynamic(() => import(`@/components/${modal}`))
          setComponent(temp)
        } catch (error) {
          console.error(`Error importing component: ${modal}`, error)
        }
      })()
    }
  }, [show, modal, Component])

  useEffect(() => {
    if (Component) {
      if (show) {
        gsap.to(layout.current, {opacity: 1, duration: 0.2})
        gsap.fromTo(content.current, {y: 200}, {y: 0, duration: 0.2})
        document.body.classList.add('modal-open')
      } else if (modal) {
        Promise.all([
          gsap.to(layout.current, {opacity: 0, duration: 0.2}),
          gsap.fromTo(content.current, {y: 0}, {y: 200, duration: 0.2})
        ]).then(() => {
          setComponent(null)
          dispatch($modal.set.destroy())
          document.body.classList.remove('modal-open')
        })
      }
    }
  }, [Component, show])

  if ( ! modal || ! Component) {
    return null
  }

  const handleClose = () => {
    dispatch($modal.set.close())
  }

  return (
    <div ref={layout} className={styles.layout}>
      <div ref={content} className={styles.content} onClick={handleClose}>
        <div onClick={e => e.stopPropagation()}>
          <Component {...props} />
        </div>
      </div>
    </div>
  )
}

export default AppModal