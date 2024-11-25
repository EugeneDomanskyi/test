import { useDispatch, useSelector } from 'react-redux'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'
import { useEffect } from 'react'

const BotOutbidModal = () => {
  const dispatch = useDispatch()
  const outbid = useSelector(({ $bot }) => $bot.outbid)

  const handleClose = () => {
    dispatch($bot.set.outbid(false))
    dispatch($bot.set.outbidClosed(true))
  }

  const handleTab = (tab) => () => {
    dispatch($bot.set.tab(tab))
    handleClose()
  }

  return (
    <App.Dialog visible hideHeader open={outbid} onClose={handleClose}>
      <App.Flex fullWidth className={styles.container}>
        <App.Flex className={styles.tiger}/>

        <App.Flex column fullWidth className={styles.inner}>
          <App.Flex fullWidth center className={styles.header}>
            <App.Text center size={20} weight={700} height={1}>Get more gems to Bid!</App.Text>

            <App.Flex center className={styles.close} onClick={handleClose}>
              <App.Icon icon="cross" color="#fff" />
            </App.Flex>
          </App.Flex>

          <App.Flex column fullWidth gap={16} className={styles.body}>
            <App.Text size={16} weight={700} height={1}>Here’s are 2 ways to get gems</App.Text>

            <App.Flex column align="flex-start" gap={8} justify="center" className={styles.blueBox}>
              <App.Text size={16} weight={700}>Buy Gems from the Shop</App.Text>
              <App.Button variant="bot" small onClick={handleTab('shop')}>Buy now</App.Button>
            </App.Flex>

            <App.Flex column align="flex-start" gap={8} justify="center" className={styles.orangeBox}>
              <App.Text size={16} weight={700}>Complete Tasks to earn gems</App.Text>
              <App.Button variant="bot" small onClick={handleTab('earn')}>Let’s go</App.Button>
            </App.Flex>
          </App.Flex>
        </App.Flex>
      </App.Flex>
    </App.Dialog>
  )
}

export default BotOutbidModal