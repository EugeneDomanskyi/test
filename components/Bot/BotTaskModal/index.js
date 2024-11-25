import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

import $bot from '@/store/bot'

import App from '@/components/App'
import BotProgress from '@/components/Bot/BotProgress'

import styles from './styles.module.scss'

const BotTaskModal = () => {
  const dispatch = useDispatch()
  const task = useSelector(({ $bot }) => $bot.claimedTask)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const result = await $bot.api.user()
    if (result && !result.error) {
      dispatch($bot.set.user(result))
    }
  }

  const handleClose = () => {
    dispatch($bot.set.claimedTask(null))
  }

  return (
    <App.Dialog visible hideHeader open={task !== null} onClose={handleClose}>
      <App.Flex fullWidth className={styles.container}>
        <App.Flex className={styles.tiger}/>

        <App.Flex column fullWidth className={styles.inner}>
          <App.Flex fullWidth center gap={8} className={styles.header}>
            <App.Icon icon="check-circle-fill2" width={24} height={24} />
            <App.Text center size={24} weight={700} height={1}>Task Completed</App.Text>

            <App.Flex center className={styles.close} onClick={handleClose}>
              <App.Icon icon="cross" color="#fff" />
            </App.Flex>
          </App.Flex>

          {task?.key ? (
            <App.Flex column fullWidth center gap={16} className={styles.body}>
              <App.Flex key={task.key} column fullWidth className={styles.taskContainer}>
                <App.Flex column fullWidth gap={8} className={styles.title}>
                  <App.Flex fullWidth align="center" justify="space-between" gap={8}>
                    <App.Text size={14} weight={700} height={1}>{task.title}</App.Text>

                    <App.Flex row center gap={4}>
                      <App.Text color="#67C9F9" size={14} weight={700} height={1}>{task.reward.toLocaleString('en-US')}</App.Text>
                      <Image src="/images/bot/gem.png" width={20} height={16} alt="" />
                    </App.Flex>
                  </App.Flex>

                  <BotProgress currentValue={task.progress} maxValue={task.steps} />
                </App.Flex>
              </App.Flex>

              <App.Flex className={styles.image} />
              <App.Text center size={24} weight={700}><App.Text inline center size={24} weight={700} color="#A6DC37">+{task.reward.toLocaleString('en-US')} gems</App.Text> credited to your account.</App.Text>

              <App.Button variant="green" fullWidth onClick={handleClose}>Okay</App.Button>
            </App.Flex>
          ) : null}
        </App.Flex>
      </App.Flex>
    </App.Dialog>
  )
}

export default BotTaskModal