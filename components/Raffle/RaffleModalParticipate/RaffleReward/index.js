import Image from 'next/image'
import cn from 'classnames'

import App from '@/components/App'

import styles from './styles.module.scss'

const RaffleReward = ({title, amount, additionalText, index, className, bgGlow = false, ...props}) => {
  const rarity = title ? title.toLowerCase() : ''

  const classes = () => {
    return cn(
      className,
      styles.rewardBlock,
      {[styles.common]: rarity === 'common'},
      {[styles.uncommon]: rarity === 'uncommon'},
      {[styles.rare]: rarity === 'rare'},
      {[styles.mythical]: rarity === 'mythical'},
      {[styles.legendary]: rarity === 'legendary'},
    )
  }

  const gradients = {
    uncommon: {
      color1: '#EDEDE9',
      color2: '#8D99AE',
      gradientName: 'common'
    },
    uncommon: {
      color1: '#BFD200',
      color2: '#007F5F',
      gradientName: 'uncommon'
    },
    rare: {
      color1: '#61A5C2',
      color2: '#01497C',
      gradientName: 'rare'
    },
    mythical: {
      color1: '#E0AAFF',
      color2: '#5A189A',
      gradientName: 'mythical'
    },
    legendary: {
      color1: '#FFE092',
      color2: '#E3A302',
      gradientName: 'legendary'
    },
  }

  const emojis = {
    common: `🦐`,
    uncommon: `🚀`,
    rare: `🌕`,
    mythical: `🙌`,
    legendary: `🐳`,
  }

  return (
    <App.Flex column className={classes()} {...props}>
      {
        bgGlow
          ? <div className={styles.bgGlow} />
          : null
      }

      <App.Flex gap={4}>
        <App.Text className={styles.title}>{emojis[rarity]} { title }</App.Text>
      </App.Flex>

      <App.Flex sx={{position: 'relative'}}>
        <App.Icon icon="raffle-reward" color={gradients[rarity]?.color1} secondaryColor={gradients[rarity]?.color2} gradientName={gradients[rarity]?.gradientName} />
        
        <App.Flex column center gap={0} sx={{position: 'absolute', inset: 0}}>
          <App.Text className={styles.amount} height={1}>{amount}</App.Text>
          <App.Text className={styles.currency}>USDT</App.Text>
        </App.Flex>
      </App.Flex>

      <App.Text className={styles.additionalText}>{ additionalText }</App.Text>
    </App.Flex>
  )
}

export default RaffleReward