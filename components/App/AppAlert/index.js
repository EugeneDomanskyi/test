import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { gsap } from 'gsap'
import cn from 'classnames'

import AppHelper from '@/libs/AppHelper'

import $alert from '@/store/alert'

import AppFlex from '@/components/App/AppFlex'
import AppText from '@/components/App/AppText'
import AppIcon from '@/components/App/AppIcon'

import styles from './styles.module.scss'

const AppAlert = () => {
  const dispatch = useDispatch()
  const isApp = useSelector(({ $app }) => $app.isApp)
  const messages = useSelector(({ $alert }) => $alert.messages)

  const [currentMessages, setCurrentMessages] = useState([])

  const alertsBoxRef = useRef({})
  const alertsRef = useRef({})
  const timerRef = useRef({})

  useEffect(() => {
    if (messages.length) {
      setCurrentMessages(state => {
        const newMessages = [
          ...messages.map(item => ({
            ...item,
            id: Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000,
            visible: false,
          })),
          ...state,
        ]

        return newMessages.slice(0, 3)
      })

      dispatch($alert.set.clear())
    }
  }, [messages])

  useEffect(() => {
    (async () => {
      if (currentMessages.some(item => ! item.visible)) {
        const unvisibleMessages = currentMessages.filter(item => ! item.visible)
        for (const message of unvisibleMessages) {
          if (!isApp) {
            const isOpen = await handleOpen(message.id)
            if (isOpen) {
              timerRef.current[message.id] = setTimeout(async () => {
                handleClose(message.id)
              }, message.delay)
            }
          } else {
            AppHelper.send({notification: message})
          }
        }

        setCurrentMessages(state => {
          return state.map(item => ({
            ...item,
            visible: true,
          }))
        })
      }

      if (currentMessages.length > 3) {
        const messagesToClose = currentMessages.slice(3)
        for (const message of messagesToClose) {
          await handleClose(message.id)
        }
      }
    })()
  }, [currentMessages, alertsRef.current])

  const handleOpen = async (id) => {
    const alert = alertsRef.current[id]
    if (alert) {
      const alertRect = alert.getBoundingClientRect()
      const alertBox = alertsBoxRef.current[id]

      if (alertBox) {
        await gsap.to(alertBox, { height: alertRect.height, duration: 0.1 })
        await gsap.to(alert, { marginLeft: 0, duration: 0.1 })

        return true
      }
    }

    return false
  }

  const handleClose = async (id) => {
    const alert = alertsRef.current[id]
    const alertBox = alertsBoxRef.current[id]

    if (alert && alertBox) {
      await gsap.to(alert, { marginLeft: '100%', duration: 0.1 })
      await gsap.to(alertBox, { height: 0, duration: 0.1 })

      setCurrentMessages(state => {
        return state.filter(item => item.id != id)
      })
    }

    clearTimeout(timerRef.current[id])
  }

  return (
    <AppFlex column gap={8} className={styles.alerts}>
      {currentMessages.map((item, index) => (
        <div key={item.id} ref={(element) => alertsBoxRef.current[item.id] = element} className={cn(styles.alertBox)} onClick={() => { handleClose(item.id) }}>
          <div ref={(element) => alertsRef.current[item.id] = element} className={cn(styles.alert, styles[item.type])}>
            <AppFlex row center className={cn(styles.alertIcon, styles[item.type])}>
              <AppIcon icon={`alert-${item.type}`} />
            </AppFlex>

            <AppFlex column gap={4} flex={1}>
              <AppText nowrap size={17} weight={600} height={1}>{item.title}</AppText>
              <AppText size={13} height={1.2} color="#C8C5C5">{item.text}</AppText>
            </AppFlex>
          </div>
        </div>
      ))}
    </AppFlex>
  )
}

export default AppAlert