import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import cn from 'classnames'

import $modal from '@/store/modal'

import AppFlex from '@/components/App/AppFlex'
import AppText from '@/components/App/AppText'
import AppIcon from '@/components/App/AppIcon'
import AppLoaderBlock from '@/components/App/AppLoaderBlock'

import styles from './styles.module.scss'

const AppModal = () => {
  const dispatch = useDispatch()
  const { show, modal, props } = useSelector((state) => state.$modal)

  const layout = useRef(null)
  const content = useRef(null)

  const [Component, setComponent] = useState(null)
  const [step, setStep] = useState(0)
  const [prevModal, setPrevModal] = useState()

  useEffect(() => {
    if (show && modal && modal != prevModal) {
      (async () => {
        try {
          const temp = dynamic(() => import(`@/components/${modal}`), {
            loading: () => <AppLoaderBlock height={300} />,
            ssr: false,
          })
          setComponent(temp)
        } catch (error) {
          console.error(`Error importing component: ${modal}`, error)
        }
      })()

      setPrevModal(modal)
    }
  }, [show, modal])

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
          setPrevModal(null)
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
    if (props?.onClose) {
      props.onClose()
    }
    dispatch($modal.set.close())
  }

  const handleStep = (val) => {
    setStep(val)
  }

  return (
    <div ref={layout} className={styles.layout}>
      <div ref={content} className={cn(styles.content, {[styles.onTop]: props.onTop})} onClick={handleClose}>
        <div onClick={e => e.stopPropagation()}>
          <div className={cn(styles.wrapper, {[styles[props?.size]]: props?.size})}>
            {props?.header ? (
              <div className={styles.header}>
                <div className={styles.closeButton} onClick={handleClose}>
                  <AppIcon icon="cross" color="#fff" />
                </div>

                <AppFlex column gap={[16, 32]} className={styles.headerContent}>
                  {props.header?.image ? (
                    <AppFlex center>
                      <img src={props.header?.image} width={120} height={120} alt="" />
                    </AppFlex>
                  ) : (
                    <>
                      <AppFlex column align={['center', 'flex-start']} gap={[16, 8]}>
                        {props.header?.title ? (
                          <AppText center size={20} weight={700} height={1}>{props.header.title}</AppText>
                        ) : props.header?.steps
                              ? <AppFlex row gap={8}>
                                  {props.header.steps.map((item, index) => (
                                    step === item.step
                                      ? <AppFlex key={index} column flex={1} gap={2}>
                                          <AppText center size={20} weight={700} height={1}>{item.title}</AppText>
                                        </AppFlex>
                                      : null
                                  ))}
                                </AppFlex>
                              : null
                        }

                        {props.header?.subtitle ? (
                          <AppText center size={12} weight={400} height={1} color="#9996B1">{props.header.subtitle}</AppText>
                        ) : null}
                      </AppFlex>
                      
                      {props.header?.steps ? (
                        <AppFlex row gap={8}>
                          {props.header.steps.map((item, index) => (
                            <AppFlex key={index} column flex={1} gap={2}>
                              {/* <AppText size={10} center color={step >= item.step ? '#53F19C' : '#605884'}>{item.title}</AppText> */}
                              <div className={cn(styles.progress, {[styles.active]: step >= item.step})} />
                            </AppFlex>
                          ))}
                        </AppFlex>
                      ) : null}
                    </>
                  )}
                </AppFlex>
              </div>
            ) : null}

            {Component ? (
              <Component {...props} onClose={handleClose} onStep={handleStep} />
            ) : (
              <AppLoaderBlock height={300} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppModal