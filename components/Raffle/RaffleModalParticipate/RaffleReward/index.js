import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleReward = ({title, amount, additionalText, size = 'normal', ...props}) => {
  return (
    <App.Flex column className={cn(styles.rewardBlock, {[styles.large]: size === 'large'})} {...props}>
      <App.Flex gap={4}>
        <Image src="/images/raffle/icon-crown.png" width={18} height={17} alt="" />
        <App.Text className={styles.title}>{ title }</App.Text>
      </App.Flex>

      <App.ShadowText color="#FFCB04" shadowColor="#FF7708" size={size !== 'large' ? 26 : 48} weight={700}>{ amount }</App.ShadowText>
      {/* <App.ShadowText color="#FFCB04" shadowColor="#FF7708" className={styles.amount}>{ amount }</App.ShadowText> */}
      <App.Text className={styles.additionalText}>{ additionalText }</App.Text>
    </App.Flex>
  )
}

export default RaffleReward