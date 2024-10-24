import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'

import $bot from '@/store/bot'

import App from '@/components/App'
import BotHand from '@/components/Bot/BotHand'

import styles from './styles.module.scss'

const BotBalance = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ $bot }) => $bot.user)
  const onboard = useSelector(({ $bot }) => $bot.onboard)

  const handleShop = () => {
    dispatch($bot.set.tab('shop'))
  }

  const formatBalance = (n) => {
    const value = Math.floor(n ?? 0)
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B'
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    } else {
      return value.toString()
    }
  }

  return (
    <App.Flex row align="center" gap={8} className={styles.container}>
      <App.Flex onClick={handleShop}>
        <App.Icon icon="plus-in-square" />
      </App.Flex>

      <App.Flex row align="center" gap={8}>
        <App.Text size={16} weight={700} height={1}>{formatBalance(user?.points)}</App.Text>
        <Image src="/images/bot/gem.png" width={24} height={20} alt="" />
      </App.Flex>

      {onboard === 'gems' ? (
        <BotHand type="gems" />
      ) : null}
    </App.Flex>
  )
}

export default BotBalance