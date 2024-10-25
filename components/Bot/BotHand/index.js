import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import cn from 'classnames'

import $bot from '@/store/bot'

import App from '@/components/App'

import styles from './styles.module.scss'

const BotHand = ({ type }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (type === 'gems') {
      setTimeout(() => {
        dispatch($bot.set.onboard(null))
      }, 5000)
    }
  }, [type])

  return (
    <App.Flex column gap={8} align="flex-end" className={cn(styles.container, styles[type])}>
      <App.Flex className={styles.hand}>
      </App.Flex>

      <App.Flex center className={styles.text}>
        <App.Text nowrap size={16} weight={600} height={1}>{type == 'bid' ? 'Earn +5000 gems 🤑' : 'Spend gems to win USDC 💰'}</App.Text>
      </App.Flex>
    </App.Flex>
  )
}

export default BotHand