import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import cn from 'classnames'

import useWalletConnect from '@/myhooks/wallet-connect'

import $modal from '@/store/modal'

import App from '@/components/App'

import styles from './styles.module.scss'

const AppModal = () => {
  const { scanUrl } = useWalletConnect()
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
            loading: () => <App.LoaderBlock height={300} />,
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
    dispatch($modal.set.close())
  }

  const handleStep = (val) => {
    setStep(val)
  }

  return (
    <div ref={layout} className={styles.layout}>
      <div ref={content} className={styles.content} onClick={handleClose}>
        <div onClick={e => e.stopPropagation()}>
          <div className={cn(styles.wrapper, {[styles[props?.size]]: props?.size})}>
            {props?.header ? (
              <div className={styles.header}>
                <div className={styles.closeButton} onClick={handleClose}>
                  <App.Icon icon="cross" color="#fff" />
                </div>

                <App.Flex column gap={[16, 32]} className={styles.headerContent}>
                  {props.header?.image ? (
                    <App.Flex center>
                      <img src={props.header?.image} width={120} height={120} alt="" />
                    </App.Flex>
                  ) : (
                    <>
                      <App.Flex column align={['center', 'flex-start']} gap={[16, 8]}>
                        {props.header?.title ? (
                          <App.Text center size={20} weight={700} height={1}>{props.header.title}</App.Text>
                        ) : null}

                        {props.header?.subtitle ? (
                          <App.Text center size={12} weight={400} height={1} color="#9996B1">{props.header.subtitle}</App.Text>
                        ) : null}
                      </App.Flex>
                      
                      {props.header?.steps ? (
                        <App.Flex row gap={8}>
                          {props.header.steps.map((item, index) => (
                            <App.Flex key={index} column flex={1} gap={2}>
                              <App.Text size={10} center color={step >= item.step ? '#53F19C' : '#605884'}>{item.title}</App.Text>
                              <div className={cn(styles.progress, {[styles.active]: step >= item.step})} />
                            </App.Flex>
                          ))}
                        </App.Flex>
                      ) : null}
                    </>
                  )}
                </App.Flex>
              </div>
            ) : null}

            {Component ? (
              <Component {...props} onClose={handleClose} onStep={handleStep} />
            ) : (
              <App.LoaderBlock height={300} />
            )}

            {props?.footer ? (
              <>
                {props.footer == 'info' ? (
                  <div className={styles.footer}>
                    <App.Flex row gap={8} align="center">
                      <App.Icon icon="lock-star-fill" />
                      <App.Flex column>
                        <App.Text>1 NFT = 1 NFT20</App.Text>
                        <App.Text>ALL NFT20 tokens are backed 1:1 by NFTs</App.Text>
                        <App.Text>Check our verified contracts <a href={scanUrl(props.token.nft20, 'address', props.token.chain)} target="_blank" rel="noreferrer" className={styles.link}>here</a></App.Text>
                      </App.Flex>
                    </App.Flex>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppModal