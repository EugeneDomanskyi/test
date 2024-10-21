import { useDispatch, useSelector } from 'react-redux'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useEffect } from 'react'

const BotOnboardingModal = () => {
  const dispatch = useDispatch()
  const onboard = useSelector(({ $bot }) => $bot.onboard)

  useEffect(() => {
    if (onboard === 'modal') {
      fetchUser()
    }
  }, [onboard])

  const fetchUser = async () => {
    const result = await $bot.api.user()
    if (result && !result.error) {
      dispatch($bot.set.user(result))
    }
  }

  const handleClose = () => {
    dispatch($bot.set.onboard('gems'))
  }

  return (
    <App.Dialog visible hideHeader open={onboard == 'modal'} onClose={handleClose}>
      <App.Flex fullWidth className={styles.container}>
        <App.Flex className={styles.tiger}/>

        <App.Flex column fullWidth className={styles.inner}>
          <App.Flex fullWidth center className={styles.header}>
            <App.Text center size={24} weight={700} height={1}>Start Bidding Now!</App.Text>

            <App.Flex center className={styles.close} onClick={handleClose}>
              <App.Icon icon="cross" color="#fff" />
            </App.Flex>
          </App.Flex>

          <App.Flex column fullWIdth center gap={16} className={styles.body}>
            <App.Flex className={styles.image} />
            <App.Text center size={24} weight={700}><App.Text inline center size={24} weight={700} color="#A6DC37">+5000 gems</App.Text> credited to your account.</App.Text>

            <App.Button variant="green" fullWidth onClick={handleClose}>Okay</App.Button>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Dialog>
  )
}

export default BotOnboardingModal