import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleReward = ({title, amount, additionalText, size = 'normal', index, ...props}) => {
  let icon = ''

  switch(index) {
    case 0:
      icon = 'reward-common'
      break
    case 1:
      icon = 'reward-uncommon'
      break
    case 2:
      icon = 'reward-rare'
      break
    case 3:
      icon = 'reward-mythical'
      break
    case 4:
      icon = 'reward-legendary'
      break
  }

  return (
    <App.Flex column className={cn(styles.rewardBlock, {[styles.large]: size === 'large'})} {...props}>
      {/* <App.Icon icon={icon} /> */}

      <App.Flex gap={4}>
        <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
        <App.Text className={styles.title}>{ title }</App.Text>
      </App.Flex>

      <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={size !== 'large' ? 26 : 48} weight={700}>{ amount }</App.ShadowText>
      <App.Text className={styles.additionalText}>{ additionalText }</App.Text>
    </App.Flex>
  )
}

export default RaffleReward